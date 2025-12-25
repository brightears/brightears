'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import MediaGallery from './MediaGallery'
import RatingStars from '@/components/ui/RatingStars'
import PublicAvailabilityCalendar from './PublicAvailabilityCalendar'
import Image from 'next/image'

interface Package {
  id: string
  name: string
  description: string
  price: number
  duration: string
  includes: string[]
}

interface Review {
  id: string
  rating: number
  comment: string
  authorName: string
  authorImage?: string
  date: string
  eventType: string
  verified: boolean
}

interface ArtistProfileTabsProps {
  artist: {
    id: string
    stageName: string
    bio?: string
    hourlyRate?: number
    minimumHours?: number
    experience?: number
    equipment?: string[]
    languages?: string[]
    travelRadius?: number
    availability?: any
    media?: any[]
    packages?: Package[]
    reviews?: Review[]
    socialLinks?: {
      facebook?: string
      instagram?: string
      youtube?: string
      spotify?: string
    }
    pastVenues?: string[]
  }
}

export default function ArtistProfileTabs({ artist }: ArtistProfileTabsProps) {
  const t = useTranslations('artists')
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'packages' | 'reviews' | 'about'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'media', label: 'Media', count: artist.media?.length },
    { id: 'packages', label: 'Packages', count: artist.packages?.length },
    { id: 'reviews', label: 'Reviews', count: artist.reviews?.length },
    { id: 'about', label: 'About' },
  ]

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Pricing */}
      <div className="bg-pure-white rounded-lg p-6">
        <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">Pricing</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-brand-cyan">
            ฿{artist.hourlyRate?.toLocaleString() || 'Contact for pricing'}
          </span>
          <span className="text-dark-gray/60">/hour</span>
        </div>
        {artist.minimumHours && artist.minimumHours > 1 && (
          <p className="text-sm text-brand-cyan/80 mt-1">
            Minimum booking: {artist.minimumHours} hours
          </p>
        )}
        <p className="text-sm text-dark-gray/60 mt-2">
          * Prices may vary based on event type and requirements
        </p>
      </div>

      {/* Quick Info */}
      <div className="bg-pure-white rounded-lg p-6">
        <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">Quick Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artist.experience && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-brand-cyan mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 012.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 012.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-2.055.485 1.704 1.704 0 01-1.89 0 3.704 3.704 0 00-2.11 0 1.704 1.704 0 01-1.89 0 3.704 3.704 0 00-2.11 0 1.704 1.704 0 01-1.89 0A3.7 3.7 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-inter font-medium text-dark-gray">Experience</p>
                <p className="text-sm text-dark-gray/60">{artist.experience} years</p>
              </div>
            </div>
          )}

          {artist.languages && artist.languages.length > 0 && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-brand-cyan mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-inter font-medium text-dark-gray">Languages</p>
                <p className="text-sm text-dark-gray/60">{artist.languages.join(', ')}</p>
              </div>
            </div>
          )}

          {artist.travelRadius && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-brand-cyan mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-inter font-medium text-dark-gray">Travel Radius</p>
                <p className="text-sm text-dark-gray/60">Up to {artist.travelRadius} km</p>
              </div>
            </div>
          )}

          {artist.equipment && artist.equipment.length > 0 && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-brand-cyan mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              <div>
                <p className="font-inter font-medium text-dark-gray">Equipment</p>
                <p className="text-sm text-dark-gray/60">{artist.equipment.slice(0, 3).join(', ')}{artist.equipment.length > 3 && '...'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Availability Calendar - Now with actual calendar component */}
      <div className="bg-transparent">
        <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">Availability</h3>
        <PublicAvailabilityCalendar
          artistId={artist.id}
          locale="en"
        />
      </div>
    </div>
  )

  const renderMediaTab = () => (
    <div className="bg-pure-white rounded-lg p-6">
      <MediaGallery
        media={artist.media || []}
        artistName={artist.stageName}
      />
    </div>
  )

  const renderPackagesTab = () => (
    <div className="space-y-4">
      {artist.packages && artist.packages.length > 0 ? (
        artist.packages.map((pkg) => (
          <div key={pkg.id} className="bg-pure-white rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-playfair text-xl font-bold text-dark-gray">{pkg.name}</h3>
                <p className="text-dark-gray/60 mt-1">{pkg.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-cyan">฿{pkg.price.toLocaleString()}</p>
                <p className="text-sm text-dark-gray/60">{pkg.duration}</p>
              </div>
            </div>
            {pkg.includes && pkg.includes.length > 0 && (
              <div className="border-t pt-4">
                <p className="font-inter font-medium text-dark-gray mb-2">Package includes:</p>
                <ul className="space-y-1">
                  {pkg.includes.map((item, index) => (
                    <li key={index} className="flex items-center text-sm text-dark-gray/80">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-pure-white rounded-lg p-8 text-center">
          <p className="text-dark-gray/60">No packages available yet</p>
          <p className="text-sm text-brand-cyan mt-2">Contact artist for custom quotes</p>
        </div>
      )}
    </div>
  )

  const renderReviewsTab = () => (
    <div className="space-y-4">
      {artist.reviews && artist.reviews.length > 0 ? (
        <>
          {/* Review Summary */}
          <div className="bg-pure-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-xl font-bold text-dark-gray">Customer Reviews</h3>
              <RatingStars
                rating={4.8}
                showNumber={true}
                reviewCount={artist.reviews.length}
              />
            </div>
          </div>

          {/* Individual Reviews */}
          {artist.reviews.map((review) => (
            <div key={review.id} className="bg-pure-white rounded-lg p-6">
              <div className="flex items-start space-x-4">
                {review.authorImage ? (
                  <Image
                    src={review.authorImage}
                    alt={review.authorName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-brand-cyan/10 rounded-full flex items-center justify-center">
                    <span className="text-brand-cyan font-bold">
                      {review.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-inter font-medium text-dark-gray">{review.authorName}</p>
                      <div className="flex items-center space-x-2 text-sm text-dark-gray/60">
                        <span>{review.date}</span>
                        <span>•</span>
                        <span>{review.eventType}</span>
                        {review.verified && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified Booking
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  <p className="text-dark-gray/80">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="bg-pure-white rounded-lg p-8 text-center">
          <p className="text-dark-gray/60">No reviews yet</p>
          <p className="text-sm text-brand-cyan mt-2">Be the first to book and review!</p>
        </div>
      )}
    </div>
  )

  const renderAboutTab = () => (
    <div className="space-y-6">
      {/* Full Bio */}
      {artist.bio && (
        <div className="bg-pure-white rounded-lg p-6">
          <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">About {artist.stageName}</h3>
          <p className="text-dark-gray/80 whitespace-pre-wrap">{artist.bio}</p>
        </div>
      )}

      {/* Experience Timeline */}
      {artist.pastVenues && artist.pastVenues.length > 0 && (
        <div className="bg-pure-white rounded-lg p-6">
          <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">Past Venues & Events</h3>
          <div className="flex flex-wrap gap-2">
            {artist.pastVenues.map((venue, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-off-white rounded-full text-sm text-dark-gray"
              >
                {venue}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {artist.socialLinks && Object.keys(artist.socialLinks).length > 0 && (
        <div className="bg-pure-white rounded-lg p-6">
          <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">Follow Me</h3>
          <div className="flex space-x-4">
            {artist.socialLinks.facebook && (
              <a
                href={artist.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-gray hover:text-brand-cyan transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {artist.socialLinks.instagram && (
              <a
                href={artist.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-gray hover:text-brand-cyan transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
            )}
            {artist.socialLinks.youtube && (
              <a
                href={artist.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-gray hover:text-brand-cyan transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab()
      case 'media':
        return renderMediaTab()
      case 'packages':
        return renderPackagesTab()
      case 'reviews':
        return renderReviewsTab()
      case 'about':
        return renderAboutTab()
      default:
        return renderOverviewTab()
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-pure-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-inter font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-cyan text-brand-cyan'
                    : 'border-transparent text-dark-gray/60 hover:text-dark-gray hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-brand-cyan/10 text-brand-cyan rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  )
}
