import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { requireAuth, requireRole, requireAnyRole, getCurrentUser } from '@/lib/auth'

/**
 * API authentication middleware
 * Returns 401 if not authenticated
 */
export async function withAuth<T>(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<T>
): Promise<T | NextResponse> {
  try {
    const user = await requireAuth()
    return await handler(req, user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
}

/**
 * API role-based authorization middleware
 * Returns 403 if user doesn't have required role
 */
export async function withRole<T>(
  req: NextRequest,
  role: UserRole,
  handler: (req: NextRequest, user: any) => Promise<T>
): Promise<T | NextResponse> {
  try {
    const user = await requireRole(role)
    return await handler(req, user)
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }
}

/**
 * API multiple roles authorization middleware
 * Returns 403 if user doesn't have any of the required roles
 */
export async function withAnyRole<T>(
  req: NextRequest,
  roles: UserRole[],
  handler: (req: NextRequest, user: any) => Promise<T>
): Promise<T | NextResponse> {
  try {
    const user = await requireAnyRole(roles)
    return await handler(req, user)
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }
}

/**
 * Check if user owns the artist profile
 */
export async function requireArtistOwnership(artistId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  if (user.role === 'ADMIN') {
    return user // Admins can edit any artist
  }
  
  if (user.role !== 'ARTIST') {
    throw new Error('Must be an artist to edit artist profiles')
  }
  
  if (user.artist?.id !== artistId) {
    throw new Error('Can only edit your own artist profile')
  }
  
  return user
}

/**
 * Input sanitization for text fields
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 10000) // Limit length
}

/**
 * Safe error response that doesn't leak sensitive information
 */
export function safeErrorResponse(error: unknown, fallbackMessage = 'An error occurred') {
  console.error('API Error:', error)
  
  // In development, show more details
  if (process.env.NODE_ENV === 'development' && error instanceof Error) {
    return NextResponse.json(
      { error: error.message, details: error.stack },
      { status: 500 }
    )
  }
  
  // In production, return generic message
  return NextResponse.json(
    { error: fallbackMessage },
    { status: 500 }
  )
}