import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  publicArtistSelect,
  publicAvailabilitySelect,
  publicReviewSelect,
  serializePublicArtist,
  serializePublicAvailability,
  serializePublicReview,
} from '../public-artists'

// Run with: node --import tsx --test lib/__tests__/public-artists.test.ts
const privateSentinel = 'PRIVATE_FINANCE_AND_IDENTITY_SENTINEL'

test('artist response preserves public content without leaking extra database columns', () => {
  const row = {
    id: 'artist-1', stageName: 'Public stage name', category: 'DJ', subCategories: [],
    bio: 'Public biography', bioTh: 'Public Thai biography', baseCity: 'Bangkok',
    serviceAreas: ['Bangkok'], languages: ['en', 'th'], genres: ['House'],
    profileImage: 'https://example.com/profile.jpg', coverImage: null,
    images: ['https://example.com/gallery.jpg'], videos: [], audioSamples: [],
    website: null, facebook: null, instagram: 'https://www.instagram.com/example',
    tiktok: null, youtube: null, spotify: null, soundcloud: null, mixcloud: null,
    startingRate: { toString: () => '1250.50' }, currency: 'THB', averageRating: 4.5,
    totalBookings: 12, completedBookings: 10,
    // Deliberately pass more than the selector permits, including a future column.
    userId: privateSentinel, user: { email: privateSentinel }, realName: privateSentinel,
    contactEmail: privateSentinel, contactPhone: privateSentinel, lineId: privateSentinel,
    workPermitStatus: privateSentinel, taxDocument: privateSentinel,
    hourlyRate: 9876.54, minimumHours: 19,
    venueFeedback: [{ notes: privateSentinel }],
  }
  const result = serializePublicArtist(row as unknown as Parameters<typeof serializePublicArtist>[0])
  assert.equal(result.id, 'artist-1')
  assert.equal(result.bio, 'Public biography')
  assert.deepEqual(result.images, ['https://example.com/gallery.jpg'])
  assert.equal(result.startingRate, 1250.5)
  assert.equal(result.hourlyRate, null)
  assert.equal(result.minimumHours, null)
  assert.equal(JSON.stringify(result).includes(privateSentinel), false)
  assert.equal(JSON.stringify(result).includes('9876.54'), false)
})

test('missing public pricing never falls back to the internal hourly rate', () => {
  const row = { startingRate: null, hourlyRate: 9999 }
  const result = serializePublicArtist(row as unknown as Parameters<typeof serializePublicArtist>[0])
  assert.equal(result.startingRate, null)
  assert.equal(result.hourlyRate, null)
})

test('published review projection excludes reviewer identity and booking details', () => {
  const now = new Date('2026-01-01T00:00:00.000Z')
  const row = {
    id: 'review-1', rating: 5, comment: 'Approved public review', commentTh: null,
    punctuality: 5, performance: 5, professionalism: 5, valueForMoney: 4,
    isVerified: true, createdAt: now, artistResponse: 'Thank you', respondedAt: now,
    reviewerId: privateSentinel, reviewer: { email: privateSentinel },
    bookingId: privateSentinel, booking: { eventType: privateSentinel },
    privateModerationNotes: privateSentinel,
  }
  const result = serializePublicReview(row)
  assert.equal(result.comment, 'Approved public review')
  assert.equal(result.artistResponse, 'Thank you')
  assert.equal(JSON.stringify(result).includes(privateSentinel), false)
})

test('availability projection exposes times without notes, booking identity or price adjustments', () => {
  const now = new Date('2026-01-01T00:00:00.000Z')
  const row = {
    date: now, startTime: now, endTime: now, timezone: 'Asia/Bangkok', status: 'AVAILABLE' as const,
    bookingId: privateSentinel, notes: privateSentinel, requirements: privateSentinel,
    artistId: privateSentinel, priceMultiplier: 9.9, minimumHours: 19,
  }
  const result = serializePublicAvailability(row)
  assert.equal(result.timezone, 'Asia/Bangkok')
  assert.equal(result.status, 'AVAILABLE')
  assert.equal(JSON.stringify(result).includes(privateSentinel), false)
  assert.equal('priceMultiplier' in result, false)
  assert.equal('minimumHours' in result, false)
})

test('public database selectors do not request private identity or finance fields', () => {
  const forbidden = [
    'user', 'userId', 'realName', 'contactEmail', 'contactPhone', 'lineId', 'workPermitStatus',
    'hourlyRate', 'minimumHours', 'venueFeedback', 'documents', 'booking', 'bookingId',
    'reviewer', 'reviewerId', 'notes', 'requirements', 'priceMultiplier',
  ]
  for (const selector of [publicArtistSelect, publicReviewSelect, publicAvailabilitySelect]) {
    for (const key of forbidden) assert.equal(key in selector, false, `${key} must remain private`)
  }
})
