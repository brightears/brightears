import { NextRequest, NextResponse } from 'next/server'
import { auth, isValidSession } from '@/lib/auth'
import { UserRole } from '@prisma/client'

/**
 * Check if user has required role
 */
export async function checkUserRole(
  req: NextRequest,
  allowedRoles: UserRole[]
): Promise<boolean> {
  const session = await auth()
  
  if (!isValidSession(session)) {
    return false
  }
  
  return allowedRoles.includes(session.user.role)
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
    const session = await auth()
    
    if (!isValidSession(session)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return handler(req)
  }
}

/**
 * Get user ID from session in API routes
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const session = await auth()
  return isValidSession(session) ? session.user.id : null
}

/**
 * Get user role from session in API routes
 */
export async function getUserRoleFromRequest(req: NextRequest): Promise<UserRole | null> {
  const session = await auth()
  return isValidSession(session) ? session.user.role : null
}