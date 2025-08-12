import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Session, User } from "next-auth"
import type { UserRole } from "@prisma/client"

export interface ExtendedUser extends User {
  id: string
  role: UserRole
  artist?: {
    id: string
    stageName: string
    verificationLevel: string
    // Add other artist properties as needed
  }
  customer?: {
    id: string
    firstName?: string
    lastName?: string
    // Add other customer properties as needed
  }
  corporate?: {
    id: string
    companyName: string
    contactPerson: string
    // Add other corporate properties as needed
  }
}

export interface ExtendedSession extends Session {
  user: ExtendedUser
}

/**
 * Get the current session on the server side
 */
export async function getSession(): Promise<ExtendedSession | null> {
  return (await getServerSession(authOptions)) as ExtendedSession | null
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser(): Promise<ExtendedUser | null> {
  const session = await getSession()
  return session?.user || null
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
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return !!session
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<ExtendedUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

/**
 * Require specific role - throws if user doesn't have the role
 */
export async function requireRole(role: UserRole): Promise<ExtendedUser> {
  const user = await requireAuth()
  if (user.role !== role) {
    throw new Error(`Role ${role} required`)
  }
  return user
}

/**
 * Require any of the specified roles - throws if user doesn't have any of them
 */
export async function requireAnyRole(roles: UserRole[]): Promise<ExtendedUser> {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error(`One of roles ${roles.join(", ")} required`)
  }
  return user
}