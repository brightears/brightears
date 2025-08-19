import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const formData = await request.formData()
    const slip = formData.get('slip') as File
    const bookingId = formData.get('bookingId') as string
    const amount = parseFloat(formData.get('amount') as string)

    if (!slip || !bookingId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        artist: {
          include: { user: true }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.customerId !== user.id) {
      return NextResponse.json(
        { error: 'You can only submit payments for your own bookings' },
        { status: 403 }
      )
    }

    // In a real implementation, you would:
    // 1. Upload the slip image to cloud storage (Cloudinary, AWS S3, etc.)
    // 2. Potentially use OCR or manual verification
    // 3. Store the payment record
    
    // TODO: Upload slip to Cloudinary
    const slipUrl = `payment-slip-${bookingId}-${Date.now()}.jpg` // Placeholder
    
    // Determine payment type based on amount
    const paymentType = amount < Number(booking.quotedPrice) ? 'deposit' : 'full'
    
    // Create payment record using new Payment model
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        currency: 'THB',
        paymentType,
        paymentMethod: 'PromptPay',
        status: 'pending',
        paymentProofUrl: slipUrl,
        paidAt: new Date()
      }
    })

    // Update booking status - keep as CONFIRMED until payment is verified
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        depositPaid: paymentType === 'deposit' || paymentType === 'full',
        paymentMethod: 'PromptPay'
        // Don't update status to PAID until verification
      }
    })

    // Create notifications
    await Promise.all([
      // Notify artist
      prisma.notification.create({
        data: {
          userId: booking.artist.userId,
          type: 'payment_received',
          title: 'Payment Received',
          titleTh: 'ได้รับการชำระเงิน',
          content: `Payment received for ${booking.eventType}. Amount: ฿${amount.toLocaleString()}`,
          contentTh: `ได้รับการชำระเงินสำหรับ ${booking.eventType} จำนวน: ฿${amount.toLocaleString()}`,
          relatedId: bookingId,
          relatedType: 'booking'
        }
      }),
      // Notify customer
      prisma.notification.create({
        data: {
          userId: user.id,
          type: 'payment_submitted',
          title: 'Payment Submitted',
          titleTh: 'ส่งข้อมูลการชำระเงินแล้ว',
          content: `Your payment for ${booking.eventType} is being verified.`,
          contentTh: `การชำระเงินของคุณสำหรับ ${booking.eventType} กำลังได้รับการตรวจสอบ`,
          relatedId: bookingId,
          relatedType: 'booking'
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Payment submitted for verification',
      paymentId: payment.id,
      status: 'pending_verification'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to verify payment')
  }
}