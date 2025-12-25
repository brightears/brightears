import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'brightears-temp-secret-2024'

export interface ArtistUser {
  id: string
  email: string
  role: string
  artistId: string
  stageName: string
  artist?: {
    id: string
    stageName: string
    profileImage: string | null
  }
}

export async function getCurrentArtist(): Promise<ArtistUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('artist-token')
    
    if (!token?.value) {
      return null
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token.value, JWT_SECRET) as any
    
    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            profileImage: true,
            category: true,
            baseCity: true,
          }
        }
      }
    })
    
    if (!user || !user.artist) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      artistId: user.artist.id,
      stageName: user.artist.stageName,
      artist: user.artist,
    }
    
  } catch (error) {
    console.error('Artist auth error:', error)
    return null
  }
}

export async function requireArtist() {
  const artist = await getCurrentArtist()
  if (!artist) {
    throw new Error('Unauthorized - Artist login required')
  }
  return artist
}