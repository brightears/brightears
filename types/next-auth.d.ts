import NextAuth, { type DefaultSession } from "next-auth"
import { type UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      artist?: {
        id: string
        stageName: string
        verificationLevel: string
        category: string
        baseCity: string
        hourlyRate?: number
        profileImage?: string
        averageRating?: number
        totalBookings: number
      }
      customer?: {
        id: string
        firstName?: string
        lastName?: string
        preferredLanguage: string
        location?: string
      }
      corporate?: {
        id: string
        companyName: string
        contactPerson: string
        position?: string
        venueType?: string
        numberOfVenues: number
      }
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: UserRole
    artist?: {
      id: string
      stageName: string
      verificationLevel: string
      category: string
      baseCity: string
      hourlyRate?: number
      profileImage?: string
      averageRating?: number
      totalBookings: number
    }
    customer?: {
      id: string
      firstName?: string
      lastName?: string
      preferredLanguage: string
      location?: string
    }
    corporate?: {
      id: string
      companyName: string
      contactPerson: string
      position?: string
      venueType?: string
      numberOfVenues: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: UserRole
    artist?: {
      id: string
      stageName: string
      verificationLevel: string
      category: string
      baseCity: string
      hourlyRate?: number
      profileImage?: string
      averageRating?: number
      totalBookings: number
    }
    customer?: {
      id: string
      firstName?: string
      lastName?: string
      preferredLanguage: string
      location?: string
    }
    corporate?: {
      id: string
      companyName: string
      contactPerson: string
      position?: string
      venueType?: string
      numberOfVenues: number
    }
  }
}