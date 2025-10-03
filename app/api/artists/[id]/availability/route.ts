import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

type DayStatus = 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE' | 'PARTIAL'

interface CalendarDay {
  date: string
  status: DayStatus
  partiallyAvailable: boolean
}

// Input validation schema for public availability queries
const getPublicAvailabilitySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2024).max(2030).optional()
})

/**
 * GET /api/artists/[id]/availability
 *
 * Public endpoint to fetch artist availability for calendar display
 * Does not expose booking details or client information
 *
 * Query params:
 * - startDate: ISO date string (YYYY-MM-DD)
 * - endDate: ISO date string (YYYY-MM-DD)
 * - month: Number (1-12)
 * - year: Number (2024-2030)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await params

    // Apply rate limiting to prevent abuse
    const rateLimitResult = await rateLimit(req, RATE_LIMITS.general)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    // Verify artist exists and is active
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        user: {
          select: { isActive: true }
        }
      }
    })

    if (!artist || !artist.user.isActive) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(req.url)

    // Validate input parameters
    const inputValidation = getPublicAvailabilitySchema.safeParse({
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      month: searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined
    })

    if (!inputValidation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: inputValidation.error.issues },
        { status: 400 }
      )
    }

    const { startDate, endDate, month, year } = inputValidation.data

    // Build date range query
    let dateRangeStart: Date
    let dateRangeEnd: Date

    if (startDate && endDate) {
      dateRangeStart = new Date(startDate)
      dateRangeEnd = new Date(endDate)
    } else if (month && year) {
      dateRangeStart = new Date(year, month - 1, 1)
      dateRangeEnd = new Date(year, month, 0)
    } else {
      // Default to next 30 days if no range specified
      dateRangeStart = new Date()
      dateRangeEnd = new Date()
      dateRangeEnd.setDate(dateRangeStart.getDate() + 30)
    }

    // Validate dates
    if (isNaN(dateRangeStart.getTime()) || isNaN(dateRangeEnd.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date range' },
        { status: 400 }
      )
    }

    // Fetch availability slots for the date range
    const availabilitySlots = await prisma.availability.findMany({
      where: {
        artistId,
        date: {
          gte: dateRangeStart,
          lte: dateRangeEnd
        }
      },
      select: {
        date: true,
        status: true,
        isBooked: true,
        startTime: true,
        endTime: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Fetch confirmed bookings for the period
    const bookings = await prisma.booking.findMany({
      where: {
        artistId,
        eventDate: {
          gte: dateRangeStart,
          lte: dateRangeEnd
        },
        status: {
          in: ['CONFIRMED', 'PAID', 'COMPLETED']
        }
      },
      select: {
        eventDate: true,
        startTime: true,
        endTime: true
      }
    })

    // Group availability by date
    const dateMap = new Map<string, CalendarDay>()

    // Process availability slots
    availabilitySlots.forEach(slot => {
      const dateKey = slot.date.toISOString().split('T')[0]

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: dateKey,
          status: 'UNAVAILABLE',
          partiallyAvailable: false
        })
      }

      const dayData = dateMap.get(dateKey)!

      // Determine day status based on slot status
      if (slot.status === 'AVAILABLE' && !slot.isBooked) {
        // If any slot is available, mark day as available (or partial if we already have booked slots)
        if (dayData.status === 'UNAVAILABLE') {
          dayData.status = 'AVAILABLE'
        } else if (dayData.status === 'BOOKED') {
          dayData.status = 'PARTIAL'
          dayData.partiallyAvailable = true
        }
      } else if (slot.status === 'BOOKED' || slot.isBooked) {
        // If slot is booked
        if (dayData.status === 'AVAILABLE') {
          dayData.status = 'PARTIAL'
          dayData.partiallyAvailable = true
        } else if (dayData.status === 'UNAVAILABLE') {
          dayData.status = 'BOOKED'
        }
      } else if (slot.status === 'UNAVAILABLE' || slot.status === 'TRAVEL_TIME') {
        // Keep as unavailable unless we already found available slots
        if (dayData.status === 'AVAILABLE') {
          dayData.status = 'PARTIAL'
          dayData.partiallyAvailable = true
        }
      }
    })

    // Process confirmed bookings (these override availability data)
    bookings.forEach(booking => {
      const dateKey = booking.eventDate.toISOString().split('T')[0]

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: dateKey,
          status: 'BOOKED',
          partiallyAvailable: false
        })
      } else {
        const dayData = dateMap.get(dateKey)!
        if (dayData.status === 'AVAILABLE') {
          dayData.status = 'PARTIAL'
          dayData.partiallyAvailable = true
        } else if (dayData.status === 'UNAVAILABLE') {
          dayData.status = 'BOOKED'
        }
      }
    })

    // Convert map to array
    const dates = Array.from(dateMap.values())

    // Set cache headers (5 minutes cache, 10 minutes stale-while-revalidate)
    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Content-Type': 'application/json'
    }

    return NextResponse.json(
      { dates },
      { headers }
    )

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch artist availability')
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
