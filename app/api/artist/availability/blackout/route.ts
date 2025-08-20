import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Validation schemas
const createBlackoutDateSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  blackoutType: z.enum(['PERSONAL', 'HOLIDAY', 'MAINTENANCE', 'OTHER']),
  isRecurring: z.boolean().default(false),
  recurringRule: z.object({}).optional() // JSON object for recurrence rules
})

const updateBlackoutDateSchema = createBlackoutDateSchema.partial()

// GET - List artist's blackout dates
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
    const type = searchParams.get('type')
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined
    const upcoming = searchParams.get('upcoming') === 'true'

    let whereClause: any = { artistId: artist.id }
    
    // Filter by blackout type
    if (type && ['PERSONAL', 'HOLIDAY', 'MAINTENANCE', 'OTHER'].includes(type)) {
      whereClause.blackoutType = type
    }

    // Date filtering
    if (upcoming) {
      whereClause.endDate = {
        gte: new Date()
      }
    } else if (year && month) {
      const startOfMonth = new Date(year, month - 1, 1)
      const endOfMonth = new Date(year, month, 0)
      
      whereClause.OR = [
        {
          startDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        {
          endDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        {
          AND: [
            { startDate: { lte: startOfMonth } },
            { endDate: { gte: endOfMonth } }
          ]
        }
      ]
    } else if (year) {
      const startOfYear = new Date(year, 0, 1)
      const endOfYear = new Date(year, 11, 31)
      
      whereClause.OR = [
        {
          startDate: {
            gte: startOfYear,
            lte: endOfYear
          }
        },
        {
          endDate: {
            gte: startOfYear,
            lte: endOfYear
          }
        },
        {
          AND: [
            { startDate: { lte: startOfYear } },
            { endDate: { gte: endOfYear } }
          ]
        }
      ]
    }

    const blackoutDates = await prisma.blackoutDate.findMany({
      where: whereClause,
      orderBy: { startDate: 'asc' }
    })

    return NextResponse.json({ blackoutDates })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch blackout dates')
  }
}

// POST - Create new blackout date
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
    const validationResult = createBlackoutDateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid blackout date data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Validate date range
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    
    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Check for conflicts with existing bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        artistId: artist.id,
        status: { in: ['CONFIRMED', 'PAID'] },
        eventDate: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        id: true,
        bookingNumber: true,
        eventDate: true,
        eventType: true
      }
    })

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot create blackout date - there are confirmed bookings in this period',
          conflictingBookings: conflictingBookings
        },
        { status: 409 }
      )
    }

    // Create the blackout date
    const blackoutDate = await prisma.blackoutDate.create({
      data: {
        artistId: artist.id,
        ...data
      }
    })

    // Automatically mark availability as unavailable for this period
    await prisma.availability.updateMany({
      where: {
        artistId: artist.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      data: {
        status: 'UNAVAILABLE',
        notes: `Blackout: ${data.title}`
      }
    })

    return NextResponse.json({ 
      success: true, 
      blackoutDate,
      message: 'Blackout date created successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to create blackout date')
  }
}

// PUT - Update existing blackout date
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

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Blackout date ID is required' },
        { status: 400 }
      )
    }

    // Validate input data
    const validationResult = updateBlackoutDateSchema.safeParse(updateData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid blackout date data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    // Check if blackout date exists and belongs to artist
    const existingBlackout = await prisma.blackoutDate.findFirst({
      where: {
        id: id,
        artistId: artist.id
      }
    })

    if (!existingBlackout) {
      return NextResponse.json(
        { error: 'Blackout date not found' },
        { status: 404 }
      )
    }

    const data = validationResult.data

    // Validate date range if provided
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      
      if (endDate <= startDate) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    // Update the blackout date
    const blackoutDate = await prisma.blackoutDate.update({
      where: { id: id },
      data: data
    })

    return NextResponse.json({ 
      success: true, 
      blackoutDate,
      message: 'Blackout date updated successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to update blackout date')
  }
}

// DELETE - Delete blackout date
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Blackout date ID is required' },
        { status: 400 }
      )
    }

    // Check if blackout date exists and belongs to artist
    const existingBlackout = await prisma.blackoutDate.findFirst({
      where: {
        id: id,
        artistId: artist.id
      }
    })

    if (!existingBlackout) {
      return NextResponse.json(
        { error: 'Blackout date not found' },
        { status: 404 }
      )
    }

    // Delete the blackout date
    await prisma.blackoutDate.delete({
      where: { id: id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Blackout date deleted successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to delete blackout date')
  }
}