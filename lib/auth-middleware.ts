import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { UserRole } from '@prisma/client'

/**
 * Check if user has required role
 */
export async function checkUserRole(
  req: NextRequest,
  allowedRoles: UserRole[]
): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    
    if (!user || !user.role) {
      return false
    }
    
    return allowedRoles.includes(user.role)
  } catch (error) {
    console.error('Error checking user role:', error)
    return false
  }
}

/**
 * Middleware to protect API routes with role-based access
 */
export function withRoleAuth(allowedRoles: UserRole[]) {
  return async function middleware(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ) {
    const hasAccess = await checkUserRole(req, allowedRoles)
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }
    
    return handler(req)
  }
}

/**
 * Middleware to protect API routes (require any authenticated user)
 */
export function withAuth() {
  return async function middleware(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ) {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      return handler(req)
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }
}

/**
 * Get user ID from session in API routes
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const user = await getCurrentUser()
    return user?.id || null
  } catch (error) {
    return null
  }
}

/**
 * Get user role from session in API routes
 */
export async function getUserRoleFromRequest(req: NextRequest): Promise<UserRole | null> {
  try {
    const user = await getCurrentUser()
    return user?.role || null
  } catch (error) {
    return null
  }
}