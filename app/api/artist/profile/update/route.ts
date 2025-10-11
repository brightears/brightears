import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  bio: z.string().optional(),
  bioTh: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  audioSamples: z.array(z.string()).optional()
})

/**
 * Update Artist Profile API Endpoint
 *
 * Updates profile details including photos, bio, and media samples.
 * Used during Step 2 of onboarding.
 *
 * @route POST /api/artist/profile/update
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Get user with artist profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { artist: true }
    })

    if (!user || user.role !== 'ARTIST' || !user.artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      lastProfileUpdate: new Date()
    }

    if (validatedData.profileImage !== undefined) updateData.profileImage = validatedData.profileImage
    if (validatedData.coverImage !== undefined) updateData.coverImage = validatedData.coverImage
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio
    if (validatedData.bioTh !== undefined) updateData.bioTh = validatedData.bioTh
    if (validatedData.images !== undefined) updateData.images = validatedData.images
    if (validatedData.videos !== undefined) updateData.videos = validatedData.videos
    if (validatedData.audioSamples !== undefined) updateData.audioSamples = validatedData.audioSamples

    // Update artist profile
    const updatedArtist = await prisma.artist.update({
      where: { id: user.artist.id },
      data: updateData,
      select: {
        id: true,
        profileImage: true,
        coverImage: true,
        bio: true,
        bioTh: true,
        images: true,
        videos: true,
        audioSamples: true,
        profileCompleteness: true,
        lastProfileUpdate: true
      }
    })

    return NextResponse.json({
      success: true,
      artist: updatedArtist
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
