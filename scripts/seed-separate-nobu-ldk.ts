/**
 * Seed Script: Separate NOBU and Le Du Kaan into Individual Accounts
 *
 * This script separates the combined NOBU/LDK account into two separate logins:
 * - NOBU: nobu@brightears.io → sees only NOBU venue
 * - Le Du Kaan: ldk@brightears.io → sees only Le Du Kaan venue
 *
 * Run with: npx tsx scripts/seed-separate-nobu-ldk.ts
 *
 * AFTER RUNNING:
 * 1. Create Clerk user for nobu@brightears.io with password: Nobu2026!
 * 2. Create Clerk user for ldk@brightears.io with password: LDK2026!
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// CONFIGURATION
// =============================================================================

const NOBU_CONFIG = {
  userId: 'nobu-corporate-user',
  email: 'nobu@brightears.io',
  companyName: 'NOBU Bangkok',
  contactPerson: 'NOBU Team',
  venueId: 'nobu-bangkok-venue',
};

const LDK_CONFIG = {
  userId: 'ldk-corporate-user',
  email: 'ldk@brightears.io',
  companyName: 'Le Du Kaan',
  contactPerson: 'Le Du Kaan Team',
  venueId: 'le-du-kaan-venue',
};

// =============================================================================
// MAIN FUNCTION
// =============================================================================

async function main() {
  console.log('🔄 Separating NOBU and Le Du Kaan accounts...\n');

  // ==========================================================================
  // Step 1: Find existing Corporate that owns both venues
  // ==========================================================================
  console.log('🔍 Finding existing corporate...');

  const nobuVenue = await prisma.venue.findUnique({
    where: { id: NOBU_CONFIG.venueId },
    include: { corporate: { include: { user: true } } },
  });

  if (!nobuVenue) {
    console.error('❌ NOBU venue not found. Run prisma/seed-nobu.ts first.');
    process.exit(1);
  }

  const existingCorporate = nobuVenue.corporate;
  console.log(`   Found: ${existingCorporate.companyName} (${existingCorporate.user.email})`);

  // ==========================================================================
  // Step 2: Create NOBU User and Corporate
  // ==========================================================================
  console.log('\n📝 Creating NOBU account...');

  // Create NOBU user
  const nobuUser = await prisma.user.upsert({
    where: { id: NOBU_CONFIG.userId },
    update: {
      email: NOBU_CONFIG.email,
      name: NOBU_CONFIG.companyName,
    },
    create: {
      id: NOBU_CONFIG.userId,
      email: NOBU_CONFIG.email,
      name: NOBU_CONFIG.companyName,
      firstName: 'NOBU',
      lastName: 'Team',
      role: 'CORPORATE',
      isActive: true,
    },
  });
  console.log(`   ✓ User: ${nobuUser.email}`);

  // Create NOBU corporate
  const nobuCorporate = await prisma.corporate.upsert({
    where: { userId: nobuUser.id },
    update: {
      companyName: NOBU_CONFIG.companyName,
      contactPerson: NOBU_CONFIG.contactPerson,
    },
    create: {
      userId: nobuUser.id,
      companyName: NOBU_CONFIG.companyName,
      contactPerson: NOBU_CONFIG.contactPerson,
      position: 'Venue Management',
      venueType: 'Restaurant',
      numberOfVenues: 1,
    },
  });
  console.log(`   ✓ Corporate: ${nobuCorporate.companyName}`);

  // ==========================================================================
  // Step 3: Create LDK User and Corporate
  // ==========================================================================
  console.log('\n📝 Creating Le Du Kaan account...');

  // Create LDK user
  const ldkUser = await prisma.user.upsert({
    where: { id: LDK_CONFIG.userId },
    update: {
      email: LDK_CONFIG.email,
      name: LDK_CONFIG.companyName,
    },
    create: {
      id: LDK_CONFIG.userId,
      email: LDK_CONFIG.email,
      name: LDK_CONFIG.companyName,
      firstName: 'Le Du Kaan',
      lastName: 'Team',
      role: 'CORPORATE',
      isActive: true,
    },
  });
  console.log(`   ✓ User: ${ldkUser.email}`);

  // Create LDK corporate
  const ldkCorporate = await prisma.corporate.upsert({
    where: { userId: ldkUser.id },
    update: {
      companyName: LDK_CONFIG.companyName,
      contactPerson: LDK_CONFIG.contactPerson,
    },
    create: {
      userId: ldkUser.id,
      companyName: LDK_CONFIG.companyName,
      contactPerson: LDK_CONFIG.contactPerson,
      position: 'Venue Management',
      venueType: 'Restaurant',
      numberOfVenues: 1,
    },
  });
  console.log(`   ✓ Corporate: ${ldkCorporate.companyName}`);

  // ==========================================================================
  // Step 4: Reassign venues to their respective corporates
  // ==========================================================================
  console.log('\n🏪 Reassigning venues...');

  // Assign NOBU venue to NOBU corporate
  await prisma.venue.update({
    where: { id: NOBU_CONFIG.venueId },
    data: { corporateId: nobuCorporate.id },
  });
  console.log(`   ✓ NOBU venue → ${nobuCorporate.companyName}`);

  // Assign LDK venue to LDK corporate
  await prisma.venue.update({
    where: { id: LDK_CONFIG.venueId },
    data: { corporateId: ldkCorporate.id },
  });
  console.log(`   ✓ Le Du Kaan venue → ${ldkCorporate.companyName}`);

  // ==========================================================================
  // Step 5: Clean up old corporate (optional - keep for reference)
  // ==========================================================================
  console.log('\n🧹 Checking old corporate...');

  // Check if old corporate still has any venues
  const oldCorporateVenues = await prisma.venue.count({
    where: { corporateId: existingCorporate.id },
  });

  if (oldCorporateVenues === 0) {
    console.log(`   ℹ️ Old corporate "${existingCorporate.companyName}" has no venues.`);
    console.log(`   ℹ️ You can delete it manually if desired, or leave it.`);
  } else {
    console.log(`   ℹ️ Old corporate still has ${oldCorporateVenues} venue(s).`);
  }

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('✅ SEPARATION COMPLETE!');
  console.log('='.repeat(60));
  console.log('\n📋 Account Summary:\n');
  console.log('   NOBU Account:');
  console.log(`   - Email: ${NOBU_CONFIG.email}`);
  console.log('   - Password: Nobu2026! (set in Clerk)');
  console.log('   - Venue: NOBU only\n');
  console.log('   Le Du Kaan Account:');
  console.log(`   - Email: ${LDK_CONFIG.email}`);
  console.log('   - Password: LDK2026! (set in Clerk)');
  console.log('   - Venue: Le Du Kaan only\n');
  console.log('📋 Next Steps:');
  console.log('   1. Go to Clerk Dashboard → Users → Create user');
  console.log(`   2. Create user: ${NOBU_CONFIG.email} with password: Nobu2026!`);
  console.log(`   3. Create user: ${LDK_CONFIG.email} with password: LDK2026!`);
  console.log('   4. Test login at /venue-portal with each account');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
