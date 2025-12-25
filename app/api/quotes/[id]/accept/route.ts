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
        { error: 'You can only accept quotes for your own bookings' },
        { status: 403 }
      )
    }

    // Check if quote is still valid
    if (new Date() > new Date(quote.validUntil)) {
      return NextResponse.json(
        { error: 'This quote has expired' },
        { status: 400 }
      )
    }

    // Check if quote is in correct status
    if (quote.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Quote is no longer available for acceptance' },
        { status: 400 }
      )
    }

    // Start transaction to update quote and booking
    await prisma.$transaction(async (tx) => {
      // Accept the quote
      await tx.quote.update({
        where: { id: quoteId },
        data: {
          status: 'ACCEPTED',
          customerNotes: notes,
          respondedAt: new Date()
        }
      })

      // Reject any other pending quotes for this booking
      await tx.quote.updateMany({
        where: {
          bookingId: quote.bookingId,
          id: { not: quoteId },
          status: 'PENDING'
        },
        data: {
          status: 'REJECTED'
        }
      })

      // Update booking status and price
      await tx.booking.update({
        where: { id: quote.bookingId },
        data: {
          status: 'CONFIRMED',
          finalPrice: quote.quotedPrice,
          confirmedAt: new Date()
        }
      })
    })

    // Create notifications
    await prisma.notification.create({
      data: {
        userId: quote.booking.artist.userId,
        type: 'quote_accepted',
        title: 'Quote Accepted!',
        titleTh: 'ใบเสนอราคาได้รับการยอมรับ!',
        content: `Your quote for ${quote.booking.eventType} has been accepted by the customer.`,
        contentTh: `ใบเสนอราคาของคุณสำหรับ ${quote.booking.eventType} ได้รับการยอมรับจากลูกค้า`,
        relatedId: quote.id,
        relatedType: 'quote'
      }
    })

    // Send email notification to artist
    try {
      const { sendQuoteAcceptedEmail, getUserLocale } = await import('@/lib/email-templates')
      
      const artistLocale = await getUserLocale(quote.booking.artist.userId)
      const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/artist/bookings`
      
      // Format the event data for email
      const formattedEventDate = new Date(quote.booking.eventDate).toLocaleDateString(
        artistLocale === 'th' ? 'th-TH' : 'en-US',
        {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      )

      const formattedEventTime = new Date(quote.booking.startTime).toLocaleTimeString(
        artistLocale === 'th' ? 'th-TH' : 'en-US',
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      )

      await sendQuoteAcceptedEmail({
        to: quote.booking.artist.user.email,
        artistName: quote.booking.artist.stageName,
        customerName: quote.booking.customer?.name || 'Customer',
        eventType: quote.booking.eventType,
        eventDate: formattedEventDate,
        eventTime: formattedEventTime,
        venue: quote.booking.venue,
        acceptedPrice: quote.quotedPrice.toFixed(2),
        currency: quote.currency,
        depositAmount: quote.depositAmount ? quote.depositAmount.toFixed(2) : undefined,
        customerNotes: notes,
        bookingUrl,
        locale: artistLocale,
      })
      
      console.log('Quote accepted email sent to artist:', quote.booking.artist.user.email)
    } catch (emailError) {
      console.error('Failed to send quote accepted email:', emailError)
      // Don't fail the acceptance if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Quote accepted successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to accept quote')
  }
}