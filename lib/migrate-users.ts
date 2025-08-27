import { PrismaClient } from '@prisma/client'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'

const prisma = new PrismaClient()
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

interface PrismaUser {
  id: string
  email: string
  phone?: string | null
  role: string
  firstName?: string | null
  lastName?: string | null
  createdAt: Date
  artist?: {
    stageName: string
    category: string
    bio?: string | null
    baseCity?: string | null
    hourlyRate?: number | null
  } | null
}

export async function migrateExistingUsers() {
  console.log('Starting user migration from Prisma to Convex...')
  
  try {
    // Get all users from Prisma with their related data
    const prismaUsers = await prisma.user.findMany({
      include: {
        artist: true,
        // Add other related models as needed
      }
    })

    console.log(`Found ${prismaUsers.length} users to migrate`)

    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const user of prismaUsers) {
      try {
        // Check if user already exists in Convex (by email)
        const existingUser = await convex.query(api.users.getUserByEmail, {
          email: user.email
        })

        if (existingUser) {
          console.log(`User ${user.email} already exists in Convex, skipping`)
          skipped++
          continue
        }

        // Create user in Convex
        const convexUserId = await convex.mutation(api.users.upsertFromClerk, {
          clerkId: `migrated_${user.id}`, // Temporary clerk ID for migrated users
          email: user.email,
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : (user.firstName || user.lastName || undefined),
          phone: user.phone || undefined,
        })

        // If user is an artist, create artist profile
        if (user.role === 'ARTIST' && user.artist) {
          await convex.mutation(api.users.createArtistProfile, {
            stageName: user.artist.stageName,
            category: user.artist.category as any,
            bio: user.artist.bio || undefined,
            baseCity: user.artist.baseCity || undefined,
            basePrice: user.artist.hourlyRate ? Number(user.artist.hourlyRate) : undefined,
            phone: user.phone || undefined,
          })
        }

        // Mark user as migrated in Prisma (add a field if needed)
        await prisma.user.update({
          where: { id: user.id },
          data: {
            // You might want to add a 'migratedToClerk' boolean field
            // migratedToClerk: true
          }
        })

        console.log(`✅ Migrated user: ${user.email}`)
        migrated++

      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.email}:`, error)
        errors++
      }
    }

    console.log('\nMigration Summary:')
    console.log(`✅ Migrated: ${migrated}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`❌ Errors: ${errors}`)

    return {
      migrated,
      skipped,
      errors,
      total: prismaUsers.length
    }

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function linkClerkUserToPrismaUser(
  clerkUserId: string,
  email: string
) {
  try {
    // Find existing Prisma user by email
    const prismaUser = await prisma.user.findUnique({
      where: { email },
      include: { artist: true }
    })

    if (!prismaUser) {
      console.log(`No existing user found for ${email}`)
      return null
    }

    // Update Convex user with real Clerk ID
    const convexUser = await convex.query(api.users.getUserByEmail, {
      email
    })

    if (convexUser) {
      // This would require a new mutation to update the clerkId
      console.log(`Linking Clerk user ${clerkUserId} to existing user ${email}`)
      // Implementation depends on your Convex schema updates
    }

    return prismaUser
  } catch (error) {
    console.error(`Failed to link user ${email}:`, error)
    throw error
  }
}