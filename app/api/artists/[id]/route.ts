import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: params.id },
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
    
    return NextResponse.json({
      ...artist,
      averageRating,
      reviewCount: artist.reviews.length,
      detailedRatings: avgDetailedRatings
    })
    
  } catch (error) {
    console.error('Error fetching artist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artist' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    
    const allowedFields = [
      'stageName', 'realName', 'bio', 'bioTh', 'subCategories',
      'serviceAreas', 'travelRadius', 'hourlyRate', 'minimumHours',
      'languages', 'genres', 'equipment', 'technicalRider',
      'website', 'facebook', 'instagram', 'tiktok', 'youtube',
      'spotify', 'soundcloud', 'mixcloud', 'lineId',
      'instantBooking', 'advanceNotice', 'cancellationPolicy'
    ]
    
    const updateData: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }
    
    const artist = await prisma.artist.update({
      where: { id: params.id },
      data: updateData
    })
    
    return NextResponse.json(artist)
    
  } catch (error) {
    console.error('Error updating artist:', error)
    return NextResponse.json(
      { error: 'Failed to update artist' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}