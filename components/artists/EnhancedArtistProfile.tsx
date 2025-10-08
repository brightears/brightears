'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from '@/components/navigation'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import ArtistProfileTabs from './ArtistProfileTabs'
import RatingStars from '@/components/ui/RatingStars'
import QuickInquiryModal from '@/components/booking/QuickInquiryModal'
import VerificationBadge from '@/components/ui/VerificationBadge'
import LineContactButton from '@/components/booking/LineContactButton'
import ProfileSkeleton from '@/components/ui/ProfileSkeleton'
import ImageSkeleton from '@/components/ui/ImageSkeleton'
import HourlyRateDisplay from '@/components/ui/HourlyRateDisplay'
import PopularityIndicator from '@/components/ui/PopularityIndicator'
import TrustSignals from '@/components/sections/TrustSignals'
import TrustBadge from '@/components/ui/TrustBadge'

interface EnhancedArtistProfileProps {
  artistId: string
  locale: string
}

export default function EnhancedArtistProfile({ artistId, locale }: EnhancedArtistProfileProps) {
  const t = useTranslations('artists')
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const router = useRouter()
  const [artist, setArtist] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [profileImageLoaded, setProfileImageLoaded] = useState(false)
  const [profileImageError, setProfileImageError] = useState(false)
  const [coverImageLoaded, setCoverImageLoaded] = useState(false)

  useEffect(() => {
    fetchArtist()
  }, [artistId])

  const fetchArtist = async () => {
    try {
      const response = await fetch(`/api/artists/${artistId}`)
      if (!response.ok) throw new Error('Artist not found')
      const data = await response.json()
      
      // Ensure arrays are initialized
      const artistData = {
        ...data,
        genres: data.genres || [],
        languages: data.languages || [],
        serviceAreas: data.serviceAreas || [],
        reviews: data.reviews || [],
        images: data.images || [],
        videos: data.videos || [],
        audioSamples: data.audioSamples || [],
        availability: data.availability || [],
        subCategories: data.subCategories || []
      }
      setArtist(artistData)
    } catch (err) {
      setError('Failed to load artist profile')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    // Open the Quick Inquiry modal instead of redirecting
    setShowInquiryModal(true)
  }

  const handleFavorite = async () => {
    if (!user) {
      openSignIn({
        fallbackRedirectUrl: window.location.href,
      })
      return
    }
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artist.stageName} on Bright Ears`,
        text: `Check out ${artist.stageName} - ${artist.category} in ${artist.baseCity}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <>
        <ProfileSkeleton
          showHero={true}
          showTabs={true}
          contentSections={4}
        />
        <Footer />
      </>
    )
  }

  if (error || !artist) {
    return (
      <>
        <div className="min-h-screen bg-off-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-playfair text-2xl font-bold text-dark-gray mb-2">
              {error || 'Artist not found'}
            </h2>
            <button
              onClick={() => router.push('/artists')}
              className="text-brand-cyan hover:text-brand-cyan/80"
            >
              Browse all artists
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Enhanced data with sample content for demo
  const sampleMedia = artist.images?.length > 0 || artist.videos?.length > 0 ? 
    [...(artist.images || []).map((url: string, i: number) => ({
      id: `img-${i}`,
      type: 'image' as const,
      url,
      title: `Photo ${i + 1}`
    })),
    ...(artist.videos || []).map((url: string, i: number) => ({
      id: `vid-${i}`,
      type: 'video' as const,
      url,
      title: `Video ${i + 1}`
    }))] : 
    [
      { id: '1', type: 'image' as const, url: 'https://via.placeholder.com/600x400?text=Performance+1', title: 'Live Performance' },
      { id: '2', type: 'image' as const, url: 'https://via.placeholder.com/600x400?text=Event+Photo', title: 'Event Photo' },
      { id: '3', type: 'image' as const, url: 'https://via.placeholder.com/600x400?text=Stage+Setup', title: 'Stage Setup' },
    ]

  const samplePackages = [
    {
      id: '1',
      name: 'Wedding Package',
      description: 'Complete entertainment for your special day',
      price: 25000,
      duration: '4 hours',
      includes: [
        'Professional DJ setup',
        'MC services',
        'Special effects lighting',
        'Unlimited song requests',
        'First dance coordination',
        'Sound system for 200 guests'
      ]
    },
    {
      id: '2',
      name: 'Corporate Event',
      description: 'Professional entertainment for company events',
      price: 15000,
      duration: '3 hours',
      includes: [
        'Professional sound system',
        'Wireless microphones',
        'Background music playlist',
        'Event coordination',
        'Corporate branding on equipment'
      ]
    },
    {
      id: '3',
      name: 'Club Night',
      description: 'High-energy performance for nightclubs',
      price: 10000,
      duration: '2 hours',
      includes: [
        'Premium DJ set',
        'Latest hits and classics',
        'Light coordination',
        'Social media promotion'
      ]
    }
  ]

  const sampleReviews = [
    {
      id: '1',
      rating: 5,
      comment: 'Absolutely amazing! The dance floor was packed all night. Our guests are still talking about how great the music was. Highly professional and accommodating with all our special requests.',
      authorName: 'Sarah Chen',
      date: '2 weeks ago',
      eventType: 'Wedding Reception',
      verified: true
    },
    {
      id: '2',
      rating: 5,
      comment: 'Best DJ we\'ve ever hired for our annual company party. Great energy, perfect song selection, and very professional. Will definitely book again!',
      authorName: 'Mike Thompson',
      date: '1 month ago',
      eventType: 'Corporate Event',
      verified: true
    },
    {
      id: '3',
      rating: 4,
      comment: 'Great performance and very accommodating with song requests. The only reason for 4 stars instead of 5 was a slight delay in setup, but once started, everything was perfect.',
      authorName: 'Lisa Wang',
      date: '6 weeks ago',
      eventType: 'Birthday Party',
      verified: true
    }
  ]

  const enrichedArtist = {
    ...artist,
    media: sampleMedia,
    packages: samplePackages,
    reviews: sampleReviews,
    experience: 7,
    languages: artist.languages?.length > 0 ? artist.languages : ['English', 'Thai'],
    travelRadius: 50,
    equipment: ['Pioneer CDJ-3000', 'DJM-900NXS2 Mixer', 'JBL EON615 Speakers', 'LED Par Lights', 'Wireless Microphones'],
    socialLinks: {
      facebook: artist.facebook || 'https://facebook.com',
      instagram: artist.instagram || 'https://instagram.com',
      youtube: artist.youtube || 'https://youtube.com',
      spotify: artist.spotify
    },
    pastVenues: ['Marriott Bangkok', 'Centara Grand', 'W Hotel', 'Anantara Siam', 'Shangri-La Hotel', 'Mandarin Oriental'],
    bio: artist.bio || `Professional ${artist.category} with over 7 years of experience performing at weddings, corporate events, and exclusive venues across Thailand. Known for reading the crowd and keeping the dance floor packed all night. Specializing in a wide range of music genres from current hits to timeless classics.`,
    tagline: 'Making your events unforgettable with the perfect soundtrack',
    stats: {
      totalEvents: 500,
      rating: artist.averageRating || 4.8,
      memberSince: 2019
    }
  }

  const verificationLevel = artist.verificationLevel === 'TRUSTED' ? 'PREMIUM' : 
                           artist.verificationLevel === 'VERIFIED' ? 'VERIFIED' : 'BASIC'

  return (
    <>
      <main className="min-h-screen bg-off-white">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-deep-teal to-brand-cyan">
          {/* Cover Image with Loading State */}
          {artist.coverImage && (
            <>
              {!coverImageLoaded && (
                <div className="absolute inset-0">
                  <ImageSkeleton
                    aspectRatio="hero"
                    size="full"
                    rounded="none"
                    showShimmer={true}
                  />
                </div>
              )}
              <Image
                src={artist.coverImage}
                alt={`${artist.stageName} cover`}
                fill
                sizes="100vw"
                className={`object-cover transition-opacity duration-500 ${
                  coverImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setCoverImageLoaded(true)}
                loading="eager"
                priority
                quality={90}
              />
            </>
          )}

          <div className="absolute inset-0 bg-gradient-to-br from-deep-teal/90 to-brand-cyan/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
            <div className="flex items-end space-x-6 w-full">
              {/* Profile Image with Loading State */}
              <div className="relative w-40 h-40">
                {!profileImageLoaded && !profileImageError && (
                  <div className="absolute inset-0">
                    <ImageSkeleton
                      aspectRatio="square"
                      size="md"
                      rounded="full"
                      showShimmer={true}
                      className="border-4 border-pure-white shadow-xl"
                    />
                  </div>
                )}

                {artist.profileImage && !profileImageError ? (
                  <Image
                    src={artist.profileImage}
                    alt={`${artist.stageName} profile`}
                    width={160}
                    height={160}
                    className={`rounded-full border-4 border-pure-white shadow-xl object-cover transition-opacity duration-500 ${
                      profileImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setProfileImageLoaded(true)}
                    onError={() => {
                      setProfileImageError(true)
                      setProfileImageLoaded(true)
                    }}
                    loading="eager"
                    priority
                    quality={90}
                  />
                ) : (
                  <div className={`w-40 h-40 bg-brand-cyan rounded-full border-4 border-pure-white shadow-xl flex items-center justify-center transition-opacity duration-500 ${
                    profileImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <span className="text-4xl font-bold text-pure-white">
                      {artist.stageName?.charAt(0)}
                    </span>
                  </div>
                )}

                {verificationLevel !== 'BASIC' && (
                  <div className="absolute bottom-2 right-2">
                    <VerificationBadge level={verificationLevel as any} showLabel={false} />
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="flex-1 pb-2">
                <div className="flex items-start gap-3 mb-2">
                  <h1 className="font-playfair text-4xl font-bold text-pure-white">
                    {artist.stageName}
                  </h1>
                  {/* Social Proof Indicators */}
                  {enrichedArtist.stats.totalEvents > 400 && (
                    <PopularityIndicator
                      type="trending"
                      animated={true}
                      size="md"
                    />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-pure-white/90">
                  <span className="bg-pure-white/20 px-3 py-1 rounded-full text-sm">
                    {t(`category.${artist.category}`)}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {artist.baseCity}
                  </span>
                  <RatingStars
                    rating={enrichedArtist.stats.rating}
                    showNumber={true}
                    reviewCount={enrichedArtist.reviews.length}
                  />
                  {/* Highly Rated Badge */}
                  {enrichedArtist.stats.rating >= 4.8 && (
                    <PopularityIndicator
                      type="highly-rated"
                      metric={enrichedArtist.stats.rating.toFixed(1)}
                      animated={false}
                      size="sm"
                    />
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Social Proof Badges */}
                  <TrustBadge variant="verified" size="sm" showTooltip={true} />
                  {enrichedArtist.stats.totalEvents >= 100 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-cyan/20 text-pure-white border border-brand-cyan/30">
                      {enrichedArtist.stats.totalEvents}+ Events Completed
                    </span>
                  )}
                </div>
                {enrichedArtist.tagline && (
                  <p className="mt-2 text-pure-white/80 italic">{enrichedArtist.tagline}</p>
                )}
              </div>

              {/* Quick Stats - Desktop Only */}
              <div className="hidden lg:flex items-center space-x-6 text-pure-white pb-2">
                <div className="text-center">
                  <p className="text-2xl font-bold">{enrichedArtist.stats.totalEvents}+</p>
                  <p className="text-sm opacity-90">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{enrichedArtist.stats.rating}</p>
                  <p className="text-sm opacity-90">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{enrichedArtist.stats.memberSince}</p>
                  <p className="text-sm opacity-90">Since</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky top-16 z-40 bg-pure-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <HourlyRateDisplay
                  rate={artist.hourlyRate}
                  minimumHours={artist.minimumHours}
                  variant="default"
                  showFromLabel={true}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBookNow}
                  className="px-6 py-3 bg-brand-cyan text-pure-white font-inter font-medium rounded-lg hover:bg-brand-cyan/90 transition-colors shadow-md"
                >
                  Get Quote
                </button>
                
                <LineContactButton
                  artistName={artist.stageName}
                  artistId={artist.id}
                  lineId={artist.lineId || '@brightears'}
                />
                
                <button
                  onClick={handleFavorite}
                  className={`p-3 rounded-lg border transition-all ${
                    isFavorite 
                      ? 'bg-red-50 border-red-200 text-red-500' 
                      : 'bg-pure-white border-gray-200 text-dark-gray hover:text-red-500'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-3 bg-pure-white rounded-lg border border-gray-200 text-dark-gray hover:text-brand-cyan transition-colors"
                  title="Share profile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-4.026-4.026m4.026 4.026l-4.026-4.026m-9.032 4.026a3 3 0 104.026-4.026m-4.026 4.026l4.026-4.026" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ArtistProfileTabs artist={enrichedArtist} />
        </div>

        {/* Trust Signals Section - Above Footer */}
        <TrustSignals variant="compact" className="border-t" />
      </main>
      <Footer />
      
      {/* Quick Inquiry Modal */}
      <QuickInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        artistId={artist.id}
        artistName={artist.stageName}
        artistImage={artist.profileImage}
      />
    </>
  )
}