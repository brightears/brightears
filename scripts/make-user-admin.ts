#!/usr/bin/env ts-node

/**
 * Script to update a user's role to ADMIN
 * Usage: ts-node scripts/make-user-admin.ts <email>
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeUserAdmin(email: string) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true }
    })

    if (!user) {
      console.error(`❌ Error: User with email ${email} not found in database`)
      process.exit(1)
    }

    console.log(`✓ Found user:`)
    console.log(`  ID: ${user.id}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Current Role: ${user.role}`)

    if (user.role === 'ADMIN') {
      console.log(`✓ User is already an ADMIN. No changes needed.`)
      process.exit(0)
    }

    // Update user role to ADMIN
    console.log(`\n🔄 Updating role to ADMIN...`)
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })

    console.log(`✅ Success! User ${email} is now an ADMIN`)
    console.log(`🎉 You can now access the admin dashboard at:`)
    console.log(`   https://brightears.io/en/dashboard/admin`)

  } catch (error) {
    console.error(`❌ Error updating user role:`, error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error('❌ Error: Email address required')
  console.log('Usage: ts-node scripts/make-user-admin.ts <email>')
  process.exit(1)
}

makeUserAdmin(email)
