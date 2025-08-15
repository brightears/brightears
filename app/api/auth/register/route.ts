import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schemas
const customerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  preferredLanguage: z.enum(['en', 'th']).default('en'),
  location: z.string().optional(),
})

const corporateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  position: z.string().optional(),
  venueType: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { role } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    if (role === 'CUSTOMER') {
      const validatedData = customerSchema.parse(body)
      
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          phone: validatedData.phone,
          role: 'CUSTOMER',
          name: validatedData.firstName && validatedData.lastName 
            ? `${validatedData.firstName} ${validatedData.lastName}` 
            : validatedData.firstName || validatedData.lastName || null,
          customer: {
            create: {
              firstName: validatedData.firstName,
              lastName: validatedData.lastName,
              preferredLanguage: validatedData.preferredLanguage,
              location: validatedData.location,
            }
          }
        },
        include: {
          customer: true
        }
      })

      return NextResponse.json({
        message: 'Customer account created successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          customer: user.customer
        }
      })
    } else if (role === 'CORPORATE') {
      const validatedData = corporateSchema.parse(body)
      
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          phone: validatedData.phone,
          role: 'CORPORATE',
          name: validatedData.contactPerson,
          corporate: {
            create: {
              companyName: validatedData.companyName,
              contactPerson: validatedData.contactPerson,
              position: validatedData.position,
              venueType: validatedData.venueType,
              companyAddress: validatedData.companyAddress,
              companyPhone: validatedData.companyPhone,
            }
          }
        },
        include: {
          corporate: true
        }
      })

      return NextResponse.json({
        message: 'Corporate account created successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          corporate: user.corporate
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid user role' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}