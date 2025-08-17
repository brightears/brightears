import { NextRequest, NextResponse } from 'next/server'
import { cloudinary, UPLOAD_CONFIGS, isValidFileType, isValidFileSize, generatePublicId } from '@/lib/cloudinary'
import { getCurrentUser, requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'

const uploadSchema = z.object({
  type: z.enum(['profile', 'cover', 'gallery', 'audio']),
  artistId: z.string().uuid()
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.general, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const typeParam = formData.get('type') as string
    const artistIdParam = formData.get('artistId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate parameters
    const validation = uploadSchema.safeParse({ 
      type: typeParam, 
      artistId: artistIdParam 
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { type, artistId } = validation.data

    // Check if user has permission to upload for this artist
    if (user.role === 'ARTIST') {
      if (!user.artist || user.artist.id !== artistId) {
        return NextResponse.json(
          { error: 'You can only upload files for your own artist profile' },
          { status: 403 }
        )
      }
    } else if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only artists can upload files' },
        { status: 403 }
      )
    }

    // Verify artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    })

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Get upload configuration based on type
    let config
    switch (type) {
      case 'profile':
        config = UPLOAD_CONFIGS.profileImages
        break
      case 'cover':
        config = UPLOAD_CONFIGS.coverImages
        break
      case 'gallery':
        config = UPLOAD_CONFIGS.images
        break
      case 'audio':
        config = UPLOAD_CONFIGS.audio
        break
      default:
        return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    // Validate file type
    if (!isValidFileType(file, config.allowedFormats)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed formats: ${config.allowedFormats.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (!isValidFileSize(file, config.maxFileSize)) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${Math.round(config.maxFileSize / 1024 / 1024)}MB` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate public ID
    const publicId = generatePublicId(type, artistId, file.name)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        public_id: publicId,
        resource_type: type === 'audio' ? 'video' : 'image',
        folder: `brightears/artists/${artistId}/${type}`,
        use_filename: true,
        unique_filename: false,
      }

      // Add transformations for images
      if (type !== 'audio' && 'transformation' in config) {
        uploadOptions.transformation = config.transformation
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

    // Update artist record based on upload type
    const updateData: any = {}
    
    switch (type) {
      case 'profile':
        updateData.profileImage = result.secure_url
        break
      case 'cover':
        updateData.coverImage = result.secure_url
        break
      case 'gallery':
        // Add to images array
        const currentImages = artist.images || []
        updateData.images = [...currentImages, result.secure_url]
        break
      case 'audio':
        // Add to audioSamples array
        const currentAudio = artist.audioSamples || []
        updateData.audioSamples = [...currentAudio, result.secure_url]
        break
    }

    // Update artist in database
    const updatedArtist = await prisma.artist.update({
      where: { id: artistId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      type,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}