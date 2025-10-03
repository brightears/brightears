import { PrismaClient, BookingStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Sample review templates for different categories
const reviewTemplates = {
  DJ: [
    "Amazing DJ! Kept the dance floor packed all night long. Great mix of music and perfect reading of the crowd.",
    "Absolutely fantastic! The music selection was perfect and the transitions were seamless. Highly recommend!",
    "Professional and talented DJ. Arrived early, set up quickly, and delivered an incredible performance.",
    "Best DJ we've ever hired! The energy was incredible and everyone had a great time. Will definitely book again.",
    "Outstanding performance! Great communication before the event and delivered exactly what we wanted."
  ],
  BAND: [
    "Incredible band! Their energy was contagious and they had everyone dancing. Perfect for our event!",
    "Professional musicians with amazing talent. They played all our requested songs perfectly.",
    "The band was the highlight of our event! Great stage presence and wonderful interaction with guests.",
    "Exceeded all expectations! The sound quality was excellent and their repertoire was impressive.",
    "Fantastic live music! They created the perfect atmosphere for our celebration."
  ],
  SINGER: [
    "Beautiful voice and amazing stage presence! Our guests were mesmerized by the performance.",
    "Truly talented singer who brought so much emotion to every song. It was magical!",
    "Professional, punctual, and incredibly talented. The acoustic set was perfect for our event.",
    "What a voice! They sang everything from classics to modern hits perfectly. Highly recommended!",
    "Outstanding performer! Connected beautifully with the audience and made our event special."
  ]
}

const thailandCities = ['Bangkok', 'Pattaya', 'Phuket', 'Chiang Mai', 'Hua Hin', 'Koh Samui']
const venueTypes = [
  'Marriott Hotel Bangkok',
  'Centara Grand',
  'The Peninsula Bangkok',
  'Anantara Riverside',
  'W Hotel Bangkok',
  'Siam Kempinski',
  'Mandarin Oriental',
  'Four Seasons Resort',
  'InterContinental Bangkok',
  'Hilton Sukhumvit'
]

const eventTypes = [
  'Corporate Event',
  'Wedding Reception',
  'Birthday Party',
  'Anniversary Celebration',
  'Product Launch',
  'Gala Dinner',
  'Private Party',
  'Hotel Event',
  'Company Party',
  'New Year Celebration'
]

async function seedFeaturedArtistReviews() {
  console.log('🌱 Seeding reviews for featured artists...\n')
  console.log('=' .repeat(80))

  try {
    // Get featured artists (VERIFIED or TRUSTED) without reviews
    const featuredArtists = await prisma.artist.findMany({
      where: {
        verificationLevel: {
          in: ['VERIFIED', 'TRUSTED']
        }
      },
      include: {
        reviews: true,
        bookings: true,
        user: true
      }
    })

    console.log(`Found ${featuredArtists.length} featured artists\n`)

    // Create sample customers if needed
    const existingCustomers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER'
      },
      take: 10
    })

    let sampleCustomers = existingCustomers

    if (existingCustomers.length < 5) {
      console.log('Creating sample customers...')

      const customerPromises = []
      for (let i = 0; i < 5; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()

        customerPromises.push(
          prisma.user.create({
            data: {
              email: faker.internet.email({ firstName, lastName }).toLowerCase(),
              firstName,
              lastName,
              name: `${firstName} ${lastName}`,
              role: 'CUSTOMER',
              isActive: true,
              customer: {
                create: {
                  firstName,
                  lastName,
                  location: faker.helpers.arrayElement(thailandCities)
                }
              }
            }
          })
        )
      }

      const newCustomers = await Promise.all(customerPromises)
      sampleCustomers = [...existingCustomers, ...newCustomers]
      console.log(`Created ${newCustomers.length} sample customers\n`)
    }

    // Process each featured artist
    for (const artist of featuredArtists) {
      const artistReviewCount = artist.reviews.length

      if (artistReviewCount === 0) {
        console.log(`\n📝 Adding reviews for: ${artist.stageName}`)
        console.log(`   Category: ${artist.category}`)
        console.log(`   Current reviews: ${artistReviewCount}`)

        // Determine number of reviews to create (3-5)
        const reviewCount = faker.number.int({ min: 3, max: 5 })

        const reviewsCreated = []

        for (let i = 0; i < reviewCount; i++) {
          // Select a random customer
          const customer = faker.helpers.arrayElement(sampleCustomers)

          // Check if this customer already reviewed this artist
          const existingReview = await prisma.review.findFirst({
            where: {
              artistId: artist.id,
              reviewerId: customer.id
            }
          })

          if (existingReview) {
            continue // Skip if already reviewed
          }

          // Create a completed booking first (reviews require bookings)
          const eventDate = faker.date.past({ years: 1 })
          const booking = await prisma.booking.create({
            data: {
              customerId: customer.id,
              artistId: artist.id,
              eventType: faker.helpers.arrayElement(eventTypes),
              eventDate,
              startTime: eventDate,
              endTime: new Date(eventDate.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
              duration: 4,
              venue: faker.helpers.arrayElement(venueTypes),
              venueAddress: `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(thailandCities)}, Thailand`,
              guestCount: faker.number.int({ min: 50, max: 300 }),
              quotedPrice: artist.hourlyRate || faker.number.int({ min: 5000, max: 20000 }),
              finalPrice: artist.hourlyRate || faker.number.int({ min: 5000, max: 20000 }),
              status: BookingStatus.COMPLETED,
              completedAt: new Date(eventDate.getTime() + 24 * 60 * 60 * 1000) // Day after event
            }
          })

          // Create the review
          const categoryTemplates = reviewTemplates[artist.category as keyof typeof reviewTemplates] || reviewTemplates.DJ
          const reviewText = faker.helpers.arrayElement(categoryTemplates)

          // Generate ratings (skewed towards positive)
          const overallRating = faker.helpers.weightedArrayElement([
            { value: 5, weight: 50 },
            { value: 4, weight: 35 },
            { value: 3, weight: 10 },
            { value: 2, weight: 3 },
            { value: 1, weight: 2 }
          ])

          const review = await prisma.review.create({
            data: {
              bookingId: booking.id,
              reviewerId: customer.id,
              artistId: artist.id,
              rating: overallRating,
              comment: reviewText,
              punctuality: faker.number.int({ min: overallRating - 1, max: 5 }),
              performance: faker.number.int({ min: overallRating - 1, max: 5 }),
              professionalism: faker.number.int({ min: overallRating - 1, max: 5 }),
              valueForMoney: faker.number.int({ min: overallRating - 1, max: 5 }),
              isVerified: true,
              isPublic: true,
              createdAt: new Date(booking.completedAt!.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000)
            }
          })

          reviewsCreated.push(review)
          console.log(`   ✅ Added review #${i + 1}: ${overallRating} stars`)
        }

        // Update artist's average rating and completed bookings count
        const allReviews = await prisma.review.findMany({
          where: { artistId: artist.id }
        })

        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

        await prisma.artist.update({
          where: { id: artist.id },
          data: {
            averageRating: parseFloat(avgRating.toFixed(1)),
            completedBookings: artist.completedBookings + reviewsCreated.length
          }
        })

        console.log(`   📊 New average rating: ${avgRating.toFixed(1)} (${allReviews.length} reviews)`)
      } else {
        console.log(`\n✓ ${artist.stageName} already has ${artistReviewCount} reviews - skipping`)
      }
    }

    // Summary
    console.log('\n' + '=' .repeat(80))
    console.log('📊 SEEDING COMPLETE\n')

    // Re-audit to show improvements
    const updatedArtists = await prisma.artist.findMany({
      where: {
        verificationLevel: {
          in: ['VERIFIED', 'TRUSTED']
        }
      },
      include: {
        reviews: true
      }
    })

    console.log('Featured Artists Status:')
    updatedArtists.forEach(artist => {
      const status = artist.reviews.length > 0 ? '✅' : '⚠️'
      console.log(`${status} ${artist.stageName}: ${artist.reviews.length} reviews, ${artist.averageRating || 0} rating`)
    })

  } catch (error) {
    console.error('Error seeding reviews:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding if called directly
if (require.main === module) {
  seedFeaturedArtistReviews()
    .then(() => {
      console.log('\n✅ Review seeding complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedFeaturedArtistReviews }