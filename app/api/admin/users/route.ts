import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schema for user search/filter
const userSearchSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['ARTIST', 'CUSTOMER', 'CORPORATE', 'ADMIN']).optional(),
  sortBy: z.enum(['createdAt', 'lastLogin', 'email', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
})

// Validation schema for user updates
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(['ARTIST', 'CUSTOMER', 'CORPORATE', 'ADMIN']).optional(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional()
})

// GET - Get all users with filtering and pagination (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only admins can access user management
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Validate query parameters
    const validationResult = userSearchSchema.safeParse(queryParams)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { search, role, sortBy, sortOrder, page, limit } = validationResult.data
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role) {
      where.role = role
    }

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where })

    // Get users with related data
    const users = await prisma.user.findMany({
      where,
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            completedBookings: true,
            averageRating: true
          }
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        corporate: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset
    })

    // Format user data for admin view
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: !!user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      profileImage: user.image,
      // Role-specific data
      artist: user.artist ? {
        stageName: user.artist.stageName,
        completedBookings: user.artist.completedBookings,
        averageRating: user.artist.averageRating || 0
      } : null,
      customer: user.customer ? {
        firstName: user.customer.firstName,
        lastName: user.customer.lastName
      } : null,
      corporate: user.corporate ? {
        companyName: user.corporate.companyName,
        contactPerson: user.corporate.contactPerson
      } : null
    }))

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: offset + limit < totalUsers,
        hasPreviousPage: page > 1
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch users')
  }
}

// POST - Create new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only admins can create users
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Basic user creation schema
    const createUserSchema = z.object({
      email: z.string().email(),
      name: z.string().min(1).max(100),
      role: z.enum(['ARTIST', 'CUSTOMER', 'CORPORATE', 'ADMIN']),
      password: z.string().min(8),
      isEmailVerified: z.boolean().default(false)
    })

    const validationResult = createUserSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid user data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { email, name, role, password, isEmailVerified } = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        password: hashedPassword,
        emailVerified: isEmailVerified ? new Date() : null,
        isActive: true
      }
    })

    // Create role-specific profile
    if (role === 'ARTIST') {
      await prisma.artist.create({
        data: {
          userId: newUser.id,
          stageName: name,
          category: 'DJ',
          baseCity: 'Bangkok',
          serviceAreas: ['Bangkok'],
          genres: []
        }
      })
    } else if (role === 'CUSTOMER') {
      await prisma.customer.create({
        data: {
          userId: newUser.id
        }
      })
    } else if (role === 'CORPORATE') {
      await prisma.corporate.create({
        data: {
          userId: newUser.id,
          companyName: `${name} Company`,
          contactPerson: name
        }
      })
    }

    // Return user without password
    const { password: _, ...userResponse } = newUser

    return NextResponse.json({
      user: userResponse,
      message: 'User created successfully'
    }, { status: 201 })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to create user')
  }
}