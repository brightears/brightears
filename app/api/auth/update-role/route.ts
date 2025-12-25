import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { setUserRole, UserRole } from '@/lib/user-registration'
import { z } from 'zod'

const updateRoleSchema = z.object({
  role: z.enum(['ARTIST', 'CUSTOMER', 'CORPORATE', 'ADMIN'])
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateRoleSchema.parse(body)

    // Update role in Clerk
    await setUserRole(userId, validatedData.role as UserRole)

    // The webhook will handle database sync when Clerk sends user.updated event

    return NextResponse.json({ 
      success: true, 
      message: `Role updated to ${validatedData.role}`,
      role: validatedData.role
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid role', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}