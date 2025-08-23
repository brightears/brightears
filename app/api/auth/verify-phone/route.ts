import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const verifySchema = z.object({
  phoneNumber: z.string(),
  otp: z.string().length(6),
})

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '66' + cleaned.substring(1)
  } else if (!cleaned.startsWith('66')) {
    cleaned = '66' + cleaned
  }
  return '+' + cleaned
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, otp } = verifySchema.parse(body)
    const formattedPhone = formatPhoneNumber(phoneNumber)
    
    // Find user with this phone number
    const user = await prisma.user.findFirst({
      where: { phone: formattedPhone }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      )
    }
    
    // Check if OTP is valid and not expired
    if (!user.verificationCode || !user.verificationExpiry) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      )
    }
    
    if (user.verificationCode !== otp) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }
    
    if (new Date() > user.verificationExpiry) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      )
    }
    
    // Mark phone as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isPhoneVerified: true,
        verificationCode: null,
        verificationExpiry: null,
      }
    })
    
    // Create a session token (simplified - in production use proper JWT)
    const sessionToken = Buffer.from(JSON.stringify({
      userId: user.id,
      phone: formattedPhone,
      verified: true,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    })).toString('base64')
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        phone: user.phone,
        isPhoneVerified: true,
      },
      sessionToken
    })
    
  } catch (error) {
    console.error('Phone verification error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}

// Resend OTP endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber } = z.object({
      phoneNumber: z.string()
    }).parse(body)
    
    const formattedPhone = formatPhoneNumber(phoneNumber)
    
    const user = await prisma.user.findFirst({
      where: { phone: formattedPhone }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      )
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: otp,
        verificationExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      }
    })
    
    // TODO: Send SMS with new OTP
    console.log(`[SMS] Resending OTP ${otp} to ${formattedPhone}`)
    
    return NextResponse.json({
      success: true,
      message: 'New verification code sent'
    })
    
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to resend code. Please try again.' },
      { status: 500 }
    )
  }
}