import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schema for full payment
const fullPaymentSchema = z.object({
  amount: z.number().min(0.01),
  paymentMethod: z.enum(['PromptPay', 'Bank Transfer', 'Cash', 'Credit Card']),
  paymentProofUrl: z.string().url().optional(),
  transactionRef: z.string().optional(),
  promptPayRef: z.string().optional(),
  customerNotes: z.string().max(500).optional()
})

// POST - Process full payment (remaining amount after deposit)
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
        },
        payments: {
          where: { status: { in: ['verified', 'pending'] } },
          orderBy: { createdAt: 'asc' }
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
    const isCustomer = user.id === booking.customerId

    if (!isCustomer) {
      return NextResponse.json(
        { error: 'Only customers can make payments' },
        { status: 403 }
      )
    }

    // Check if booking is in correct status for full payment
    if (!['CONFIRMED', 'PAID'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Booking must be confirmed before full payment' },
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

    const body = await request.json()
    
    // Validate input data
    const validationResult = fullPaymentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { amount, paymentMethod, paymentProofUrl, transactionRef, promptPayRef, customerNotes } = validationResult.data

    // Calculate remaining amount
    const totalAmount = Number(acceptedQuote.quotedPrice)
    const paidAmount = booking.payments.reduce((sum, payment) => 
      sum + (payment.status === 'verified' ? Number(payment.amount) : 0), 0
    )
    const remainingAmount = totalAmount - paidAmount

    // Validate payment amount
    if (Math.abs(amount - remainingAmount) > 0.01) {
      return NextResponse.json(
        { error: `Invalid payment amount. Remaining amount: ${remainingAmount} THB` },
        { status: 400 }
      )
    }

    // Check if full payment already exists
    const existingFullPayment = await prisma.payment.findFirst({
      where: {
        bookingId: bookingId,
        paymentType: { in: ['full', 'remaining'] },
        status: { in: ['verified', 'pending'] }
      }
    })

    if (existingFullPayment) {
      return NextResponse.json(
        { error: 'Full payment already exists for this booking' },
        { status: 400 }
      )
    }

    // Determine payment type
    const paymentType = paidAmount > 0 ? 'remaining' : 'full'

    // Create the payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId,
        amount: amount,
        currency: 'THB',
        paymentType: paymentType,
        paymentMethod: paymentMethod,
        status: paymentProofUrl ? 'pending' : 'verified', // Auto-verify cash/direct payments
        paymentProofUrl: paymentProofUrl,
        transactionRef: transactionRef,
        promptPayRef: promptPayRef,
        paidAt: new Date()
      }
    })

    // Update booking to PAID status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'PAID',
        finalPrice: totalAmount,
        paidAt: new Date()
      }
    })

    // Create notification for artist
    await prisma.notification.create({
      data: {
        userId: booking.artist.userId,
        type: 'payment_completed',
        title: 'Full Payment Received',
        titleTh: 'ได้รับการชำระเงินครบถ้วน',
        content: `Full payment of ${amount} THB received for booking ${booking.bookingNumber}. Total paid: ${totalAmount} THB`,
        contentTh: `ได้รับการชำระเงินครบถ้วน ${amount} บาทสำหรับการจอง ${booking.bookingNumber} รวมทั้งหมด: ${totalAmount} บาท`,
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
      booking: {
        status: 'PAID',
        totalAmount: totalAmount,
        paidAmount: totalAmount
      },
      message: 'Full payment processed successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to process full payment')
  }
}