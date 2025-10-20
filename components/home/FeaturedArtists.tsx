'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'
import Image from 'next/image'
import RatingStars from '@/components/ui/RatingStars'
import VerificationBadge from '@/components/ui/VerificationBadge'
import QuickBookingButton from '@/components/booking/QuickBookingButton'
import CardSkeleton from '@/components/ui/CardSkeleton'

interface FeaturedArtist {
  id: string
  stageName: string
  category: string
  baseCity: string
  hourlyRate?: number
  profileImage?: string
  averageRating?: number
  reviewCount?: number
  totalBookings: number
  completedBookings?: number
  verificationLevel: string
  recentVenue?: string
  isAvailable?: boolean
}

interface FeaturedArtistsProps {
  locale: string
}

export default function FeaturedArtists({ locale }: FeaturedArtistsProps) {
  const t = useTranslations('home')
  const [artists, setArtists] = useState<FeaturedArtist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedArtists()
  }, [])

  const fetchFeaturedArtists = async () => {
    try {
      // Fetch top artists sorted by verification level, rating, and bookings
      // This matches the "featured" sort order in the API
      const response = await fetch('/api/artists?limit=6&sort=featured')

      if (!response.ok) {
        console.error('Failed to fetch featured artists:', response.status, response.statusText)
        // Still set loading to false even on error
        setLoading(false)
        return
      }

      const data = await response.json()

      // Log for debugging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Featured artists fetched:', data.artists?.length || 0, 'artists')
      }

      setArtists(data.artists || [])
    } catch (error) {
      console.error('Error fetching featured artists:', error)
      // Ensure loading is set to false even on error
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return t('featuredArtists.priceOnRequest')
    return `${t('featuredArtists.startingFrom')} ฿${price.toLocaleString()}/hr`
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'DJ': '🎧',
      'BAND': '🎵',
      'SINGER': '🎤',
      'MUSICIAN': '🎹',
      'MC': '🎙️',
      'COMEDIAN': '😄',
      'MAGICIAN': '🎩',
      'DANCER': '💃',
      'PHOTOGRAPHER': '📸',
      'SPEAKER': '🗣️'
    }
    return icons[category as keyof typeof icons] || '🎵'
  }

  if (loading) {
    return (
      <section className="bg-off-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair font-bold text-3xl text-deep-teal sm:text-4xl mb-4">
              {t('featuredArtists.title')}
            </h2>
            <div className="w-24 h-1 bg-brand-cyan mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton
                key={i}
                layout="featured"
                animated={true}
                animationDelay={i * 150}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Empty state if no artists found
  if (!artists || artists.length === 0) {
    return (
      <section className="bg-off-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair font-bold text-3xl text-deep-teal sm:text-4xl mb-4">
              {t('featuredArtists.title')}
            </h2>
            <div className="w-24 h-1 bg-brand-cyan mx-auto mb-6"></div>
          </div>

          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-dark-gray/70 text-lg mb-6">
              {t('featuredArtists.noArtistsFound') || 'No featured artists available at the moment.'}
            </p>
            <Link
              href="/artists"
              className="inline-flex items-center space-x-2 bg-brand-cyan text-pure-white px-6 py-3 rounded-lg font-medium hover:bg-brand-cyan/90 transition-colors"
            >
              <span>{t('featuredArtists.browseAllArtists') || 'Browse All Artists'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-off-white py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl text-brand-cyan">♪</div>
        <div className="absolute top-32 right-20 text-4xl text-deep-teal">♫</div>
        <div className="absolute bottom-20 left-1/4 text-5xl text-earthy-brown">♪</div>
        <div className="absolute bottom-32 right-1/3 text-3xl text-soft-lavender">♫</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair font-bold text-3xl text-deep-teal sm:text-4xl mb-4">
            {t('featuredArtists.title')}
          </h2>
          <div className="w-24 h-1 bg-brand-cyan mx-auto mb-6"></div>
          <p className="text-dark-gray/80 max-w-2xl mx-auto text-lg">
            {t('featuredArtists.subtitle')}
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              className="bg-pure-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 overflow-hidden group relative artist-card transform hover:scale-[1.02] hover:-translate-y-1"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0
              }}
            >
              {/* Featured Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-soft-lavender text-pure-white text-xs px-2 py-1 rounded-full font-medium">
                  ⭐ {t('featuredArtists.featured')}
                </span>
              </div>

              {/* Availability Indicator */}
              {artist.isAvailable && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center space-x-1 bg-green-500 text-pure-white text-xs px-2 py-1 rounded-full animate-live-pulse">
                    <div className="w-2 h-2 bg-pure-white rounded-full animate-live-pulse"></div>
                    <span>{t('featuredArtists.available')}</span>
                  </div>
                </div>
              )}

              {/* Artist Image */}
              <div className="relative h-64 bg-gray-200">
                {artist.profileImage ? (
                  <Image
                    src={artist.profileImage}
                    alt={artist.stageName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-cyan/20 to-deep-teal/20">
                    <div className="text-6xl text-brand-cyan/60">
                      {getCategoryIcon(artist.category)}
                    </div>
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                {/* Quick book button on hover */}
                <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <QuickBookingButton
                      artist={{
                        id: artist.id,
                        stageName: artist.stageName,
                        category: artist.category,
                        baseCity: artist.baseCity,
                        hourlyRate: artist.hourlyRate,
                        profileImage: artist.profileImage,
                        averageRating: artist.averageRating,
                        isAvailable: artist.isAvailable
                      }}
                      variant="primary"
                      size="md"
                      className="w-full shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Artist Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-playfair font-bold text-xl text-deep-teal mb-1">
                      {artist.stageName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-dark-gray/70">
                      <span>{getCategoryIcon(artist.category)}</span>
                      <span className="capitalize">{artist.category.toLowerCase()}</span>
                      <span>•</span>
                      <span>📍 {artist.baseCity}</span>
                    </div>
                  </div>
                  <VerificationBadge level={artist.verificationLevel as any} />
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-3 mb-3">
                  {artist.reviewCount && artist.reviewCount > 0 ? (
                    <>
                      <RatingStars rating={artist.averageRating || 0} />
                      <span className="text-sm text-dark-gray/70">
                        {artist.averageRating?.toFixed(1)} ({artist.reviewCount} {artist.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold rounded-full">
                        New Artist
                      </span>
                      {artist.completedBookings && artist.completedBookings > 0 ? (
                        <span className="text-sm text-dark-gray/60">
                          {artist.completedBookings} completed {artist.completedBookings === 1 ? 'event' : 'events'}
                        </span>
                      ) : (
                        <span className="text-sm text-dark-gray/50 italic">
                          Available for bookings
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                {artist.recentVenue && (
                  <div className="bg-brand-cyan/5 rounded-lg p-3 mb-4">
                    <p className="text-xs text-brand-cyan font-medium">
                      💼 {t('featuredArtists.recentlyPerformed')} {artist.recentVenue}
                    </p>
                  </div>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-gray/60 mb-1 group-hover:text-brand-cyan transition-colors duration-300">Starting from</p>
                    <p className="font-bold text-earthy-brown group-hover:text-brand-cyan transition-colors duration-300 animate-count-up">
                      {formatPrice(artist.hourlyRate)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/artists/${artist.id}`}
                      className="px-4 py-2 text-sm border border-brand-cyan text-brand-cyan rounded-lg hover:bg-brand-cyan hover:text-pure-white transition-colors"
                    >
                      {t('featuredArtists.viewProfile')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Artists CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/artists"
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-cyan to-brand-cyan/80 text-pure-white px-8 py-4 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <span className="text-base sm:text-lg">{t('featuredArtists.viewAllArtists')}</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .artist-card {
            max-width: 100%;
          }
        }

        /* Glass morphism enhancement */
        .artist-card {
          box-shadow:
            0 8px 32px 0 rgba(47, 99, 100, 0.08),
            0 2px 8px 0 rgba(0, 187, 228, 0.05);
        }

        .artist-card:hover {
          box-shadow:
            0 20px 48px 0 rgba(47, 99, 100, 0.15),
            0 4px 16px 0 rgba(0, 187, 228, 0.1);
        }
      `}</style>
    </section>
  )
}