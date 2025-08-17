import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse, sanitizeInput } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Input validation schemas
const createQuoteSchema = z.object({
  bookingId: z.string().uuid(),
  quotedPrice: z.number().min(0).max(1000000),
  currency: z.string().length(3).default('THB'),
  validUntil: z.string().datetime(),
  inclusions: z.array(z.string().max(200)).max(20).optional(),
  exclusions: z.array(z.string().max(200)).max(20).optional(),
  notes: z.string().max(1000).optional(),
  requiresDeposit: z.boolean().default(false),
  depositAmount: z.number().min(0).optional(),
  depositPercentage: z.number().min(0).max(100).optional()
})

const getQuotesSchema = z.object({
  bookingId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED']).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

/**
 * Create a quote for a booking (artist only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Apply rate limiting for quote creation
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.booking, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = createQuoteSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid quote data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const {
      bookingId,
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

    // Verify the booking exists and belongs to the user's artist profile
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        artist: {
          include: { user: true }
        },
        customer: {
          select: { email: true, role: true }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check authorization - only the artist who received the booking can quote
    if (user.role === 'ARTIST') {
      if (!user.artist || user.artist.id !== booking.artistId) {
        return NextResponse.json(
          { error: 'You can only create quotes for your own bookings' },
          { status: 403 }
        )
      }
    } else if (user.role === 'ADMIN') {
      // Admins can create quotes on behalf of artists
    } else {
      return NextResponse.json(
        { error: 'Only artists can create quotes' },
        { status: 403 }
      )
    }

    // Check if booking is in correct status for quoting
    if (booking.status !== 'INQUIRY') {
      return NextResponse.json(
        { error: 'Can only quote on inquiry status bookings' },
        { status: 400 }
      )
    }

    // Validate quote expiration date
    const validUntilDate = new Date(validUntil)
    const now = new Date()
    if (validUntilDate <= now) {
      return NextResponse.json(
        { error: 'Quote expiration date must be in the future' },
        { status: 400 }
      )
    }

    // Validate deposit logic
    if (requiresDeposit) {
      if (depositAmount && depositPercentage) {
        return NextResponse.json(
          { error: 'Specify either deposit amount or percentage, not both' },
          { status: 400 }
        )
      }
      if (!depositAmount && !depositPercentage) {
        return NextResponse.json(
          { error: 'Deposit amount or percentage required when deposit is required' },
          { status: 400 }
        )
      }
      if (depositPercentage && depositPercentage > 100) {
        return NextResponse.json(
          { error: 'Deposit percentage cannot exceed 100%' },
          { status: 400 }
        )
      }
    }

    // Check if quote already exists for this booking
    const existingQuote = await prisma.quote.findFirst({
      where: {
        bookingId: bookingId,
        status: { in: ['PENDING', 'ACCEPTED'] }
      }
    })

    if (existingQuote) {
      return NextResponse.json(
        { error: 'Active quote already exists for this booking' },
        { status: 409 }
      )
    }

    // Sanitize text inputs
    const sanitizedData = {
      inclusions: inclusions?.map(item => sanitizeInput(item)),
      exclusions: exclusions?.map(item => sanitizeInput(item)),
      notes: notes ? sanitizeInput(notes) : undefined
    }

    // Create the quote
    const quote = await prisma.quote.create({
      data: {
        bookingId,
        quotedPrice,
        currency,
        validUntil: validUntilDate,
        inclusions: sanitizedData.inclusions || [],
        exclusions: sanitizedData.exclusions || [],
        notes: sanitizedData.notes,
        requiresDeposit,
        depositAmount,
        depositPercentage,
        status: 'PENDING'
      },
      include: {
        booking: {
          include: {
            customer: {
              select: { email: true }
            },
            artist: {
              select: { stageName: true }
            }
          }
        }
      }
    })

    // Update booking status to QUOTED
    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'QUOTED',
        quotedPrice: quotedPrice
      }
    })

    // Create notification for customer
    await prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'quote_received',
        title: 'Quote Received',
        titleTh: 'ได้รับใบเสนอราคา',
        content: `${booking.artist.stageName} has sent you a quote for your booking request.`,
        contentTh: `${booking.artist.stageName} ได้ส่งใบเสนอราคาสำหรับคำขอจองของคุณ`,
        relatedId: quote.id,
        relatedType: 'quote'
      }
    })

    return NextResponse.json({
      success: true,
      quote: {
        ...quote,
        quotedPrice: quote.quotedPrice.toNumber(),
        depositAmount: quote.depositAmount ? quote.depositAmount.toNumber() : null
      }
    }, { status: 201 })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to create quote')
  }
}

/**
 * Get quotes (for artists to see their sent quotes, customers to see received quotes)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Validate input parameters
    const inputValidation = getQuotesSchema.safeParse({
      bookingId: searchParams.get('bookingId') || undefined,
      status: searchParams.get('status') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    })
    
    if (!inputValidation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: inputValidation.error.issues },
        { status: 400 }
      )
    }
    
    const { bookingId, status, limit, offset } = inputValidation.data

    let whereClause: any = {}

    // Filter by user role
    if (user.role === 'ARTIST') {
      // Artists see quotes for their bookings
      whereClause.booking = {
        artistId: user.artist?.id
      }
    } else if (user.role === 'CUSTOMER' || user.role === 'CORPORATE') {
      // Customers see quotes for their bookings
      whereClause.booking = {
        customerId: user.id
      }
    } else if (user.role === 'ADMIN') {
      // Admins see all quotes
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Apply filters
    if (bookingId) {
      whereClause.bookingId = bookingId
    }
    if (status) {
      whereClause.status = status
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where: whereClause,
        include: {
          booking: {
            include: {
              customer: {
                select: {
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
                  stageName: true,
                  profileImage: true,
                  category: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.quote.count({ where: whereClause })
    ])

    // Format the response
    const formattedQuotes = quotes.map(quote => ({
      ...quote,
      quotedPrice: quote.quotedPrice.toNumber(),
      depositAmount: quote.depositAmount ? quote.depositAmount.toNumber() : null,
      booking: {
        ...quote.booking,
        quotedPrice: quote.booking.quotedPrice ? quote.booking.quotedPrice.toNumber() : null
      }
    }))

    return NextResponse.json({
      quotes: formattedQuotes,
      total,
      limit,
      offset
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch quotes')
  }
}