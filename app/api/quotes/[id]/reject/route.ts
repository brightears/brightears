import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id: quoteId } = await params
    const body = await request.json()
    const { notes } = body

    // Find the quote with booking details
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        booking: {
          include: {
            customer: true,
            artist: {
              include: { user: true }
            }
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Verify user is the customer for this booking
    if (quote.booking.customerId !== user.id) {
      return NextResponse.json(
        { error: 'You can only reject quotes for your own bookings' },
        { status: 403 }
      )
    }

    // Check if quote is in correct status
    if (quote.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Quote is no longer available for rejection' },
        { status: 400 }
      )
    }

    // Update quote status
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'REJECTED',
        customerNotes: notes,
        respondedAt: new Date()
      }
    })

    // Create notification for artist
    await prisma.notification.create({
      data: {
        userId: quote.booking.artist.userId,
        type: 'quote_rejected',
        title: 'Quote Declined',
        titleTh: 'ใบเสนอราคาถูกปฏิเสธ',
        content: `Your quote for ${quote.booking.eventType} was declined by the customer.${notes ? ` Customer note: "${notes}"` : ''}`,
        contentTh: `ใบเสนอราคาของคุณสำหรับ ${quote.booking.eventType} ถูกปฏิเสธโดยลูกค้า${notes ? ` หมายเหตุจากลูกค้า: "${notes}"` : ''}`,
        relatedId: quote.id,
        relatedType: 'quote'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Quote rejected successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to reject quote')
  }
}