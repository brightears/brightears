import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Input validation schemas
const updateAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  isAvailable: z.boolean(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).default('09:00'), // HH:MM format
  endTime: z.string().regex(/^\d{2}:\d{2}$/).default('23:00')
})

const bulkAvailabilitySchema = z.object({
  availabilities: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    isAvailable: z.boolean(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).default('09:00'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).default('23:00')
  })).min(1).max(31) // Limit to 31 days at once
})

const getAvailabilitySchema = z.object({
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2024).max(2030).optional()
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

    const { date, isAvailable, startTime, endTime } = validationResult.data

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
          isAvailable,
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
          isAvailable
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
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined
    })
    
    if (!inputValidation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: inputValidation.error.issues },
        { status: 400 }
      )
    }
    
    const { month, year } = inputValidation.data

    let whereClause: any = { artistId: artist.id }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      
      whereClause.date = {
        gte: startDate,
        lte: endDate
      }
    }

    const availability = await prisma.availability.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    })

    return NextResponse.json({ availability })
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
        const { date, isAvailable, startTime, endTime } = availabilityData
        
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
              isAvailable,
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
              isAvailable
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