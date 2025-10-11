import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const pricingUpdateSchema = z.object({
  hourlyRate: z.number().min(0).optional(),
  minimumHours: z.number().min(1).max(24).optional(),
  serviceAreas: z.array(z.string()).optional(),
  travelRadius: z.number().min(0).optional(),
  genres: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  advanceNotice: z.number().min(0).optional()
})

/**
 * Update Artist Pricing & Availability API Endpoint
 *
 * Updates pricing, service areas, genres, and availability settings.
 * Used during Step 3 of onboarding.
 *
 * @route POST /api/artist/pricing/update
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = pricingUpdateSchema.parse(body)

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

    if (validatedData.hourlyRate !== undefined) updateData.hourlyRate = validatedData.hourlyRate
    if (validatedData.minimumHours !== undefined) updateData.minimumHours = validatedData.minimumHours
    if (validatedData.serviceAreas !== undefined) updateData.serviceAreas = validatedData.serviceAreas
    if (validatedData.travelRadius !== undefined) updateData.travelRadius = validatedData.travelRadius
    if (validatedData.genres !== undefined) updateData.genres = validatedData.genres
    if (validatedData.languages !== undefined) updateData.languages = validatedData.languages
    if (validatedData.advanceNotice !== undefined) updateData.advanceNotice = validatedData.advanceNotice

    // Update artist profile
    const updatedArtist = await prisma.artist.update({
      where: { id: user.artist.id },
      data: updateData,
      select: {
        id: true,
        hourlyRate: true,
        minimumHours: true,
        serviceAreas: true,
        travelRadius: true,
        genres: true,
        languages: true,
        advanceNotice: true,
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

    console.error('Pricing update error:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing' },
      { status: 500 }
    )
  }
}
