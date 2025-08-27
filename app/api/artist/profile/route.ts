import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from '@/lib/prisma'

// GET artist profile
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with artist profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        artist: {
          include: {
            reviews: {
              include: {
                reviewer: {
                  select: { name: true, image: true }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 5
            },
            bookings: {
              where: { status: 'COMPLETED' },
              select: { id: true }
            }
          }
        }
      }
    });

    if (!user || !user.artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const artistWithStats = {
      ...user.artist,
      totalCompletedBookings: user.artist.bookings.length,
      recentReviews: user.artist.reviews
    };

    return NextResponse.json({ artist: artistWithStats })
  } catch (error) {
    console.error('Error fetching artist profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE artist profile
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user and verify they're an artist
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { artist: true }
    });

    if (!user || user.role !== 'ARTIST' || !user.artist) {
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
      serviceAreas,
      languages,
      genres,
      hourlyRate,
      minimumHours,
      website,
      facebook,
      instagram,
      tiktok,
      youtube,
      spotify,
      soundcloud,
      lineId
    } = body

    // Update artist profile with comprehensive data
    const updatedArtist = await prisma.artist.update({
      where: { id: user.artist.id },
      data: {
        stageName: stageName || user.artist.stageName,
        realName: realName || null,
        bio: bio || null,
        bioTh: bioTh || null,
        category: category || user.artist.category,
        subCategories: subCategories || user.artist.subCategories,
        baseCity: baseCity || user.artist.baseCity,
        serviceAreas: serviceAreas || user.artist.serviceAreas,
        languages: languages || user.artist.languages,
        genres: genres || user.artist.genres,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : user.artist.hourlyRate,
        minimumHours: minimumHours ? parseInt(minimumHours) : user.artist.minimumHours,
        website: website || user.artist.website,
        facebook: facebook || user.artist.facebook,
        instagram: instagram || user.artist.instagram,
        tiktok: tiktok || user.artist.tiktok,
        youtube: youtube || user.artist.youtube,
        spotify: spotify || user.artist.spotify,
        soundcloud: soundcloud || user.artist.soundcloud,
        lineId: lineId || user.artist.lineId,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, artist: updatedArtist })
  } catch (error) {
    console.error('Error updating artist profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}