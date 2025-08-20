import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { 
  sendBookingConfirmedEmail, 
  sendCancellationNoticeEmail,
  getUserLocale,
  generateDashboardUrl,
  generateSupportUrl
} from '@/lib/email-templates'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id: bookingId } = await params
    const { status, notes } = await request.json()

    const validStatuses = ['INQUIRY', 'QUOTED', 'CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        artist: {
          include: { user: true }
        },
        customer: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check authorization
    const isArtist = user.role === 'ARTIST' && booking.artist.userId === user.id
    const isCustomer = (user.role === 'CUSTOMER' || user.role === 'CORPORATE') && booking.customerId === user.id
    const isAdmin = user.role === 'ADMIN'

    if (!isArtist && !isCustomer && !isAdmin) {
      return NextResponse.json(
        { error: 'You are not authorized to update this booking' },
        { status: 403 }
      )
    }

    // Validate status transitions
    const currentStatus = booking.status
    const validTransitions: Record<string, string[]> = {
      'INQUIRY': ['QUOTED', 'CANCELLED'],
      'QUOTED': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PAID', 'CANCELLED'],
      'PAID': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [], // Final status
      'CANCELLED': [] // Final status
    }

    if (!validTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${status}` },
        { status: 400 }
      )
    }

    // Additional business logic checks
    if (status === 'COMPLETED' && !isArtist && !isAdmin) {
      return NextResponse.json(
        { error: 'Only artists can mark bookings as completed' },
        { status: 403 }
      )
    }

    // Update booking status
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (status === 'CONFIRMED') {
      updateData.confirmedAt = new Date()
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date()
      updateData.cancellationReason = notes
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: updateData
    })

    // Create notifications
    const notificationRecipientId = isArtist ? booking.customerId : booking.artist.userId
    const notificationTitle = getNotificationTitle(status)
    const notificationContent = getNotificationContent(status, booking.eventType, notes)

    await prisma.notification.create({
      data: {
        userId: notificationRecipientId,
        type: `booking_${status.toLowerCase()}`,
        title: notificationTitle.en,
        titleTh: notificationTitle.th,
        content: notificationContent.en,
        contentTh: notificationContent.th,
        relatedId: bookingId,
        relatedType: 'booking'
      }
    })

    // Send email notifications based on status
    await sendStatusChangeEmails(booking, status, notes, user)

    // Additional actions based on status
    if (status === 'COMPLETED') {
      // Could trigger review request, payment release, etc.
      await createCompletionActions(bookingId)
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: {
        id: bookingId,
        status,
        updatedAt: updateData.updatedAt
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to update booking status')
  }
}

function getNotificationTitle(status: string) {
  const titles: Record<string, { en: string; th: string }> = {
    'QUOTED': { en: 'Quote Sent', th: 'ส่งใบเสนอราคาแล้ว' },
    'CONFIRMED': { en: 'Booking Confirmed', th: 'การจองได้รับการยืนยัน' },
    'PAID': { en: 'Payment Received', th: 'ได้รับการชำระเงิน' },
    'COMPLETED': { en: 'Event Completed', th: 'งานเสร็จสิ้น' },
    'CANCELLED': { en: 'Booking Cancelled', th: 'ยกเลิกการจอง' }
  }
  return titles[status] || { en: 'Booking Updated', th: 'อัปเดตการจอง' }
}

function getNotificationContent(status: string, eventType: string, notes?: string) {
  const contents: Record<string, { en: string; th: string }> = {
    'QUOTED': {
      en: `You have received a quote for ${eventType}`,
      th: `คุณได้รับใบเสนอราคาสำหรับ ${eventType}`
    },
    'CONFIRMED': {
      en: `Your booking for ${eventType} has been confirmed`,
      th: `การจอง ${eventType} ของคุณได้รับการยืนยันแล้ว`
    },
    'PAID': {
      en: `Payment received for ${eventType}`,
      th: `ได้รับการชำระเงินสำหรับ ${eventType}`
    },
    'COMPLETED': {
      en: `${eventType} has been completed successfully`,
      th: `${eventType} เสร็จสิ้นเรียบร้อยแล้ว`
    },
    'CANCELLED': {
      en: `Booking for ${eventType} has been cancelled${notes ? `. Reason: ${notes}` : ''}`,
      th: `การจอง ${eventType} ถูกยกเลิกแล้ว${notes ? ` เหตุผล: ${notes}` : ''}`
    }
  }
  return contents[status] || { en: `Booking ${status}`, th: `การจอง ${status}` }
}

async function createCompletionActions(bookingId: string) {
  try {
    // Create review request notification after 24 hours
    // In a real app, you'd use a job queue like Bull or Agenda
    setTimeout(async () => {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { customer: true, artist: true }
      })

      if (booking) {
        await prisma.notification.create({
          data: {
            userId: booking.customerId,
            type: 'review_request',
            title: 'How was your event?',
            titleTh: 'งานของคุณเป็นอย่างไรบ้าง?',
            content: `Please share your experience with ${booking.artist.stageName}`,
            contentTh: `กรุณาแบ่งปันประสบการณ์ของคุณกับ ${booking.artist.stageName}`,
            relatedId: bookingId,
            relatedType: 'review_request'
          }
        })
      }
    }, 24 * 60 * 60 * 1000) // 24 hours

  } catch (error) {
    console.error('Error creating completion actions:', error)
  }
}

async function sendStatusChangeEmails(booking: any, status: string, notes?: string, currentUser?: any) {
  try {
    // Determine who should receive the email
    const customer = booking.customer || await prisma.user.findUnique({ where: { id: booking.customerId } })
    const artist = booking.artist?.user || await prisma.user.findUnique({ where: { id: booking.artist.userId } })

    if (!customer || !artist) {
      console.error('Could not find customer or artist for email notification')
      return
    }

    // Get user locales
    const customerLocale = await getUserLocale(customer.id)
    const artistLocale = await getUserLocale(artist.id)

    // Format dates and times
    const eventDate = new Date(booking.eventDate).toLocaleDateString()
    const startTime = new Date(booking.startTime).toLocaleTimeString()
    const endTime = new Date(booking.endTime).toLocaleTimeString()

    switch (status) {
      case 'CONFIRMED':
        // Send confirmation email to customer
        try {
          await sendBookingConfirmedEmail({
            to: customer.email,
            customerName: customer.name || 'Customer',
            artistName: booking.artist.stageName || 'Artist',
            bookingNumber: booking.bookingNumber,
            eventType: booking.eventType,
            eventDate,
            startTime,
            endTime,
            venue: booking.venue,
            venueAddress: booking.venueAddress || '',
            finalPrice: Number(booking.finalPrice || booking.quotedPrice),
            currency: booking.currency,
            depositAmount: booking.depositAmount ? Number(booking.depositAmount) : undefined,
            depositPaid: booking.depositPaid,
            guestCount: booking.guestCount,
            specialRequests: booking.specialRequests,
            artistContact: artist.email,
            dashboardUrl: generateDashboardUrl(customer.role, booking.id),
            locale: customerLocale,
          })
        } catch (error) {
          console.error('Error sending booking confirmed email to customer:', error)
        }
        break

      case 'CANCELLED':
        // Send cancellation emails to both parties
        const senderRole = currentUser?.role === 'ARTIST' ? 'artist' : 
                          currentUser?.role === 'ADMIN' ? 'admin' : 'customer'
        const senderName = currentUser?.name || 'System'

        // Email to customer
        if (senderRole !== 'customer') {
          try {
            await sendCancellationNoticeEmail({
              to: customer.email,
              recipientName: customer.name || 'Customer',
              senderName,
              senderRole,
              bookingNumber: booking.bookingNumber,
              eventType: booking.eventType,
              eventDate,
              venue: booking.venue,
              cancellationReason: notes,
              refundAmount: booking.depositAmount ? Number(booking.depositAmount) : undefined,
              currency: booking.currency,
              refundTimeline: '3-5 business days',
              dashboardUrl: generateDashboardUrl(customer.role, booking.id),
              supportUrl: generateSupportUrl(),
              locale: customerLocale,
            })
          } catch (error) {
            console.error('Error sending cancellation email to customer:', error)
          }
        }

        // Email to artist
        if (senderRole !== 'artist') {
          try {
            await sendCancellationNoticeEmail({
              to: artist.email,
              recipientName: booking.artist.stageName || 'Artist',
              senderName,
              senderRole,
              bookingNumber: booking.bookingNumber,
              eventType: booking.eventType,
              eventDate,
              venue: booking.venue,
              cancellationReason: notes,
              dashboardUrl: generateDashboardUrl('ARTIST', booking.id),
              supportUrl: generateSupportUrl(),
              locale: artistLocale,
            })
          } catch (error) {
            console.error('Error sending cancellation email to artist:', error)
          }
        }
        break

      // Add more cases for other status changes as needed
      default:
        console.log(`No email notification configured for status: ${status}`)
    }

  } catch (error) {
    console.error('Error sending status change emails:', error)
  }
}