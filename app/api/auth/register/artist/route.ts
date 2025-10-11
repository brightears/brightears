import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

const artistRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  stageName: z.string().min(1),
  realName: z.string().optional(),
  bio: z.string().optional(),
  bioTh: z.string().optional(),
  category: z.enum(['DJ', 'BAND', 'SINGER', 'MUSICIAN', 'MC', 'COMEDIAN', 'MAGICIAN', 'DANCER', 'PHOTOGRAPHER', 'SPEAKER']),
  subCategories: z.array(z.string()).optional(),
  baseCity: z.string().min(1),
  serviceAreas: z.array(z.string()).optional(),
  travelRadius: z.number().optional(),
  hourlyRate: z.number().optional(),
  minimumHours: z.number().optional(),
  languages: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  lineId: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
})

/**
 * Calculate initial profile completeness based on provided registration data
 *
 * Profile Completeness Breakdown (100 points total):
 * - Basic Info (30 points): stageName (10) + category (10) + baseCity (10)
 * - Contact (10 points): phone/lineId (5) + social media (5)
 * - Pricing (20 points): hourlyRate (15) + minimumHours (5)
 * - Description (20 points): bio (15) + bioTh (5)
 * - Service Details (20 points): serviceAreas (5) + genres (5) + languages (5) + realName (5)
 *
 * @param data - Validated registration data
 * @returns Profile completeness percentage (0-100)
 */
function calculateProfileCompleteness(data: z.infer<typeof artistRegistrationSchema>): number {
  let completeness = 0

  // Basic Info - Always provided (required fields)
  completeness += 30 // stageName (10) + category (10) + baseCity (10)

  // Contact Information (10 points)
  if (data.phone || data.lineId) completeness += 5
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
 * Artist Registration API Endpoint
 *
 * Creates a new artist account with proper initialization of verification
 * and onboarding fields for the multi-step onboarding wizard.
 *
 * Onboarding Flow (5 Steps):
 * 1. Basic Info (this endpoint) - Create account
 * 2. Profile Details - Add bio, photos, media
 * 3. Pricing & Availability - Set rates, service areas
 * 4. Verification Documents - Upload ID for verification
 * 5. Payment & Go Live - Pay verification fee, publish profile
 *
 * @route POST /api/auth/register/artist
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate registration data
    const validatedData = artistRegistrationSchema.parse(body)

    // Check for existing user with same email or phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { phone: validatedData.phone || undefined }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 400 }
      )
    }

    // Hash password for secure storage
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Calculate initial profile completeness
    const profileCompleteness = calculateProfileCompleteness(validatedData)

    // Create user and artist records in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user account
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          phone: validatedData.phone,
          role: 'ARTIST',
        }
      })

      // Create artist profile with verification and onboarding initialization
      const artist = await tx.artist.create({
        data: {
          userId: user.id,

          // Basic profile information
          stageName: validatedData.stageName,
          realName: validatedData.realName,
          bio: validatedData.bio,
          bioTh: validatedData.bioTh,
          category: validatedData.category,
          subCategories: validatedData.subCategories || [],

          // Location and service areas
          baseCity: validatedData.baseCity,
          serviceAreas: validatedData.serviceAreas || [validatedData.baseCity],
          travelRadius: validatedData.travelRadius,

          // Pricing
          hourlyRate: validatedData.hourlyRate,
          minimumHours: validatedData.minimumHours || 2,

          // Additional details
          languages: validatedData.languages || ['en', 'th'],
          genres: validatedData.genres || [],

          // Social media links
          lineId: validatedData.lineId,
          facebook: validatedData.facebook,
          instagram: validatedData.instagram,
          website: validatedData.website,

          // === VERIFICATION FIELDS INITIALIZATION ===

          // Verification Level - All new artists start unverified
          verificationLevel: 'UNVERIFIED',
          // verifiedAt will be null until admin approves verification

          // ID Verification Documents - All null until artist uploads in Step 4
          // verificationDocumentUrl: null (default)
          // verificationDocumentType: null (default)
          // verificationSubmittedAt: null (default)
          // verificationReviewedAt: null (default)
          // verificationReviewedBy: null (default)
          // verificationRejectionReason: null (default)

          // Verification Fee Tracking - ฿1,500 one-time fee required
          verificationFeeRequired: true,
          verificationFeePaid: false,
          verificationFeeAmount: 1500.00, // THB - Standard verification fee
          // verificationFeePaidAt: null (set when payment confirmed in Step 5)
          // verificationFeeTransactionId: null (set when payment processed)

          // === ONBOARDING PROGRESS TRACKING ===

          // Onboarding Steps (1-5):
          // Step 1: Basic Info (completed by this endpoint)
          // Step 2: Profile Details (photos, videos, detailed bio)
          // Step 3: Pricing & Availability (rates, service areas, calendar)
          // Step 4: Verification Documents (ID upload)
          // Step 5: Payment & Go Live (verification fee, publish profile)
          onboardingStep: 1, // Start at step 1
          onboardingStartedAt: new Date(), // Track when they started
          // onboardingCompletedAt: null (set when all 5 steps complete)

          // Profile Completeness - Calculated based on provided fields
          profileCompleteness: profileCompleteness, // 0-100 percentage

          // === PROFILE MANAGEMENT ===

          // Profile stays in draft mode until onboarding complete
          isDraft: true, // Profile NOT publicly visible yet
          lastProfileUpdate: new Date(), // Track profile changes
          // profilePublishedAt: null (set when isDraft changes to false)
        }
      })

      return { user, artist }
    })

    // Track artist registration activity for analytics
    try {
      const { trackArtistRegistration } = await import('@/lib/activity-tracker')
      await trackArtistRegistration(
        result.artist.id,
        validatedData.category,
        validatedData.baseCity
      )
    } catch (trackingError) {
      console.error('Failed to track artist registration:', trackingError)
      // Don't fail the registration if tracking fails
    }

    // Remove sensitive password from response
    const { password, ...userWithoutPassword } = result.user

    // Return user data with onboarding guidance
    return NextResponse.json({
      user: userWithoutPassword,
      artist: {
        id: result.artist.id,
        stageName: result.artist.stageName,
        category: result.artist.category,
        baseCity: result.artist.baseCity,

        // Onboarding state for frontend wizard
        onboardingStep: result.artist.onboardingStep,
        profileCompleteness: result.artist.profileCompleteness,
        verificationLevel: result.artist.verificationLevel,
        isDraft: result.artist.isDraft,

        // Verification fee information
        verificationFeeRequired: result.artist.verificationFeeRequired,
        verificationFeePaid: result.artist.verificationFeePaid,
        verificationFeeAmount: result.artist.verificationFeeAmount,
      },

      // Next steps guidance for frontend
      nextSteps: {
        currentStep: 1,
        totalSteps: 5,
        message: 'Account created! Complete your profile to start receiving bookings.',
        actions: [
          'Add profile photos and media samples',
          'Set your pricing and availability',
          'Upload verification documents',
          'Pay verification fee (฿1,500)',
          'Publish your profile'
        ]
      }
    }, { status: 201 })

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    // Log unexpected errors
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register artist' },
      { status: 500 }
    )
  } finally {
    // Clean up database connection
    await prisma.$disconnect()
  }
}
