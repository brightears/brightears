import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schema for completing booking
const completeBookingSchema = z.object({
  completionNotes: z.string().max(1000).optional(),
  actualDuration: z.number().min(0).max(24 * 60).optional(), // in minutes
  customerSatisfaction: z.enum(['excellent', 'good', 'average', 'poor']).optional()
})

// POST - Mark booking as completed
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: bookingId } = await context.params

    // Get booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        artist: true,
        payments: {
          where: { status: 'verified' },
          orderBy: { createdAt: 'asc' }
        },
        availabilitySlot: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check authorization - only artist or admin can mark booking as completed
    const isArtist = user.role === 'ARTIST' && user.artist?.id === booking.artistId
    const isAdmin = user.role === 'ADMIN'

    if (!isArtist && !isAdmin) {
      return NextResponse.json(
        { error: 'Only the artist or admin can mark booking as completed' },
        { status: 403 }
      )
    }

    // Check if booking is in correct status
    if (booking.status !== 'PAID') {
      return NextResponse.json(
        { error: 'Booking must be paid before it can be marked as completed' },
        { status: 400 }
      )
    }

    // Check if event date has passed
    const eventDate = new Date(booking.eventDate)
    const now = new Date()
    
    if (eventDate > now) {
      // Allow completion up to 4 hours before event (for setup completion)
      const fourHoursBefore = new Date(eventDate.getTime() - 4 * 60 * 60 * 1000)
      if (now < fourHoursBefore) {
        return NextResponse.json(
          { error: 'Cannot complete booking before the event date' },
          { status: 400 }
        )
      }
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = completeBookingSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid completion data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { completionNotes, actualDuration, customerSatisfaction } = validationResult.data

    // Update booking to completed status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        notes: completionNotes ? `${booking.notes || ''}\n\nCompletion Notes: ${completionNotes}`.trim() : booking.notes
      }
    })

    // Update artist statistics
    await prisma.artist.update({
      where: { id: booking.artistId },
      data: {
        completedBookings: { increment: 1 }
      }
    })

    // Free up the availability slot if it exists
    if (booking.availabilitySlot && booking.availabilitySlot.length > 0) {
      await prisma.availability.updateMany({
        where: {
          id: { in: booking.availabilitySlot.map(slot => slot.id) }
        },
        data: {
          status: 'AVAILABLE',
          isBooked: false,
          bookingId: null
        }
      })
    }

    // Calculate final earnings (subtract any platform fees if applicable)
    const totalPaid = booking.payments.reduce((sum, payment) => 
      sum + Number(payment.amount), 0
    )

    // Create completion notification for customer
    await prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'booking_completed',
        title: 'Event Completed',
        titleTh: 'งานเสร็จสิ้น',
        content: `Your event with ${booking.artist.stageName} has been completed. Please consider leaving a review!`,
        contentTh: `งานของคุณกับ ${booking.artist.stageName} เสร็จสิ้นแล้ว กรุณาพิจารณาให้คะแนนและรีวิว!`,
        relatedId: bookingId,
        relatedType: 'booking'
      }
    })

    // Create completion notification for artist
    await prisma.notification.create({
      data: {
        userId: booking.artist.userId,
        type: 'booking_completed',
        title: 'Event Completed',
        titleTh: 'งานเสร็จสิ้น',
        content: `Your event for booking ${booking.bookingNumber} has been marked as completed.`,
        contentTh: `งานสำหรับการจอง ${booking.bookingNumber} ได้ถูกทำเครื่องหมายว่าเสร็จสิ้นแล้ว`,
        relatedId: bookingId,
        relatedType: 'booking'
      }
    })

    // Send completion emails to both customer and artist
    try {
      const { sendBookingCompletedEmail, getUserLocale, sendBulkEmails } = await import('@/lib/email-templates')
      
      // Format the event data for email
      const formattedEventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Send emails to both parties
      await sendBulkEmails([
        // Customer email
        async () => {
          const customerLocale = await getUserLocale(booking.customerId)
          const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer/bookings?review=${bookingId}`
          
          return sendBookingCompletedEmail({
            to: booking.customer.email,
            recipientName: booking.customer.name || 'Customer',
            recipientType: 'customer',
            artistName: booking.artist.stageName,
            customerName: booking.customer.name || 'Customer',
            eventType: booking.eventType,
            eventDate: formattedEventDate,
            bookingNumber: booking.bookingNumber,
            finalPrice: totalPaid.toFixed(2),
            currency: 'THB',
            reviewUrl,
            locale: customerLocale,
          })
        },
        // Artist email
        async () => {
          const artistLocale = await getUserLocale(booking.artist.userId)
          const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/artist/bookings`
          
          return sendBookingCompletedEmail({
            to: booking.artist.user.email,
            recipientName: booking.artist.stageName,
            recipientType: 'artist',
            artistName: booking.artist.stageName,
            customerName: booking.customer.name || 'Customer',
            eventType: booking.eventType,
            eventDate: formattedEventDate,
            bookingNumber: booking.bookingNumber,
            finalPrice: totalPaid.toFixed(2),
            currency: 'THB',
            reviewUrl: dashboardUrl,
            locale: artistLocale,
          })
        }
      ])
      
      console.log('Booking completion emails sent to both customer and artist')
    } catch (emailError) {
      console.error('Failed to send booking completion emails:', emailError)
      // Don't fail the completion if email fails
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        bookingNumber: updatedBooking.bookingNumber,
        status: updatedBooking.status,
        completedAt: updatedBooking.completedAt,
        eventDate: updatedBooking.eventDate,
        totalPaid: totalPaid,
        finalPrice: Number(updatedBooking.finalPrice || booking.quotedPrice || 0)
      },
      message: 'Booking marked as completed successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to complete booking')
  }
}

// GET - Check if booking can be completed (status check)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: bookingId } = await context.params

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        eventDate: true,
        artistId: true,
        completedAt: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check authorization
    const isArtist = user.role === 'ARTIST' && user.artist?.id === booking.artistId
    const isAdmin = user.role === 'ADMIN'

    if (!isArtist && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const eventDate = new Date(booking.eventDate)
    const now = new Date()
    const fourHoursBefore = new Date(eventDate.getTime() - 4 * 60 * 60 * 1000)

    const canComplete = booking.status === 'PAID' && now >= fourHoursBefore
    const isCompleted = booking.status === 'COMPLETED'

    return NextResponse.json({
      bookingId: bookingId,
      canComplete: canComplete,
      isCompleted: isCompleted,
      status: booking.status,
      eventDate: booking.eventDate,
      completedAt: booking.completedAt,
      reason: !canComplete 
        ? booking.status !== 'PAID' 
          ? 'Booking must be paid first'
          : 'Too early to complete (can complete 4 hours before event)'
        : null
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to check completion status')
  }
}