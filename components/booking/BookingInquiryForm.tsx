'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useUser, useAuth } from '@clerk/nextjs'
import Image from 'next/image'

interface Artist {
  id: string
  stageName: string
  profileImage?: string
  category: string
  baseCity: string
  hourlyRate?: number
  minimumHours: number
  currency: string
  instantBooking: boolean
  advanceNotice: number
}

interface BookingInquiryFormProps {
  artist: Artist
  locale: string
  onClose: () => void
}

type FormStep = 'event' | 'venue' | 'details' | 'contact' | 'review' | 'success'

interface FormData {
  eventType: string
  eventDate: string
  startTime: string
  endTime: string
  duration: number
  venue: string
  venueAddress: string
  guestCount: string
  specialRequests: string
  budgetRange: string
  contactPhone: string
  notes: string
}

export default function BookingInquiryForm({ artist, locale, onClose }: BookingInquiryFormProps) {
  const t = useTranslations('booking')
  const { user, isLoaded, isSignedIn } = useUser()
  const { userId } = useAuth()
  const [currentStep, setCurrentStep] = useState<FormStep>('event')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState('')

  const [formData, setFormData] = useState<FormData>({
    eventType: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    duration: artist.minimumHours,
    venue: '',
    venueAddress: '',
    guestCount: '',
    specialRequests: '',
    budgetRange: '',
    contactPhone: '',
    notes: ''
  })

  const eventTypes = [
    'Wedding', 'Birthday Party', 'Corporate Event', 'Private Party', 
    'Bar/Club Night', 'Festival', 'Restaurant Performance', 'Hotel Event',
    'Concert', 'Other'
  ]

  const budgetRanges = [
    'Under ฿5,000', '฿5,000 - ฿10,000', '฿10,000 - ฿20,000', 
    '฿20,000 - ฿50,000', '฿50,000 - ฿100,000', 'Over ฿100,000', 'Flexible'
  ]

  const steps: { key: FormStep; title: string; titleTh: string }[] = [
    { key: 'event', title: 'Event Details', titleTh: 'รายละเอียดงาน' },
    { key: 'venue', title: 'Venue Information', titleTh: 'ข้อมูลสถานที่' },
    { key: 'details', title: 'Additional Details', titleTh: 'รายละเอียดเพิ่มเติม' },
    { key: 'contact', title: 'Contact & Budget', titleTh: 'ติดต่อและง예산' },
    { key: 'review', title: 'Review & Submit', titleTh: 'ตรวจสอบและส่ง' }
  ]

  const getCurrentStepIndex = () => steps.findIndex(step => step.key === currentStep)

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return artist.minimumHours
    const startTime = new Date(`2000-01-01T${start}`)
    const endTime = new Date(`2000-01-01T${end}`)
    if (endTime <= startTime) return artist.minimumHours
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    return Math.max(Math.ceil(hours), artist.minimumHours)
  }

  const validateStep = (step: FormStep): boolean => {
    switch (step) {
      case 'event':
        return !!(formData.eventType && formData.eventDate && formData.startTime && formData.endTime)
      case 'venue':
        return !!(formData.venue && formData.venueAddress)
      case 'details':
        return true // Optional step
      case 'contact':
        return true // Optional step if user is logged in
      default:
        return true
    }
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields')
      return
    }
    
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key)
    }
  }

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key)
    }
  }

  const submitBooking = async () => {
    if (!isSignedIn || !userId) {
      setError('Please log in to submit a booking request')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Combine date and time
      const eventDateTime = new Date(`${formData.eventDate}T00:00:00`)
      const startDateTime = new Date(`${formData.eventDate}T${formData.startTime}:00`)
      const endDateTime = new Date(`${formData.eventDate}T${formData.endTime}:00`)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistId: artist.id,
          eventType: formData.eventType,
          eventDate: eventDateTime.toISOString(),
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          duration: formData.duration,
          venue: formData.venue,
          venueAddress: formData.venueAddress,
          guestCount: formData.guestCount,
          specialRequests: formData.specialRequests,
          budgetRange: formData.budgetRange,
          contactPhone: formData.contactPhone,
          notes: formData.notes
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBookingId(data.booking.bookingNumber)
        setCurrentStep('success')
      } else {
        setError(data.error || 'Failed to submit booking request')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getEstimatedPrice = () => {
    if (!artist.hourlyRate || !formData.duration) return null
    return artist.hourlyRate * Math.max(formData.duration, artist.minimumHours)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'event':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('eventType')} *
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => updateFormData('eventType', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                required
              >
                <option value="">{t('selectEventType')}</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('eventDate')} *
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => updateFormData('eventDate', e.target.value)}
                min={new Date(Date.now() + artist.advanceNotice * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {t('minimumAdvanceNotice', { days: artist.advanceNotice })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  {t('startTime')} *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => {
                    updateFormData('startTime', e.target.value)
                    if (formData.endTime) {
                      updateFormData('duration', calculateDuration(e.target.value, formData.endTime))
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  {t('endTime')} *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => {
                    updateFormData('endTime', e.target.value)
                    if (formData.startTime) {
                      updateFormData('duration', calculateDuration(formData.startTime, e.target.value))
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  required
                />
              </div>
            </div>

            {formData.startTime && formData.endTime && (
              <div className="bg-brand-cyan/10 p-4 rounded-lg">
                <p className="text-sm text-brand-cyan font-medium">
                  {t('duration')}: {formData.duration} {t('hours')}
                  {formData.duration < artist.minimumHours && (
                    <span className="text-orange-600 ml-2">
                      ({t('minimumHours', { hours: artist.minimumHours })})
                    </span>
                  )}
                </p>
                {getEstimatedPrice() && (
                  <p className="text-sm text-brand-cyan mt-1">
                    {t('estimatedPrice')}: ฿{getEstimatedPrice()?.toLocaleString()} {artist.currency}
                  </p>
                )}
              </div>
            )}
          </div>
        )

      case 'venue':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('venueName')} *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => updateFormData('venue', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                placeholder={t('venueNamePlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('venueAddress')} *
              </label>
              <textarea
                value={formData.venueAddress}
                onChange={(e) => updateFormData('venueAddress', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                rows={3}
                placeholder={t('venueAddressPlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('expectedGuests')}
              </label>
              <input
                type="number"
                value={formData.guestCount}
                onChange={(e) => updateFormData('guestCount', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                placeholder={t('expectedGuestsPlaceholder')}
                min="1"
              />
            </div>
          </div>
        )

      case 'details':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('specialRequests')}
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => updateFormData('specialRequests', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                rows={4}
                placeholder={t('specialRequestsPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('additionalNotes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                rows={3}
                placeholder={t('additionalNotesPlaceholder')}
              />
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('budgetRange')}
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => updateFormData('budgetRange', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
              >
                <option value="">{t('selectBudgetRange')}</option>
                {budgetRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                {t('contactPhone')}
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => updateFormData('contactPhone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                placeholder={t('contactPhonePlaceholder')}
              />
            </div>

            {!isSignedIn && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  {t('loginRequired')}
                </p>
              </div>
            )}
          </div>
        )

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
                {t('bookingSummary')}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('artist')}:</span>
                  <span className="font-medium">{artist.stageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('eventType')}:</span>
                  <span className="font-medium">{formData.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('date')}:</span>
                  <span className="font-medium">{formData.eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('time')}:</span>
                  <span className="font-medium">{formData.startTime} - {formData.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('duration')}:</span>
                  <span className="font-medium">{formData.duration} {t('hours')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('venue')}:</span>
                  <span className="font-medium">{formData.venue}</span>
                </div>
                {getEstimatedPrice() && (
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">{t('estimatedPrice')}:</span>
                    <span className="font-semibold text-brand-cyan">
                      ฿{getEstimatedPrice()?.toLocaleString()} {artist.currency}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">{t('whatHappensNext')}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t('step1')}</li>
                <li>• {t('step2')}</li>
                <li>• {t('step3')}</li>
              </ul>
            </div>
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <h3 className="font-playfair text-2xl font-bold text-dark-gray mb-2">
                {t('bookingRequestSent')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('bookingRequestSentDescription')}
              </p>
              <p className="text-sm text-gray-500">
                {t('bookingNumber')}: <span className="font-mono font-bold">{bookingId}</span>
              </p>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-dark-gray rounded-lg hover:bg-gray-300"
              >
                {t('close')}
              </button>
              <button
                onClick={() => window.location.href = `/${locale}/dashboard`}
                className="px-6 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80"
              >
                {t('viewBookings')}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isSignedIn && currentStep !== 'success') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-dark-gray bg-opacity-50" onClick={onClose} />
          <div className="relative bg-pure-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
                {t('loginRequired')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('loginRequiredDescription')}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-200 text-dark-gray rounded-lg hover:bg-gray-300"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => window.location.href = `/${locale}/login`}
                  className="flex-1 px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80"
                >
                  {t('login')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-dark-gray bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-pure-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-pure-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {artist.profileImage && (
                  <Image
                    src={artist.profileImage}
                    alt={artist.stageName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="font-playfair text-xl font-semibold text-dark-gray">
                    {t('bookArtist', { name: artist.stageName })}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {artist.category} • {artist.baseCity}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            {currentStep !== 'success' && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.key} className="flex-1 flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        getCurrentStepIndex() > index 
                          ? 'bg-brand-cyan text-pure-white' 
                          : getCurrentStepIndex() === index
                            ? 'bg-brand-cyan text-pure-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 ${
                          getCurrentStepIndex() > index ? 'bg-brand-cyan' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-center">
                    {locale === 'th' ? steps[getCurrentStepIndex()]?.titleTh : steps[getCurrentStepIndex()]?.title}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {renderStepContent()}
          </div>

          {/* Footer */}
          {currentStep !== 'success' && (
            <div className="sticky bottom-0 bg-pure-white border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={getCurrentStepIndex() === 0}
                  className="px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {t('previous')}
                </button>
                
                {currentStep === 'review' ? (
                  <button
                    onClick={submitBooking}
                    disabled={isLoading || !isSignedIn}
                    className="px-6 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t('submitting') : t('submitRequest')}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80"
                  >
                    {t('next')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}