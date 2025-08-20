import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse, sanitizeInput } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Validation schema for updating quotes
const updateQuoteSchema = z.object({
  quotedPrice: z.number().min(0).max(1000000).optional(),
  currency: z.string().length(3).optional(),
  validUntil: z.string().datetime().optional(),
  inclusions: z.array(z.string().max(200)).max(20).optional(),
  exclusions: z.array(z.string().max(200)).max(20).optional(),
  notes: z.string().max(1000).optional(),
  requiresDeposit: z.boolean().optional(),
  depositAmount: z.number().min(0).optional(),
  depositPercentage: z.number().min(0).max(100).optional()
})

// GET - Get specific quote details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id: quoteId } = await context.params

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        booking: {
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                customer: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            },
            artist: {
              select: {
                id: true,
                stageName: true,
                profileImage: true,
                category: true
              }
            }
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Check authorization - customer, artist, or admin can view
    const isCustomer = user.id === quote.booking.customerId
    const isArtist = user.role === 'ARTIST' && user.artist?.id === quote.booking.artistId
    const isAdmin = user.role === 'ADMIN'

    if (!isCustomer && !isArtist && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized to view this quote' }, { status: 403 })
    }

    return NextResponse.json({
      quote: {
        ...quote,
        quotedPrice: quote.quotedPrice.toNumber(),
        depositAmount: quote.depositAmount ? quote.depositAmount.toNumber() : null,
        booking: {
          ...quote.booking,
          quotedPrice: quote.booking.quotedPrice ? quote.booking.quotedPrice.toNumber() : null
        }
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch quote')
  }
}

// PUT - Update quote (artist only, before customer accepts)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Only artists can update quotes' }, { status: 403 })
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.booking, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    const { id: quoteId } = await context.params

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        booking: {
          include: {
            customer: { select: { id: true, email: true } },
            artist: { select: { id: true, stageName: true } }
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Check if user is the artist who created the quote
    if (user.artist?.id !== quote.booking.artistId) {
      return NextResponse.json({ error: 'Can only update your own quotes' }, { status: 403 })
    }

    // Check if quote can be updated (must be PENDING)
    if (quote.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only update pending quotes' },
        { status: 400 }
      )
    }

    // Check if quote has expired
    if (quote.validUntil < new Date()) {
      return NextResponse.json(
        { error: 'Cannot update expired quotes' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = updateQuoteSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid quote data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const {
      quotedPrice,
      currency,
      validUntil,
      inclusions,
      exclusions,
      notes,
      requiresDeposit,
      depositAmount,
      depositPercentage
    } = validationResult.data

    // Validate quote expiration date if provided
    if (validUntil) {
      const validUntilDate = new Date(validUntil)
      const now = new Date()
      if (validUntilDate <= now) {
        return NextResponse.json(
          { error: 'Quote expiration date must be in the future' },
          { status: 400 }
        )
      }
    }

    // Validate deposit logic if updating deposit settings
    if (requiresDeposit !== undefined && requiresDeposit) {
      if (depositAmount && depositPercentage) {
        return NextResponse.json(
          { error: 'Specify either deposit amount or percentage, not both' },
          { status: 400 }
        )
      }
      
      const newDepositAmount = depositAmount !== undefined ? depositAmount : quote.depositAmount
      const newDepositPercentage = depositPercentage !== undefined ? depositPercentage : quote.depositPercentage
      
      if (!newDepositAmount && !newDepositPercentage) {
        return NextResponse.json(
          { error: 'Deposit amount or percentage required when deposit is required' },
          { status: 400 }
        )
      }
    }

    // Sanitize text inputs
    const sanitizedData = {
      inclusions: inclusions?.map(item => sanitizeInput(item)),
      exclusions: exclusions?.map(item => sanitizeInput(item)),
      notes: notes ? sanitizeInput(notes) : undefined
    }

    // Build update data
    const updateData: any = {}
    if (quotedPrice !== undefined) updateData.quotedPrice = quotedPrice
    if (currency !== undefined) updateData.currency = currency
    if (validUntil !== undefined) updateData.validUntil = new Date(validUntil)
    if (sanitizedData.inclusions !== undefined) updateData.inclusions = sanitizedData.inclusions
    if (sanitizedData.exclusions !== undefined) updateData.exclusions = sanitizedData.exclusions
    if (sanitizedData.notes !== undefined) updateData.notes = sanitizedData.notes
    if (requiresDeposit !== undefined) updateData.requiresDeposit = requiresDeposit
    if (depositAmount !== undefined) updateData.depositAmount = depositAmount
    if (depositPercentage !== undefined) updateData.depositPercentage = depositPercentage

    // Update the quote
    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: updateData,
      include: {
        booking: {
          include: {
            customer: { select: { email: true } },
            artist: { select: { stageName: true } }
          }
        }
      }
    })

    // Update booking quoted price if price changed
    if (quotedPrice !== undefined) {
      await prisma.booking.update({
        where: { id: quote.bookingId },
        data: { quotedPrice: quotedPrice }
      })
    }

    // Create notification for customer about quote update
    await prisma.notification.create({
      data: {
        userId: quote.booking.customerId,
        type: 'quote_updated',
        title: 'Quote Updated',
        titleTh: 'ใบเสนอราคาได้รับการอัพเดท',
        content: `${quote.booking.artist.stageName} has updated their quote for your booking request.`,
        contentTh: `${quote.booking.artist.stageName} ได้อัพเดทใบเสนอราคาสำหรับคำขอจองของคุณ`,
        relatedId: quoteId,
        relatedType: 'quote'
      }
    })

    return NextResponse.json({
      success: true,
      quote: {
        ...updatedQuote,
        quotedPrice: updatedQuote.quotedPrice.toNumber(),
        depositAmount: updatedQuote.depositAmount ? updatedQuote.depositAmount.toNumber() : null
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to update quote')
  }
}

// DELETE - Delete/cancel quote (artist only, before customer accepts)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Only artists can delete quotes' }, { status: 403 })
    }

    const { id: quoteId } = await context.params

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        booking: {
          include: {
            customer: { select: { id: true, email: true } },
            artist: { select: { id: true, stageName: true } }
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Check if user is the artist who created the quote
    if (user.artist?.id !== quote.booking.artistId) {
      return NextResponse.json({ error: 'Can only delete your own quotes' }, { status: 403 })
    }

    // Check if quote can be deleted (must be PENDING)
    if (quote.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only delete pending quotes' },
        { status: 400 }
      )
    }

    // Delete the quote
    await prisma.quote.delete({
      where: { id: quoteId }
    })

    // Revert booking status back to INQUIRY if this was the only quote
    const remainingQuotes = await prisma.quote.count({
      where: {
        bookingId: quote.bookingId,
        status: { in: ['PENDING', 'ACCEPTED'] }
      }
    })

    if (remainingQuotes === 0) {
      await prisma.booking.update({
        where: { id: quote.bookingId },
        data: { 
          status: 'INQUIRY'
        }
      })
    }

    // Create notification for customer
    await prisma.notification.create({
      data: {
        userId: quote.booking.customerId,
        type: 'quote_cancelled',
        title: 'Quote Cancelled',
        titleTh: 'ใบเสนอราคาถูกยกเลิก',
        content: `${quote.booking.artist.stageName} has cancelled their quote for your booking request.`,
        contentTh: `${quote.booking.artist.stageName} ได้ยกเลิกใบเสนอราคาสำหรับคำขอจองของคุณ`,
        relatedId: quote.bookingId,
        relatedType: 'booking'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to delete quote')
  }
}