import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Validation schemas
const createRecurringPatternSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']),
  dayOfWeek: z.number().min(0).max(6).optional(), // Sunday=0
  dayOfMonth: z.number().min(1).max(31).optional(),
  weekOfMonth: z.number().min(1).max(5).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().default('Asia/Bangkok'),
  priceMultiplier: z.number().min(0.1).max(10).default(1.0),
  minimumHours: z.number().min(1).max(24).optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime().optional(),
  isActive: z.boolean().default(true)
})

const updateRecurringPatternSchema = createRecurringPatternSchema.partial()

// GET - List artist's recurring patterns
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
    const isActive = searchParams.get('active')

    let whereClause: any = { artistId: artist.id }
    
    if (isActive !== null) {
      whereClause.isActive = isActive === 'true'
    }

    const recurringPatterns = await prisma.recurringPattern.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            availability: true,
            exceptions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ recurringPatterns })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch recurring patterns')
  }
}

// POST - Create new recurring pattern
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
    const validationResult = createRecurringPatternSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid recurring pattern data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Validate time range
    const startTime = new Date(`2000-01-01T${data.startTime}:00`)
    const endTime = new Date(`2000-01-01T${data.endTime}:00`)
    
    if (endTime <= startTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    // Validate date range
    const validFrom = new Date(data.validFrom)
    const validUntil = data.validUntil ? new Date(data.validUntil) : null
    
    if (validUntil && validUntil <= validFrom) {
      return NextResponse.json(
        { error: 'Valid until date must be after valid from date' },
        { status: 400 }
      )
    }

    // Validate frequency-specific fields
    if (data.frequency === 'WEEKLY' && data.dayOfWeek === undefined) {
      return NextResponse.json(
        { error: 'Day of week is required for weekly patterns' },
        { status: 400 }
      )
    }

    if (data.frequency === 'MONTHLY' && data.dayOfMonth === undefined) {
      return NextResponse.json(
        { error: 'Day of month is required for monthly patterns' },
        { status: 400 }
      )
    }

    // Create the recurring pattern
    const recurringPattern = await prisma.recurringPattern.create({
      data: {
        artistId: artist.id,
        ...data
      },
      include: {
        _count: {
          select: {
            availability: true,
            exceptions: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      recurringPattern,
      message: 'Recurring pattern created successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to create recurring pattern')
  }
}

// PUT - Update existing recurring pattern
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
        { error: 'Pattern ID is required' },
        { status: 400 }
      )
    }

    // Validate input data
    const validationResult = updateRecurringPatternSchema.safeParse(updateData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid recurring pattern data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    // Check if pattern exists and belongs to artist
    const existingPattern = await prisma.recurringPattern.findFirst({
      where: {
        id: id,
        artistId: artist.id
      }
    })

    if (!existingPattern) {
      return NextResponse.json(
        { error: 'Recurring pattern not found' },
        { status: 404 }
      )
    }

    const data = validationResult.data

    // Validate time range if provided
    if (data.startTime && data.endTime) {
      const startTime = new Date(`2000-01-01T${data.startTime}:00`)
      const endTime = new Date(`2000-01-01T${data.endTime}:00`)
      
      if (endTime <= startTime) {
        return NextResponse.json(
          { error: 'End time must be after start time' },
          { status: 400 }
        )
      }
    }

    // Update the recurring pattern
    const recurringPattern = await prisma.recurringPattern.update({
      where: { id: id },
      data: data,
      include: {
        _count: {
          select: {
            availability: true,
            exceptions: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      recurringPattern,
      message: 'Recurring pattern updated successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to update recurring pattern')
  }
}

// DELETE - Delete recurring pattern
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
        { error: 'Pattern ID is required' },
        { status: 400 }
      )
    }

    // Check if pattern exists and belongs to artist
    const existingPattern = await prisma.recurringPattern.findFirst({
      where: {
        id: id,
        artistId: artist.id
      },
      include: {
        availability: true
      }
    })

    if (!existingPattern) {
      return NextResponse.json(
        { error: 'Recurring pattern not found' },
        { status: 404 }
      )
    }

    // Check if pattern has associated availability slots
    if (existingPattern.availability.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete pattern with existing availability slots',
          availabilitySlotsCount: existingPattern.availability.length
        },
        { status: 409 }
      )
    }

    // Delete the recurring pattern
    await prisma.recurringPattern.delete({
      where: { id: id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Recurring pattern deleted successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to delete recurring pattern')
  }
}