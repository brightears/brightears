import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schema for deposit payment
const depositPaymentSchema = z.object({
  amount: z.number().min(0.01),
  paymentMethod: z.enum(['PromptPay', 'Bank Transfer', 'Cash', 'Credit Card']),
  paymentProofUrl: z.string().url().optional(),
  transactionRef: z.string().optional(),
  promptPayRef: z.string().optional(),
  customerNotes: z.string().max(500).optional()
})

// POST - Process deposit payment
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const user = await requireAuth()
    const { bookingId } = await context.params

    // Verify booking exists and user has access
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        artist: true,
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

    // Check if user is the customer or artist
    const isCustomer = user.id === booking.customerId
    const isArtist = user.id === booking.artist.userId

    if (!isCustomer && !isArtist) {
      return NextResponse.json(
        { error: 'Unauthorized to access this booking' },
        { status: 403 }
      )
    }

    // Only customers can make payments
    if (!isCustomer) {
      return NextResponse.json(
        { error: 'Only customers can make payments' },
        { status: 403 }
      )
    }

    // Check if booking is in correct status for deposit payment
    if (!['QUOTED', 'CONFIRMED'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Booking is not in a state that accepts deposit payments' },
        { status: 400 }
      )
    }

    // Get the accepted quote
    const acceptedQuote = booking.quotes[0]
    if (!acceptedQuote) {
      return NextResponse.json(
        { error: 'No accepted quote found for this booking' },
        { status: 400 }
      )
    }

    // Check if deposit is already paid
    const existingDepositPayment = await prisma.payment.findFirst({
      where: {
        bookingId: bookingId,
        paymentType: 'deposit',
        status: { in: ['verified', 'pending'] }
      }
    })

    if (existingDepositPayment) {
      return NextResponse.json(
        { error: 'Deposit payment already exists for this booking' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = depositPaymentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { amount, paymentMethod, paymentProofUrl, transactionRef, promptPayRef, customerNotes } = validationResult.data

    // Validate deposit amount
    const expectedDepositAmount = acceptedQuote.depositAmount ? 
      Number(acceptedQuote.depositAmount) : 
      (Number(acceptedQuote.quotedPrice) * ((acceptedQuote.depositPercentage || 30) / 100))

    if (Math.abs(amount - expectedDepositAmount) > 0.01) {
      return NextResponse.json(
        { error: `Invalid deposit amount. Expected: ${expectedDepositAmount} THB` },
        { status: 400 }
      )
    }

    // Create the payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId,
        amount: amount,
        currency: 'THB',
        paymentType: 'deposit',
        paymentMethod: paymentMethod,
        status: paymentProofUrl ? 'pending' : 'verified', // Auto-verify cash/direct payments
        paymentProofUrl: paymentProofUrl,
        transactionRef: transactionRef,
        promptPayRef: promptPayRef,
        paidAt: new Date()
      }
    })

    // Update booking status if this is the first payment
    if (booking.status === 'QUOTED') {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          depositPaid: true,
          depositAmount: amount
        }
      })
    }

    // Create notification for artist
    await prisma.notification.create({
      data: {
        userId: booking.artist.userId,
        type: 'payment_received',
        title: 'Deposit Payment Received',
        titleTh: 'ได้รับการชำระเงินมัดจำ',
        content: `Deposit payment of ${amount} THB received for booking ${booking.bookingNumber}`,
        contentTh: `ได้รับการชำระเงินมัดจำ ${amount} บาทสำหรับการจอง ${booking.bookingNumber}`,
        relatedId: bookingId,
        relatedType: 'booking'
      }
    })

    return NextResponse.json({
      payment: {
        id: payment.id,
        amount: Number(payment.amount),
        currency: payment.currency,
        paymentType: payment.paymentType,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        paidAt: payment.paidAt,
        transactionRef: payment.transactionRef
      },
      message: 'Deposit payment processed successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to process deposit payment')
  }
}