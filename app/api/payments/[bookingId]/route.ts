import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// GET - Get all payments for a specific booking
export async function GET(
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
        artist: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this booking
    const isCustomer = user.id === booking.customerId
    const isArtist = user.id === booking.artist.userId
    const isAdmin = user.role === 'ADMIN'

    if (!isCustomer && !isArtist && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to access this booking' },
        { status: 403 }
      )
    }

    // Get all payments for this booking
    const payments = await prisma.payment.findMany({
      where: { bookingId: bookingId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentType: true,
        paymentMethod: true,
        status: true,
        paymentProofUrl: true,
        transactionRef: true,
        promptPayRef: true,
        verifiedAt: true,
        verifiedBy: true,
        rejectionReason: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Calculate payment summary
    const totalPaid = payments
      .filter(p => p.status === 'verified')
      .reduce((sum, payment) => sum + Number(payment.amount), 0)
    
    const pendingAmount = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, payment) => sum + Number(payment.amount), 0)

    // Get the accepted quote to calculate remaining amount
    const acceptedQuote = await prisma.quote.findFirst({
      where: {
        bookingId: bookingId,
        status: 'ACCEPTED'
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalAmount = acceptedQuote ? Number(acceptedQuote.quotedPrice) : Number(booking.quotedPrice) || 0
    const remainingAmount = totalAmount - totalPaid

    // Format payments for response
    const formattedPayments = payments.map(payment => ({
      ...payment,
      amount: Number(payment.amount)
    }))

    return NextResponse.json({
      bookingId: bookingId,
      payments: formattedPayments,
      summary: {
        totalAmount: totalAmount,
        totalPaid: totalPaid,
        pendingAmount: pendingAmount,
        remainingAmount: Math.max(0, remainingAmount),
        paymentCount: payments.length,
        isFullyPaid: remainingAmount <= 0.01
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch payment history')
  }
}