import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// GET - Get detailed booking information (Admin only)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: bookingId } = await context.params
    
    // Only admins can access detailed booking info
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get comprehensive booking data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                lastLogin: true,
                isActive: true
              }
            }
          }
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                lastLogin: true,
                isActive: true
              }
            }
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        },
        quotes: {
          orderBy: { createdAt: 'desc' }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            sender: {
              select: {
                name: true,
                role: true
              }
            }
          }
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Calculate payment summary
    const paymentSummary = {
      totalPaid: booking.payments
        .filter(p => p.status === 'verified')
        .reduce((sum, p) => sum + Number(p.amount), 0),
      totalPending: booking.payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + Number(p.amount), 0),
      totalRejected: booking.payments
        .filter(p => p.status === 'rejected')
        .reduce((sum, p) => sum + Number(p.amount), 0),
      paymentCount: booking.payments.length,
      hasDeposit: booking.payments.some(p => p.paymentType === 'deposit' && p.status === 'verified'),
      lastPaymentDate: booking.payments[0]?.createdAt || null
    }

    const totalAmount = Number(booking.finalPrice || booking.quotedPrice || 0)
    paymentSummary.remainingAmount = Math.max(0, totalAmount - paymentSummary.totalPaid)

    // Get quote summary
    const quoteSummary = {
      totalQuotes: booking.quotes.length,
      acceptedQuote: booking.quotes.find(q => q.status === 'ACCEPTED'),
      latestQuote: booking.quotes[0],
      averageQuoteAmount: booking.quotes.length > 0 ? 
        booking.quotes.reduce((sum, q) => sum + Number(q.quotedPrice), 0) / booking.quotes.length : 0
    }

    // Get timeline events
    const timelineEvents = [
      {
        type: 'booking_created',
        date: booking.createdAt,
        title: 'Booking Created',
        description: 'Initial booking inquiry submitted'
      },
      ...booking.quotes.map(quote => ({
        type: 'quote_submitted',
        date: quote.createdAt,
        title: 'Quote Submitted',
        description: `Quote for ${Number(quote.quotedPrice)} THB - Status: ${quote.status}`
      })),
      ...booking.payments.map(payment => ({
        type: 'payment_submitted',
        date: payment.createdAt,
        title: 'Payment Submitted',
        description: `${payment.paymentType} payment of ${Number(payment.amount)} THB - Status: ${payment.status}`
      })),
      ...(booking.confirmedAt ? [{
        type: 'booking_confirmed',
        date: booking.confirmedAt,
        title: 'Booking Confirmed',
        description: 'Booking confirmed with deposit'
      }] : []),
      ...(booking.completedAt ? [{
        type: 'booking_completed',
        date: booking.completedAt,
        title: 'Booking Completed',
        description: 'Event completed successfully'
      }] : [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Format response
    const formattedBooking = {
      ...booking,
      finalPrice: Number(booking.finalPrice || booking.quotedPrice || 0),
      quotedPrice: Number(booking.quotedPrice || 0),
      depositAmount: Number(booking.depositAmount || 0),
      
      artist: {
        ...booking.artist,
        averageRating: booking.artist.averageRating || 0
      },
      
      customer: {
        ...booking.customer,
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName
      },
      
      payments: booking.payments.map(payment => ({
        ...payment,
        amount: Number(payment.amount)
      })),
      
      quotes: booking.quotes.map(quote => ({
        ...quote,
        quotedPrice: Number(quote.quotedPrice),
        depositAmount: quote.depositAmount ? Number(quote.depositAmount) : null
      }))
    }

    return NextResponse.json({
      booking: formattedBooking,
      summary: {
        payment: paymentSummary,
        quote: quoteSummary,
        timeline: timelineEvents
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch booking details')
  }
}

// POST - Admin actions on booking (refund, cancel, etc.)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: bookingId } = await context.params
    
    // Only admins can perform admin actions
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, reason, amount } = body

    // Validate action
    const validActions = ['cancel', 'refund', 'force_complete', 'dispute_resolve']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action', validActions },
        { status: 400 }
      )
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        artist: true,
        customer: true,
        payments: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    let result: any = {}

    switch (action) {
      case 'cancel':
        if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
          return NextResponse.json(
            { error: 'Cannot cancel completed or already cancelled booking' },
            { status: 400 }
          )
        }

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CANCELLED',
            notes: `${booking.notes || ''}\n[${new Date().toISOString()}] Admin cancelled: ${reason || 'No reason provided'}`.trim()
          }
        })

        // Notify both parties
        await Promise.all([
          prisma.notification.create({
            data: {
              userId: booking.customer.userId,
              type: 'booking_cancelled',
              title: 'Booking Cancelled by Admin',
              titleTh: 'การจองถูกยกเลิกโดยผู้ดูแลระบบ',
              content: `Your booking ${booking.bookingNumber} has been cancelled by an administrator. Reason: ${reason || 'Administrative decision'}`,
              contentTh: `การจอง ${booking.bookingNumber} ของคุณถูกยกเลิกโดยผู้ดูแลระบบ เหตุผล: ${reason || 'การตัดสินใจของผู้ดูแลระบบ'}`,
              relatedId: bookingId,
              relatedType: 'booking'
            }
          }),
          prisma.notification.create({
            data: {
              userId: booking.artist.userId,
              type: 'booking_cancelled',
              title: 'Booking Cancelled by Admin',
              titleTh: 'การจองถูกยกเลิกโดยผู้ดูแลระบบ',
              content: `Booking ${booking.bookingNumber} has been cancelled by an administrator. Reason: ${reason || 'Administrative decision'}`,
              contentTh: `การจอง ${booking.bookingNumber} ถูกยกเลิกโดยผู้ดูแลระบบ เหตุผล: ${reason || 'การตัดสินใจของผู้ดูแลระบบ'}`,
              relatedId: bookingId,
              relatedType: 'booking'
            }
          })
        ])

        result = { message: 'Booking cancelled successfully' }
        break

      case 'refund':
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { error: 'Valid refund amount is required' },
            { status: 400 }
          )
        }

        // Create refund record (simplified - in production would integrate with payment processor)
        await prisma.payment.create({
          data: {
            bookingId: bookingId,
            amount: -Math.abs(amount), // Negative amount for refund
            currency: 'THB',
            paymentType: 'refund',
            paymentMethod: 'admin_refund',
            status: 'verified',
            paidAt: new Date(),
            verifiedAt: new Date(),
            verifiedBy: user.id,
            transactionRef: `ADMIN_REFUND_${Date.now()}`
          }
        })

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            notes: `${booking.notes || ''}\n[${new Date().toISOString()}] Admin refund: ${amount} THB - ${reason || 'No reason provided'}`.trim()
          }
        })

        // Notify customer
        await prisma.notification.create({
          data: {
            userId: booking.customer.userId,
            type: 'refund_processed',
            title: 'Refund Processed',
            titleTh: 'การคืนเงินได้รับการดำเนินการ',
            content: `A refund of ${amount} THB has been processed for booking ${booking.bookingNumber}.`,
            contentTh: `การคืนเงิน ${amount} บาทได้รับการดำเนินการสำหรับการจอง ${booking.bookingNumber}`,
            relatedId: bookingId,
            relatedType: 'booking'
          }
        })

        result = { message: `Refund of ${amount} THB processed successfully` }
        break

      case 'force_complete':
        if (booking.status !== 'PAID') {
          return NextResponse.json(
            { error: 'Can only force complete paid bookings' },
            { status: 400 }
          )
        }

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            notes: `${booking.notes || ''}\n[${new Date().toISOString()}] Admin force completed: ${reason || 'Administrative completion'}`.trim()
          }
        })

        // Update artist stats
        await prisma.artist.update({
          where: { id: booking.artistId },
          data: {
            completedBookings: { increment: 1 }
          }
        })

        result = { message: 'Booking force completed successfully' }
        break

      case 'dispute_resolve':
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            notes: `${booking.notes || ''}\n[${new Date().toISOString()}] Dispute resolved: ${reason || 'Dispute resolved by admin'}`.trim()
          }
        })

        // Create resolution notifications
        await Promise.all([
          prisma.notification.create({
            data: {
              userId: booking.customer.userId,
              type: 'dispute_resolved',
              title: 'Dispute Resolved',
              titleTh: 'ข้อพิพาทได้รับการแก้ไข',
              content: `The dispute for booking ${booking.bookingNumber} has been resolved by our team.`,
              contentTh: `ข้อพิพาทสำหรับการจอง ${booking.bookingNumber} ได้รับการแก้ไขโดยทีมงานของเรา`,
              relatedId: bookingId,
              relatedType: 'booking'
            }
          }),
          prisma.notification.create({
            data: {
              userId: booking.artist.userId,
              type: 'dispute_resolved',
              title: 'Dispute Resolved',
              titleTh: 'ข้อพิพาทได้รับการแก้ไข',
              content: `The dispute for booking ${booking.bookingNumber} has been resolved by our team.`,
              contentTh: `ข้อพิพาทสำหรับการจอง ${booking.bookingNumber} ได้รับการแก้ไขโดยทีมงานของเรา`,
              relatedId: bookingId,
              relatedType: 'booking'
            }
          })
        ])

        result = { message: 'Dispute resolved successfully' }
        break
    }

    return NextResponse.json(result)

  } catch (error) {
    return safeErrorResponse(error, 'Failed to perform admin action')
  }
}