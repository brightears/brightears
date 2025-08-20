import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Enhanced input validation schemas
const updateAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  startTime: z.string().regex(/^\d{2}:\d{2}$/).default('09:00'), // HH:MM format
  endTime: z.string().regex(/^\d{2}:\d{2}$/).default('23:00'),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'TENTATIVE', 'BOOKED', 'TRAVEL_TIME']).default('AVAILABLE'),
  priceMultiplier: z.number().min(0.1).max(10).optional(),
  minimumHours: z.number().min(1).max(24).optional(),
  bufferBefore: z.number().min(0).max(480).default(0), // minutes
  bufferAfter: z.number().min(0).max(480).default(0), // minutes
  notes: z.string().max(500).optional(),
  requirements: z.string().max(1000).optional(),
  recurringPatternId: z.string().uuid().optional(),
  timezone: z.string().default('Asia/Bangkok')
})

const bulkAvailabilitySchema = z.object({
  availabilities: z.array(updateAvailabilitySchema).min(1).max(31), // Limit to 31 days at once
  applyToRecurringPattern: z.boolean().default(false),
  recurringPatternId: z.string().uuid().optional()
})

const getAvailabilitySchema = z.object({
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2024).max(2030).optional(),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'TENTATIVE', 'BOOKED', 'TRAVEL_TIME']).optional(),
  includeBooked: z.boolean().default(true),
  includePastDates: z.boolean().default(false),
  view: z.enum(['calendar', 'list', 'summary']).default('calendar')
})

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const artist = user.artist
    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.profile, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = updateAvailabilitySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid availability data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { 
      date, startTime, endTime, status, priceMultiplier, minimumHours,
      bufferBefore, bufferAfter, notes, requirements, recurringPatternId, timezone
    } = validationResult.data

    // Parse the date and time
    const eventDate = new Date(date)
    const startDateTime = new Date(`${date}T${startTime}:00`)
    const endDateTime = new Date(`${date}T${endTime}:00`)
    
    // Validate date is not in the past (except for today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (eventDate < today) {
      return NextResponse.json(
        { error: 'Cannot set availability for past dates' },
        { status: 400 }
      )
    }
    
    // Validate that end time is after start time
    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    // Check for booking conflicts if status is being set to unavailable
    if (status === 'UNAVAILABLE' || status === 'TRAVEL_TIME') {
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          artistId: artist.id,
          eventDate: eventDate,
          status: { in: ['CONFIRMED', 'PAID'] }
        }
      })
      
      if (conflictingBooking) {
        return NextResponse.json(
          { error: 'Cannot mark as unavailable - there is a confirmed booking on this date' },
          { status: 409 }
        )
      }
    }

    // Check if availability already exists for this date and time
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        artistId: artist.id,
        date: eventDate,
        startTime: startDateTime
      }
    })

    let availability

    if (existingAvailability) {
      // Update existing availability
      availability = await prisma.availability.update({
        where: { id: existingAvailability.id },
        data: {
          endTime: endDateTime,
          status,
          priceMultiplier,
          minimumHours,
          bufferBefore,
          bufferAfter,
          notes,
          requirements,
          recurringPatternId,
          timezone
        },
        include: {
          recurringPattern: true,
          booking: true
        }
      })
    } else {
      // Create new availability
      availability = await prisma.availability.create({
        data: {
          artistId: artist.id,
          date: eventDate,
          startTime: startDateTime,
          endTime: endDateTime,
          status,
          priceMultiplier,
          minimumHours,
          bufferBefore,
          bufferAfter,
          notes,
          requirements,
          recurringPatternId,
          timezone
        },
        include: {
          recurringPattern: true,
          booking: true
        }
      })
    }

    return NextResponse.json({ success: true, availability })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to update availability')
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const artist = user.artist
    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    
    // Validate input parameters
    const inputValidation = getAvailabilitySchema.safeParse({
      month: searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      status: searchParams.get('status') || undefined,
      includeBooked: searchParams.get('includeBooked') === 'true',
      includePastDates: searchParams.get('includePastDates') === 'true',
      view: searchParams.get('view') || 'calendar'
    })
    
    if (!inputValidation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: inputValidation.error.issues },
        { status: 400 }
      )
    }
    
    const { month, year, status, includeBooked, includePastDates, view } = inputValidation.data

    let whereClause: any = { artistId: artist.id }

    // Date filtering
    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      
      whereClause.date = {
        gte: startDate,
        lte: endDate
      }
    } else if (!includePastDates) {
      // Only show future dates by default
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      whereClause.date = {
        gte: today
      }
    }

    // Status filtering
    if (status) {
      whereClause.status = status
    }

    // Booking filtering
    if (!includeBooked) {
      whereClause.isBooked = false
    }

    const availability = await prisma.availability.findMany({
      where: whereClause,
      include: {
        recurringPattern: {
          select: {
            id: true,
            name: true,
            frequency: true
          }
        },
        booking: includeBooked ? {
          select: {
            id: true,
            bookingNumber: true,
            status: true,
            eventType: true,
            customer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        } : false
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    // Format response based on view type
    let response: any = { availability }

    if (view === 'summary') {
      const summary = {
        total: availability.length,
        available: availability.filter(a => a.status === 'AVAILABLE').length,
        unavailable: availability.filter(a => a.status === 'UNAVAILABLE').length,
        booked: availability.filter(a => a.status === 'BOOKED').length,
        tentative: availability.filter(a => a.status === 'TENTATIVE').length
      }
      response.summary = summary
    }

    return NextResponse.json(response)
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch availability')
  }
}

/**
 * Bulk update availability for multiple dates
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const artist = user.artist
    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.profile, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = bulkAvailabilitySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid bulk availability data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { availabilities } = validationResult.data
    const results = []
    const errors = []

    // Process each availability update
    for (const availabilityData of availabilities) {
      try {
        const { date, startTime, endTime, status = 'AVAILABLE' } = availabilityData
        
        // Parse the date and time
        const eventDate = new Date(date)
        const startDateTime = new Date(`${date}T${startTime}:00`)
        const endDateTime = new Date(`${date}T${endTime}:00`)
        
        // Validate date is not in the past
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (eventDate < today) {
          errors.push({ date, error: 'Cannot set availability for past dates' })
          continue
        }
        
        // Validate that end time is after start time
        if (endDateTime <= startDateTime) {
          errors.push({ date, error: 'End time must be after start time' })
          continue
        }

        // Check if availability already exists for this date
        const existingAvailability = await prisma.availability.findFirst({
          where: {
            artistId: artist.id,
            date: eventDate
          }
        })

        let availability
        if (existingAvailability) {
          // Update existing availability
          availability = await prisma.availability.update({
            where: { id: existingAvailability.id },
            data: {
              status,
              startTime: startDateTime,
              endTime: endDateTime
            }
          })
        } else {
          // Create new availability
          availability = await prisma.availability.create({
            data: {
              artistId: artist.id,
              date: eventDate,
              startTime: startDateTime,
              endTime: endDateTime,
              status
            }
          })
        }

        results.push({ date, success: true, availability })

      } catch (error) {
        console.error(`Error processing availability for ${availabilityData.date}:`, error)
        errors.push({ 
          date: availabilityData.date, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      processed: results.length,
      failed: errors.length,
      results,
      errors
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to bulk update availability')
  }
}