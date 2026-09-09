import type { Prisma } from '@prisma/client'
import { sanitizePublicArtistBio } from './public-artist-bio'

/** Shared boundary for anonymous artist discovery; never select the full row. */
export const publicArtistWhere = {
  isVisible: true,
  user: { isActive: true },
} satisfies Prisma.ArtistWhereInput

export const publicArtistSelect = {
  id: true,
  stageName: true,
  category: true,
  subCategories: true,
  bio: true,
  bioTh: true,
  baseCity: true,
  serviceAreas: true,
  languages: true,
  genres: true,
  profileImage: true,
  coverImage: true,
  images: true,
  videos: true,
  audioSamples: true,
  website: true,
  facebook: true,
  instagram: true,
  tiktok: true,
  youtube: true,
  spotify: true,
  soundcloud: true,
  mixcloud: true,
  startingRate: true,
  currency: true,
  averageRating: true,
  totalBookings: true,
  completedBookings: true,
} satisfies Prisma.ArtistSelect

type PublicArtistRow = Prisma.ArtistGetPayload<{ select: typeof publicArtistSelect }>

/** Explicit output projection also protects callers that supply extra fields. */
export function serializePublicArtist(artist: PublicArtistRow) {
  return {
    id: artist.id,
    stageName: artist.stageName,
    category: artist.category,
    subCategories: artist.subCategories,
    bio: sanitizePublicArtistBio(artist.bio),
    bioTh: sanitizePublicArtistBio(artist.bioTh),
    baseCity: artist.baseCity,
    serviceAreas: artist.serviceAreas,
    languages: artist.languages,
    genres: artist.genres,
    profileImage: artist.profileImage,
    coverImage: artist.coverImage,
    images: artist.images,
    videos: artist.videos,
    audioSamples: artist.audioSamples,
    website: artist.website,
    facebook: artist.facebook,
    instagram: artist.instagram,
    tiktok: artist.tiktok,
    youtube: artist.youtube,
    spotify: artist.spotify,
    soundcloud: artist.soundcloud,
    mixcloud: artist.mixcloud,
    startingRate: artist.startingRate === null ? null : Number(artist.startingRate),
    currency: artist.currency,
    averageRating: artist.averageRating,
    totalBookings: artist.totalBookings,
    completedBookings: artist.completedBookings,
    // Retain legacy response keys without disclosing internal operations pricing.
    hourlyRate: null,
    minimumHours: null,
  }
}

export const publicReviewSelect = {
  id: true,
  rating: true,
  comment: true,
  commentTh: true,
  punctuality: true,
  performance: true,
  professionalism: true,
  valueForMoney: true,
  isVerified: true,
  createdAt: true,
  artistResponse: true,
  respondedAt: true,
} satisfies Prisma.ReviewSelect

type PublicReviewRow = Prisma.ReviewGetPayload<{ select: typeof publicReviewSelect }>

export function serializePublicReview(review: PublicReviewRow) {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    commentTh: review.commentTh,
    punctuality: review.punctuality,
    performance: review.performance,
    professionalism: review.professionalism,
    valueForMoney: review.valueForMoney,
    isVerified: review.isVerified,
    createdAt: review.createdAt,
    artistResponse: review.artistResponse,
    respondedAt: review.respondedAt,
  }
}

export const publicAvailabilitySelect = {
  date: true,
  startTime: true,
  endTime: true,
  timezone: true,
  status: true,
} satisfies Prisma.AvailabilitySelect

type PublicAvailabilityRow = Prisma.AvailabilityGetPayload<{ select: typeof publicAvailabilitySelect }>

export function serializePublicAvailability(slot: PublicAvailabilityRow) {
  return {
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    timezone: slot.timezone,
    status: slot.status,
  }
}
