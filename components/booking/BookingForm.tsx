'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/components/navigation'
import { useTranslations } from 'next-intl'
import ErrorModal from '@/components/ui/ErrorModal'

interface BookingFormProps {
  artist: any
  userId: string
  locale: string
}

export default function BookingForm({ artist, userId, locale }: BookingFormProps) {
  const router = useRouter()
  const t = useTranslations('booking')
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [estimatedTotal, setEstimatedTotal] = useState(0)
  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '',
    duration: artist.minimumHours || 2,
    eventType: '',
    venueName: '',
    venueAddress: '',
    expectedGuests: '',
    message: '',
    contactPhone: '',
    contactEmail: '',
  })

  // Calculate estimated total whenever duration changes
  useEffect(() => {
    const baseRate = artist.hourlyRate || 2500
    const total = baseRate * formData.duration
    setEstimatedTotal(total)
  }, [formData.duration, artist.hourlyRate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artistId: artist.id,
          customerId: userId,
          ...formData,
          totalAmount: artist.hourlyRate * formData.duration,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const booking = await response.json()
      
      // Redirect to booking confirmation
      router.push(`/bookings/${booking.id}/confirmation`)
    } catch (error) {
      console.error('Booking error:', error)
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to create booking. Please check your information and try again.'
      )
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotal = () => {
    return (artist.hourlyRate || 2500) * formData.duration
  }

  return (
    <form onSubmit={handleSubmit} className="bg-pure-white rounded-lg shadow-md p-6">
      <h2 className="font-playfair text-2xl font-bold text-dark-gray mb-6">
        Event Details
      </h2>

      <div className="space-y-6">
        {/* Event Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-dark-gray mb-1">
              Event Date *
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.eventDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent ${locale === 'th' ? 'font-noto-thai' : 'font-inter'}`}
            />
          </div>
          
          <div>
            <label htmlFor="eventTime" className="block text-sm font-medium text-dark-gray mb-1">
              Start Time *
            </label>
            <input
              type="time"
              id="eventTime"
              name="eventTime"
              required
              value={formData.eventTime}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent ${locale === 'th' ? 'font-noto-thai' : 'font-inter'}`}
            />
          </div>
        </div>

        {/* Duration & Event Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-dark-gray mb-1">
              Duration (hours) *
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              required
              min={artist.minimumHours || 1}
              max={12}
              value={formData.duration}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent ${locale === 'th' ? 'font-noto-thai' : 'font-inter'}`}
            />
          </div>
          
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-dark-gray mb-1">
              Event Type *
            </label>
            <select
              id="eventType"
              name="eventType"
              required
              value={formData.eventType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent ${locale === 'th' ? 'font-noto-thai' : 'font-inter'}`}
            >
              <option value="">Select event type</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Club/Bar">Club/Bar</option>
              <option value="Private Party">Private Party</option>
              <option value="Festival">Festival</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Venue Information */}
        <div>
          <label htmlFor="venueName" className="block text-sm font-medium text-dark-gray mb-1">
            Venue Name *
          </label>
          <input
            type="text"
            id="venueName"
            name="venueName"
            required
            value={formData.venueName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            placeholder="e.g., Marriott Bangkok"
          />
        </div>

        <div>
          <label htmlFor="venueAddress" className="block text-sm font-medium text-dark-gray mb-1">
            Venue Address *
          </label>
          <input
            type="text"
            id="venueAddress"
            name="venueAddress"
            required
            value={formData.venueAddress}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            placeholder="Full address of the venue"
          />
        </div>

        <div>
          <label htmlFor="expectedGuests" className="block text-sm font-medium text-dark-gray mb-1">
            Expected Number of Guests
          </label>
          <input
            type="number"
            id="expectedGuests"
            name="expectedGuests"
            value={formData.expectedGuests}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            placeholder="Approximate number"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-dark-gray mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              required
              value={formData.contactEmail}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent ${locale === 'th' ? 'font-noto-thai' : 'font-inter'}`}
            />
          </div>
          
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-dark-gray mb-1">
              Contact Phone *
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              required
              value={formData.contactPhone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent ${locale === 'th' ? 'font-noto-thai' : 'font-inter'}`}
            />
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-dark-gray mb-1">
            Special Requests or Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            placeholder="Any special requirements, song requests, or additional information..."
          />
        </div>

        {/* Total Cost */}
        <div className="border-t pt-6">
          <div className="bg-off-white rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-dark-gray/70">Base Rate ({formData.duration} hours)</span>
              <span className="text-sm text-dark-gray">
                ฿{((artist.hourlyRate || 2500) * formData.duration).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-lg font-medium text-dark-gray">Estimated Total</span>
              <span className="text-2xl font-bold text-brand-cyan">
                ฿{estimatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-brand-cyan text-pure-white font-medium rounded-lg hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending Request...' : 'Send Booking Request'}
          </button>

          <p className="mt-4 text-sm text-dark-gray/70 text-center">
            This is a booking request. The artist will review and confirm availability.
          </p>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Booking Request Failed"
        message={errorMessage}
        actionText="Try Again"
        onAction={() => setShowErrorModal(false)}
      />
    </form>
  )
}