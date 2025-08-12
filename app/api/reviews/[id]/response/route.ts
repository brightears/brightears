import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const artist = user.artist
    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { response } = body

    if (!response || response.trim().length === 0) {
      return NextResponse.json({ error: 'Response cannot be empty' }, { status: 400 })
    }

    if (response.length > 500) {
      return NextResponse.json({ error: 'Response too long (max 500 characters)' }, { status: 400 })
    }

    // Verify the review belongs to this artist
    const review = await prisma.review.findUnique({
      where: { id: id },
      include: { artist: true }
    })

    if (!review || review.artistId !== artist.id) {
      return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 })
    }

    // Update review with artist response
    const updatedReview = await prisma.review.update({
      where: { id: id },
      data: {
        artistResponse: response,
        respondedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, review: updatedReview })
  } catch (error) {
    console.error('Error updating review response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}