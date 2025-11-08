import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withRole } from '@/lib/api-auth'
import { z } from 'zod'

const prisma = new PrismaClient()

/**
 * Request body validation
 */
const approvalSchema = z.object({
  reviewNotes: z.string().max(1000).optional()
})

/**
 * Parse social media links from application
 * Expected formats:
 * - "Instagram: @username, Facebook: /username"
 * - "instagram.com/username"
 * - "@username"
 */
function extractSocialLink(socialMediaLinks: string | null, platform: string): string | null {
  if (!socialMediaLinks) return null

  const lowerLinks = socialMediaLinks.toLowerCase()
  const lowerPlatform = platform.toLowerCase()

  // Try to find platform-specific link
  const patterns = [
    new RegExp(`${lowerPlatform}[:\\s]+([^,\\n]+)`, 'i'), // "Instagram: @username"
    new RegExp(`${lowerPlatform}\\.com/([^/\\s,]+)`, 'i'), // "instagram.com/username"
    new RegExp(`@([\\w.]+)`, 'i') // "@username" fallback
  ]

  for (const pattern of patterns) {
    const match = socialMediaLinks.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }

  return null
}

/**
 * Calculate profile completeness percentage (0-100)
 * Based on 10 categories, each worth 10 points
 */
function calculateProfileCompleteness(artist: any): number {
  let score = 0

  // Basic info (always present for approved applications)
  if (artist.stageName) score += 10
  if (artist.bio) score += 10
  if (artist.category) score += 10

  // Contact & social (10 points)
  if (artist.lineId || artist.facebook || artist.instagram) score += 10

  // Pricing (10 points)
  if (artist.hourlyRate && artist.hourlyRate > 0) score += 10

  // Location (10 points)
  if (artist.baseCity) score += 10

  // Genres (10 points)
  if (artist.genres && artist.genres.length > 0) score += 10

  // Media (10 points)
  if (artist.profileImage) score += 10

  // Website (10 points)
  if (artist.website) score += 10

  // Real name (10 points - optional but adds credibility)
  if (artist.realName) score += 10

  return score
}

/**
 * POST /api/admin/applications/[id]/approve
 *
 * Approve application and create Artist profile
 * Requires ADMIN role
 *
 * Request Body:
 * - reviewNotes: Optional admin notes
 *
 * Process:
 * 1. Validate application is PENDING
 * 2. Update application status to APPROVED
 * 3. Create User record (if doesn't exist)
 * 4. Create Artist record with mapped data
 * 5. Send approval email (future)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRole(req, 'ADMIN', async () => {
    try {
      const { id } = await params
      const body = await req.json()

      // Validate request body
      const validationResult = approvalSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid request body',
            details: validationResult.error.issues
          },
          { status: 400 }
        )
      }

      const { reviewNotes } = validationResult.data

      // Fetch application
      const application = await prisma.application.findUnique({
        where: { id }
      })

      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        )
      }

      // Check if already reviewed
      if (application.status !== 'PENDING') {
        return NextResponse.json(
          {
            error: 'Application already reviewed',
            currentStatus: application.status
          },
          { status: 409 }
        )
      }

      // Check if artist already exists for this email
      const existingUser = await prisma.user.findUnique({
        where: { email: application.email },
        include: { artist: true }
      })

      if (existingUser?.artist) {
        return NextResponse.json(
          {
            error: 'Artist profile already exists for this email',
            artistId: existingUser.artist.id
          },
          { status: 409 }
        )
      }

      // Begin transaction: Update application + Create user + Create artist
      const result = await prisma.$transaction(async (tx) => {
        // 1. Update application status
        const updatedApplication = await tx.application.update({
          where: { id },
          data: {
            status: 'APPROVED',
            reviewedAt: new Date(),
            reviewNotes: reviewNotes || `Approved by admin on ${new Date().toISOString()}`
          }
        })

        // 2. Create or get user
        let user = existingUser
        if (!user) {
          user = await tx.user.create({
            data: {
              email: application.email,
              phone: application.phone,
              role: 'ARTIST',
              name: application.applicantName,
              isActive: true
            },
            include: { artist: true }
          })
        } else {
          // Update existing user to ARTIST role if not already
          if (user.role !== 'ARTIST') {
            user = await tx.user.update({
              where: { id: user.id },
              data: { role: 'ARTIST' },
              include: { artist: true }
            })
          }
        }

        // 3. Parse social media links
        const facebook = extractSocialLink(application.socialMediaLinks, 'facebook')
        const instagram = extractSocialLink(application.socialMediaLinks, 'instagram')
        const spotify = extractSocialLink(application.socialMediaLinks, 'spotify')
        const soundcloud = extractSocialLink(application.socialMediaLinks, 'soundcloud')
        const mixcloud = extractSocialLink(application.socialMediaLinks, 'mixcloud')

        // 4. Create artist profile
        const artistData = {
          userId: user.id,
          stageName: application.stageName || application.applicantName,
          realName: application.applicantName,
          bio: application.bio,
          category: application.category,
          subCategories: [],
          baseCity: application.baseLocation || 'Bangkok',
          serviceAreas: [application.baseLocation || 'Bangkok'],
          hourlyRate: application.hourlyRateExpectation
            ? parseFloat(application.hourlyRateExpectation)
            : null,
          minimumHours: 2,
          currency: 'THB',
          languages: ['en', 'th'],
          genres: application.genres,
          profileImage: application.profilePhotoUrl || null,
          website: application.website || null,
          facebook: facebook || null,
          instagram: instagram || null,
          spotify: spotify || null,
          soundcloud: soundcloud || null,
          mixcloud: mixcloud || null,
          lineId: application.lineId,
          totalBookings: 0,
          completedBookings: 0,
          instantBooking: false,
          advanceNotice: 7
        }

        const artist = await tx.artist.create({
          data: artistData
        })

        // Calculate and update profile completeness
        const completeness = calculateProfileCompleteness(artist)
        const updatedArtist = await tx.artist.update({
          where: { id: artist.id },
          data: {
            // Note: profileCompleteness field doesn't exist in current schema
            // This is a placeholder for future schema update
            // For now, just return the calculated value
          }
        })

        return {
          application: updatedApplication,
          artist: { ...artist, profileCompleteness: completeness },
          user
        }
      })

      // TODO: Send approval email
      // await sendApprovalEmail(application.email, result.artist.stageName)

      console.log(`✅ Application ${id} approved. Artist created: ${result.artist.id}`)

      return NextResponse.json(
        {
          success: true,
          message: 'Application approved successfully',
          application: {
            id: result.application.id,
            status: result.application.status,
            reviewedAt: result.application.reviewedAt
          },
          artist: {
            id: result.artist.id,
            userId: result.artist.userId,
            stageName: result.artist.stageName,
            category: result.artist.category,
            hourlyRate: result.artist.hourlyRate,
            profileCompleteness: result.artist.profileCompleteness
          }
        },
        { status: 200 }
      )

    } catch (error) {
      console.error('Error approving application:', error)

      return NextResponse.json(
        {
          error: 'Failed to approve application',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })
}
