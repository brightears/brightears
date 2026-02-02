/**
 * Seed Script: CRU & Cocoa XO Venue Portal Data
 *
 * This script seeds the database with:
 * 1. Corporate record for CRU & Cocoa XO
 * 2. Two venues: CRU Champagne Bar and Cocoa XO
 * 3. 5 New DJ Artist profiles (existing DJs are reused)
 * 4. February 2026 schedule assignments
 *
 * Run with: npx tsx scripts/seed-cru-cocoaxo.ts
 *
 * PREREQUISITES:
 * 1. Create Clerk user first for norbert@brightears.com
 * 2. Set DATABASE_URL in .env or run with inline DATABASE_URL
 */

import { PrismaClient, ArtistCategory, VenueAssignmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// CONFIGURATION
// =============================================================================

// Corporate user ID will be created dynamically
const CORPORATE_USER_ID = 'cru-cocoaxo-corporate-user';
const CORPORATE_EMAIL = 'norbert@brightears.com';

// =============================================================================
// NEW DJ PROFILES DATA - Only DJs not already in NOBU roster
// =============================================================================

const NEW_DJ_PROFILES = [
  {
    stageName: 'Tohmo',
    realName: null,
    bio: 'For over a decade, Tohmo has shaped the Thai music scene as a rapper, club hype man, and chill Hip Hop DJ. His rap roots enrich his DJ sets, crafting a narrative journey that resonates with each beat. As a hype man, he can transform any venue\'s ambiance, electrifying crowds with unmatched energy.',
    category: ArtistCategory.DJ,
    genres: ['Hip Hop', 'R&B', 'Lounge', 'Chillout'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/tohmo-photo1.jpg',
    hourlyRate: 800,
  },
  {
    stageName: 'Krit',
    realName: null,
    bio: 'Since stepping behind the decks in 2014 with the JAZZBAH CREW, DJ Krit has carved out a reputation as one of Bangkok\'s most versatile and dynamic selectors. In 2015, his talent earned him a place in BAD KIDS — a cutting-edge DJ collective curated by SUPERRZAAAP! and BADMOTEL. Whether it\'s a rooftop bar, underground club, or luxury hotel, DJ Krit delivers more than just music — he creates experiences.',
    category: ArtistCategory.DJ,
    genres: ['Nu Disco', 'House', 'R&B', 'Hip Hop', 'Pop'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/krit-photo1.jpg',
    hourlyRate: 800,
  },
  {
    stageName: 'April',
    realName: null,
    bio: 'Thailand\'s acclaimed female DJ, April first started mixing house music in late 2010 at many five-star hotels and clubs in Bangkok. In 2012, she was awarded Winner of the Pioneer Lady DJ Championship. Known for bringing an air of youth while maintaining the utmost professionalism, April has performed internationally across Asia and Europe.',
    category: ArtistCategory.DJ,
    genres: ['EDM', 'Top 40', 'House', 'Tech House', 'Soulful House', 'Open Format'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/april-photo1.jpg',
    hourlyRate: 1000,
  },
  {
    stageName: 'JJ',
    realName: null,
    bio: 'Open format DJ with 6 years behind the decks and 11 years as DJ Director at Method to My Madness. Specializes in variety music spanning soul, funk, disco, R&B, hip hop, indie rock, and pop. Has performed at major Thai festivals including Longlay, Spicy on the Beach, Made by Legacy, and Viva la Vespa.',
    category: ArtistCategory.DJ,
    genres: ['Soul', 'Funk', 'Disco', 'R&B', 'Hip Hop', 'Indie Rock', 'Pop', 'Open Format'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/jj-photo1.jpg',
    hourlyRate: 800,
  },
  {
    stageName: 'Camilo',
    realName: 'Camilo Diaz',
    bio: 'Since very young, Camilo Diaz has worked with several Salsa bands in Colombia, recording, producing and performing. He joined forces with the most popular radio station in Colombia "Latina Stereo" and worked with the best musicians in Medellin. He moved to Thailand where he has been performing as a freelance percussionist and DJ in the most popular clubs and hotels.',
    category: ArtistCategory.DJ,
    genres: ['Salsa', 'Latin', 'Tropical', 'Afro-Latin', 'World Music'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/camilo-photo1.png',
    hourlyRate: 1000,
  },
];

// =============================================================================
// FEBRUARY 2026 SCHEDULE - CRU & Cocoa XO
// =============================================================================

interface ScheduleEntry {
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  venue: 'CRU' | 'Cocoa XO';
  startTime: string;
  endTime: string;
  djStageName: string;
}

// Weekly recurring schedule (based on CRU project schedule.md)
const WEEKLY_SCHEDULE: ScheduleEntry[] = [
  // Sunday
  { dayOfWeek: 0, venue: 'CRU', startTime: '21:00', endTime: '01:00', djStageName: 'Izaar' },
  { dayOfWeek: 0, venue: 'Cocoa XO', startTime: '21:00', endTime: '01:00', djStageName: 'JJ' },

  // Monday
  { dayOfWeek: 1, venue: 'CRU', startTime: '21:00', endTime: '01:00', djStageName: 'UFO' },
  { dayOfWeek: 1, venue: 'Cocoa XO', startTime: '21:00', endTime: '01:00', djStageName: 'Tohmo' },

  // Tuesday
  { dayOfWeek: 2, venue: 'CRU', startTime: '21:00', endTime: '01:00', djStageName: 'Manymaur' },
  { dayOfWeek: 2, venue: 'Cocoa XO', startTime: '21:00', endTime: '01:00', djStageName: 'Krit' },

  // Wednesday
  { dayOfWeek: 3, venue: 'CRU', startTime: '21:00', endTime: '01:00', djStageName: 'Linze' },
  { dayOfWeek: 3, venue: 'Cocoa XO', startTime: '21:00', endTime: '01:00', djStageName: 'Benji' },

  // Thursday
  { dayOfWeek: 4, venue: 'CRU', startTime: '21:00', endTime: '01:00', djStageName: 'JJ' },
  { dayOfWeek: 4, venue: 'Cocoa XO', startTime: '21:00', endTime: '01:00', djStageName: 'Tohmo' },

  // Friday
  { dayOfWeek: 5, venue: 'CRU', startTime: '21:00', endTime: '01:00', djStageName: 'Eskay Da Real' },
  { dayOfWeek: 5, venue: 'Cocoa XO', startTime: '21:00', endTime: '01:00', djStageName: 'Linze' },

  // Saturday
  { dayOfWeek: 6, venue: 'CRU', startTime: '21:00', endTime: '01:00', djStageName: 'Izaar' },
  { dayOfWeek: 6, venue: 'Cocoa XO', startTime: '21:00', endTime: '01:00', djStageName: 'Scotty B' },
];

// Special date exceptions for February 2026
interface ScheduleException {
  date: string; // YYYY-MM-DD
  venue: 'CRU' | 'Cocoa XO';
  djStageName: string | null; // null means Guest DJ (skip)
  reason: string;
}

const SCHEDULE_EXCEPTIONS: ScheduleException[] = [
  // Feb 1 (Sun): April at CRU, Guest DJ at Cocoa XO
  { date: '2026-02-01', venue: 'CRU', djStageName: 'April', reason: 'Special guest' },
  { date: '2026-02-01', venue: 'Cocoa XO', djStageName: null, reason: 'Guest DJ - venue provides' },

  // Feb 5, 19 (Thu): JJ at CRU (already in schedule)
  // Feb 12, 26 (Thu): Pound at CRU
  { date: '2026-02-12', venue: 'CRU', djStageName: 'DJ Pound', reason: 'Thursday rotation' },
  { date: '2026-02-26', venue: 'CRU', djStageName: 'DJ Pound', reason: 'Thursday rotation' },

  // Feb 13 (Fri): Guest DJ at CRU
  { date: '2026-02-13', venue: 'CRU', djStageName: null, reason: 'Guest DJ - venue provides' },

  // Feb 14 (Sat): Guest DJ at CRU, Camilo at Cocoa XO
  { date: '2026-02-14', venue: 'CRU', djStageName: null, reason: 'Guest DJ - Valentine\'s Day' },
  { date: '2026-02-14', venue: 'Cocoa XO', djStageName: 'Camilo', reason: 'Valentine\'s Day special' },

  // Feb 15 (Sun): Guest DJ at CRU, Camilo at Cocoa XO
  { date: '2026-02-15', venue: 'CRU', djStageName: null, reason: 'Guest DJ - venue provides' },
  { date: '2026-02-15', venue: 'Cocoa XO', djStageName: 'Camilo', reason: 'Weekend special' },

  // Feb 20 (Fri): Guest DJ at Cocoa XO
  { date: '2026-02-20', venue: 'Cocoa XO', djStageName: null, reason: 'Guest DJ - venue provides' },

  // Feb 21 (Sat): Guest DJ at Cocoa XO
  { date: '2026-02-21', venue: 'Cocoa XO', djStageName: null, reason: 'Guest DJ - venue provides' },

  // Feb 28 (Sat): JJ at CRU
  { date: '2026-02-28', venue: 'CRU', djStageName: 'JJ', reason: 'Saturday special' },
];

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================

async function main() {
  console.log('🌱 Starting CRU & Cocoa XO seed...\n');

  // ==========================================================================
  // Step 1: Create or update User for Corporate account
  // ==========================================================================
  console.log('📝 Creating/updating corporate user...');

  const corporateUser = await prisma.user.upsert({
    where: { id: CORPORATE_USER_ID },
    update: {
      name: 'CRU & Cocoa XO',
      firstName: 'Norbert',
      lastName: 'Platzer',
    },
    create: {
      id: CORPORATE_USER_ID,
      email: CORPORATE_EMAIL,
      name: 'CRU & Cocoa XO',
      firstName: 'Norbert',
      lastName: 'Platzer',
      role: 'CORPORATE',
      isActive: true,
    },
  });
  console.log(`   ✓ Corporate user: ${corporateUser.email}`);

  // ==========================================================================
  // Step 2: Create Corporate record
  // ==========================================================================
  console.log('🏢 Creating/updating corporate record...');

  const corporate = await prisma.corporate.upsert({
    where: { userId: corporateUser.id },
    update: {
      companyName: 'CRU & Cocoa XO',
      contactPerson: 'Norbert Platzer',
      position: 'Entertainment Director',
    },
    create: {
      userId: corporateUser.id,
      companyName: 'CRU & Cocoa XO',
      contactPerson: 'Norbert Platzer',
      position: 'Entertainment Director',
      venueType: 'Bar',
      numberOfVenues: 2,
    },
  });
  console.log(`   ✓ Corporate: ${corporate.companyName}`);

  // ==========================================================================
  // Step 3: Create Venues
  // ==========================================================================
  console.log('🏪 Creating/updating venues...');

  const cruVenue = await prisma.venue.upsert({
    where: {
      id: 'cru-champagne-bar-venue',
    },
    update: {
      name: 'CRU Champagne Bar',
      operatingHours: { startTime: '21:00', endTime: '01:00' },
    },
    create: {
      id: 'cru-champagne-bar-venue',
      corporateId: corporate.id,
      name: 'CRU Champagne Bar',
      address: 'Centara Grand at Central World, 59th Floor, Bangkok, Thailand',
      city: 'Bangkok',
      venueType: 'Bar',
      operatingHours: { startTime: '21:00', endTime: '01:00' },
      contactPerson: 'Venue Manager',
      isActive: true,
    },
  });
  console.log(`   ✓ Venue: ${cruVenue.name} (59F)`);

  const cocoaXOVenue = await prisma.venue.upsert({
    where: {
      id: 'cocoa-xo-venue',
    },
    update: {
      name: 'Cocoa XO',
      operatingHours: { startTime: '21:00', endTime: '01:00' },
    },
    create: {
      id: 'cocoa-xo-venue',
      corporateId: corporate.id,
      name: 'Cocoa XO',
      address: 'Centara Grand at Central World, 57th Floor, Bangkok, Thailand',
      city: 'Bangkok',
      venueType: 'Bar',
      operatingHours: { startTime: '21:00', endTime: '01:00' },
      contactPerson: 'Venue Manager',
      isActive: true,
    },
  });
  console.log(`   ✓ Venue: ${cocoaXOVenue.name} (57F)`);

  // ==========================================================================
  // Step 4: Create NEW DJ Artists (only the 5 that don't exist yet)
  // ==========================================================================
  console.log('🎧 Creating/updating NEW DJ artists...');

  const artistMap: Record<string, string> = {}; // stageName -> artistId

  for (const dj of NEW_DJ_PROFILES) {
    // Create a unique ID based on stage name
    const djId = `dj-${dj.stageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    const userId = `user-${djId}`;

    // Create or update user for artist
    const djUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: dj.stageName,
      },
      create: {
        id: userId,
        email: `${djId}@brightears.io`, // Placeholder email
        name: dj.stageName,
        firstName: dj.realName || dj.stageName,
        role: 'ARTIST',
        isActive: true,
      },
    });

    // Create or update artist profile
    const artist = await prisma.artist.upsert({
      where: { userId: djUser.id },
      update: {
        stageName: dj.stageName,
        realName: dj.realName,
        bio: dj.bio,
        genres: dj.genres,
        instagram: dj.instagram,
        mixcloud: dj.mixcloud,
        profileImage: dj.profileImage,
        hourlyRate: dj.hourlyRate,
      },
      create: {
        id: djId,
        userId: djUser.id,
        stageName: dj.stageName,
        realName: dj.realName,
        bio: dj.bio,
        category: dj.category,
        genres: dj.genres,
        baseCity: 'Bangkok',
        serviceAreas: ['Bangkok'],
        hourlyRate: dj.hourlyRate,
        minimumHours: 4,
        currency: 'THB',
        languages: ['en', 'th'],
        instagram: dj.instagram,
        mixcloud: dj.mixcloud,
        profileImage: dj.profileImage,
      },
    });

    artistMap[dj.stageName] = artist.id;
    console.log(`   ✓ DJ: ${dj.stageName}`);
  }

  // ==========================================================================
  // Step 5: Get existing artist IDs for reuse
  // ==========================================================================
  console.log('🔗 Finding existing DJ artists...');

  const existingDJs = ['Benji', 'Izaar', 'Manymaur', 'UFO', 'Linze', 'DJ Pound', 'Scotty B', 'Eskay Da Real'];

  for (const stageName of existingDJs) {
    const artist = await prisma.artist.findFirst({
      where: { stageName },
      select: { id: true },
    });
    if (artist) {
      artistMap[stageName] = artist.id;
      console.log(`   ✓ Found existing: ${stageName}`);
    } else {
      console.warn(`   ⚠️ Not found: ${stageName}`);
    }
  }

  // ==========================================================================
  // Step 6: Create February 2026 Schedule Assignments
  // ==========================================================================
  console.log('📅 Creating February 2026 schedule assignments...');

  // Get all days in February 2026
  const february2026Days: Date[] = [];
  for (let day = 1; day <= 28; day++) {
    february2026Days.push(new Date(Date.UTC(2026, 1, day, 12, 0, 0))); // Noon UTC
  }

  let assignmentCount = 0;
  let skippedCount = 0;

  for (const date of february2026Days) {
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split('T')[0];

    // Process both venues
    for (const venue of ['CRU', 'Cocoa XO'] as const) {
      const venueId = venue === 'CRU' ? cruVenue.id : cocoaXOVenue.id;

      // Check for exception first
      const exception = SCHEDULE_EXCEPTIONS.find(
        e => e.date === dateStr && e.venue === venue
      );

      let djStageName: string | null = null;
      let notes: string | null = null;

      if (exception) {
        djStageName = exception.djStageName;
        notes = exception.reason;
      } else {
        // Get regular schedule for this day
        const entry = WEEKLY_SCHEDULE.find(s => s.dayOfWeek === dayOfWeek && s.venue === venue);
        if (entry) {
          djStageName = entry.djStageName;
        }
      }

      // Skip if Guest DJ (null)
      if (djStageName === null) {
        skippedCount++;
        continue;
      }

      const artistId = artistMap[djStageName];

      if (!artistId) {
        console.warn(`   ⚠️ Artist not found: ${djStageName} for ${dateStr} ${venue}`);
        continue;
      }

      // Create unique assignment ID
      const assignmentId = `cru-assignment-${dateStr}-${venue.toLowerCase().replace(/\s+/g, '-')}`;

      try {
        await prisma.venueAssignment.upsert({
          where: { id: assignmentId },
          update: {
            artistId,
            startTime: '21:00',
            endTime: '01:00',
            notes,
          },
          create: {
            id: assignmentId,
            venueId,
            artistId,
            date: date,
            startTime: '21:00',
            endTime: '01:00',
            slot: null,
            status: date < new Date() ? VenueAssignmentStatus.COMPLETED : VenueAssignmentStatus.SCHEDULED,
            notes,
          },
        });
        assignmentCount++;
      } catch (error) {
        console.warn(`   ⚠️ Assignment error: ${dateStr} ${venue}`);
      }
    }
  }

  console.log(`   ✓ Created ${assignmentCount} assignments`);
  console.log(`   ⏭️ Skipped ${skippedCount} Guest DJ slots`);

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log('\n✅ Seed completed successfully!\n');
  console.log('Summary:');
  console.log(`   - 1 Corporate account (CRU & Cocoa XO)`);
  console.log(`   - 2 Venues (CRU Champagne Bar, Cocoa XO)`);
  console.log(`   - ${NEW_DJ_PROFILES.length} NEW DJ profiles created`);
  console.log(`   - ${existingDJs.length} Existing DJs reused`);
  console.log(`   - ${assignmentCount} schedule assignments for February 2026`);
  console.log(`   - ${skippedCount} Guest DJ slots skipped`);
  console.log('\n📋 Next steps:');
  console.log(`   1. Create Clerk user for ${CORPORATE_EMAIL}`);
  console.log('   2. Link Clerk user to database user (run sync script or manual update)');
  console.log('   3. Test login at /venue-portal');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
