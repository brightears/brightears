import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
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
    console.error('Error fetching artists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}