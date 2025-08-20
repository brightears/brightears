import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Input validation schema for public availability queries
const getPublicAvailabilitySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2024).max(2030).optional()
})

/**
 * Get artist availability for customers (public endpoint)
 * This endpoint allows customers to check when an artist is available for booking
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
    let dateFilter: any = {}
    
    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    } else if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1)
      const endOfMonth = new Date(year, month, 0)
      dateFilter = {
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    } else {
      // Default to next 30 days if no range specified
      const today = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(today.getDate() + 30)
      
      dateFilter = {
        date: {
          gte: today,
          lte: thirtyDaysFromNow
        }
      }
    }

    // Get availability data
    const availability = await prisma.availability.findMany({
      where: {
        artistId: artistId,
        isAvailable: true, // Only show available slots
        isBooked: false,   // Only show unbooked slots
        ...dateFilter
      },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
        isBooked: false // Don't expose booking status details
      },
      orderBy: { date: 'asc' }
    })

    // Also check for confirmed bookings that would block availability
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        artistId: artistId,
        status: {
          in: ['CONFIRMED', 'PAID', 'COMPLETED']
        },
        eventDate: dateFilter.date
      },
      select: {
        eventDate: true,
        startTime: true,
        endTime: true
      }
    })

    // Filter out availability slots that conflict with confirmed bookings
    const availableSlots = availability.filter(slot => {
      return !confirmedBookings.some(booking => {
        const slotDate = slot.date.toDateString()
        const bookingDate = booking.eventDate.toDateString()
        
        if (slotDate !== bookingDate) return false
        
        // Check for time overlap
        const slotStart = slot.startTime.getTime()
        const slotEnd = slot.endTime.getTime()
        const bookingStart = booking.startTime.getTime()
        const bookingEnd = booking.endTime.getTime()
        
        return (slotStart < bookingEnd && slotEnd > bookingStart)
      })
    })

    return NextResponse.json({
      artistId,
      availability: availableSlots,
      totalSlots: availableSlots.length
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch artist availability')
  }
}