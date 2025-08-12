import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const {
      hourlyRate,
      minimumHours,
      currency,
      instantBooking,
      advanceNotice,
      cancellationPolicy
    } = body

    // Update artist pricing settings
    const updatedArtist = await prisma.artist.update({
      where: { id: artist.id },
      data: {
        hourlyRate: hourlyRate || null,
        minimumHours: minimumHours || 2,
        currency: currency || 'THB',
        instantBooking: instantBooking || false,
        advanceNotice: advanceNotice || 7,
        cancellationPolicy: cancellationPolicy || null
      }
    })

    return NextResponse.json({ success: true, artist: updatedArtist })
  } catch (error) {
    console.error('Error updating artist pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}