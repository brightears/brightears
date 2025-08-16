import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/favorites - Get user's favorite artists
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get customer profile with favorite artists
    const customer = await prisma.customer.findUnique({
      where: { userId: user.id },
      include: {
        favoriteArtists: {
          include: {
            user: {
              select: {
                email: true,
                createdAt: true
              }
            }
          }
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      )
    }

    // Calculate average ratings for each artist
    const favoritesWithRatings = await Promise.all(
      customer.favoriteArtists.map(async (artist) => {
        const ratings = await prisma.review.aggregate({
          where: { artistId: artist.id },
          _avg: { rating: true },
          _count: { rating: true }
        })

        return {
          ...artist,
          averageRating: ratings._avg.rating || null,
          reviewCount: ratings._count.rating || 0
        }
      })
    )

    return NextResponse.json({
      favorites: favoritesWithRatings,
      total: favoritesWithRatings.length
    })

  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/favorites - Add artist to favorites
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { artistId } = body

    if (!artistId) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      )
    }

    // Verify artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Get customer profile
    const customer = await prisma.customer.findUnique({
      where: { userId: user.id }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      )
    }

    // Add to favorites (using connect in many-to-many relationship)
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        favoriteArtists: {
          connect: { id: artistId }
        }
      }
    })

    return NextResponse.json({
      message: 'Artist added to favorites',
      artistId
    })

  } catch (error) {
    console.error('Error adding to favorites:', error)
    
    // Handle unique constraint violation (already in favorites)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Artist already in favorites' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/favorites - Remove artist from favorites
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const artistId = searchParams.get('artistId')

    if (!artistId) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      )
    }

    // Get customer profile
    const customer = await prisma.customer.findUnique({
      where: { userId: user.id }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      )
    }

    // Remove from favorites (using disconnect in many-to-many relationship)
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        favoriteArtists: {
          disconnect: { id: artistId }
        }
      }
    })

    return NextResponse.json({
      message: 'Artist removed from favorites',
      artistId
    })

  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}