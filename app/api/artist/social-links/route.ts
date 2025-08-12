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
      website,
      facebook,
      instagram,
      tiktok,
      youtube,
      spotify,
      soundcloud,
      mixcloud,
      lineId
    } = body

    // Update artist social links
    const updatedArtist = await prisma.artist.update({
      where: { id: artist.id },
      data: {
        website: website || null,
        facebook: facebook || null,
        instagram: instagram || null,
        tiktok: tiktok || null,
        youtube: youtube || null,
        spotify: spotify || null,
        soundcloud: soundcloud || null,
        mixcloud: mixcloud || null,
        lineId: lineId || null
      }
    })

    return NextResponse.json({ success: true, artist: updatedArtist })
  } catch (error) {
    console.error('Error updating artist social links:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}