import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schema for user updates
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(['ARTIST', 'CUSTOMER', 'CORPORATE', 'ADMIN']).optional(),
  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional()
})

// GET - Get specific user details (Admin only)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: userId } = await context.params
    
    // Only admins can access user details
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get user with all related data
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        artist: {
          include: {
            _count: {
              select: {
                bookings: true,
                reviews: true
              }
            }
          }
        },
        customer: {
          include: {
            _count: {
              select: {
                bookings: true,
                reviews: true
              }
            }
          }
        },
        corporate: {
          include: {
            _count: {
              select: {
                bookings: true
              }
            }
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get recent activity
    const recentBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { customerId: userId },
          { artist: { userId: userId } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        eventDate: true,
        createdAt: true,
        artist: {
          select: {
            stageName: true
          }
        },
        customer: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Get notifications count
    const unreadNotifications = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false
      }
    })

    // Format response
    const { password, ...userWithoutPassword } = targetUser

    return NextResponse.json({
      user: {
        ...userWithoutPassword,
        artist: targetUser.artist ? {
          ...targetUser.artist,
          averageRating: targetUser.artist.averageRating || 0,
          bookingsCount: targetUser.artist._count.bookings,
          reviewsCount: targetUser.artist._count.reviews
        } : null,
        customer: targetUser.customer ? {
          ...targetUser.customer,
          firstName: targetUser.customer.firstName,
          lastName: targetUser.customer.lastName,
          bookingsCount: targetUser.customer._count.bookings,
          reviewsCount: targetUser.customer._count.reviews
        } : null,
        corporate: targetUser.corporate ? {
          ...targetUser.corporate,
          bookingsCount: targetUser.corporate._count.bookings
        } : null
      },
      recentActivity: {
        recentBookings,
        unreadNotifications
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch user details')
  }
}

// PATCH - Update user (Admin only)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: userId } = await context.params
    
    // Only admins can update users
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = updateUserSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const updateData = validationResult.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        artist: true,
        customer: true,
        corporate: true
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent self-role changes for safety
    if (updateData.role && user.id === userId && updateData.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot change your own admin role' },
        { status: 400 }
      )
    }

    // Check if email is already taken
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email }
      })
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }
    }

    // Handle role changes
    if (updateData.role && updateData.role !== existingUser.role) {
      // Delete old role-specific data
      if (existingUser.artist) {
        await prisma.artist.delete({ where: { userId: userId } })
      }
      if (existingUser.customer) {
        await prisma.customer.delete({ where: { userId: userId } })
      }
      if (existingUser.corporate) {
        await prisma.corporate.delete({ where: { userId: userId } })
      }

      // Create new role-specific data
      if (updateData.role === 'ARTIST') {
        await prisma.artist.create({
          data: {
            userId: userId,
            stageName: `${updateData.name || existingUser.name}`,
            category: 'DJ',
            verificationLevel: 'UNVERIFIED'
          }
        })
      } else if (updateData.role === 'CUSTOMER') {
        await prisma.customer.create({
          data: {
            userId: userId
          }
        })
      } else if (updateData.role === 'CORPORATE') {
        await prisma.corporate.create({
          data: {
            userId: userId,
            companyName: `${updateData.name || existingUser.name} Company`,
            contactPerson: updateData.name || existingUser.name || 'Contact Person'
          }
        })
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        artist: true,
        customer: true,
        corporate: true
      }
    })

    // Create admin log entry
    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'admin_action',
        title: 'Account Updated by Admin',
        titleTh: 'บัญชีถูกอัพเดทโดยผู้ดูแลระบบ',
        content: `Your account has been updated by an administrator.`,
        contentTh: `บัญชีของคุณได้รับการอัพเดทโดยผู้ดูแลระบบ`,
        relatedId: userId,
        relatedType: 'user'
      }
    })

    // Return updated user without password
    const { password, ...userResponse } = updatedUser

    return NextResponse.json({
      user: userResponse,
      message: 'User updated successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to update user')
  }
}

// DELETE - Deactivate user (Admin only) - We don't actually delete for data integrity
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: userId } = await context.params
    
    // Only admins can deactivate users
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Prevent self-deletion
    if (user.id === userId) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Deactivate user instead of deleting
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false
      }
    })

    // Cancel any pending bookings
    await prisma.booking.updateMany({
      where: {
        OR: [
          { customerId: userId },
          { artist: { userId: userId } }
        ],
        status: { in: ['INQUIRY', 'QUOTED', 'CONFIRMED'] }
      },
      data: {
        status: 'CANCELLED'
      }
    })

    // Notify user
    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'account_deactivated',
        title: 'Account Deactivated',
        titleTh: 'บัญชีถูกปิดใช้งาน',
        content: 'Your account has been deactivated by an administrator. Contact support for assistance.',
        contentTh: 'บัญชีของคุณถูกปิดใช้งานโดยผู้ดูแลระบบ กรุณาติดต่อฝ่ายสนับสนุนสำหรับความช่วยเหลือ',
        relatedId: userId,
        relatedType: 'user'
      }
    })

    return NextResponse.json({
      message: 'User deactivated successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to deactivate user')
  }
}