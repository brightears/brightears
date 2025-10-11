import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'

const verificationUploadSchema = z.object({
  artistId: z.string().uuid(),
  documentType: z.enum(['national_id', 'passport', 'driver_license'])
})

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * POST /api/artist/verification/upload
 *
 * Upload ID verification documents for artist verification
 *
 * Required fields:
 * - file: File (JPG, PNG, WebP, PDF - max 10MB)
 * - artistId: string (UUID)
 * - documentType: 'national_id' | 'passport' | 'driver_license'
 *
 * Authentication: Required (must be logged-in artist)
 * Authorization: Can only upload own verification documents
 *
 * Updates Artist record:
 * - verificationDocumentUrl: Cloudinary URL
 * - verificationDocumentType: Document type
 * - verificationSubmittedAt: Current timestamp
 * - verificationLevel: UNVERIFIED → PENDING
 *
 * @returns {object} Success response with document URL
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Ensure user is an artist
    if (user.role !== 'ARTIST') {
      return NextResponse.json(
        { error: 'Only artists can upload verification documents' },
        { status: 403 }
      )
    }

    // Apply rate limiting (prevent spam uploads)
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.profile, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const artistIdParam = formData.get('artistId') as string
    const documentTypeParam = formData.get('documentType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate parameters
    const validation = verificationUploadSchema.safeParse({
      artistId: artistIdParam,
      documentType: documentTypeParam
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { artistId, documentType } = validation.data

    // Verify artist exists and user has permission
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: { user: true }
    })

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Authorization check: User can only upload their own verification documents
    if (artist.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only upload verification documents for your own profile' },
        { status: 403 }
      )
    }

    // Additional check: Prevent re-upload if already verified or pending
    if (artist.verificationLevel === 'VERIFIED' || artist.verificationLevel === 'TRUSTED') {
      return NextResponse.json(
        {
          error: 'Your profile is already verified',
          message: 'Contact support if you need to update your verification documents'
        },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed formats: JPG, PNG, WebP, PDF` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: 10MB` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate public ID with artist reference and document type
    const timestamp = Date.now()
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9]/g, '_')
    const publicId = `brightears/verification/${artistId}/${documentType}_${timestamp}_${cleanFilename}`

    // Determine resource type (image or raw for PDF)
    const resourceType = file.type === 'application/pdf' ? 'raw' : 'image'

    // Upload to Cloudinary with security settings
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        public_id: publicId,
        resource_type: resourceType,
        folder: `brightears/verification/${artistId}`,
        use_filename: true,
        unique_filename: false,
        // Security: Mark as private (requires signed URLs to access)
        type: 'private',
        access_mode: 'authenticated'
      }

      // Add transformations for images (optimization)
      if (resourceType === 'image') {
        uploadOptions.transformation = {
          quality: 'auto',
          fetch_format: 'auto'
        }
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const result = uploadResult as any

    // Update artist record with verification document
    const updatedArtist = await prisma.artist.update({
      where: { id: artistId },
      data: {
        verificationDocumentUrl: result.secure_url,
        verificationDocumentType: documentType,
        verificationSubmittedAt: new Date(),
        // Change verification level from UNVERIFIED to PENDING (awaiting admin review)
        verificationLevel: artist.verificationLevel === 'UNVERIFIED' ? 'PENDING' : artist.verificationLevel,
        // Update last profile update timestamp
        lastProfileUpdate: new Date()
      }
    })

    // TODO: Send notification to admin about new verification submission
    // This can be implemented later with email/Line notification system

    // TODO: Log verification document upload event for audit trail
    // This can be implemented with an AuditLog model

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      documentType,
      verificationLevel: updatedArtist.verificationLevel,
      message: 'Verification document uploaded successfully. Our team will review it within 24-48 hours.',
      nextSteps: [
        'Complete remaining onboarding steps',
        'Pay verification fee (฿1,500)',
        'Wait for admin approval (24-48 hours)',
        'Receive verification badge on approval'
      ]
    })

  } catch (error) {
    console.error('Verification document upload error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to upload verification document. Please try again.'
      },
      { status: 500 }
    )
  }
}
