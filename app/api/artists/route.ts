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
    
    const where: any = {
      user: {
        isActive: true
      }
    }
    
    if (category) {
      where.category = category
    }
    
    if (city) {
      where.OR = [
        { baseCity: { contains: city, mode: 'insensitive' } },
        { serviceAreas: { has: city } }
      ]
    }
    
    if (search) {
      where.OR = [
        { stageName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { genres: { hasSome: [search] } }
      ]
    }
    
    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              phone: false,
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
    
    const artistsWithStats = artists.map(artist => {
      const ratings = artist.reviews.map(r => r.rating)
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : null
      
      const { reviews, ...artistData } = artist
      
      return {
        ...artistData,
        averageRating,
        reviewCount: ratings.length
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