'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useUser, useAuth } from '@clerk/nextjs'
import LineContactButton from './LineContactButton'
import LoginPromptModal from '@/components/auth/LoginPromptModal'

interface Artist {
  id: string
  stageName: string
  lineId?: string
  advanceNotice: number
}

interface QuickBookingFormProps {
  artist: Artist
  locale: string
  onDetailedBookingClick?: () => void
}

export default function QuickBookingForm({ artist, locale, onDetailedBookingClick }: QuickBookingFormProps) {
  const t = useTranslations('booking')
  const { user, isLoaded, isSignedIn } = useUser()
  const { userId } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inquiryTracked, setInquiryTracked] = useState(false)

  const [formData, setFormData] = useState({
    eventDate: '',
    eventType: '',
    location: ''
  })

  const eventTypes = [
    'Wedding',
    'Birthday Party', 
    'Corporate Event',
    'Private Party',
    'Bar/Club Night',
    'Restaurant Performance',
    'Hotel Event',
    'Other'
  ]

  // Get minimum date based on artist's advance notice
  const getMinDate = () => {
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + artist.advanceNotice)
    return minDate.toISOString().split('T')[0]
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isFormValid = () => {
    return formData.eventDate && formData.eventType && formData.location
  }

  const handleQuickInquiry = () => {
    if (!isSignedIn || !userId) {
      setShowLoginModal(true)
      return
    }

    if (!isFormValid()) {
      alert(t('quickBooking.fillAllFields'))
      return
    }

    // The tracking will be handled by the LineContactButton component
    // when the user clicks the LINE button
  }

  const trackInquiry = () => {
    setInquiryTracked(true)
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    // Refresh the page to update session
    window.location.reload()
  }

  // Fallback contact method for artists without LINE ID
  const handlePhoneContact = () => {
    // This would open phone app or show phone number
    // For now, just show an alert
    alert(t('quickBooking.contactArtistDirectly'))
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
          {t('quickBooking.title')}
        </h3>
        
        <p className="text-sm text-gray-600 mb-6 font-inter">
          {t('quickBooking.description')}
        </p>

        <div className="space-y-4">
          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2 font-inter">
              {t('quickBooking.eventDate')} *
            </label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleInputChange('eventDate', e.target.value)}
              min={getMinDate()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
              required
            />
            <p className="text-xs text-gray-500 mt-1 font-inter">
              {t('minimumAdvanceNotice', { days: artist.advanceNotice })}
            </p>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2 font-inter">
              {t('quickBooking.eventType')} *
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => handleInputChange('eventType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
              required
            >
              <option value="">{t('quickBooking.selectEventType')}</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2 font-inter">
              {t('quickBooking.location')} *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
              placeholder={t('quickBooking.locationPlaceholder')}
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {artist.lineId ? (
            /* Primary LINE Contact Button */
            <LineContactButton
              artistId={artist.id}
              artistName={artist.stageName}
              lineId={artist.lineId}
              eventDate={formData.eventDate}
              eventType={formData.eventType}
              location={formData.location}
              size="lg"
              onInquiryTrack={trackInquiry}
            />
          ) : (
            /* Fallback contact button */
            <button
              onClick={handlePhoneContact}
              className="w-full px-8 py-4 bg-brand-cyan hover:bg-brand-cyan/80 text-white font-inter font-semibold rounded-lg text-lg transition-all duration-200 hover:shadow-lg"
            >
              {t('quickBooking.contactArtist')}
            </button>
          )}

          {/* Secondary action - Full booking form */}
          <button
            onClick={onDetailedBookingClick}
            className="w-full px-6 py-3 border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-white font-inter font-medium rounded-lg transition-all duration-200"
          >
            {t('quickBooking.detailedBooking')}
          </button>
        </div>

        {/* Success indicator */}
        {inquiryTracked && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-700 font-inter">
                {t('quickBooking.inquirySent')}
              </p>
            </div>
          </div>
        )}

        {/* Help text */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 font-inter">
            {t('quickBooking.helpText')}
          </p>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginPromptModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          artistName={artist.stageName}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  )
}