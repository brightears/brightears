'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Artist {
  id: string
  stageName: string
  category: string
  baseCity: string
  hourlyRate?: number
  minimumHours?: number
  profileImage?: string
}

interface MobileQuickBookingProps {
  artist: Artist
  isOpen: boolean
  onClose: () => void
}

interface BookingForm {
  eventDate: string
  eventTime: string
  eventType: string
  location: string
  duration: number
  contactMethod: 'line' | 'phone' | 'email'
  contactInfo: string
  additionalInfo: string
}

const EVENT_TYPES = [
  'wedding', 'corporate', 'birthday', 'anniversary', 
  'festival', 'private_party', 'nightclub', 'restaurant'
]

const THAI_CITIES = [
  'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Hua Hin',
  'Koh Samui', 'Krabi', 'Rayong'
]

export default function MobileQuickBooking({ artist, isOpen, onClose }: MobileQuickBookingProps) {
  const t = useTranslations('booking.mobile')
  const { data: session } = useSession()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState<BookingForm>({
    eventDate: '',
    eventTime: '',
    eventType: '',
    location: artist.baseCity || 'Bangkok',
    duration: artist.minimumHours || 3,
    contactMethod: 'line', // Default to LINE for Thai market
    contactInfo: '',
    additionalInfo: ''
  })

  // Auto-detect user location and set default time
  useEffect(() => {
    if (isOpen) {
      // Set default event time to evening
      const defaultTime = '19:00'
      setForm(prev => ({ 
        ...prev, 
        eventTime: defaultTime,
        contactInfo: session?.user?.email || ''
      }))
      setStep(1)
      setError(null)
      setSuccess(false)
    }
  }, [isOpen, session])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const updateForm = (field: keyof BookingForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    return !!(form.eventDate && form.eventTime && form.eventType && form.location)
  }

  const validateStep2 = () => {
    return !!(form.contactMethod && form.contactInfo.trim())
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
      setError(null)
    } else if (step === 2 && validateStep2()) {
      submitBooking()
    } else {
      setError(t('validation.completeRequired'))
    }
  }

  const submitBooking = async () => {
    if (!session?.user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          artistId: artist.id,
          userId: session.user.id,
          eventDate: `${form.eventDate}T${form.eventTime}`,
          eventType: form.eventType,
          location: form.location,
          duration: form.duration,
          additionalInfo: form.additionalInfo,
          contactMethod: form.contactMethod,
          contactInfo: form.contactInfo,
          inquiryMethod: 'MOBILE_QUICK'
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setError(result.error || t('error.submitFailed'))
      }
    } catch (err) {
      setError(t('error.networkError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateEstimate = () => {
    if (!artist.hourlyRate) return null
    return artist.hourlyRate * form.duration
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 md:hidden">
      {/* Bottom Sheet Modal */}
      <div className="bg-pure-white rounded-t-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4"></div>

        {/* Header */}
        <div className="px-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {artist.profileImage && (
                <img 
                  src={artist.profileImage} 
                  alt={artist.stageName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-playfair font-bold text-lg text-deep-teal">
                  {t('title')}
                </h3>
                <p className="text-sm text-dark-gray">
                  {artist.stageName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-3 bg-off-white">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-brand-cyan' : 'bg-gray-300'}`}></div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-brand-cyan' : 'bg-gray-300'} rounded`}></div>
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-brand-cyan' : 'bg-gray-300'}`}></div>
            <div className={`flex-1 h-1 ${success ? 'bg-green-500' : 'bg-gray-300'} rounded`}></div>
            <div className={`w-3 h-3 rounded-full ${success ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className="flex justify-between text-xs text-dark-gray/70 mt-1">
            <span>{t('step1')}</span>
            <span>{t('step2')}</span>
            <span>{t('step3')}</span>
          </div>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {success ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-playfair font-bold text-xl text-deep-teal mb-2">
                {t('success.title')}
              </h4>
              <p className="text-dark-gray mb-6">
                {t('success.message', { artist: artist.stageName })}
              </p>
              
              {/* LINE Contact Option */}
              {form.contactMethod === 'line' && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <p className="text-sm text-green-800 mb-3">{t('success.lineMessage')}</p>
                  <button className="bg-green-500 text-pure-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
                    {t('success.openLine')}
                  </button>
                </div>
              )}
              
              <p className="text-xs text-dark-gray/70">
                {t('success.autoClose')}
              </p>
            </div>
          ) : step === 1 ? (
            // Step 1: Event Details
            <div className="space-y-4">
              <h4 className="font-medium text-deep-teal mb-4">{t('step1.title')}</h4>
              
              {/* Event Type - Button Grid */}
              <div>
                <label className="block text-sm font-medium text-deep-teal mb-2">
                  {t('step1.eventType')} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EVENT_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => updateForm('eventType', type)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        form.eventType === type
                          ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                          : 'border-gray-200 text-dark-gray hover:border-brand-cyan/50'
                      }`}
                    >
                      {t(`eventTypes.${type}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('step1.date')} *
                  </label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => updateForm('eventDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('step1.time')} *
                  </label>
                  <input
                    type="time"
                    value={form.eventTime}
                    onChange={(e) => updateForm('eventTime', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-deep-teal mb-2">
                  {t('step1.location')} *
                </label>
                <select
                  value={form.location}
                  onChange={(e) => updateForm('location', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
                >
                  {THAI_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Duration Slider */}
              <div>
                <label className="block text-sm font-medium text-deep-teal mb-2">
                  {t('step1.duration')}: {form.duration} {t('step1.hours')}
                </label>
                <input
                  type="range"
                  min={artist.minimumHours || 1}
                  max="12"
                  value={form.duration}
                  onChange={(e) => updateForm('duration', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-dark-gray/70 mt-1">
                  <span>{artist.minimumHours || 1}h</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Price Estimate */}
              {artist.hourlyRate && (
                <div className="bg-brand-cyan/5 p-4 rounded-lg border border-brand-cyan/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-deep-teal">{t('step1.estimate')}</span>
                    <span className="text-lg font-bold text-brand-cyan">
                      ฿{calculateEstimate()?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-dark-gray/70 mt-1">
                    {t('step1.estimateNote')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Step 2: Contact & Submit
            <div className="space-y-4">
              <h4 className="font-medium text-deep-teal mb-4">{t('step2.title')}</h4>
              
              {/* Contact Method */}
              <div>
                <label className="block text-sm font-medium text-deep-teal mb-3">
                  {t('step2.contactMethod')} *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['line', 'phone', 'email'] as const).map(method => (
                    <button
                      key={method}
                      onClick={() => updateForm('contactMethod', method)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        form.contactMethod === method
                          ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                          : 'border-gray-200 text-dark-gray hover:border-brand-cyan/50'
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {method === 'line' ? '💬' : method === 'phone' ? '📞' : '📧'}
                      </div>
                      {t(`contactMethods.${method}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-sm font-medium text-deep-teal mb-2">
                  {form.contactMethod === 'line' && t('step2.lineId')}
                  {form.contactMethod === 'phone' && t('step2.phone')}
                  {form.contactMethod === 'email' && t('step2.email')} *
                </label>
                <input
                  type={form.contactMethod === 'email' ? 'email' : 'text'}
                  value={form.contactInfo}
                  onChange={(e) => updateForm('contactInfo', e.target.value)}
                  placeholder={
                    form.contactMethod === 'line' ? '@yourlineid' :
                    form.contactMethod === 'phone' ? '+66 X XXXX XXXX' :
                    'your@email.com'
                  }
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-sm"
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-deep-teal mb-2">
                  {t('step2.additionalInfo')}
                </label>
                <textarea
                  value={form.additionalInfo}
                  onChange={(e) => updateForm('additionalInfo', e.target.value)}
                  placeholder={t('step2.additionalInfoPlaceholder')}
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent resize-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed Action Buttons */}
        {!success && (
          <div className="px-6 py-4 border-t bg-pure-white">
            <div className="flex space-x-3">
              {step === 1 ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 text-dark-gray rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!validateStep1()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white rounded-lg font-medium hover:from-brand-cyan/90 hover:to-deep-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('next')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-3 border border-gray-300 text-dark-gray rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    {t('back')}
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!validateStep2() || isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white rounded-lg font-medium hover:from-brand-cyan/90 hover:to-deep-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting && (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    <span>{isSubmitting ? t('submitting') : t('sendInquiry')}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00bbe4;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00bbe4;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}