import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const saveOnboardingSchema = z.object({
  artistId: z.string(),
  currentStep: z.number().min(1).max(5),
  step2Data: z.object({
    profileImage: z.string().optional(),
    coverImage: z.string().optional(),
    bio: z.string().optional(),
    bioTh: z.string().optional()
  }).optional(),
  step3Data: z.object({
    hourlyRate: z.number().optional(),
    minimumHours: z.number().optional(),
    serviceAreas: z.array(z.string()).optional(),
    travelRadius: z.number().optional(),
    genres: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional()
  }).optional(),
  step4Data: z.object({
    verificationDocumentUrl: z.string().optional(),
    verificationDocumentType: z.enum(['national_id', 'passport', 'driver_license']).optional(),
    verificationSubmittedAt: z.string().optional()
  }).optional(),
  step5Data: z.object({
    verificationFeeAmount: z.number().optional(),
    verificationFeePaid: z.boolean().optional(),
    verificationFeePaidAt: z.string().optional(),
    paymentSlipUrl: z.string().optional()
  }).optional()
})

/**
 * Calculate updated profile completeness
 */
function calculateProfileCompleteness(data: {
  stageName: string
  category: string
  baseCity: string
  bio?: string | null
  bioTh?: string | null
  hourlyRate?: number | null
  minimumHours?: number | null
  serviceAreas?: string[]
  genres?: string[]
  languages?: string[]
  realName?: string | null
  phone?: string | null
  facebook?: string | null
  instagram?: string | null
  website?: string | null
}): number {
  let completeness = 0

  // Basic Info (30 points) - Always present
  completeness += 30

  // Contact Information (10 points)
  if (data.phone) completeness += 5
  if (data.facebook || data.instagram || data.website) completeness += 5

  // Pricing Information (20 points)
  if (data.hourlyRate && data.hourlyRate > 0) completeness += 15
  if (data.minimumHours && data.minimumHours > 0) completeness += 5

  // Description (20 points)
  if (data.bio && data.bio.length >= 50) completeness += 15
  if (data.bioTh && data.bioTh.length >= 50) completeness += 5

  // Service Details (20 points)
  if (data.serviceAreas && data.serviceAreas.length > 0) completeness += 5
  if (data.genres && data.genres.length > 0) completeness += 5
  if (data.languages && data.languages.length > 1) completeness += 5
  if (data.realName) completeness += 5

  return Math.min(completeness, 100)
}

/**
 * Save Onboarding Progress API Endpoint
 *
 * Saves the current state of the onboarding wizard without publishing the profile.
 * Updates artist profile fields and tracks progress.
 *
 * @route POST /api/artist/onboarding/save
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = saveOnboardingSchema.parse(body)

    // Verify user owns this artist profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { artist: true }
    })

    if (!user || user.role !== 'ARTIST' || !user.artist || user.artist.id !== validatedData.artistId) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      onboardingStep: validatedData.currentStep,
      lastProfileUpdate: new Date()
    }

    // Apply step 2 data (Profile Details)
    if (validatedData.step2Data) {
      if (validatedData.step2Data.profileImage) updateData.profileImage = validatedData.step2Data.profileImage
      if (validatedData.step2Data.coverImage) updateData.coverImage = validatedData.step2Data.coverImage
      if (validatedData.step2Data.bio) updateData.bio = validatedData.step2Data.bio
      if (validatedData.step2Data.bioTh) updateData.bioTh = validatedData.step2Data.bioTh
    }

    // Apply step 3 data (Pricing & Availability)
    if (validatedData.step3Data) {
      if (validatedData.step3Data.hourlyRate !== undefined) updateData.hourlyRate = validatedData.step3Data.hourlyRate
      if (validatedData.step3Data.minimumHours !== undefined) updateData.minimumHours = validatedData.step3Data.minimumHours
      if (validatedData.step3Data.serviceAreas) updateData.serviceAreas = validatedData.step3Data.serviceAreas
      if (validatedData.step3Data.travelRadius !== undefined) updateData.travelRadius = validatedData.step3Data.travelRadius
      if (validatedData.step3Data.genres) updateData.genres = validatedData.step3Data.genres
      if (validatedData.step3Data.languages) updateData.languages = validatedData.step3Data.languages
    }

    // Apply step 4 data (Verification)
    if (validatedData.step4Data) {
      if (validatedData.step4Data.verificationDocumentUrl) {
        updateData.verificationDocumentUrl = validatedData.step4Data.verificationDocumentUrl
        updateData.verificationDocumentType = validatedData.step4Data.verificationDocumentType
        updateData.verificationSubmittedAt = validatedData.step4Data.verificationSubmittedAt
          ? new Date(validatedData.step4Data.verificationSubmittedAt)
          : new Date()
        updateData.verificationLevel = 'PENDING' // Move to PENDING status when document submitted
      }
    }

    // Apply step 5 data (Payment)
    if (validatedData.step5Data) {
      if (validatedData.step5Data.verificationFeePaid !== undefined) {
        updateData.verificationFeePaid = validatedData.step5Data.verificationFeePaid
      }
      if (validatedData.step5Data.verificationFeePaidAt) {
        updateData.verificationFeePaidAt = new Date(validatedData.step5Data.verificationFeePaidAt)
      }
    }

    // Recalculate profile completeness
    const currentArtist = await prisma.artist.findUnique({
      where: { id: validatedData.artistId },
      select: {
        stageName: true,
        category: true,
        baseCity: true,
        bio: true,
        bioTh: true,
        hourlyRate: true,
        minimumHours: true,
        serviceAreas: true,
        genres: true,
        languages: true,
        realName: true,
        facebook: true,
        instagram: true,
        website: true,
        user: {
          select: {
            phone: true
          }
        }
      }
    })

    if (currentArtist) {
      const mergedData = {
        ...currentArtist,
        ...updateData,
        phone: currentArtist.user.phone
      }
      updateData.profileCompleteness = calculateProfileCompleteness(mergedData)
    }

    // Update artist profile
    const updatedArtist = await prisma.artist.update({
      where: { id: validatedData.artistId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      artist: {
        id: updatedArtist.id,
        onboardingStep: updatedArtist.onboardingStep,
        profileCompleteness: updatedArtist.profileCompleteness,
        verificationLevel: updatedArtist.verificationLevel
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Onboarding save error:', error)
    return NextResponse.json(
      { error: 'Failed to save onboarding progress' },
      { status: 500 }
    )
  }
}
