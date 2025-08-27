import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const uploadSchema = z.object({
  type: z.enum(['profile', 'cover', 'gallery', 'audio']),
  files: z.array(z.object({
    name: z.string(),
    data: z.string(), // Base64 encoded data
    type: z.string()  // MIME type
  }))
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user and verify they're an artist
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { artist: true }
    });

    if (!user || user.role !== 'ARTIST' || !user.artist) {
      return NextResponse.json(
        { error: 'Artist profile not found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validatedData = uploadSchema.parse(body)

    const uploadedFiles: string[] = []
    
    // Process each file
    for (const file of validatedData.files) {
      // In production, upload to Cloudinary or similar service
      // For now, we'll simulate with a data URL
      const dataUrl = `data:${file.type};base64,${file.data}`
      uploadedFiles.push(dataUrl)
    }

    // Update artist profile based on upload type
    let updateData: any = {}
    
    switch (validatedData.type) {
      case 'profile':
        updateData.profileImage = uploadedFiles[0]
        break
      case 'cover':
        updateData.coverImage = uploadedFiles[0]
        break
      case 'gallery':
        // Add to existing images array
        const currentImages = user.artist.images || []
        updateData.images = [...currentImages, ...uploadedFiles]
        break
      case 'audio':
        // Add to existing audio samples array
        const currentAudio = user.artist.audioSamples || []
        updateData.audioSamples = [...currentAudio, ...uploadedFiles]
        break
    }

    const updatedArtist = await prisma.artist.update({
      where: { id: user.artist.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: `${validatedData.type} files uploaded successfully`,
      uploadedFiles,
      artist: updatedArtist
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

// DELETE endpoint for removing media
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { artist: true }
    });

    if (!user || user.role !== 'ARTIST' || !user.artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') as 'profile' | 'cover' | 'gallery' | 'audio'
    const fileUrl = searchParams.get('file')

    if (!type || !fileUrl) {
      return NextResponse.json({ error: 'Type and file URL required' }, { status: 400 })
    }

    let updateData: any = {}

    switch (type) {
      case 'profile':
        updateData.profileImage = null
        break
      case 'cover':
        updateData.coverImage = null
        break
      case 'gallery':
        const currentImages = user.artist.images || []
        updateData.images = currentImages.filter(img => img !== fileUrl)
        break
      case 'audio':
        const currentAudio = user.artist.audioSamples || []
        updateData.audioSamples = currentAudio.filter(audio => audio !== fileUrl)
        break
    }

    const updatedArtist = await prisma.artist.update({
      where: { id: user.artist.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'File removed successfully',
      artist: updatedArtist
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}