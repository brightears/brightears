import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionArtist = user.artist
    if (!sessionArtist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    // Fetch full artist data
    const artist = await prisma.artist.findUnique({
      where: { id: sessionArtist.id },
      select: { id: true, baseCity: true, serviceAreas: true, travelRadius: true }
    })

    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { serviceAreas, travelRadius } = body

    // Ensure base city is always included in service areas
    const updatedServiceAreas = serviceAreas.includes(artist.baseCity) 
      ? serviceAreas 
      : [artist.baseCity, ...serviceAreas]

    // Update artist service areas
    const updatedArtist = await prisma.artist.update({
      where: { id: artist.id },
      data: {
        serviceAreas: updatedServiceAreas,
        travelRadius: travelRadius || null
      }
    })

    return NextResponse.json({ success: true, artist: updatedArtist })
  } catch (error) {
    console.error('Error updating artist service areas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}