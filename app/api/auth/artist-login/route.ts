import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Simple JWT secret (in production, use proper secret)
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'brightears-temp-secret-2024'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    
    // Find user with artist profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            verificationLevel: true,
            profileImage: true,
          }
        }
      }
    })
    
    if (!user || !user.artist) {
      return NextResponse.json(
        { error: 'Invalid credentials or not an artist account' },
        { status: 401 }
      )
    }
    
    // Check password
    if (!user.password) {
      return NextResponse.json(
        { error: 'Please use social login or reset your password' },
        { status: 401 }
      )
    }
    
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        artistId: user.artist.id,
        stageName: user.artist.stageName,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        artist: user.artist,
      }
    })
    
    // Set HTTP-only cookie
    response.cookies.set('artist-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    return response
    
  } catch (error: any) {
    console.error('Artist login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('artist-token')
  return response
}