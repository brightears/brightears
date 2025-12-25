import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'

const deleteSchema = z.object({
  publicId: z.string(),
  type: z.enum(['profile', 'cover', 'gallery', 'audio']),
  artistId: z.string().uuid(),
  url: z.string().url()
})

export async function DELETE(request: NextRequest) {
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

    const body = await request.json()
    
    // Validate parameters
    const validation = deleteSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { publicId, type, artistId, url } = validation.data

    // Check if user has permission to delete for this artist
    if (user.role === 'ARTIST') {
      if (!user.artist || user.artist.id !== artistId) {
        return NextResponse.json(
          { error: 'You can only delete files from your own artist profile' },
          { status: 403 }
        )
      }
    } else if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only artists can delete files' },
        { status: 403 }
      )
    }

    // Get current artist data
    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    })

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Delete from Cloudinary
    const resourceType = type === 'audio' ? 'video' : 'image'
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })

    // Update artist record based on type
    const updateData: any = {}
    
    switch (type) {
      case 'profile':
        updateData.profileImage = null
        break
      case 'cover':
        updateData.coverImage = null
        break
      case 'gallery':
        // Remove from images array
        const currentImages = artist.images || []
        updateData.images = currentImages.filter(image => image !== url)
        break
      case 'audio':
        // Remove from audioSamples array
        const currentAudio = artist.audioSamples || []
        updateData.audioSamples = currentAudio.filter(audio => audio !== url)
        break
    }

    // Update artist in database
    await prisma.artist.update({
      where: { id: artistId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}