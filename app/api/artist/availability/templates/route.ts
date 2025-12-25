import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  duration: z.number().min(30).max(1440), // minutes, max 24 hours
  bufferBefore: z.number().min(0).max(480).default(0), // minutes
  bufferAfter: z.number().min(0).max(480).default(0), // minutes
  priceMultiplier: z.number().min(0.1).max(10).default(1.0),
  minimumAdvanceHours: z.number().min(1).max(8760).default(24), // max 1 year
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true)
})

const updateTemplateSchema = createTemplateSchema.partial()

const applyTemplateSchema = z.object({
  templateId: z.string().uuid(),
  dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1).max(31),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  overwriteExisting: z.boolean().default(false)
})

// GET - List artist's time slot templates
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
    const isDefault = searchParams.get('default')

    let whereClause: any = { artistId: artist.id }
    
    if (isActive !== null) {
      whereClause.isActive = isActive === 'true'
    }

    if (isDefault !== null) {
      whereClause.isDefault = isDefault === 'true'
    }

    const templates = await prisma.timeSlotTemplate.findMany({
      where: whereClause,
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ templates })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch time slot templates')
  }
}

// POST - Create new time slot template or apply template to dates
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
    
    // Check if this is a template application request
    if (body.templateId && body.dates) {
      return await applyTemplateToDateRange(artist.id, body)
    }

    // Otherwise, create a new template
    const validationResult = createTemplateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid template data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // If setting as default, unset other default templates
    if (data.isDefault) {
      await prisma.timeSlotTemplate.updateMany({
        where: {
          artistId: artist.id,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }

    // Create the template
    const template = await prisma.timeSlotTemplate.create({
      data: {
        artistId: artist.id,
        ...data
      }
    })

    return NextResponse.json({ 
      success: true, 
      template,
      message: 'Time slot template created successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to create time slot template')
  }
}

// Helper function to apply template to date range
async function applyTemplateToDateRange(artistId: string, requestData: any) {
  const validationResult = applyTemplateSchema.safeParse(requestData)
  if (!validationResult.success) {
    return NextResponse.json(
      { error: 'Invalid template application data', details: validationResult.error.issues },
      { status: 400 }
    )
  }

  const { templateId, dates, startTime, overwriteExisting } = validationResult.data

  // Get the template
  const template = await prisma.timeSlotTemplate.findFirst({
    where: {
      id: templateId,
      artistId: artistId,
      isActive: true
    }
  })

  if (!template) {
    return NextResponse.json(
      { error: 'Template not found or inactive' },
      { status: 404 }
    )
  }

  const results = []
  const errors = []

  // Process each date
  for (const dateString of dates) {
    try {
      const date = new Date(dateString)
      const startDateTime = new Date(`${dateString}T${startTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + template.duration * 60000)

      // Check if availability already exists
      const existingAvailability = await prisma.availability.findFirst({
        where: {
          artistId: artistId,
          date: date,
          startTime: startDateTime
        }
      })

      if (existingAvailability && !overwriteExisting) {
        errors.push({ 
          date: dateString, 
          error: 'Availability already exists for this date and time'
        })
        continue
      }

      let availability
      if (existingAvailability && overwriteExisting) {
        // Update existing
        availability = await prisma.availability.update({
          where: { id: existingAvailability.id },
          data: {
            endTime: endDateTime,
            priceMultiplier: template.priceMultiplier,
            minimumHours: Math.ceil(template.duration / 60),
            bufferBefore: template.bufferBefore,
            bufferAfter: template.bufferAfter,
            notes: `Applied template: ${template.name}`
          }
        })
      } else {
        // Create new
        availability = await prisma.availability.create({
          data: {
            artistId: artistId,
            date: date,
            startTime: startDateTime,
            endTime: endDateTime,
            status: 'AVAILABLE',
            priceMultiplier: template.priceMultiplier,
            minimumHours: Math.ceil(template.duration / 60),
            bufferBefore: template.bufferBefore,
            bufferAfter: template.bufferAfter,
            notes: `Applied template: ${template.name}`
          }
        })
      }

      results.push({ date: dateString, success: true, availability })

    } catch (error) {
      console.error(`Error applying template to ${dateString}:`, error)
      errors.push({ 
        date: dateString, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  return NextResponse.json({
    success: errors.length === 0,
    processed: results.length,
    failed: errors.length,
    results,
    errors,
    message: `Template applied to ${results.length} dates`
  })
}

// PUT - Update existing template
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
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Validate input data
    const validationResult = updateTemplateSchema.safeParse(updateData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid template data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    // Check if template exists and belongs to artist
    const existingTemplate = await prisma.timeSlotTemplate.findFirst({
      where: {
        id: id,
        artistId: artist.id
      }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const data = validationResult.data

    // If setting as default, unset other default templates
    if (data.isDefault) {
      await prisma.timeSlotTemplate.updateMany({
        where: {
          artistId: artist.id,
          isDefault: true,
          id: { not: id }
        },
        data: {
          isDefault: false
        }
      })
    }

    // Update the template
    const template = await prisma.timeSlotTemplate.update({
      where: { id: id },
      data: data
    })

    return NextResponse.json({ 
      success: true, 
      template,
      message: 'Template updated successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to update template')
  }
}

// DELETE - Delete template
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
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Check if template exists and belongs to artist
    const existingTemplate = await prisma.timeSlotTemplate.findFirst({
      where: {
        id: id,
        artistId: artist.id
      }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Delete the template
    await prisma.timeSlotTemplate.delete({
      where: { id: id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Template deleted successfully'
    })
  } catch (error) {
    return safeErrorResponse(error, 'Failed to delete template')
  }
}