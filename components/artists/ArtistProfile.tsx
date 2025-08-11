'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

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
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')
  
  useEffect(() => {
    fetchArtist()
  }, [artistId])
  
  const fetchArtist = async () => {
    try {
      const response = await fetch(`/api/artists/${artistId}`)
      if (response.ok) {
        const data = await response.json()
        setArtist(data)
      }
    } catch (error) {
      console.error('Error fetching artist:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('notFound')}</h1>
          <Link href={`/${locale}/artists`} className="text-brightears hover:text-brightears-600">
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
        <span className="ml-1 text-gray-600">
          ({artist.reviewCount} {t('reviews')})
        </span>
      </div>
    )
  }
  
  const getVerificationBadge = () => {
    switch (artist.verificationLevel) {
      case 'TRUSTED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-brightears-600 to-brightears">
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
          <div className="bg-white rounded-lg shadow-lg p-6">
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {artist.stageName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="bg-brightears-100 text-brightears-700 px-3 py-1 rounded-full text-sm font-medium">
                        {t(`category.${artist.category}`)}
                      </span>
                      {getVerificationBadge()}
                      <span className="text-gray-600">
                        📍 {artist.baseCity}
                      </span>
                    </div>
                    {artist.averageRating && renderStars(artist.averageRating)}
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <button className="w-full md:w-auto px-6 py-3 bg-brightears text-white font-semibold rounded-lg hover:bg-brightears-600 transition">
                      {t('bookNow')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div>
                <p className="text-gray-600 text-sm">{t('startingPrice')}</p>
                <p className="text-xl font-semibold">
                  {artist.hourlyRate ? `฿${artist.hourlyRate.toLocaleString()}/hr` : t('priceOnRequest')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t('minimumBooking')}</p>
                <p className="text-xl font-semibold">{artist.minimumHours} {t('hours')}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t('completedEvents')}</p>
                <p className="text-xl font-semibold">{artist.completedBookings}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t('responseTime')}</p>
                <p className="text-xl font-semibold">
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
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-brightears text-brightears'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">{t('aboutArtist')}</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {bio || t('noBio')}
                    </p>
                    
                    {artist.genres.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">{t('genres')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {artist.genres.map((genre) => (
                            <span key={genre} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {artist.languages.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">{t('languages')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {artist.languages.map((lang) => (
                            <span key={lang} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {lang === 'en' ? 'English' : lang === 'th' ? 'ไทย' : lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold mb-4">{t('serviceDetails')}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">{t('serviceAreas')}</p>
                        <p className="font-medium">{artist.serviceAreas.join(', ')}</p>
                      </div>
                      
                      {artist.travelRadius && (
                        <div>
                          <p className="text-sm text-gray-600">{t('travelRadius')}</p>
                          <p className="font-medium">{artist.travelRadius} km</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm text-gray-600">{t('advanceNotice')}</p>
                        <p className="font-medium">{artist.advanceNotice} {t('days')}</p>
                      </div>
                      
                      {artist.instantBooking && (
                        <div className="pt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            ⚡ {t('instantBooking')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Social Links */}
                    {(artist.website || artist.facebook || artist.instagram || artist.lineId) && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold mb-4">{t('connect')}</h3>
                        <div className="space-y-2">
                          {artist.website && (
                            <a href={artist.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-brightears">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.029 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                              </svg>
                              {t('website')}
                            </a>
                          )}
                          {artist.facebook && (
                            <a href={artist.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-brightears">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              Facebook
                            </a>
                          )}
                          {artist.instagram && (
                            <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-brightears">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                              </svg>
                              Instagram
                            </a>
                          )}
                          {artist.lineId && (
                            <div className="flex items-center text-gray-600">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6L14 10.64c-.32.32-.32.86 0 1.19.16.16.37.24.58.24s.43-.08.58-.24l2.64-2.64c.32-.32.32-.86 0-1.19zm-9.28 0c-.32.33-.32.87 0 1.19L10 11.83c.16.16.37.24.58.24s.43-.08.58-.24c.32-.32.32-.86 0-1.19L8.52 8c-.32-.33-.86-.33-1.18 0zm9.28 5.19L14 15.83c-.16.16-.37.24-.58.24s-.43-.08-.58-.24c-.32-.32-.32-.86 0-1.19L15.48 12c.32-.32.86-.32 1.18 0 .32.33.32.87 0 1.19zm-9.28 0c-.32.32-.32.86 0 1.19.16.16.37.24.58.24s.43-.08.58-.24L10 13.19c.32-.32.32-.86 0-1.19-.32-.32-.86-.32-1.18 0-.32.33-.32.87 0 1.19z"/>
                              </svg>
                              Line: {artist.lineId}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{t('customerReviews')}</h2>
                {artist.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {artist.reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">{t('noReviews')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}