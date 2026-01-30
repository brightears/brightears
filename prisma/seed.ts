import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'
import { ArtistCategory, BookingStatus } from '@prisma/client'

// Thai cities for realistic data
const THAI_CITIES = ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Hua Hin', 'Koh Samui', 'Krabi']

// Artist categories
const CATEGORIES = ['SINGER', 'DJ', 'BAND', 'DANCER', 'MAGICIAN', 'COMEDIAN', 'MC']

// Sample Thai and English names
const THAI_STAGE_NAMES = [
  'DJ Boom Bangkok', 'Neon Tiger', 'Bangkok Nights', 'Temple Bass',
  'Mango Groove', 'Sunset Sessions', 'River Flow Band', 'Lotus Dreams',
  'Thai Vibes', 'Spicy Beats', 'Moonlight Orchestra', 'Paradise DJ', 'Urban Monkey'
]

const REAL_NAMES = [
  'Somchai Jaidee', 'Nattapong Srisawat', 'Kamon Thongkham', 'Siriporn Kaewsai',
  'Thanapon Suksamran', 'Preecha Boonmee', 'Wanchai Phongsri', 'Malee Somboon',
  'Thanawat Chaiyo', 'Sirinya Rattana', 'Prasert Wongsawat', 'Noppadol Saetang'
]

// Music genres
const GENRES: Record<string, string[]> = {
  DJ: ['House', 'Techno', 'Hip-Hop', 'EDM', 'Trance', 'Drum & Bass'],
  SINGER: ['Pop', 'Rock', 'Jazz', 'R&B', 'Country', 'Folk', 'Soul'],
  BAND: ['Rock', 'Pop', 'Jazz', 'Funk', 'Indie', 'Alternative'],
  DANCER: ['Contemporary', 'Hip-Hop', 'Traditional Thai', 'Ballet', 'Jazz'],
  MAGICIAN: ['Close-up', 'Stage', 'Mentalism', 'Comedy Magic'],
  COMEDIAN: ['Stand-up', 'Improv', 'Sketch', 'Musical Comedy'],
  MC: ['Corporate', 'Wedding', 'Festival', 'Bilingual']
}

// Sample bios
const BIOS: Record<string, string[]> = {
  DJ: [
    "International DJ with 10+ years experience in Bangkok's hottest clubs. Specializing in house and techno that keeps the dance floor moving all night.",
    "Award-winning DJ bringing the best of electronic music to Thailand. From underground raves to luxury hotels, I create unforgettable experiences.",
    "Your party deserves the perfect soundtrack. With extensive experience in weddings, corporate events, and festivals across Southeast Asia."
  ],
  SINGER: [
    "Professional vocalist with a passion for bringing emotion to every performance. From intimate gatherings to grand stages.",
    "Bilingual singer specializing in both Thai and English hits. Perfect for international events and diverse audiences.",
    "Jazz and soul vocalist with a voice that captivates. Available for weddings, corporate events, and special occasions."
  ],
  BAND: [
    "High-energy 5-piece band ready to rock your event. We play everything from classic rock to modern pop hits.",
    "Professional wedding band with over 500 successful events. We read the crowd and keep the party going.",
    "Versatile band offering acoustic sets for ceremonies and full electric performances for receptions."
  ],
  DANCER: [
    "Professional dance troupe specializing in traditional Thai and contemporary fusion performances.",
    "Award-winning dancers bringing energy and excitement to corporate events and festivals.",
    "Elegant performances that blend modern choreography with cultural elements."
  ],
  MAGICIAN: [
    "Mind-bending close-up magic that leaves guests amazed. Perfect for cocktail hours and intimate gatherings.",
    "Grand illusions and comedy magic for all ages. Making your event magical and memorable.",
    "Corporate magician specializing in team building and interactive performances."
  ],
  COMEDIAN: [
    "Stand-up comedian with a fresh perspective on life in Thailand. Clean comedy suitable for corporate events.",
    "Bilingual comedian bridging cultures with humor. Perfect for international audiences.",
    "Interactive comedy that gets everyone laughing. Customized material for your special event."
  ],
  MC: [
    "Professional bilingual MC with experience in corporate events, weddings, and product launches.",
    "Energetic host who keeps your event flowing smoothly. From conferences to celebrations.",
    "Experienced emcee bringing professionalism and personality to your special occasion."
  ]
}

// Sample images (using placeholder URLs)
const PROFILE_IMAGES = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
  'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400',
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
  'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=400',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400'
]

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200',
  'https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200',
  'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200'
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.booking.deleteMany()
  await prisma.review.deleteMany()
  await prisma.artist.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.corporate.deleteMany()
  await prisma.user.deleteMany()

  console.log('👥 Creating test users and artists...')

  // Create test artists
  const artists = []
  for (let i = 0; i < 15; i++) {
    const category = CATEGORIES[i % CATEGORIES.length] as ArtistCategory
    const email = `artist${i + 1}@brightears.test`
    const stageName = THAI_STAGE_NAMES[i] || `Artist ${i + 1}`
    const realName = REAL_NAMES[i % REAL_NAMES.length]
    const baseCity = THAI_CITIES[i % THAI_CITIES.length]
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: await hash('password123', 10),
        firstName: realName.split(' ')[0],
        lastName: realName.split(' ')[1],
        role: 'ARTIST',
        emailVerified: new Date(),
        phone: `+668${Math.floor(10000000 + Math.random() * 90000000)}`,
        phoneVerified: new Date(),
        isPhoneVerified: true,
      }
    })

    // Create artist profile
    const artist = await prisma.artist.create({
      data: {
        userId: user.id,
        stageName,
        realName,
        bio: BIOS[category][i % BIOS[category].length],
        bioTh: 'ศิลปินมืออาชีพพร้อมให้บริการในงานของคุณ', // Generic Thai bio
        category,
        subCategories: GENRES[category] ? GENRES[category].slice(0, 3) : [],
        genres: GENRES[category] ? GENRES[category].slice(0, 3) : [],
        baseCity,
        serviceAreas: [baseCity, ...THAI_CITIES.slice(0, 3)],
        languages: ['en', 'th'],
        hourlyRate: 5000 + (Math.floor(Math.random() * 20) * 500), // 5000-15000 THB
        minimumHours: Math.random() > 0.5 ? 2 : 3,
        profileImage: PROFILE_IMAGES[i % PROFILE_IMAGES.length],
        coverImage: COVER_IMAGES[i % COVER_IMAGES.length],
        images: [
          PROFILE_IMAGES[(i + 1) % PROFILE_IMAGES.length],
          PROFILE_IMAGES[(i + 2) % PROFILE_IMAGES.length],
          PROFILE_IMAGES[(i + 3) % PROFILE_IMAGES.length],
        ],
        // Note: verificationLevel removed - all artists are owner-verified in agency model
        completedBookings: Math.floor(Math.random() * 100),
        totalBookings: Math.floor(Math.random() * 150),
        averageRating: 3.5 + (Math.random() * 1.5), // 3.5-5.0
        // Social media (optional)
        instagram: Math.random() > 0.5 ? `@${stageName.toLowerCase().replace(/\s+/g, '')}` : null,
        facebook: Math.random() > 0.5 ? `facebook.com/${stageName.toLowerCase().replace(/\s+/g, '')}` : null,
        youtube: Math.random() > 0.3 ? `youtube.com/@${stageName.toLowerCase().replace(/\s+/g, '')}` : null,
        lineId: Math.random() > 0.7 ? `@${stageName.toLowerCase().replace(/\s+/g, '')}` : null,
      }
    })

    artists.push({ user, artist })
    console.log(`✅ Created artist: ${stageName} (${category})`)
  }

  // Create a few test customers
  console.log('👤 Creating test customers...')
  
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `customer${i + 1}@brightears.test`,
        password: await hash('password123', 10),
        firstName: `Customer`,
        lastName: `${i + 1}`,
        role: 'CUSTOMER',
        emailVerified: new Date(),
        phone: `+668${Math.floor(10000000 + Math.random() * 90000000)}`,
        phoneVerified: new Date(),
        isPhoneVerified: true,
      }
    })

    await prisma.customer.create({
      data: {
        userId: user.id,
        firstName: `Customer`,
        lastName: `${i + 1}`,
        preferredLanguage: 'en',
        location: THAI_CITIES[i % THAI_CITIES.length],
        favoriteGenres: ['Pop', 'Rock', 'Jazz'].slice(0, Math.floor(Math.random() * 3) + 1),
      }
    })

    console.log(`✅ Created customer: customer${i + 1}@brightears.test`)
  }

  // Create one corporate account
  console.log('🏢 Creating test corporate account...')
  const corporateUser = await prisma.user.create({
    data: {
      email: 'corporate@brightears.test',
      password: await hash('password123', 10),
      firstName: 'Corporate',
      lastName: 'Manager',
      role: 'CORPORATE',
      emailVerified: new Date(),
      phone: '+6681234567',
      phoneVerified: new Date(),
      isPhoneVerified: true,
    }
  })

  await prisma.corporate.create({
    data: {
      userId: corporateUser.id,
      companyName: 'Marriott Hotels Thailand',
      taxId: '0105561234567',
      companyAddress: '123 Sukhumvit Road, Bangkok',
      contactPerson: 'John Smith',
      position: 'Events Manager',
      companyPhone: '+6681234567',
      venueType: 'Hotel',
      numberOfVenues: 5,
      monthlyBudget: 500000,
    }
  })

  console.log('✅ Created corporate account: corporate@brightears.test')

  // Create some sample bookings
  console.log('📅 Creating sample bookings...')
  const customers = await prisma.customer.findMany({ include: { user: true } })
  
  for (let i = 0; i < 10; i++) {
    const artist = artists[Math.floor(Math.random() * artists.length)]
    const customer = customers[Math.floor(Math.random() * customers.length)]
    
    if (!customer) continue

    const eventDate = new Date()
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 60) + 1) // 1-60 days from now
    
    const startTime = new Date(eventDate)
    startTime.setHours(18 + Math.floor(Math.random() * 4), 0, 0, 0) // 6PM-10PM start
    
    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + 3 + Math.floor(Math.random() * 3)) // 3-6 hours duration

    const statuses = ['INQUIRY', 'QUOTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as BookingStatus[]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.userId,
        artistId: artist.artist.id,
        eventDate,
        startTime,
        endTime,
        duration: (endTime.getHours() - startTime.getHours()),
        eventType: ['WEDDING', 'CORPORATE', 'PARTY', 'FESTIVAL'][Math.floor(Math.random() * 4)],
        venue: ['Grand Hyatt', 'Marriott Hotel', 'Beach Club', 'Private Villa'][Math.floor(Math.random() * 4)],
        venueAddress: `${Math.floor(Math.random() * 999) + 1} Sukhumvit Road, Bangkok`,
        guestCount: 50 + Math.floor(Math.random() * 450), // 50-500 guests
        status,
        quotedPrice: status !== 'INQUIRY' ? Number(artist.artist.hourlyRate || 5000) * (endTime.getHours() - startTime.getHours()) : 1000,
        finalPrice: status === 'COMPLETED' ? Number(artist.artist.hourlyRate || 5000) * (endTime.getHours() - startTime.getHours()) : undefined,
        specialRequests: 'Please play some international hits mixed with Thai favorites',
      }
    })
  }

  console.log('✅ Created sample bookings')

  // Create some reviews
  console.log('⭐ Creating sample reviews...')
  const completedBookings = await prisma.booking.findMany({
    where: { status: 'COMPLETED' },
    include: { artist: true, customer: true }
  })

  for (const booking of completedBookings.slice(0, 5)) {
    const rating = Math.floor(4 + Math.random() * 2) // 4-5 stars
    await prisma.review.create({
      data: {
        bookingId: booking.id,
        artistId: booking.artistId,
        reviewerId: booking.customerId,
        rating,
        comment: 'Great performance! Very professional and the crowd loved it.',
        punctuality: Math.floor(4 + Math.random() * 2),
        performance: Math.floor(4 + Math.random() * 2),
        professionalism: Math.floor(4 + Math.random() * 2),
        valueForMoney: Math.floor(3 + Math.random() * 3),
        isVerified: true,
      }
    })
  }

  console.log('✅ Created sample reviews')

  console.log('\n🎉 Database seeding completed!')
  console.log('\n📝 Test Accounts:')
  console.log('Artists: artist1@brightears.test to artist15@brightears.test')
  console.log('Customers: customer1@brightears.test to customer5@brightears.test')
  console.log('Corporate: corporate@brightears.test')
  console.log('Password for all: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })