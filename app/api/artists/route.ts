import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'

// Input validation schema for artist search
const searchSchema = z.object({
  category: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  search: z.string().max(200).optional(),
  page: z.number().min(1).max(1000).default(1),
  limit: z.number().min(1).max(100).default(12)
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    
    // Validate input parameters
    const inputValidation = searchSchema.safeParse({
      category: searchParams.get('category') || undefined,
      city: searchParams.get('city') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12')
    })
    
    if (!inputValidation.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: inputValidation.error.issues },
        { status: 400 }
      )
    }
    
    const { category, city, search, page, limit } = inputValidation.data
    const skip = (page - 1) * limit
    
    // Base query to get active artists
    const where: any = {
      user: {
        isActive: true
      }
    }
    
    // Build search conditions
    const conditions: any[] = []
    
    if (category) {
      conditions.push({ category: category })
    }
    
    if (city) {
      conditions.push({
        OR: [
          { baseCity: { contains: city, mode: 'insensitive' } },
          { serviceAreas: { has: city } }
        ]
      })
    }
    
    if (search) {
      conditions.push({
        OR: [
          { stageName: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
          { bioTh: { contains: search, mode: 'insensitive' } },
          { genres: { hasSome: search.split(' ').filter(s => s.length > 0) } }
        ]
      })
    }
    
    // Combine all conditions
    if (conditions.length > 0) {
      where.AND = conditions
    }
    
    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isActive: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        },
        orderBy: [
          { verificationLevel: 'desc' },
          { averageRating: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.artist.count({ where })
    ])
    
    // Transform the data to match the expected interface
    const artistsWithStats = artists.map(artist => {
      const ratings = artist.reviews.map(r => r.rating)
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : null
      
      const { reviews, user, hourlyRate, ...artistData } = artist
      
      return {
        id: artist.id,
        stageName: artist.stageName,
        bio: artist.bio,
        bioTh: artist.bioTh,
        category: artist.category,
        baseCity: artist.baseCity,
        profileImage: artist.profileImage,
        averageRating,
        reviewCount: ratings.length,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate.toString()) : null,
        verificationLevel: artist.verificationLevel,
        genres: artist.genres
      }
    })
    
    return NextResponse.json({
      artists: artistsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch artists')
  }
}