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
      stageName,
      realName,
      bio,
      bioTh,
      category,
      subCategories,
      baseCity,
      languages,
      genres
    } = body

    // Update artist profile
    const updatedArtist = await prisma.artist.update({
      where: { id: artist.id },
      data: {
        stageName,
        realName: realName || null,
        bio: bio || null,
        bioTh: bioTh || null,
        category,
        subCategories: subCategories || [],
        baseCity,
        languages: languages || ['en'],
        genres: genres || []
      }
    })

    return NextResponse.json({ success: true, artist: updatedArtist })
  } catch (error) {
    console.error('Error updating artist profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}