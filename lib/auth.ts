import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Extend the default session types
declare module "next-auth" {
  interface Session {
    user: {
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
    } & DefaultSession["user"]
  }
}

const providers = []

// Only add Google provider if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  )
}

providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validatedFields = loginSchema.safeParse(credentials)
          
          if (!validatedFields.success) {
            return null
          }

          const { email, password } = validatedFields.data

          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              artist: true,
              customer: true,
              corporate: true,
            },
          })

          if (!user || !user.password) {
            return null
          }

          const isValidPassword = await bcrypt.compare(password, user.password)

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
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
          } as any
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    })
)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true, // Required for NextAuth v5 in production
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers, create/update user profile
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { customer: true, corporate: true, artist: true }
          })

          if (!existingUser) {
            // Create new customer account for Google OAuth users
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: 'CUSTOMER',
                customer: {
                  create: {
                    firstName: user.name?.split(' ')[0] || '',
                    lastName: user.name?.split(' ').slice(1).join(' ') || '',
                    preferredLanguage: 'en'
                  }
                }
              },
              include: { customer: true }
            })
            console.log("Created new Google OAuth user:", newUser.email)
          } else {
            console.log("Google OAuth user already exists:", existingUser.email)
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
          // Still return true to allow sign in, but log the error
          return true
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user && user.email) {
        // For Google OAuth, the user should already be created in signIn callback
        // Fetch the full user data from database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { customer: true, corporate: true, artist: true }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          token.name = dbUser.name
          token.role = dbUser.role
          token.artist = dbUser.artist
          token.customer = dbUser.customer
          token.corporate = dbUser.corporate
        } else {
          // This shouldn't happen if signIn callback worked correctly
          console.error("Google OAuth user not found in database:", user.email)
          return token // Return existing token instead of empty object
        }
      } else if (user && user.id && user.email) {
        // For credentials provider - ensure we have required fields
        token.id = user.id
        token.email = user.email
        token.role = (user as any).role
        token.artist = (user as any).artist
        token.customer = (user as any).customer
        token.corporate = (user as any).corporate
      }
      
      return token
    },
    async session({ session, token }) {
      // Only return a session if we have a valid token with user ID and email
      if (token && token.id && token.email && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as UserRole
        session.user.artist = token.artist as any
        session.user.customer = token.customer as any
        session.user.corporate = token.corporate as any
        return session
      }
      
      // Return the original session if we don't have a valid token (NextAuth expects this)
      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in`)
    },
    async signOut() {
      console.log(`User signed out`)
    },
  },
})

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
 * Get the current user from the session
 */
export async function getCurrentUser() {
  const session = await auth()
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
 * Check if a session is valid and authenticated
 */
export function isValidSession(session: any): boolean {
  return !!(
    session && 
    session.user && 
    session.user.id && 
    session.user.email &&
    session.user.role
  )
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth()
  return isValidSession(session)
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