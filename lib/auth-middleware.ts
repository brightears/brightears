import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '@prisma/client'

/**
 * Check if user has required role
 */
export async function checkUserRole(
  req: NextRequest,
  allowedRoles: UserRole[]
): Promise<boolean> {
  const token = await getToken({ req })
  
  if (!token || !token.role) {
    return false
  }
  
  return allowedRoles.includes(token.role as UserRole)
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
    const token = await getToken({ req })
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return handler(req)
  }
}

/**
 * Get user ID from token in API routes
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const token = await getToken({ req })
  return token?.userId as string || null
}

/**
 * Get user role from token in API routes
 */
export async function getUserRoleFromRequest(req: NextRequest): Promise<UserRole | null> {
  const token = await getToken({ req })
  return token?.role as UserRole || null
}