import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const uploadSchema = z.object({
  artistId: z.string(),
  type: z.enum(['profile', 'cover']),
  image: z.string(), // Base64 encoded image
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ARTIST') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = uploadSchema.parse(body)

    // Verify the artist belongs to the current user
    const artist = await prisma.artist.findUnique({
      where: { 
        id: validatedData.artistId,
        userId: session.user.id 
      }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found or unauthorized' },
        { status: 404 }
      )
    }

    // For now, store the base64 image directly
    // In production, this would upload to Cloudinary and return a URL
    const updateData = validatedData.type === 'profile' 
      ? { profileImage: validatedData.image }
      : { coverImage: validatedData.image }

    const updatedArtist = await prisma.artist.update({
      where: { id: validatedData.artistId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: `${validatedData.type} image updated successfully`,
      imageUrl: validatedData.type === 'profile' 
        ? updatedArtist.profileImage 
        : updatedArtist.coverImage
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
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}