#!/usr/bin/env tsx

/**
 * Migration script to move existing users from NextAuth to Clerk
 * 
 * This script should be run after setting up Clerk and Convex
 * 
 * Usage: tsx scripts/migrate-to-clerk.ts
 */

import { PrismaClient } from "@prisma/client";
import { Clerk } from "@clerk/backend";

const prisma = new PrismaClient();

// Initialize Clerk with your secret key
const clerk = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

async function migrateUsers() {
  console.log("Starting user migration to Clerk...");

  try {
    // Get all existing users from database
    const users = await prisma.user.findMany({
      include: {
        artist: true,
        customer: true,
        corporate: true,
      },
    });

    console.log(`Found ${users.length} users to migrate`);

    for (const user of users) {
      try {
        console.log(`Migrating user: ${user.email}`);

        // Check if user already exists in Clerk
        const existingClerkUsers = await clerk.users.getUserList({
          emailAddress: [user.email],
        });

        let clerkUser;

        if (existingClerkUsers.length > 0) {
          // User already exists in Clerk
          clerkUser = existingClerkUsers[0];
          console.log(`User ${user.email} already exists in Clerk`);
        } else {
          // Create new user in Clerk
          // Note: We can't migrate passwords, so users will need to reset
          clerkUser = await clerk.users.createUser({
            emailAddress: [user.email],
            firstName: user.name?.split(" ")[0],
            lastName: user.name?.split(" ").slice(1).join(" "),
            publicMetadata: {
              role: user.role,
              legacyUserId: user.id,
              migrated: true,
            },
            privateMetadata: {
              artistId: user.artist?.id,
              customerId: user.customer?.id,
              corporateId: user.corporate?.id,
            },
            // Skip password for now - users will need to reset
            skipPasswordChecks: true,
            skipPasswordRequirement: true,
          });

          console.log(`Created Clerk user for ${user.email}`);
        }

        // Update the user's metadata with their role and profile IDs
        await clerk.users.updateUserMetadata(clerkUser.id, {
          publicMetadata: {
            role: user.role,
            legacyUserId: user.id,
            migrated: true,
          },
          privateMetadata: {
            artistId: user.artist?.id,
            customerId: user.customer?.id,
            corporateId: user.corporate?.id,
          },
        });

        // Store Clerk ID in database for reference
        await prisma.user.update({
          where: { id: user.id },
          data: {
            // Store Clerk ID in a custom field if you add one
            // clerkId: clerkUser.id,
          },
        });

        console.log(`Successfully migrated user: ${user.email}`);
      } catch (error) {
        console.error(`Failed to migrate user ${user.email}:`, error);
      }
    }

    console.log("User migration completed!");

    // Print summary
    console.log("\n=== Migration Summary ===");
    console.log(`Total users processed: ${users.length}`);
    console.log("\nIMPORTANT NOTES:");
    console.log("1. Users will need to reset their passwords");
    console.log("2. Send password reset emails to all migrated users");
    console.log("3. Update your application to use Clerk authentication");
    console.log("4. Test the migration with a few users first");

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateUsers();