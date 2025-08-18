import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enhanceBiography, type BiographyInput } from '@/lib/ai-bio-enhancer'
import { safeErrorResponse } from '@/lib/api-auth'

// Rate limiting for AI enhancement
const ENHANCEMENT_LIMITS = {
  BASIC: 3,      // Basic verified artists
  VERIFIED: 5,   // Email verified artists
  TRUSTED: 10    // Trusted artists
}

const enhancementSchema = z.object({
  bio: z.string().min(1, 'Bio is required'),
  bioTh: z.string().optional(),
  language: z.enum(['en', 'th', 'both']).default('both'),
  targetAudience: z.enum(['corporate', 'wedding', 'nightlife', 'international', 'traditional']).optional(),
  formalityLevel: z.enum(['casual', 'professional', 'formal']).optional()
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Validate input
    const body = await req.json()
    const validationResult = enhancementSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { bio, bioTh, language, targetAudience, formalityLevel } = validationResult.data

    // Get full artist profile from database
    const fullArtist = await prisma.artist.findUnique({
      where: { id: user.artist?.id },
      include: {
        user: true
      }
    })

    if (!fullArtist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    if (!fullArtist.user.isActive) {
      return NextResponse.json({ error: 'Account is not active' }, { status: 403 })
    }

    // Check enhancement limits
    const enhancementLimit = getEnhancementLimit(fullArtist.verificationLevel, fullArtist.user.emailVerified)
    const enhancementCount = await getMonthlyEnhancementCount(fullArtist.id)
    
    if (enhancementCount >= enhancementLimit) {
      return NextResponse.json({
        error: 'Enhancement limit reached',
        limit: enhancementLimit,
        used: enhancementCount,
        message: 'Upgrade your verification level for more AI enhancements'
      }, { status: 429 })
    }

    // Prepare enhancement input
    const enhancementInput: BiographyInput = {
      bio,
      bioTh,
      category: fullArtist.category,
      baseCity: fullArtist.baseCity,
      genres: fullArtist.genres,
      hourlyRate: fullArtist.hourlyRate ? parseFloat(fullArtist.hourlyRate.toString()) : undefined,
      targetAudience,
      language,
      formalityLevel
    }

    // Enhance biography
    const enhancement = await enhanceBiography(enhancementInput)

    // Track usage
    await trackEnhancementUsage(fullArtist.id, language, targetAudience)

    // Return enhanced content
    return NextResponse.json({
      success: true,
      enhancement,
      usage: {
        used: enhancementCount + 1,
        limit: enhancementLimit,
        remaining: enhancementLimit - enhancementCount - 1
      }
    })

  } catch (error) {
    console.error('Bio enhancement error:', error)
    return safeErrorResponse(error, 'Failed to enhance biography')
  }
}

function getEnhancementLimit(verificationLevel: string, emailVerified?: Date | null): number {
  if (verificationLevel === 'TRUSTED') {
    return ENHANCEMENT_LIMITS.TRUSTED
  }
  
  if (emailVerified) {
    return ENHANCEMENT_LIMITS.VERIFIED
  }
  
  return ENHANCEMENT_LIMITS.BASIC
}

async function getMonthlyEnhancementCount(artistId: string): Promise<number> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  // This would typically be stored in a separate enhancement_usage table
  // For now, we'll use a simple approach (you may want to implement proper tracking)
  return 0 // Placeholder - implement actual tracking based on your needs
}

async function trackEnhancementUsage(
  artistId: string, 
  language: string, 
  targetAudience?: string
): Promise<void> {
  // Track enhancement usage for analytics and limits
  // This could be implemented as a separate table or analytics system
  
  try {
    // Example implementation - you might want to create an enhancement_usage table
    // await prisma.enhancementUsage.create({
    //   data: {
    //     artistId,
    //     language,
    //     targetAudience,
    //     createdAt: new Date()
    //   }
    // })
    
    console.log(`Enhancement used by artist ${artistId}: ${language}, ${targetAudience}`)
  } catch (error) {
    console.error('Failed to track enhancement usage:', error)
    // Don't fail the request if tracking fails
  }
}

// GET endpoint to check enhancement limits and usage
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const fullArtist = await prisma.artist.findUnique({
      where: { id: user.artist?.id },
      include: {
        user: true
      }
    })

    if (!fullArtist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const limit = getEnhancementLimit(fullArtist.verificationLevel, fullArtist.user.emailVerified)
    const used = await getMonthlyEnhancementCount(fullArtist.id)

    return NextResponse.json({
      limits: {
        monthly: limit,
        used,
        remaining: limit - used
      },
      verificationLevel: fullArtist.verificationLevel,
      canEnhance: used < limit
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to get enhancement limits')
  }
}