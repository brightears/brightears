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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const validatedData = artistRegistrationSchema.parse(body)
    
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
    
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)
    
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          phone: validatedData.phone,
          role: 'ARTIST',
        }
      })
      
      const artist = await tx.artist.create({
        data: {
          userId: user.id,
          stageName: validatedData.stageName,
          realName: validatedData.realName,
          bio: validatedData.bio,
          bioTh: validatedData.bioTh,
          category: validatedData.category,
          subCategories: validatedData.subCategories || [],
          baseCity: validatedData.baseCity,
          serviceAreas: validatedData.serviceAreas || [validatedData.baseCity],
          travelRadius: validatedData.travelRadius,
          hourlyRate: validatedData.hourlyRate,
          minimumHours: validatedData.minimumHours || 2,
          languages: validatedData.languages || ['en', 'th'],
          genres: validatedData.genres || [],
          lineId: validatedData.lineId,
          facebook: validatedData.facebook,
          instagram: validatedData.instagram,
          website: validatedData.website,
        }
      })
      
      return { user, artist }
    })
    
    // Track artist registration activity
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
    
    const { password, ...userWithoutPassword } = result.user
    
    return NextResponse.json({
      user: userWithoutPassword,
      artist: result.artist
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register artist' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}