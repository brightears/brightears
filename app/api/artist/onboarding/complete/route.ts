import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const completeOnboardingSchema = z.object({
  artistId: z.string()
})

/**
 * Complete Onboarding API Endpoint
 *
 * Marks the artist's onboarding as complete and publishes their profile.
 * This makes the profile publicly visible on the platform.
 *
 * Requirements before completion:
 * - All 5 steps completed
 * - Profile completeness >= 70%
 * - Verification document uploaded
 * - Payment slip uploaded (or fee waived)
 *
 * @route POST /api/artist/onboarding/complete
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = completeOnboardingSchema.parse(body)

    // Get user with artist profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { artist: true }
    })

    if (!user || user.role !== 'ARTIST' || !user.artist || user.artist.id !== validatedData.artistId) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const artist = user.artist

    // Validation: Check if onboarding requirements are met
    const errors: string[] = []

    // Check profile completeness
    if (artist.profileCompleteness < 70) {
      errors.push('Profile must be at least 70% complete')
    }

    // Check required fields
    if (!artist.bio || artist.bio.length < 50) {
      errors.push('Biography (English) must be at least 50 characters')
    }

    if (!artist.profileImage) {
      errors.push('Profile photo is required')
    }

    if (!artist.hourlyRate || artist.hourlyRate.lte(0)) {
      errors.push('Hourly rate must be set')
    }

    if (!artist.minimumHours || artist.minimumHours < 1) {
      errors.push('Minimum hours must be set')
    }

    if (!artist.verificationDocumentUrl) {
      errors.push('Verification document must be uploaded')
    }

    // Check if verification fee is required and if so, if it's paid
    if (artist.verificationFeeRequired && !artist.verificationFeePaid) {
      errors.push('Verification fee payment slip must be uploaded')
    }

    // Return errors if validation fails
    if (errors.length > 0) {
      return NextResponse.json({
        error: 'Onboarding requirements not met',
        details: errors
      }, { status: 400 })
    }

    // Update artist profile: Mark onboarding complete and publish profile
    const updatedArtist = await prisma.artist.update({
      where: { id: validatedData.artistId },
      data: {
        onboardingCompletedAt: new Date(),
        isDraft: false, // Publish profile
        profilePublishedAt: new Date(),
        onboardingStep: 5, // Ensure step is set to final step
        lastProfileUpdate: new Date()
      }
    })

    // Send welcome email (optional - implement later)
    try {
      // TODO: Send artist welcome email with onboarding completion confirmation
      // const { sendArtistWelcomeEmail } = await import('@/lib/emails')
      // await sendArtistWelcomeEmail(user.email, artist.stageName)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the request if email fails
    }

    // Track onboarding completion for analytics
    try {
      const { trackOnboardingCompletion } = await import('@/lib/activity-tracker')
      await trackOnboardingCompletion(
        artist.id,
        artist.category,
        artist.baseCity,
        5 // Completed all 5 steps
      )
    } catch (trackingError) {
      console.error('Failed to track onboarding completion:', trackingError)
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully! Your profile is now live.',
      artist: {
        id: updatedArtist.id,
        stageName: updatedArtist.stageName,
        onboardingCompletedAt: updatedArtist.onboardingCompletedAt,
        isDraft: updatedArtist.isDraft,
        profilePublishedAt: updatedArtist.profilePublishedAt,
        profileCompleteness: updatedArtist.profileCompleteness
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Onboarding completion error:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
