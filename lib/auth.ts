import { auth } from "@clerk/nextjs/server"
import { PrismaClient, UserRole } from "@prisma/client"

const prisma = new PrismaClient()

// Export types for use in other files
export type ExtendedUser = {
  id: string
  email?: string
  role: UserRole
  artist?: {
    id: string
    stageName: string
    verificationLevel: string
  }
  customer?: {
    id: string
    firstName?: string
    lastName?: string
  }
  corporate?: {
    id: string
    companyName: string
    contactPerson: string
  }
}

/**
 * Get the current session (alias for auth())
 */
export async function getSession() {
  return await auth()
}

/**
 * Get the current user from Clerk auth and fetch user data from Prisma
 */
export async function getCurrentUser(): Promise<ExtendedUser | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        artist: true,
        customer: true,
        corporate: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      artist: user.artist ? {
        id: user.artist.id,
        stageName: user.artist.stageName,
        verificationLevel: user.artist.verificationLevel.toString(),
      } : undefined,
      customer: user.customer ? {
        id: user.customer.id,
        firstName: user.customer.firstName,
        lastName: user.customer.lastName,
      } : undefined,
      corporate: user.corporate ? {
        id: user.corporate.id,
        companyName: user.corporate.companyName,
        contactPerson: user.corporate.contactPerson,
      } : undefined,
    }
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser()
  return user ? roles.includes(user.role) : false
}

/**
 * Get the current user's artist profile (if they're an artist)
 */
export async function getCurrentArtist() {
  const user = await getCurrentUser()
  if (user?.role === "ARTIST") {
    return user.artist
  }
  return null
}

/**
 * Get the current user's customer profile (if they're a customer)
 */
export async function getCurrentCustomer() {
  const user = await getCurrentUser()
  if (user?.role === "CUSTOMER") {
    return user.customer
  }
  return null
}

/**
 * Get the current user's corporate profile (if they're corporate)
 */
export async function getCurrentCorporate() {
  const user = await getCurrentUser()
  if (user?.role === "CORPORATE") {
    return user.corporate
  }
  return null
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("ADMIN")
}

/**
 * Check if a session is valid and authenticated
 * Works with both Clerk and NextAuth session objects for compatibility
 */
export function isValidSession(session: any): boolean {
  // For Clerk sessions
  if (session && session.userId) {
    return true
  }
  // For NextAuth sessions (backward compatibility)
  if (session && session.user && session.user.id && session.user.email && session.user.role) {
    return true
  }
  return false
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth()
  return !!userId
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

/**
 * Require specific role - throws if user doesn't have the role
 */
export async function requireRole(role: UserRole) {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error(`Role ${role} required`)
  }
  return user
}

/**
 * Require any of the specified roles - throws if user doesn't have any of them
 */
export async function requireAnyRole(roles: UserRole[]) {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error(`One of roles ${roles.join(", ")} required`)
  }
  return user
}

// For backward compatibility - these exports are no longer needed but kept for compatibility
export const signIn = () => { throw new Error("Use Clerk's SignIn component instead") }
export const signOut = () => { throw new Error("Use Clerk's SignOut component instead") }
export const handlers = { GET: () => {}, POST: () => {} } // Placeholder for NextAuth handlers