import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (for production, use Redis)
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Rate limit configurations
export const RATE_LIMITS = {
  // General API requests
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100 // 100 requests per 15 minutes
  },
  // Authentication attempts
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes  
    maxRequests: 5 // 5 login attempts per 15 minutes
  },
  // Booking creation (more restrictive)
  booking: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10 // 10 booking attempts per hour
  },
  // Artist profile updates
  profile: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10 // 10 profile updates per 5 minutes
  }
}

/**
 * Get client identifier (IP address or user ID if authenticated)
 */
function getClientId(req: NextRequest): string {
  // Try to get IP from headers (for deployment behind proxies)
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || req.ip || 'unknown'
  
  return ip
}

/**
 * Rate limiting middleware
 */
export async function rateLimit(
  req: NextRequest,
  config: { windowMs: number; maxRequests: number },
  identifier?: string
): Promise<{ success: boolean; response?: NextResponse }> {
  const clientId = identifier || getClientId(req)
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  // Clean up old entries
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
  
  // Get current entry or create new one
  let entry = rateLimitStore.get(clientId)
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetTime: now + config.windowMs
    }
    rateLimitStore.set(clientId, entry)
    return { success: true }
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000)
    
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${resetInSeconds} seconds.`,
          retryAfter: resetInSeconds
        },
        { 
          status: 429,
          headers: {
            'Retry-After': resetInSeconds.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString()
          }
        }
      )
    }
  }
  
  // Increment counter
  entry.count++
  rateLimitStore.set(clientId, entry)
  
  return { success: true }
}

/**
 * Rate limiting decorator for API routes
 */
export function withRateLimit<T>(
  config: { windowMs: number; maxRequests: number },
  handler: (req: NextRequest, ...args: any[]) => Promise<T>
) {
  return async (req: NextRequest, ...args: any[]): Promise<T | NextResponse> => {
    const rateLimitResult = await rateLimit(req, config)
    
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }
    
    return handler(req, ...args)
  }
}

/**
 * User-specific rate limiting (for authenticated requests)
 */
export async function rateLimitByUser(
  req: NextRequest,
  userId: string,
  config: { windowMs: number; maxRequests: number }
): Promise<{ success: boolean; response?: NextResponse }> {
  return rateLimit(req, config, `user:${userId}`)
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupRateLimit() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}

// Clean up every 5 minutes
if (typeof global !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000)
}