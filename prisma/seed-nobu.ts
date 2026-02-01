/**
 * Seed Script: NOBU & Le Du Kaan Venue Portal Data
 *
 * This script seeds the database with:
 * 1. Corporate record for TGC Hotel Collection
 * 2. Two venues: NOBU and Le Du Kaan
 * 3. 15 DJ Artist profiles
 * 4. February 2026 schedule assignments
 *
 * Run with: npx tsx prisma/seed-nobu.ts
 *
 * PREREQUISITES:
 * 1. Create Clerk users first (see VENUE_PORTAL_SETUP.md)
 * 2. Set DATABASE_URL in .env
 */

import { PrismaClient, ArtistCategory, VenueAssignmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// CONFIGURATION - Update these Clerk User IDs after creating users in Clerk
// =============================================================================

// Clerk User IDs
const CLERK_USER_IDS = {
  // Admin account (support@brightears.io)
  admin: 'user_38nZAkyEkiY2IiiaVtZzenJW73I',

  // Corporate account for NOBU/Le Du Kaan (dan.jamme@marriott.com)
  corporate: 'user_38nZi0YUqCOxVzlya47mwA8qBvh',
};

// =============================================================================
// DJ PROFILES DATA - From NOBU project
// =============================================================================

const DJ_PROFILES = [
  // NOBU DJs (6)
  {
    stageName: 'Benji',
    realName: 'Bua Benchawan',
    bio: 'Afro and Organic House specialist known for weaving organic house remixes of familiar tracks into her sets, creating an accessible yet sophisticated sound. Regular performer at Tribe Beach Club and Escape.',
    category: ArtistCategory.DJ,
    genres: ['Afro House', 'Organic House', 'Soulful House', 'Deep House', 'Nu Disco'],
    instagram: '@djbenjibkk',
    mixcloud: 'm.mixcloud.com/buabenchawan9',
    profileImage: '/images/djs/benji-photo1.png',
    venues: ['NOBU', 'Le Du Kaan Early'],
    hourlyRate: 1000,
  },
  {
    stageName: 'Izaar',
    realName: null,
    bio: 'Deep and soulful house specialist with a refined ear for elegant, sophisticated sounds. Perfect for upscale dining environments.',
    category: ArtistCategory.DJ,
    genres: ['Deep House', 'Soulful House', 'Organic House'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/izaar-photo1.png',
    venues: ['NOBU'],
    hourlyRate: 1000,
  },
  {
    stageName: 'Manymaur',
    realName: null,
    bio: 'Versatile DJ comfortable across House, Tech House, and Afro House genres. Can adapt to commercial settings when needed.',
    category: ArtistCategory.DJ,
    genres: ['House', 'Tech House', 'Afro House', 'Commercial'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/manymaur-photo1.png',
    venues: ['NOBU', 'Le Du Kaan Late'],
    hourlyRate: 1000,
  },
  {
    stageName: 'UFO',
    realName: null,
    bio: 'Afro and Organic House specialist bringing cosmic energy to the dance floor. Can also play commercial sets for late-night crowds.',
    category: ArtistCategory.DJ,
    genres: ['Afro House', 'Organic House', 'Commercial'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/ufo-photo1.png',
    venues: ['NOBU', 'Le Du Kaan Late'],
    hourlyRate: 1000,
  },
  {
    stageName: 'DJ Mint',
    realName: null,
    bio: 'Nu Disco, Tech House, and Afro House specialist with extensive experience on the Bangkok hotel circuit.',
    category: ArtistCategory.DJ,
    genres: ['Nu Disco', 'Tech House', 'Afro House'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/mint-photo1.png',
    venues: ['NOBU'],
    hourlyRate: 1000,
  },
  {
    stageName: 'Linze',
    realName: null,
    bio: 'Open format DJ specializing in pop and dance music with a flair for Thai pop and K-pop. Known for taking requests and keeping the flow fresh.',
    category: ArtistCategory.DJ,
    genres: ['Pop & Dance', 'Thai Pop', 'K-pop', 'Open Format', 'Techno', 'EDM'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/linze-photo1.png',
    venues: ['NOBU', 'Le Du Kaan Early', 'Le Du Kaan Late'],
    hourlyRate: 1000,
  },
  {
    stageName: 'Vita',
    realName: null,
    bio: 'Versatile open format DJ comfortable with Pop, K-Pop, and R&B. SO/ Bangkok resident DJ.',
    category: ArtistCategory.DJ,
    genres: ['Open Format', 'Pop', 'K-Pop', 'R&B'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/vita-photo1.png',
    venues: ['NOBU', 'Le Du Kaan Late'],
    hourlyRate: 1000,
  },

  // Le Du Kaan Early DJs (6)
  {
    stageName: 'Tom FKG',
    realName: null,
    bio: 'Nu Disco, Funky, Soulful, and Deep House veteran with over 27 years of experience. Master of feel-good grooves.',
    category: ArtistCategory.DJ,
    genres: ['Nu Disco', 'Funky House', 'Soulful House', 'Deep House'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/tomfkg-photo1.png',
    venues: ['Le Du Kaan Early'],
    hourlyRate: 1000,
  },
  {
    stageName: 'RabbitDisco',
    realName: null,
    bio: 'Nu Disco and Indie Dance specialist bringing fun, upbeat energy to early evening sets.',
    category: ArtistCategory.DJ,
    genres: ['Nu Disco', 'Indie Dance'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/rabbitdisco-photo1.png',
    venues: ['NOBU', 'Le Du Kaan Early'],
    hourlyRate: 1000,
  },
  {
    stageName: 'DJ Enjoy',
    realName: null,
    bio: 'House DJ with over 10 years experience bringing uplifting energy to the dance floor.',
    category: ArtistCategory.DJ,
    genres: ['House', 'Uplifting House'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/enjoy-photo1.png',
    venues: ['Le Du Kaan Early'],
    hourlyRate: 1000,
  },
  {
    stageName: 'Mizuyo',
    realName: null,
    bio: 'Japanese DJ with 25+ years experience specializing in Funk, Disco, Latin, and World Fusion music.',
    category: ArtistCategory.DJ,
    genres: ['Funk', 'Disco', 'Latin', 'World Fusion'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/mizuyo-photo1.jpg',
    venues: ['Le Du Kaan Early'],
    hourlyRate: 1000,
  },
  {
    stageName: 'DJ Furry',
    realName: null,
    bio: 'Versatile DJ comfortable in both club and bar settings. House and Commercial specialist.',
    category: ArtistCategory.DJ,
    genres: ['House', 'Commercial', 'Open Format'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/furry-photo1.png',
    venues: ['Le Du Kaan Early'],
    hourlyRate: 1000,
  },

  // Le Du Kaan Late DJs (5 - some overlap with NOBU)
  {
    stageName: 'DJ Pound',
    realName: null,
    bio: 'Open Format specialist with 20 years experience. Expert in Pop Charts, R&B, and Hip Hop.',
    category: ArtistCategory.DJ,
    genres: ['Open Format', 'Pop Charts', 'R&B', 'Hip Hop'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/pound-photo1.png',
    venues: ['Le Du Kaan Early', 'Le Du Kaan Late'],
    hourlyRate: 1000,
  },
  {
    stageName: 'Scotty B',
    realName: null,
    bio: 'Versatile Open Format and Nu Disco DJ with over 30 years of experience.',
    category: ArtistCategory.DJ,
    genres: ['Open Format', 'Nu Disco'],
    instagram: null,
    mixcloud: null,
    profileImage: '/images/djs/scottyb-photo1.png',
    venues: ['Le Du Kaan Late'],
    hourlyRate: 1000,
  },
  {
    stageName: 'Yui Truluv',
    realName: null,
    bio: 'Bangkok-based professional DJ with over 10 years experience. Known for creating smooth, feel-good vibes and building strong crowd connections. Also produces original tracks and remixes.',
    category: ArtistCategory.DJ,
    genres: ['Nu Disco', 'Disco House', 'Deep House', 'Tech House', 'Commercial', 'Hip Hop', 'R&B', 'Funky', 'Latin', 'Reggaeton'],
    instagram: '@yuitruluv',
    mixcloud: 'mixcloud.com/yuitruluv',
    profileImage: '/images/djs/yuitruluv-photo1.png',
    venues: ['Le Du Kaan Early', 'Le Du Kaan Late'],
    hourlyRate: 1000,
  },
  {
    stageName: 'Eskay Da Real',
    realName: null,
    bio: 'French DJ with over 15 years of experience. Known for his signature French Touch and diverse cultural influences. Seamlessly blends Hip Hop, R&B, Afro House, and Latino rhythms. Also a sought-after beatmaker collaborating with international artists.',
    category: ArtistCategory.DJ,
    genres: ['Hip Hop', 'R&B', 'Afro House', 'Pop', 'House', 'Electro', 'Latino', 'Open Format'],
    instagram: '@eskaydareal',
    mixcloud: null,
    profileImage: '/images/djs/eskay-photo1.png',
    venues: ['Le Du Kaan Late'],
    hourlyRate: 1000,
  },
];

// =============================================================================
// FEBRUARY 2026 SCHEDULE
// =============================================================================

interface ScheduleEntry {
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  venue: 'NOBU' | 'Le Du Kaan';
  slot: string | null;
  startTime: string;
  endTime: string;
  djStageName: string;
}

// Weekly recurring schedule
const WEEKLY_SCHEDULE: ScheduleEntry[] = [
  // Monday
  { dayOfWeek: 1, venue: 'NOBU', slot: null, startTime: '20:00', endTime: '24:00', djStageName: 'RabbitDisco' },
  { dayOfWeek: 1, venue: 'Le Du Kaan', slot: 'Early', startTime: '18:00', endTime: '21:00', djStageName: 'Benji' },
  { dayOfWeek: 1, venue: 'Le Du Kaan', slot: 'Late', startTime: '21:00', endTime: '24:00', djStageName: 'DJ Pound' },

  // Tuesday
  { dayOfWeek: 2, venue: 'NOBU', slot: null, startTime: '20:00', endTime: '24:00', djStageName: 'Benji' },
  { dayOfWeek: 2, venue: 'Le Du Kaan', slot: 'Early', startTime: '18:00', endTime: '21:00', djStageName: 'Tom FKG' },
  { dayOfWeek: 2, venue: 'Le Du Kaan', slot: 'Late', startTime: '21:00', endTime: '24:00', djStageName: 'Yui Truluv' },

  // Wednesday
  { dayOfWeek: 3, venue: 'NOBU', slot: null, startTime: '20:00', endTime: '24:00', djStageName: 'Izaar' },
  { dayOfWeek: 3, venue: 'Le Du Kaan', slot: 'Early', startTime: '18:00', endTime: '21:00', djStageName: 'DJ Enjoy' },
  { dayOfWeek: 3, venue: 'Le Du Kaan', slot: 'Late', startTime: '21:00', endTime: '24:00', djStageName: 'Manymaur' },

  // Thursday
  { dayOfWeek: 4, venue: 'NOBU', slot: null, startTime: '20:00', endTime: '24:00', djStageName: 'Linze' },
  { dayOfWeek: 4, venue: 'Le Du Kaan', slot: 'Early', startTime: '18:00', endTime: '21:00', djStageName: 'DJ Furry' },
  { dayOfWeek: 4, venue: 'Le Du Kaan', slot: 'Late', startTime: '21:00', endTime: '24:00', djStageName: 'Yui Truluv' },

  // Friday
  { dayOfWeek: 5, venue: 'NOBU', slot: null, startTime: '20:00', endTime: '24:00', djStageName: 'DJ Mint' },
  { dayOfWeek: 5, venue: 'Le Du Kaan', slot: 'Early', startTime: '18:00', endTime: '21:00', djStageName: 'DJ Pound' },
  { dayOfWeek: 5, venue: 'Le Du Kaan', slot: 'Late', startTime: '21:00', endTime: '24:00', djStageName: 'UFO' },

  // Saturday
  { dayOfWeek: 6, venue: 'NOBU', slot: null, startTime: '20:00', endTime: '24:00', djStageName: 'Vita' },
  { dayOfWeek: 6, venue: 'Le Du Kaan', slot: 'Early', startTime: '18:00', endTime: '21:00', djStageName: 'Yui Truluv' },
  { dayOfWeek: 6, venue: 'Le Du Kaan', slot: 'Late', startTime: '21:00', endTime: '24:00', djStageName: 'Scotty B' },

  // Sunday
  { dayOfWeek: 0, venue: 'NOBU', slot: null, startTime: '20:00', endTime: '24:00', djStageName: 'UFO' },
  { dayOfWeek: 0, venue: 'Le Du Kaan', slot: 'Early', startTime: '18:00', endTime: '21:00', djStageName: 'Tom FKG' },
  { dayOfWeek: 0, venue: 'Le Du Kaan', slot: 'Late', startTime: '21:00', endTime: '24:00', djStageName: 'Yui Truluv' },
];

// Special date exceptions for February 2026
interface ScheduleException {
  date: string; // YYYY-MM-DD
  venue: 'NOBU' | 'Le Du Kaan';
  slot: string | null;
  djStageName: string;
  reason: string;
}

const SCHEDULE_EXCEPTIONS: ScheduleException[] = [
  // Feb 2 (Mon): DJ Furry at LDK Early (instead of Benji)
  { date: '2026-02-02', venue: 'Le Du Kaan', slot: 'Early', djStageName: 'DJ Furry', reason: 'Cover' },

  // Feb 11 (Wed): Mizuyo at LDK Early (instead of DJ Enjoy)
  { date: '2026-02-11', venue: 'Le Du Kaan', slot: 'Early', djStageName: 'Mizuyo', reason: 'Guest DJ' },

  // Feb 14 (Sat): Mizuyo at LDK Early (instead of Yui Truluv), DJ Pound at LDK Late (Scotty B away)
  { date: '2026-02-14', venue: 'Le Du Kaan', slot: 'Early', djStageName: 'Mizuyo', reason: 'Valentine\'s Day' },
  { date: '2026-02-14', venue: 'Le Du Kaan', slot: 'Late', djStageName: 'DJ Pound', reason: 'Valentine\'s Day - Scotty B away' },

  // Feb 15 (Sun): Mizuyo at LDK Early (instead of Tom FKG)
  { date: '2026-02-15', venue: 'Le Du Kaan', slot: 'Early', djStageName: 'Mizuyo', reason: 'Guest DJ' },

  // Feb 18 (Wed): DJ Furry at LDK Early (instead of DJ Enjoy)
  { date: '2026-02-18', venue: 'Le Du Kaan', slot: 'Early', djStageName: 'DJ Furry', reason: 'Cover' },

  // Feb 21 (Sat): DJ Pound at LDK Late (Scotty B away)
  { date: '2026-02-21', venue: 'Le Du Kaan', slot: 'Late', djStageName: 'DJ Pound', reason: 'Scotty B away' },

  // Feb 25 (Wed): Mizuyo at LDK Early (instead of DJ Enjoy)
  { date: '2026-02-25', venue: 'Le Du Kaan', slot: 'Early', djStageName: 'Mizuyo', reason: 'Guest DJ' },
];

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================

async function main() {
  console.log('🌱 Starting NOBU & Le Du Kaan seed...\n');

  // Check if Clerk IDs have been configured
  if (CLERK_USER_IDS.corporate.includes('REPLACE')) {
    console.error('❌ ERROR: Please update CLERK_USER_IDS in the seed file with actual Clerk user IDs');
    console.error('   See VENUE_PORTAL_SETUP.md for instructions on creating Clerk users');
    process.exit(1);
  }

  // ==========================================================================
  // Step 1: Create or update User for Corporate account
  // ==========================================================================
  console.log('📝 Creating/updating corporate user...');

  const corporateUser = await prisma.user.upsert({
    where: { id: CLERK_USER_IDS.corporate },
    update: {
      name: 'TGC Hotel Collection',
      firstName: 'Dan',
      lastName: 'Jamme',
    },
    create: {
      id: CLERK_USER_IDS.corporate,
      email: 'dan.jamme@marriott.com',
      name: 'TGC Hotel Collection',
      firstName: 'Dan',
      lastName: 'Jamme',
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
      companyName: 'TGC Hotel Collection Co., Ltd.',
      contactPerson: 'Dan Jamme',
      position: 'Multi Restaurants GM',
    },
    create: {
      userId: corporateUser.id,
      companyName: 'TGC Hotel Collection Co., Ltd.',
      contactPerson: 'Dan Jamme',
      position: 'Multi Restaurants GM',
      venueType: 'Restaurant',
      numberOfVenues: 2,
    },
  });
  console.log(`   ✓ Corporate: ${corporate.companyName}`);

  // ==========================================================================
  // Step 3: Create Venues
  // ==========================================================================
  console.log('🏪 Creating/updating venues...');

  const nobuVenue = await prisma.venue.upsert({
    where: {
      id: 'nobu-bangkok-venue',
    },
    update: {
      name: 'NOBU',
      operatingHours: { startTime: '20:00', endTime: '24:00' },
    },
    create: {
      id: 'nobu-bangkok-venue',
      corporateId: corporate.id,
      name: 'NOBU',
      address: 'Bangkok, Thailand',
      city: 'Bangkok',
      venueType: 'Restaurant',
      operatingHours: { startTime: '20:00', endTime: '24:00' },
      contactPerson: 'Leila',
      isActive: true,
    },
  });
  console.log(`   ✓ Venue: ${nobuVenue.name}`);

  const leDuKaanVenue = await prisma.venue.upsert({
    where: {
      id: 'le-du-kaan-venue',
    },
    update: {
      name: 'Le Du Kaan',
      operatingHours: { startTime: '18:00', endTime: '24:00', slots: ['Early', 'Late'] },
    },
    create: {
      id: 'le-du-kaan-venue',
      corporateId: corporate.id,
      name: 'Le Du Kaan',
      address: 'Bangkok, Thailand',
      city: 'Bangkok',
      venueType: 'Restaurant',
      operatingHours: { startTime: '18:00', endTime: '24:00', slots: ['Early', 'Late'] },
      contactPerson: 'Terry',
      isActive: true,
    },
  });
  console.log(`   ✓ Venue: ${leDuKaanVenue.name}`);

  // ==========================================================================
  // Step 4: Create DJ Artists
  // ==========================================================================
  console.log('🎧 Creating/updating DJ artists...');

  const artistMap: Record<string, string> = {}; // stageName -> artistId

  for (const dj of DJ_PROFILES) {
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
        minimumHours: 3,
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
  // Step 5: Create February 2026 Schedule Assignments
  // ==========================================================================
  console.log('📅 Creating February 2026 schedule assignments...');

  // Get all days in February 2026
  // Use Date.UTC with noon to avoid timezone boundary issues
  // (local midnight can shift to previous day when converted to UTC)
  const february2026Days: Date[] = [];
  for (let day = 1; day <= 28; day++) {
    february2026Days.push(new Date(Date.UTC(2026, 1, day, 12, 0, 0))); // Noon UTC
  }

  let assignmentCount = 0;

  for (const date of february2026Days) {
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split('T')[0];

    // Get regular schedule for this day
    const daySchedule = WEEKLY_SCHEDULE.filter(s => s.dayOfWeek === dayOfWeek);

    for (const entry of daySchedule) {
      // Check for exceptions
      const exception = SCHEDULE_EXCEPTIONS.find(
        e => e.date === dateStr &&
             e.venue === entry.venue &&
             e.slot === entry.slot
      );

      const djStageName = exception ? exception.djStageName : entry.djStageName;
      const artistId = artistMap[djStageName];

      if (!artistId) {
        console.warn(`   ⚠️ Artist not found: ${djStageName}`);
        continue;
      }

      const venueId = entry.venue === 'NOBU' ? nobuVenue.id : leDuKaanVenue.id;

      // Create unique assignment ID
      const assignmentId = `assignment-${dateStr}-${venueId}-${entry.slot || 'main'}`;

      try {
        await prisma.venueAssignment.upsert({
          where: { id: assignmentId },
          update: {
            artistId,
            startTime: entry.startTime,
            endTime: entry.endTime,
            notes: exception?.reason,
          },
          create: {
            id: assignmentId,
            venueId,
            artistId,
            date: date,
            startTime: entry.startTime,
            endTime: entry.endTime,
            slot: entry.slot,
            status: date < new Date() ? VenueAssignmentStatus.COMPLETED : VenueAssignmentStatus.SCHEDULED,
            notes: exception?.reason,
          },
        });
        assignmentCount++;
      } catch (error) {
        // Handle unique constraint violations gracefully
        console.warn(`   ⚠️ Assignment already exists: ${dateStr} ${entry.venue} ${entry.slot || ''}`);
      }
    }
  }

  console.log(`   ✓ Created ${assignmentCount} assignments`);

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log('\n✅ Seed completed successfully!\n');
  console.log('Summary:');
  console.log(`   - 1 Corporate account (TGC Hotel Collection)`);
  console.log(`   - 2 Venues (NOBU, Le Du Kaan)`);
  console.log(`   - ${DJ_PROFILES.length} DJ profiles`);
  console.log(`   - ${assignmentCount} schedule assignments for February 2026`);
  console.log('\n📋 Next steps:');
  console.log('   1. Create Clerk users (see VENUE_PORTAL_SETUP.md)');
  console.log('   2. Update CLERK_USER_IDS in this file');
  console.log('   3. Run this seed script again');
  console.log('   4. Test login at /venue-portal');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
