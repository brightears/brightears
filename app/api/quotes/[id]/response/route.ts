import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse, sanitizeInput } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Input validation schema
const quoteResponseSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT']),
  customerNotes: z.string().max(1000).optional()
})

/**
 * Respond to a quote (accept or reject) - Customer only
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Apply rate limiting for quote responses
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.booking, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = quoteResponseSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid response data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { action, customerNotes } = validationResult.data

    // Get the quote with booking information
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        booking: {
          include: {
            artist: {
              include: { user: true }
            },
            customer: {
              select: { email: true }
            }
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Check authorization - only the customer who received the quote can respond
    if (user.role === 'CUSTOMER' || user.role === 'CORPORATE') {
      if (user.id !== quote.booking.customerId) {
        return NextResponse.json(
          { error: 'You can only respond to your own quotes' },
          { status: 403 }
        )
      }
    } else if (user.role === 'ADMIN') {
      // Admins can respond on behalf of customers
    } else {
      return NextResponse.json(
        { error: 'Only customers can respond to quotes' },
        { status: 403 }
      )
    }

    // Check if quote is in valid status for response
    if (quote.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only respond to pending quotes' },
        { status: 400 }
      )
    }

    // Check if quote has expired
    const now = new Date()
    if (quote.validUntil < now) {
      // Mark quote as expired
      await prisma.quote.update({
        where: { id: quoteId },
        data: { status: 'EXPIRED' }
      })
      
      return NextResponse.json(
        { error: 'Quote has expired' },
        { status: 410 }
      )
    }

    // Sanitize customer notes
    const sanitizedNotes = customerNotes ? sanitizeInput(customerNotes) : undefined

    let updatedBookingStatus = quote.booking.status
    let notificationTitle = ''
    let notificationTitleTh = ''
    let notificationContent = ''
    let notificationContentTh = ''

    if (action === 'ACCEPT') {
      // Update quote status to accepted
      await prisma.quote.update({
        where: { id: quoteId },
        data: { 
          status: 'ACCEPTED',
          customerNotes: sanitizedNotes,
          respondedAt: now
        }
      })

      // Update booking status to confirmed
      updatedBookingStatus = 'CONFIRMED'
      
      notificationTitle = 'Quote Accepted!'
      notificationTitleTh = 'ใบเสนอราคาได้รับการตอบรับ!'
      notificationContent = `Your quote has been accepted. The booking is now confirmed.`
      notificationContentTh = `ใบเสนอราคาของคุณได้รับการตอบรับ การจองได้รับการยืนยันแล้ว`

    } else { // REJECT
      // Update quote status to rejected
      await prisma.quote.update({
        where: { id: quoteId },
        data: { 
          status: 'REJECTED',
          customerNotes: sanitizedNotes,
          respondedAt: now
        }
      })

      // Update booking status back to inquiry
      updatedBookingStatus = 'INQUIRY'
      
      notificationTitle = 'Quote Rejected'
      notificationTitleTh = 'ใบเสนอราคาถูกปฏิเสธ'
      notificationContent = `Your quote has been rejected. You can send a revised quote if needed.`
      notificationContentTh = `ใบเสนอราคาของคุณถูกปฏิเสธ คุณสามารถส่งใบเสนอราคาใหม่ได้หากต้องการ`
    }

    // Update booking status
    await prisma.booking.update({
      where: { id: quote.bookingId },
      data: { 
        status: updatedBookingStatus
      }
    })

    // Create notification for artist
    await prisma.notification.create({
      data: {
        userId: quote.booking.artist.userId,
        type: action === 'ACCEPT' ? 'quote_accepted' : 'quote_rejected',
        title: notificationTitle,
        titleTh: notificationTitleTh,
        content: notificationContent,
        contentTh: notificationContentTh,
        relatedId: quote.id,
        relatedType: 'quote'
      }
    })

    // Get updated quote for response
    const updatedQuote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        booking: {
          include: {
            artist: {
              select: { stageName: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      action,
      quote: {
        ...updatedQuote,
        quotedPrice: updatedQuote!.quotedPrice.toNumber(),
        depositAmount: updatedQuote!.depositAmount ? updatedQuote!.depositAmount.toNumber() : null
      },
      message: action === 'ACCEPT' 
        ? 'Quote accepted! Your booking is now confirmed.' 
        : 'Quote rejected. The artist can send a revised quote if needed.'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to respond to quote')
  }
}