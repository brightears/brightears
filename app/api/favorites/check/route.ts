import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/favorites/check?artistId=123 - Check if artist is in user's favorites
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json({ isFavorite: false })
    }

    const { searchParams } = new URL(req.url)
    const artistId = searchParams.get('artistId')

    if (!artistId) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      )
    }

    // Check if artist is in customer's favorites
    const customer = await prisma.customer.findUnique({
      where: { userId: user.id },
      include: {
        favoriteArtists: {
          where: { id: artistId },
          select: { id: true }
        }
      }
    })

    const isFavorite = (customer?.favoriteArtists?.length ?? 0) > 0

    return NextResponse.json({ 
      isFavorite,
      artistId 
    })

  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json({ isFavorite: false })
  } finally {
    await prisma.$disconnect()
  }
}