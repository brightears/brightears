import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const respondToQuoteSchema = z.object({
  action: z.enum(['accept', 'reject']),
  customerNotes: z.string().optional()
})

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await context.params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Only customers can respond to quotes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, customerNotes } = respondToQuoteSchema.parse(body)

    // Find the quote and verify ownership
    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        booking: {
          customerId: user.id
        }
      },
      include: {
        booking: {
          include: {
            artist: true,
            customer: {
              include: {
                customer: true
              }
            }
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found or access denied' },
        { status: 404 }
      )
    }

    // Check if quote is still pending
    if (quote.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Quote has already been responded to' },
        { status: 400 }
      )
    }

    // Check if quote has expired
    if (new Date(quote.validUntil) < new Date()) {
      return NextResponse.json(
        { error: 'Quote has expired' },
        { status: 400 }
      )
    }

    const now = new Date()

    if (action === 'accept') {
      // Accept the quote - update quote status and booking status
      await prisma.$transaction([
        // Update the quote
        prisma.quote.update({
          where: { id: quoteId },
          data: {
            status: 'ACCEPTED',
            customerNotes,
            respondedAt: now
          }
        }),
        // Update the booking status to CONFIRMED
        prisma.booking.update({
          where: { id: quote.booking.id },
          data: {
            status: 'CONFIRMED',
            finalPrice: quote.quotedPrice,
            confirmedAt: now
          }
        }),
        // Create notification for artist
        prisma.notification.create({
          data: {
            userId: quote.booking.artist.userId,
            type: 'quote_accepted',
            title: 'Quote Accepted!',
            titleTh: 'ใบเสนอราคาได้รับการยอมรับ!',
            content: `Your quote for ${quote.booking.eventType} has been accepted by ${quote.booking.customer?.customer?.firstName || 'the customer'}.`,
            contentTh: `ใบเสนอราคาของคุณสำหรับ ${quote.booking.eventType} ได้รับการยอมรับจากลูกค้าแล้ว`,
            relatedId: quote.booking.id,
            relatedType: 'booking'
          }
        })
      ])

      return NextResponse.json({
        success: true,
        message: 'Quote accepted successfully',
        booking: {
          id: quote.booking.id,
          status: 'CONFIRMED'
        }
      })
    } else {
      // Reject the quote
      await prisma.$transaction([
        // Update the quote
        prisma.quote.update({
          where: { id: quoteId },
          data: {
            status: 'REJECTED',
            customerNotes,
            respondedAt: now
          }
        }),
        // Keep booking status as INQUIRY for artist to potentially send new quote
        // Create notification for artist
        prisma.notification.create({
          data: {
            userId: quote.booking.artist.userId,
            type: 'quote_rejected',
            title: 'Quote Declined',
            titleTh: 'ใบเสนอราคาถูกปฏิเสธ',
            content: `Your quote for ${quote.booking.eventType} was declined.${customerNotes ? ` Customer notes: ${customerNotes}` : ''}`,
            contentTh: `ใบเสนอราคาของคุณสำหรับ ${quote.booking.eventType} ถูกปฏิเสธ${customerNotes ? ` หมายเหตุจากลูกค้า: ${customerNotes}` : ''}`,
            relatedId: quote.booking.id,
            relatedType: 'booking'
          }
        })
      ])

      return NextResponse.json({
        success: true,
        message: 'Quote declined',
        booking: {
          id: quote.booking.id,
          status: quote.booking.status // Keep current status
        }
      })
    }

  } catch (error) {
    console.error('Error responding to quote:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}