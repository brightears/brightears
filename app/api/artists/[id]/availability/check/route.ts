import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schemas
const availabilityCheckSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM
  duration: z.number().min(30).max(1440), // minutes
  eventType: z.string().optional(),
  includeAlternatives: z.boolean().default(true),
  alternativeRange: z.number().min(1).max(30).default(7) // days
})

interface AvailabilitySlot {
  date: string
  startTime: string
  endTime: string
  duration: number
  basePrice: number
  finalPrice: number
  priceMultiplier: number
  minimumHours?: number
  bufferBefore: number
  bufferAfter: number
  notes?: string
  requirements?: string
}

interface AlternativeSlot extends AvailabilitySlot {
  reason: string
  dayDifference: number
}

// POST - Check availability for specific date/time
export async function POST(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await context.params
    
    if (!artistId) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      )
    }

    // Check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      select: {
        id: true,
        stageName: true,
        hourlyRate: true,
        minimumHours: true,
        defaultBufferTime: true,
        minAdvanceBooking: true,
        maxAdvanceBooking: true,
        weekendPricing: true,
        holidayPricing: true,
        maxTravelDistance: true,
        travelTimeBuffer: true,
        travelRate: true
      }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = availabilityCheckSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid availability check data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { date, startTime, duration, eventType, includeAlternatives, alternativeRange } = validationResult.data

    // Parse requested date and time
    const requestedDate = new Date(date)
    const requestedStartTime = new Date(`${date}T${startTime}:00`)
    const requestedEndTime = new Date(requestedStartTime.getTime() + duration * 60000)

    // Check if date is in valid booking range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const minBookingDate = new Date(today.getTime() + artist.minAdvanceBooking * 60 * 60 * 1000)
    const maxBookingDate = new Date(today.getTime() + artist.maxAdvanceBooking * 24 * 60 * 60 * 1000)

    if (requestedDate < minBookingDate) {
      return NextResponse.json({
        available: false,
        reason: 'TOO_SOON',
        message: `Bookings require ${artist.minAdvanceBooking} hours advance notice`,
        minAdvanceHours: artist.minAdvanceBooking,
        alternatives: includeAlternatives ? await findAlternativeSlots(artistId, requestedDate, duration, alternativeRange, artist) : []
      })
    }

    if (requestedDate > maxBookingDate) {
      return NextResponse.json({
        available: false,
        reason: 'TOO_FAR',
        message: `Bookings can only be made up to ${artist.maxAdvanceBooking} days in advance`,
        maxAdvanceDays: artist.maxAdvanceBooking,
        alternatives: []
      })
    }

    // Check for exact availability match
    const availabilitySlot = await prisma.availability.findFirst({
      where: {
        artistId: artistId,
        date: requestedDate,
        startTime: { lte: requestedStartTime },
        endTime: { gte: requestedEndTime },
        status: 'AVAILABLE',
        isBooked: false
      },
      include: {
        booking: true
      }
    })

    if (!availabilitySlot) {
      return NextResponse.json({
        available: false,
        reason: 'NO_AVAILABILITY',
        message: 'Artist is not available at the requested time',
        alternatives: includeAlternatives ? await findAlternativeSlots(artistId, requestedDate, duration, alternativeRange, artist) : []
      })
    }

    // Check for booking conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        artistId: artistId,
        eventDate: requestedDate,
        status: { in: ['CONFIRMED', 'PAID'] },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: new Date(requestedEndTime.getTime()).toTimeString().slice(0, 5) } },
              { endTime: { gte: new Date(requestedEndTime.getTime()).toTimeString().slice(0, 5) } }
            ]
          }
        ]
      }
    })

    if (conflictingBooking) {
      return NextResponse.json({
        available: false,
        reason: 'BOOKING_CONFLICT',
        message: 'Artist has a confirmed booking that conflicts with requested time',
        conflictingBooking: {
          id: conflictingBooking.id,
          bookingNumber: conflictingBooking.bookingNumber
        },
        alternatives: includeAlternatives ? await findAlternativeSlots(artistId, requestedDate, duration, alternativeRange, artist) : []
      })
    }

    // Check blackout dates
    const blackoutDate = await prisma.blackoutDate.findFirst({
      where: {
        artistId: artistId,
        startDate: { lte: requestedDate },
        endDate: { gte: requestedDate }
      }
    })

    if (blackoutDate) {
      return NextResponse.json({
        available: false,
        reason: 'BLACKOUT_DATE',
        message: `Artist is not available: ${blackoutDate.title}`,
        blackoutInfo: {
          title: blackoutDate.title,
          type: blackoutDate.blackoutType,
          startDate: blackoutDate.startDate,
          endDate: blackoutDate.endDate
        },
        alternatives: includeAlternatives ? await findAlternativeSlots(artistId, requestedDate, duration, alternativeRange, artist) : []
      })
    }

    // Calculate pricing
    const basePrice = artist.hourlyRate ? Number(artist.hourlyRate) : 0
    const durationHours = Math.max(duration / 60, artist.minimumHours)
    
    let priceMultiplier = Number(availabilitySlot.priceMultiplier || 1.0)
    
    // Apply weekend pricing
    const isWeekend = requestedDate.getDay() === 0 || requestedDate.getDay() === 6
    if (isWeekend && artist.weekendPricing) {
      priceMultiplier *= Number(artist.weekendPricing)
    }

    // Apply holiday pricing (simplified - would integrate with Thai holidays in full implementation)
    // This would check against the ThaiHoliday model in a complete implementation

    const finalPrice = basePrice * durationHours * priceMultiplier

    const availabilityInfo: AvailabilitySlot = {
      date: date,
      startTime: availabilitySlot.startTime.toTimeString().slice(0, 5),
      endTime: availabilitySlot.endTime.toTimeString().slice(0, 5),
      duration: duration,
      basePrice: basePrice * durationHours,
      finalPrice: finalPrice,
      priceMultiplier: priceMultiplier,
      minimumHours: availabilitySlot.minimumHours || artist.minimumHours,
      bufferBefore: availabilitySlot.bufferBefore,
      bufferAfter: availabilitySlot.bufferAfter,
      notes: availabilitySlot.notes || undefined,
      requirements: availabilitySlot.requirements || undefined
    }

    return NextResponse.json({
      available: true,
      availability: availabilityInfo,
      artist: {
        id: artist.id,
        name: artist.stageName
      },
      message: 'Artist is available for the requested time'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to check availability')
  }
}

// Helper function to find alternative time slots
async function findAlternativeSlots(
  artistId: string, 
  requestedDate: Date, 
  duration: number, 
  searchRange: number,
  artist: any
): Promise<AlternativeSlot[]> {
  const alternatives: AlternativeSlot[] = []
  const basePrice = artist.hourlyRate ? Number(artist.hourlyRate) : 0
  const durationHours = Math.max(duration / 60, artist.minimumHours)

  // Search for alternatives within the range
  const searchStartDate = new Date(requestedDate.getTime() - searchRange * 24 * 60 * 60 * 1000)
  const searchEndDate = new Date(requestedDate.getTime() + searchRange * 24 * 60 * 60 * 1000)

  const availabilitySlots = await prisma.availability.findMany({
    where: {
      artistId: artistId,
      date: {
        gte: searchStartDate,
        lte: searchEndDate
      },
      status: 'AVAILABLE',
      isBooked: false
    },
    orderBy: { date: 'asc' }
  })

  for (const slot of availabilitySlots) {
    // Check if this slot can accommodate the requested duration
    const slotDuration = slot.endTime.getTime() - slot.startTime.getTime()
    if (slotDuration >= duration * 60000) {
      const dayDifference = Math.floor((slot.date.getTime() - requestedDate.getTime()) / (24 * 60 * 60 * 1000))
      
      let reason = 'ALTERNATIVE_TIME'
      if (dayDifference === 0) {
        reason = 'SAME_DAY_ALTERNATIVE'
      } else if (Math.abs(dayDifference) <= 1) {
        reason = 'ADJACENT_DAY'
      }

      let priceMultiplier = Number(slot.priceMultiplier || 1.0)
      
      // Apply weekend pricing
      const isWeekend = slot.date.getDay() === 0 || slot.date.getDay() === 6
      if (isWeekend && artist.weekendPricing) {
        priceMultiplier *= Number(artist.weekendPricing)
      }

      const finalPrice = basePrice * durationHours * priceMultiplier

      alternatives.push({
        date: slot.date.toISOString().split('T')[0],
        startTime: slot.startTime.toTimeString().slice(0, 5),
        endTime: slot.endTime.toTimeString().slice(0, 5),
        duration: duration,
        basePrice: basePrice * durationHours,
        finalPrice: finalPrice,
        priceMultiplier: priceMultiplier,
        minimumHours: slot.minimumHours || artist.minimumHours,
        bufferBefore: slot.bufferBefore,
        bufferAfter: slot.bufferAfter,
        notes: slot.notes || undefined,
        requirements: slot.requirements || undefined,
        reason: reason,
        dayDifference: dayDifference
      })

      // Limit alternatives to prevent overwhelming response
      if (alternatives.length >= 10) {
        break
      }
    }
  }

  return alternatives.sort((a, b) => Math.abs(a.dayDifference) - Math.abs(b.dayDifference))
}