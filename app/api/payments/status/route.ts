import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schema for updating payment status
const updatePaymentStatusSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(['pending', 'verified', 'rejected', 'cancelled']),
  rejectionReason: z.string().max(500).optional(),
  verifiedBy: z.string().optional()
})

// PATCH - Update payment status (admin or artist verification)
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const body = await request.json()
    
    // Validate input data
    const validationResult = updatePaymentStatusSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid status update data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { paymentId, status, rejectionReason, verifiedBy } = validationResult.data

    // Get payment with booking details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            customer: true,
            artist: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Check authorization - only admin or the artist can verify payments
    const isAdmin = user.role === 'ADMIN'
    const isArtist = user.id === payment.booking.artist.userId

    if (!isAdmin && !isArtist) {
      return NextResponse.json(
        { error: 'Only artists or admins can update payment status' },
        { status: 403 }
      )
    }

    // Validate status transition
    const currentStatus = payment.status
    const validTransitions: Record<string, string[]> = {
      'pending': ['verified', 'rejected'],
      'verified': ['rejected'], // Can reject a verified payment if needed
      'rejected': ['verified'], // Can re-verify a rejected payment
      'cancelled': [] // Cannot change cancelled payments
    }

    if (!validTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentStatus} to ${status}` },
        { status: 400 }
      )
    }

    // Require rejection reason for rejected status
    if (status === 'rejected' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting a payment' },
        { status: 400 }
      )
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status,
        verifiedAt: status === 'verified' ? new Date() : null,
        verifiedBy: status === 'verified' ? (verifiedBy || user.id) : null,
        rejectionReason: status === 'rejected' ? rejectionReason : null
      }
    })

    // Update booking status based on payment verification
    if (status === 'verified') {
      // Check if this completes the payment for the booking
      const allPayments = await prisma.payment.findMany({
        where: {
          bookingId: payment.bookingId,
          status: 'verified'
        }
      })

      const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0)
      
      // Get the accepted quote amount
      const acceptedQuote = await prisma.quote.findFirst({
        where: {
          bookingId: payment.bookingId,
          status: 'ACCEPTED'
        }
      })

      const totalAmount = acceptedQuote ? Number(acceptedQuote.quotedPrice) : Number(payment.booking.quotedPrice) || 0

      // Update booking status if fully paid
      if (totalPaid >= totalAmount - 0.01) { // Allow for small rounding differences
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            finalPrice: totalAmount
          }
        })
      } else if (payment.paymentType === 'deposit') {
        // If deposit is verified, confirm the booking
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'CONFIRMED',
            confirmedAt: new Date(),
            depositPaid: true,
            depositAmount: Number(updatedPayment.amount)
          }
        })
      }
    }

    // Create notification for customer about payment status update
    const notificationTitle = status === 'verified' ? 'Payment Verified' : 
                            status === 'rejected' ? 'Payment Rejected' : 
                            'Payment Status Updated'

    const notificationTitleTh = status === 'verified' ? 'การชำระเงินได้รับการยืนยัน' :
                               status === 'rejected' ? 'การชำระเงินถูกปฏิเสธ' :
                               'สถานะการชำระเงินได้รับการอัพเดท'

    const notificationContent = status === 'verified' 
      ? `Your payment of ${updatedPayment.amount} THB has been verified`
      : status === 'rejected'
        ? `Your payment of ${updatedPayment.amount} THB has been rejected. Reason: ${rejectionReason}`
        : `Payment status updated to ${status}`

    const notificationContentTh = status === 'verified'
      ? `การชำระเงินจำนวน ${updatedPayment.amount} บาทได้รับการยืนยันแล้ว`
      : status === 'rejected'
        ? `การชำระเงินจำนวน ${updatedPayment.amount} บาทถูกปฏิเสธ เหตุผล: ${rejectionReason}`
        : `สถานะการชำระเงินได้รับการอัพเดทเป็น ${status}`

    await prisma.notification.create({
      data: {
        userId: payment.booking.customerId,
        type: `payment_${status}`,
        title: notificationTitle,
        titleTh: notificationTitleTh,
        content: notificationContent,
        contentTh: notificationContentTh,
        relatedId: payment.bookingId,
        relatedType: 'booking'
      }
    })

    return NextResponse.json({
      payment: {
        id: updatedPayment.id,
        amount: Number(updatedPayment.amount),
        currency: updatedPayment.currency,
        paymentType: updatedPayment.paymentType,
        paymentMethod: updatedPayment.paymentMethod,
        status: updatedPayment.status,
        verifiedAt: updatedPayment.verifiedAt,
        verifiedBy: updatedPayment.verifiedBy,
        rejectionReason: updatedPayment.rejectionReason,
        paidAt: updatedPayment.paidAt
      },
      message: `Payment ${status} successfully`
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to update payment status')
  }
}