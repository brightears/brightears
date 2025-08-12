import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

const customerRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'CORPORATE']),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  preferredLanguage: z.string().optional(),
  location: z.string().optional(),
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  position: z.string().optional(),
  venueType: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const validatedData = customerRegistrationSchema.parse(body)
    
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

    // Validate required fields based on role
    if (validatedData.role === 'CORPORATE') {
      if (!validatedData.companyName || !validatedData.contactPerson) {
        return NextResponse.json(
          { error: 'Company name and contact person are required for corporate registration' },
          { status: 400 }
        )
      }
    }
    
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)
    
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          phone: validatedData.phone,
          role: validatedData.role,
        }
      })
      
      let profile = null
      
      if (validatedData.role === 'CUSTOMER') {
        profile = await tx.customer.create({
          data: {
            userId: user.id,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            preferredLanguage: validatedData.preferredLanguage || 'en',
            location: validatedData.location,
          }
        })
      } else if (validatedData.role === 'CORPORATE') {
        profile = await tx.corporate.create({
          data: {
            userId: user.id,
            companyName: validatedData.companyName!,
            contactPerson: validatedData.contactPerson!,
            position: validatedData.position,
            venueType: validatedData.venueType,
            companyAddress: validatedData.companyAddress,
            companyPhone: validatedData.companyPhone || validatedData.phone,
          }
        })
      }
      
      return { user, profile }
    })
    
    const { password, ...userWithoutPassword } = result.user
    
    return NextResponse.json({
      user: userWithoutPassword,
      profile: result.profile
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
      { error: 'Failed to register user' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}