'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import BookingInquiryForm from '@/components/booking/BookingInquiryForm'
import QuickBookingForm from '@/components/booking/QuickBookingForm'
import LoginPromptModal from '@/components/auth/LoginPromptModal'

interface ArtistProfileProps {
  artistId: string
  locale: string
}

interface Artist {
  id: string
  stageName: string
  realName?: string
  bio?: string
  bioTh?: string
  category: string
  subCategories: string[]
  verificationLevel: string
  baseCity: string
  serviceAreas: string[]
  travelRadius?: number
  hourlyRate?: number
  minimumHours: number
  currency: string
  languages: string[]
  genres: string[]
  equipment?: any
  technicalRider?: string
  profileImage?: string
  coverImage?: string
  images: string[]
  videos: string[]
  audioSamples: string[]
  website?: string
  facebook?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  spotify?: string
  soundcloud?: string
  mixcloud?: string
  lineId?: string
  totalBookings: number
  completedBookings: number
  averageRating?: number
  reviewCount: number
  responseTime?: number
  instantBooking: boolean
  advanceNotice: number
  cancellationPolicy?: string
  createdAt: string
  reviews: any[]
  availability: any[]
  detailedRatings?: {
    punctuality?: number
    performance?: number
    professionalism?: number
    valueForMoney?: number
  }
}

export default function ArtistProfile({ artistId, locale }: ArtistProfileProps) {
  const t = useTranslations('artist')
  const { data: session, status } = useSession()
  const router = useRouter()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [hasViewedContact, setHasViewedContact] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('about')
  
  useEffect(() => {
    fetchArtist()
  }, [artistId])
  
  const fetchArtist = async () => {
    try {
      const response = await fetch(`/api/artists/${artistId}`)
      if (response.ok) {
        const data = await response.json()
        // Ensure arrays are initialized to prevent null/undefined errors
        const artistData = {
          ...data,
          genres: data.genres || [],
          languages: data.languages || [],
          serviceAreas: data.serviceAreas || [],
          reviews: data.reviews || [],
          images: data.images || [],
          videos: data.videos || [],
          audioSamples: data.audioSamples || [],
          availability: data.availability || []
        }
        setArtist(artistData)
      }
    } catch (error) {
      console.error('Error fetching artist:', error)
    } finally {
      setLoading(false)
    }
  }

  // Track contact view when user logs in and views contact info
  const trackContactView = async () => {
    if (session?.user && artist && !hasViewedContact) {
      try {
        await fetch('/api/artists/contact-views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            artistId: artist.id,
            userId: session.user.id,
          }),
        })
        setHasViewedContact(true)
      } catch (error) {
        console.error('Error tracking contact view:', error)
      }
    }
  }

  // Handle login success - track contact view
  const handleLoginSuccess = () => {
    // Refresh the page to update session
    window.location.reload()
  }

  // Handle contact button click
  const handleContactClick = () => {
    if (session?.user) {
      trackContactView()
    } else {
      setShowLoginModal(true)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-off-white animate-pulse">
        <div className="h-64 bg-gray-300"></div>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!artist) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-playfair font-bold text-dark-gray mb-4">{t('notFound')}</h1>
          <Link href={`/${locale}/artists`} className="text-brand-cyan hover:text-brand-cyan/80">
            {t('backToArtists')}
          </Link>
        </div>
      </div>
    )
  }
  
  const bio = locale === 'th' && artist.bioTh ? artist.bioTh : artist.bio
  
  const renderStars = (rating?: number) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < fullStars ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-lg font-semibold">
          {rating.toFixed(1)}
        </span>
        <span className="ml-1 text-dark-gray font-inter">
          ({artist.reviewCount} {t('reviews')})
        </span>
      </div>
    )
  }
  
  const getVerificationBadge = () => {
    switch (artist.verificationLevel) {
      case 'TRUSTED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-inter font-medium bg-soft-lavender text-pure-white">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('trusted')}
          </span>
        )
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('verified')}
          </span>
        )
      case 'BASIC':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {t('basic')}
          </span>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-off-white">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-deep-teal">
        {artist.coverImage && (
          <Image
            src={artist.coverImage}
            alt={artist.stageName}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      {/* Profile Header */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20">
          <div className="bg-background rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-start">
              {/* Profile Image */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 -mt-16 md:-mt-20 mb-4 md:mb-0 md:mr-6">
                {artist.profileImage ? (
                  <Image
                    src={artist.profileImage}
                    alt={artist.stageName}
                    fill
                    className="rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Artist Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-playfair font-bold text-dark-gray mb-2">
                      {artist.stageName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {artist.category && (
                        <span className="bg-earthy-brown text-pure-white px-3 py-1 rounded-full text-sm font-inter font-medium">
                          {t(`category.${artist.category}`)}
                        </span>
                      )}
                      {getVerificationBadge()}
                      <span className="text-dark-gray font-inter">
                        📍 {artist.baseCity}
                      </span>
                    </div>
                    {artist.averageRating && renderStars(artist.averageRating)}
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <button 
                      onClick={() => setShowBookingForm(true)}
                      className="w-full md:w-auto px-6 py-3 bg-brand-cyan text-pure-white font-inter font-semibold rounded-lg hover:bg-brand-cyan/80 transition"
                    >
                      {t('bookNow')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div>
                <p className="text-dark-gray font-inter text-sm">{t('startingPrice')}</p>
                <p className="text-xl font-inter font-semibold text-dark-gray">
                  {artist.hourlyRate ? `฿${artist.hourlyRate.toLocaleString()}/hr` : t('priceOnRequest')}
                </p>
              </div>
              <div>
                <p className="text-dark-gray font-inter text-sm">{t('minimumBooking')}</p>
                <p className="text-xl font-inter font-semibold text-dark-gray">{artist.minimumHours} {t('hours')}</p>
              </div>
              <div>
                <p className="text-dark-gray font-inter text-sm">{t('completedEvents')}</p>
                <p className="text-xl font-inter font-semibold text-dark-gray">{artist.completedBookings}</p>
              </div>
              <div>
                <p className="text-dark-gray font-inter text-sm">{t('responseTime')}</p>
                <p className="text-xl font-inter font-semibold text-dark-gray">
                  {artist.responseTime ? `~${artist.responseTime}hr` : t('fast')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['about', 'media', 'reviews', 'availability'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-inter font-medium text-sm ${
                    activeTab === tab
                      ? 'border-brand-cyan text-brand-cyan'
                      : 'border-transparent text-dark-gray hover:text-brand-cyan hover:border-gray-300'
                  }`}
                >
                  {t(`tab.${tab}`)}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-background rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-playfair font-bold mb-4 text-dark-gray">{t('aboutArtist')}</h2>
                    <p className="text-dark-gray font-inter whitespace-pre-wrap">
                      {bio || t('noBio')}
                    </p>
                    
                    {artist.genres && artist.genres.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-playfair font-semibold mb-3 text-dark-gray">{t('genres')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {artist.genres.map((genre) => (
                            <span key={genre} className="bg-off-white text-dark-gray font-inter px-3 py-1 rounded-full text-sm">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {artist.languages && artist.languages.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-playfair font-semibold mb-3 text-dark-gray">{t('languages')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {artist.languages.map((lang) => (
                            <span key={lang} className="bg-brand-cyan text-pure-white font-inter px-3 py-1 rounded-full text-sm">
                              {lang === 'en' ? 'English' : lang === 'th' ? 'ไทย' : lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-background rounded-lg shadow-md p-6">
                    <h3 className="font-playfair font-semibold mb-4 text-dark-gray">{t('serviceDetails')}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-inter text-dark-gray">{t('serviceAreas')}</p>
                        <p className="font-inter font-medium text-dark-gray">
                          {artist.serviceAreas && artist.serviceAreas.length > 0 
                            ? artist.serviceAreas.join(', ') 
                            : 'Not specified'}
                        </p>
                      </div>
                      
                      {artist.travelRadius && (
                        <div>
                          <p className="text-sm font-inter text-dark-gray">{t('travelRadius')}</p>
                          <p className="font-inter font-medium text-dark-gray">{artist.travelRadius} km</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-inter text-dark-gray">{t('advanceNotice')}</p>
                        <p className="font-inter font-medium text-dark-gray">{artist.advanceNotice} {t('days')}</p>
                      </div>
                      
                      {artist.instantBooking && (
                        <div className="pt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            ⚡ {t('instantBooking')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Contact Information Section */}
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-playfair font-semibold mb-4 text-dark-gray">{t('connect')}</h3>
                      
                      {session?.user ? (
                        <div className="space-y-2">
                          {/* Show actual contact info for logged-in users */}
                          {artist.website && (
                            <a href={artist.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-dark-gray font-inter hover:text-brand-cyan">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.029 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                              </svg>
                              {t('website')}
                            </a>
                          )}
                          {artist.facebook && (
                            <a href={artist.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center text-dark-gray font-inter hover:text-brand-cyan">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              Facebook
                            </a>
                          )}
                          {artist.instagram && (
                            <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center text-dark-gray font-inter hover:text-brand-cyan">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                              </svg>
                              Instagram
                            </a>
                          )}
                          {artist.lineId && (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center text-green-700 font-inter">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.28-.63.626-.63.352 0 .631.285.631.63v4.771z"/>
                                </svg>
                                LINE: {artist.lineId}
                              </div>
                              <button
                                onClick={() => window.open(`https://line.me/ti/p/~${artist.lineId}`, '_blank')}
                                className="px-3 py-1 bg-green-500 text-white text-sm font-inter rounded hover:bg-green-600 transition-colors"
                              >
                                {t('addLine')}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Show login prompt for non-logged-in users */
                        <div className="space-y-3">
                          <div className="p-4 bg-off-white rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-center">
                              <div className="mb-3">
                                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <h4 className="font-playfair font-semibold text-dark-gray mb-2">
                                {t('contactInfoProtected')}
                              </h4>
                              <p className="text-sm font-inter text-dark-gray mb-4">
                                {t('signInToViewContact')}
                              </p>
                              <button
                                onClick={handleContactClick}
                                className="px-6 py-2 bg-brand-cyan text-white font-inter font-medium rounded-lg hover:bg-brand-cyan/80 transition-colors"
                              >
                                {t('signInToContact')}
                              </button>
                            </div>
                          </div>
                          
                          {/* Show public social links */}
                          <div className="space-y-2">
                            {artist.website && (
                              <a href={artist.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-dark-gray font-inter hover:text-brand-cyan">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.029 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                                </svg>
                                {t('website')}
                              </a>
                            )}
                            {artist.facebook && (
                              <a href={artist.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center text-dark-gray font-inter hover:text-brand-cyan">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                              </a>
                            )}
                            {artist.instagram && (
                              <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center text-dark-gray font-inter hover:text-brand-cyan">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                                </svg>
                                Instagram
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Quick Booking Section - Prominent LINE integration */}
                <div className="lg:col-span-1">
                  <QuickBookingForm 
                    artist={artist} 
                    locale={locale} 
                    onDetailedBookingClick={() => setShowBookingForm(true)}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="bg-background rounded-lg shadow-md p-6">
                <h2 className="text-xl font-playfair font-bold mb-4 text-dark-gray">{t('customerReviews')}</h2>
                {artist.reviews && artist.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {artist.reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-dark-gray font-inter">{review.comment}</p>
                            <p className="text-sm font-inter text-dark-gray mt-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-gray font-inter">{t('noReviews')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && artist && (
        <BookingInquiryForm
          artist={artist}
          locale={locale}
          onClose={() => setShowBookingForm(false)}
        />
      )}

      {/* Login Prompt Modal */}
      {showLoginModal && artist && (
        <LoginPromptModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          artistName={artist.stageName}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  )
}