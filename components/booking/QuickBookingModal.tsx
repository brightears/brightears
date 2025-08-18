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
  averageRating?: number
  reviewCount?: number
  isAvailable?: boolean
}

interface QuickBookingModalProps {
  artist: Artist
  isOpen: boolean
  onClose: () => void
  triggerElement?: React.ReactNode
}

interface BookingForm {
  eventDate: string
  eventTime: string
  eventType: string
  location: string
  duration: number
  additionalInfo: string
  contactMethod: 'email' | 'line' | 'phone'
  contactInfo: string
}

const EVENT_TYPES = [
  'wedding', 'corporate', 'birthday', 'anniversary', 'festival', 
  'private_party', 'nightclub', 'restaurant', 'hotel', 'other'
]

const THAI_CITIES = [
  'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Hua Hin',
  'Koh Samui', 'Krabi', 'Rayong', 'Khon Kaen', 'Udon Thani'
]

export default function QuickBookingModal({ 
  artist, 
  isOpen, 
  onClose, 
  triggerElement 
}: QuickBookingModalProps) {
  const t = useTranslations('booking.quick')
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
    additionalInfo: '',
    contactMethod: 'email',
    contactInfo: session?.user?.email || ''
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setError(null)
      setSuccess(false)
      setForm(prev => ({
        ...prev,
        contactInfo: session?.user?.email || '',
        location: artist.baseCity || 'Bangkok',
        duration: artist.minimumHours || 3
      }))
    }
  }, [isOpen, artist, session])

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

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(form.eventDate && form.eventTime && form.eventType)
      case 2:
        return !!(form.location && form.duration >= 1)
      case 3:
        return !!(form.contactMethod && form.contactInfo.trim())
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      setError(null)
    } else {
      setError(t('validation.completeRequired'))
    }
  }

  const prevStep = () => {
    setStep(step - 1)
    setError(null)
  }

  const calculateEstimate = () => {
    if (!artist.hourlyRate) return null
    const basePrice = artist.hourlyRate * form.duration
    return {
      basePrice,
      estimatedTotal: basePrice,
      currency: 'THB'
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
          inquiryMethod: 'QUICK_MODAL'
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setStep(4) // Success step
        
        // Auto-close after success
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-pure-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-cyan to-deep-teal px-6 py-4 text-pure-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {artist.profileImage && (
                <img 
                  src={artist.profileImage} 
                  alt={artist.stageName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-pure-white/20"
                />
              )}
              <div>
                <h3 className="font-playfair font-bold text-xl">{t('title')}</h3>
                <p className="text-pure-white/90 text-sm">
                  {artist.stageName} • {t(`categories.${artist.category.toLowerCase()}`)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-pure-white/80 hover:text-pure-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-off-white border-b">
          <div className="flex items-center justify-between text-sm text-dark-gray/70 mb-2">
            <span>{t('step')} {step}/4</span>
            <span>{t('estimatedTime', { minutes: 2 })}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-brand-cyan to-deep-teal h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Event Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-playfair font-bold text-lg text-deep-teal mb-4">
                  {t('step1.title')}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Event Date */}
                  <div>
                    <label className="block text-sm font-medium text-deep-teal mb-2">
                      {t('step1.eventDate')} *
                    </label>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => updateForm('eventDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                    />
                  </div>

                  {/* Event Time */}
                  <div>
                    <label className="block text-sm font-medium text-deep-teal mb-2">
                      {t('step1.eventTime')} *
                    </label>
                    <input
                      type="time"
                      value={form.eventTime}
                      onChange={(e) => updateForm('eventTime', e.target.value)}
                      className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Event Type */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('step1.eventType')} *
                  </label>
                  <select
                    value={form.eventType}
                    onChange={(e) => updateForm('eventType', e.target.value)}
                    className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  >
                    <option value="">{t('step1.selectEventType')}</option>
                    {EVENT_TYPES.map(type => (
                      <option key={type} value={type}>
                        {t(`eventTypes.${type}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Duration */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-playfair font-bold text-lg text-deep-teal mb-4">
                  {t('step2.title')}
                </h4>
                
                {/* Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('step2.location')} *
                  </label>
                  <select
                    value={form.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                    className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  >
                    {THAI_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('step2.duration')} *
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min={artist.minimumHours || 1}
                      max={12}
                      value={form.duration}
                      onChange={(e) => updateForm('duration', parseInt(e.target.value))}
                      className="w-24 px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                    />
                    <span className="text-sm text-dark-gray">{t('step2.hours')}</span>
                    {artist.minimumHours && (
                      <span className="text-xs text-dark-gray/70">
                        {t('step2.minimum', { hours: artist.minimumHours })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Estimate */}
                {artist.hourlyRate && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-brand-cyan/5 to-deep-teal/5 rounded-lg border border-brand-cyan/20">
                    <h5 className="font-medium text-deep-teal mb-2">{t('step2.estimate')}</h5>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>{t('step2.hourlyRate')}</span>
                        <span>฿{artist.hourlyRate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('step2.duration')}</span>
                        <span>{form.duration} {t('step2.hours')}</span>
                      </div>
                      <div className="border-t pt-1 mt-2 flex justify-between font-medium text-brand-cyan">
                        <span>{t('step2.estimated')}</span>
                        <span>฿{(artist.hourlyRate * form.duration).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-playfair font-bold text-lg text-deep-teal mb-4">
                  {t('step3.title')}
                </h4>

                {/* Contact Method */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('step3.preferredContact')} *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['email', 'line', 'phone'].map(method => (
                      <button
                        key={method}
                        onClick={() => updateForm('contactMethod', method as any)}
                        className={`p-3 rounded-lg border-2 transition-colors text-center ${
                          form.contactMethod === method
                            ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                            : 'border-deep-teal/30 text-dark-gray hover:border-brand-cyan/50'
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {t(`contactMethods.${method}`)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {form.contactMethod === 'email' && t('step3.email')}
                    {form.contactMethod === 'line' && t('step3.lineId')}
                    {form.contactMethod === 'phone' && t('step3.phone')} *
                  </label>
                  <input
                    type={form.contactMethod === 'email' ? 'email' : 'text'}
                    value={form.contactInfo}
                    onChange={(e) => updateForm('contactInfo', e.target.value)}
                    placeholder={
                      form.contactMethod === 'email' ? 'your@email.com' :
                      form.contactMethod === 'line' ? '@yourlineid' :
                      '+66 X XXXX XXXX'
                    }
                    className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  />
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">
                    {t('step3.additionalInfo')}
                  </label>
                  <textarea
                    value={form.additionalInfo}
                    onChange={(e) => updateForm('additionalInfo', e.target.value)}
                    placeholder={t('step3.additionalInfoPlaceholder')}
                    rows={3}
                    className="w-full px-3 py-2 border border-deep-teal/30 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && success && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-playfair font-bold text-xl text-deep-teal mb-2">
                {t('success.title')}
              </h4>
              <p className="text-dark-gray mb-4">
                {t('success.message', { artist: artist.stageName })}
              </p>
              <p className="text-sm text-dark-gray/70">
                {t('success.autoClose')}
              </p>
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

        {/* Footer */}
        {step <= 3 && (
          <div className="flex justify-between items-center p-6 border-t bg-off-white">
            <button
              onClick={step === 1 ? onClose : prevStep}
              className="px-6 py-2 border border-deep-teal/30 text-deep-teal rounded-lg hover:bg-deep-teal/5 transition-colors"
            >
              {step === 1 ? t('cancel') : t('back')}
            </button>
            
            <div className="flex items-center space-x-3">
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!validateStep(step)}
                  className="px-6 py-2 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white rounded-lg hover:from-brand-cyan/90 hover:to-deep-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('next')}
                </button>
              ) : (
                <button
                  onClick={submitBooking}
                  disabled={!validateStep(step) || isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white rounded-lg hover:from-brand-cyan/90 hover:to-deep-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting && (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  <span>{isSubmitting ? t('submitting') : t('sendInquiry')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}