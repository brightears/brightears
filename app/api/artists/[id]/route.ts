import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireArtistOwnership, safeErrorResponse, sanitizeInput } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Track profile view activity
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            isActive: true,
            createdAt: true
          }
        },
        reviews: {
          where: { isPublic: true },
          include: {
            reviewer: {
              select: {
                email: false,
                role: true
              }
            },
            booking: {
              select: {
                eventType: true,
                eventDate: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        availability: {
          where: {
            date: { gte: new Date() },
            isAvailable: true,
            isBooked: false
          },
          orderBy: { date: 'asc' },
          take: 30
        }
      }
    })
    
    if (!artist || !artist.user.isActive) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }
    
    const ratings = artist.reviews.map(r => r.rating)
    const averageRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : null
    
    const detailedRatings = artist.reviews.reduce((acc, review) => {
      if (review.punctuality) acc.punctuality.push(review.punctuality)
      if (review.performance) acc.performance.push(review.performance)
      if (review.professionalism) acc.professionalism.push(review.professionalism)
      if (review.valueForMoney) acc.valueForMoney.push(review.valueForMoney)
      return acc
    }, {
      punctuality: [] as number[],
      performance: [] as number[],
      professionalism: [] as number[],
      valueForMoney: [] as number[]
    })
    
    const avgDetailedRatings = {
      punctuality: detailedRatings.punctuality.length > 0 
        ? detailedRatings.punctuality.reduce((a, b) => a + b, 0) / detailedRatings.punctuality.length 
        : null,
      performance: detailedRatings.performance.length > 0
        ? detailedRatings.performance.reduce((a, b) => a + b, 0) / detailedRatings.performance.length
        : null,
      professionalism: detailedRatings.professionalism.length > 0
        ? detailedRatings.professionalism.reduce((a, b) => a + b, 0) / detailedRatings.professionalism.length
        : null,
      valueForMoney: detailedRatings.valueForMoney.length > 0
        ? detailedRatings.valueForMoney.reduce((a, b) => a + b, 0) / detailedRatings.valueForMoney.length
        : null
    }

    // Track profile view activity (async, don't wait for it)
    try {
      const { trackProfileView } = await import('@/lib/activity-tracker')
      trackProfileView(id, artist.category, artist.baseCity).catch(console.error)
    } catch (trackingError) {
      console.error('Failed to track profile view:', trackingError)
    }
    
    return NextResponse.json({
      ...artist,
      hourlyRate: artist.hourlyRate ? artist.hourlyRate.toNumber() : null,
      averageRating,
      reviewCount: artist.reviews.length,
      detailedRatings: avgDetailedRatings
    })
    
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch artist')
  }
}

// Validation schema for artist profile updates
const updateArtistSchema = z.object({
  stageName: z.string().min(2).max(100).optional(),
  realName: z.string().min(2).max(100).optional(),
  bio: z.string().max(2000).optional(),
  bioTh: z.string().max(2000).optional(),
  subCategories: z.array(z.string()).max(10).optional(),
  serviceAreas: z.array(z.string()).max(20).optional(),
  travelRadius: z.number().min(0).max(1000).optional(),
  hourlyRate: z.number().min(0).max(100000).optional(),
  minimumHours: z.number().min(1).max(24).optional(),
  languages: z.array(z.string()).max(10).optional(),
  genres: z.array(z.string()).max(20).optional(),
  equipment: z.array(z.string()).max(50).optional(),
  technicalRider: z.string().max(5000).optional(),
  website: z.string().url().max(200).optional().or(z.literal('')),
  facebook: z.string().max(200).optional(),
  instagram: z.string().max(200).optional(),
  tiktok: z.string().max(200).optional(),
  youtube: z.string().max(200).optional(),
  spotify: z.string().max(200).optional(),
  soundcloud: z.string().max(200).optional(),
  mixcloud: z.string().max(200).optional(),
  lineId: z.string().max(100).optional(),
  instantBooking: z.boolean().optional(),
  advanceNotice: z.number().min(1).max(365).optional(),
  cancellationPolicy: z.string().max(1000).optional()
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // CRITICAL: Check authentication and ownership
    const user = await requireArtistOwnership(id)
    
    // Apply rate limiting for profile updates
    const rateLimitResult = await rateLimit(req, RATE_LIMITS.profile, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }
    
    const body = await req.json()
    
    // Validate input data
    const validationResult = updateArtistSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }
    
    const updateData = validationResult.data
    
    // Sanitize text fields to prevent XSS
    const sanitizedData: any = {}
    for (const [key, value] of Object.entries(updateData)) {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeInput(value)
      } else {
        sanitizedData[key] = value
      }
    }
    
    // Only update if we have some data
    if (Object.keys(sanitizedData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }
    
    const artist = await prisma.artist.update({
      where: { id },
      data: sanitizedData
    })
    
    return NextResponse.json({
      ...artist,
      hourlyRate: artist.hourlyRate ? artist.hourlyRate.toNumber() : null
    })
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      if (error.message.includes('Can only edit') || error.message.includes('Must be an artist')) {
        return NextResponse.json(
          { error: 'Unauthorized to edit this artist profile' },
          { status: 403 }
        )
      }
    }
    return safeErrorResponse(error, 'Failed to update artist')
  }
}