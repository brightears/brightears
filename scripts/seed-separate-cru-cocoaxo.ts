/**
 * Seed Script: Separate CRU and Cocoa XO into Individual Accounts
 *
 * This script separates the combined CRU/Cocoa XO account into two separate logins:
 * - CRU: cru@brightears.io → sees only CRU Champagne Bar venue
 * - Cocoa XO: cocoaxo@brightears.io → sees only Cocoa XO venue
 *
 * Run with: npx tsx scripts/seed-separate-cru-cocoaxo.ts
 *
 * AFTER RUNNING:
 * 1. Create Clerk user for cru@brightears.io with password: CRU2026!
 * 2. Create Clerk user for cocoaxo@brightears.io with password: CocoaXO2026!
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// CONFIGURATION
// =============================================================================

const CRU_CONFIG = {
  userId: 'cru-corporate-user',
  email: 'cru@brightears.io',
  companyName: 'CRU Champagne Bar',
  contactPerson: 'CRU Team',
  venueId: 'cru-champagne-bar-venue',
};

const COCOAXO_CONFIG = {
  userId: 'cocoaxo-corporate-user',
  email: 'cocoaxo@brightears.io',
  companyName: 'Cocoa XO',
  contactPerson: 'Cocoa XO Team',
  venueId: 'cocoa-xo-venue',
};

// =============================================================================
// MAIN FUNCTION
// =============================================================================

async function main() {
  console.log('🔄 Separating CRU and Cocoa XO accounts...\n');

  // ==========================================================================
  // Step 1: Find existing Corporate that owns both venues
  // ==========================================================================
  console.log('🔍 Finding existing corporate...');

  const cruVenue = await prisma.venue.findUnique({
    where: { id: CRU_CONFIG.venueId },
    include: { corporate: { include: { user: true } } },
  });

  if (!cruVenue) {
    console.error('❌ CRU venue not found. Run seed-cru-cocoaxo.ts first.');
    process.exit(1);
  }

  const existingCorporate = cruVenue.corporate;
  console.log(`   Found: ${existingCorporate.companyName} (${existingCorporate.user.email})`);

  // ==========================================================================
  // Step 2: Create CRU User and Corporate
  // ==========================================================================
  console.log('\n📝 Creating CRU account...');

  // Create CRU user
  const cruUser = await prisma.user.upsert({
    where: { id: CRU_CONFIG.userId },
    update: {
      email: CRU_CONFIG.email,
      name: CRU_CONFIG.companyName,
    },
    create: {
      id: CRU_CONFIG.userId,
      email: CRU_CONFIG.email,
      name: CRU_CONFIG.companyName,
      firstName: 'CRU',
      lastName: 'Team',
      role: 'CORPORATE',
      isActive: true,
    },
  });
  console.log(`   ✓ User: ${cruUser.email}`);

  // Create CRU corporate
  const cruCorporate = await prisma.corporate.upsert({
    where: { userId: cruUser.id },
    update: {
      companyName: CRU_CONFIG.companyName,
      contactPerson: CRU_CONFIG.contactPerson,
    },
    create: {
      userId: cruUser.id,
      companyName: CRU_CONFIG.companyName,
      contactPerson: CRU_CONFIG.contactPerson,
      position: 'Venue Management',
      venueType: 'Bar',
      numberOfVenues: 1,
    },
  });
  console.log(`   ✓ Corporate: ${cruCorporate.companyName}`);

  // ==========================================================================
  // Step 3: Create Cocoa XO User and Corporate
  // ==========================================================================
  console.log('\n📝 Creating Cocoa XO account...');

  // Create Cocoa XO user
  const cocoaxoUser = await prisma.user.upsert({
    where: { id: COCOAXO_CONFIG.userId },
    update: {
      email: COCOAXO_CONFIG.email,
      name: COCOAXO_CONFIG.companyName,
    },
    create: {
      id: COCOAXO_CONFIG.userId,
      email: COCOAXO_CONFIG.email,
      name: COCOAXO_CONFIG.companyName,
      firstName: 'Cocoa XO',
      lastName: 'Team',
      role: 'CORPORATE',
      isActive: true,
    },
  });
  console.log(`   ✓ User: ${cocoaxoUser.email}`);

  // Create Cocoa XO corporate
  const cocoaxoCorporate = await prisma.corporate.upsert({
    where: { userId: cocoaxoUser.id },
    update: {
      companyName: COCOAXO_CONFIG.companyName,
      contactPerson: COCOAXO_CONFIG.contactPerson,
    },
    create: {
      userId: cocoaxoUser.id,
      companyName: COCOAXO_CONFIG.companyName,
      contactPerson: COCOAXO_CONFIG.contactPerson,
      position: 'Venue Management',
      venueType: 'Bar',
      numberOfVenues: 1,
    },
  });
  console.log(`   ✓ Corporate: ${cocoaxoCorporate.companyName}`);

  // ==========================================================================
  // Step 4: Reassign venues to their respective corporates
  // ==========================================================================
  console.log('\n🏪 Reassigning venues...');

  // Assign CRU venue to CRU corporate
  await prisma.venue.update({
    where: { id: CRU_CONFIG.venueId },
    data: { corporateId: cruCorporate.id },
  });
  console.log(`   ✓ CRU Champagne Bar → ${cruCorporate.companyName}`);

  // Assign Cocoa XO venue to Cocoa XO corporate
  await prisma.venue.update({
    where: { id: COCOAXO_CONFIG.venueId },
    data: { corporateId: cocoaxoCorporate.id },
  });
  console.log(`   ✓ Cocoa XO → ${cocoaxoCorporate.companyName}`);

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
  console.log('   CRU Account:');
  console.log(`   - Email: ${CRU_CONFIG.email}`);
  console.log('   - Password: CRU2026! (set in Clerk)');
  console.log('   - Venue: CRU Champagne Bar only\n');
  console.log('   Cocoa XO Account:');
  console.log(`   - Email: ${COCOAXO_CONFIG.email}`);
  console.log('   - Password: CocoaXO2026! (set in Clerk)');
  console.log('   - Venue: Cocoa XO only\n');
  console.log('📋 Next Steps:');
  console.log('   1. Go to Clerk Dashboard → Users → Create user');
  console.log(`   2. Create user: ${CRU_CONFIG.email} with password: CRU2026!`);
  console.log(`   3. Create user: ${COCOAXO_CONFIG.email} with password: CocoaXO2026!`);
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
