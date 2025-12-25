import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPaymentSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.string(),
  status: z.string().optional().default('pending')
})

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await context.params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify booking exists and user has access
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        artist: {
          include: { user: true }
        },
        quotes: {
          where: { status: 'ACCEPTED' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user is the customer
    if (booking.customerId !== user.id) {
      return NextResponse.json(
        { error: 'You can only create payments for your own bookings' },
        { status: 403 }
      )
    }

    // Check if booking is in correct status
    if (booking.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Booking must be confirmed before payment' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { amount, paymentMethod, status } = createPaymentSchema.parse(body)

    // Get the accepted quote to determine payment details
    const acceptedQuote = booking.quotes[0]
    const expectedAmount = acceptedQuote ? acceptedQuote.quotedPrice : booking.quotedPrice

    // Determine payment type
    const paymentType = amount < Number(expectedAmount) ? 'deposit' : 'full'

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        currency: 'THB',
        paymentType,
        paymentMethod,
        status,
        paidAt: new Date()
      }
    })

    // Update booking with payment information
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentMethod,
        depositPaid: paymentType === 'deposit' || paymentType === 'full'
      }
    })

    // Create notification for artist
    await prisma.notification.create({
      data: {
        userId: booking.artist.userId,
        type: 'payment_initiated',
        title: 'Payment Initiated',
        titleTh: 'เริ่มกระบวนการชำระเงิน',
        content: `Customer has initiated payment for ${booking.eventType}. Amount: ฿${amount.toLocaleString()}`,
        contentTh: `ลูกค้าเริ่มกระบวนการชำระเงินสำหรับ ${booking.eventType} จำนวน: ฿${amount.toLocaleString()}`,
        relatedId: bookingId,
        relatedType: 'booking'
      }
    })

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        paymentType: payment.paymentType,
        status: payment.status
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating payment:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}