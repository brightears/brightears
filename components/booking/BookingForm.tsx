'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/components/navigation'
import { useTranslations } from 'next-intl'
import ErrorModal from '@/components/ui/ErrorModal'
import AvailabilityCalendar from './AvailabilityCalendar'

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
  const [showCalendar, setShowCalendar] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [formData, setFormData] = useState({
    eventDate: '',
    startTime: '',
    endTime: '',
    duration: artist.minimumHours || 2,
    eventType: '',
    venue: '',
    venueAddress: '',
    guestCount: '',
    specialRequests: '',
    contactPhone: '',
    budgetRange: '',
    notes: '',
  })

  // Calculate estimated total and end time whenever duration or start time changes
  useEffect(() => {
    const baseRate = artist.hourlyRate || 2500
    const total = baseRate * formData.duration
    setEstimatedTotal(total)
    
    // Auto-calculate end time when start time and duration are set
    if (formData.startTime && formData.duration) {
      const [hours, minutes] = formData.startTime.split(':').map(Number)
      const startDate = new Date()
      startDate.setHours(hours, minutes, 0, 0)
      
      const endDate = new Date(startDate.getTime() + (formData.duration * 60 * 60 * 1000))
      const endTimeString = endDate.toTimeString().slice(0, 5)
      
      if (formData.endTime !== endTimeString) {
        setFormData(prev => ({ ...prev, endTime: endTimeString }))
      }
    }
  }, [formData.duration, formData.startTime, artist.hourlyRate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: string, availability?: any[]) => {
    setFormData(prev => ({ ...prev, eventDate: date }))
    setAvailableSlots(availability || [])
    setShowCalendar(false)
    
    // Auto-set start time to the first available slot if available
    if (availability && availability.length > 0) {
      const firstSlot = availability[0]
      const startTime = firstSlot.startTime.toTimeString().slice(0, 5)
      setFormData(prev => ({ ...prev, startTime }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Format datetime fields to ISO strings for API
      const eventDate = new Date(formData.eventDate)
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number)
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number)
      
      const startDateTime = new Date(eventDate)
      startDateTime.setHours(startHours, startMinutes, 0, 0)
      
      const endDateTime = new Date(eventDate)
      endDateTime.setHours(endHours, endMinutes, 0, 0)
      
      // If end time is earlier than start time, assume it's next day
      if (endDateTime <= startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1)
      }

      const bookingData = {
        artistId: artist.id,
        eventType: formData.eventType,
        eventDate: eventDate.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: formData.duration,
        venue: formData.venue,
        venueAddress: formData.venueAddress,
        guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
        specialRequests: formData.specialRequests || undefined,
        budgetRange: formData.budgetRange || undefined,
        contactPhone: formData.contactPhone,
        notes: formData.notes || undefined,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      const result = await response.json()
      
      // Redirect to booking confirmation
      router.push(`/${locale}/dashboard/customer/bookings`)
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
            <div className="relative">
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
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-brand-cyan hover:text-brand-cyan/80 transition-colors"
                title="View availability calendar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            {formData.eventDate && (
              <p className="text-xs text-dark-gray/70 mt-1">
                Selected: {new Date(formData.eventDate).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-dark-gray mb-1">
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              required
              value={formData.startTime}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent ${locale === 'th' ? 'font-noto-thai' : 'font-inter'}`}
            />
          </div>
        </div>

        {/* End Time (auto-calculated) */}
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-dark-gray mb-1">
            End Time (calculated automatically)
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            readOnly
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
          />
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
          <label htmlFor="venue" className="block text-sm font-medium text-dark-gray mb-1">
            Venue Name *
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            required
            value={formData.venue}
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
          <label htmlFor="guestCount" className="block text-sm font-medium text-dark-gray mb-1">
            Expected Number of Guests
          </label>
          <input
            type="number"
            id="guestCount"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            placeholder="Approximate number"
          />
        </div>

        {/* Contact Information & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="e.g., +66 9 xxxx xxxx"
            />
          </div>
          
          <div>
            <label htmlFor="budgetRange" className="block text-sm font-medium text-dark-gray mb-1">
              Budget Range (optional)
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent ${locale === 'th' ? 'font-noto-thai' : 'font-inter'}`}
            >
              <option value="">Select budget range</option>
              <option value="Under ฿10,000">Under ฿10,000</option>
              <option value="฿10,000 - ฿25,000">฿10,000 - ฿25,000</option>
              <option value="฿25,000 - ฿50,000">฿25,000 - ฿50,000</option>
              <option value="฿50,000 - ฿100,000">฿50,000 - ฿100,000</option>
              <option value="Over ฿100,000">Over ฿100,000</option>
            </select>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-dark-gray mb-1">
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows={3}
            value={formData.specialRequests}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            placeholder="Any special requirements, song requests, equipment needs..."
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-dark-gray mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            placeholder="Any additional information about your event..."
          />
        </div>

        {/* Availability Calendar */}
        {showCalendar && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-dark-gray">Artist Availability</h3>
              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="text-dark-gray/70 hover:text-dark-gray transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AvailabilityCalendar
              artistId={artist.id}
              selectedDate={formData.eventDate}
              onDateSelect={handleDateSelect}
              locale={locale}
            />
          </div>
        )}

        {/* Available Time Slots */}
        {availableSlots.length > 0 && formData.eventDate && (
          <div className="bg-off-white rounded-lg p-4">
            <h4 className="font-medium text-dark-gray mb-3">Available Time Slots</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSlots.map((slot, index) => {
                const startTime = slot.startTime.toTimeString().slice(0, 5)
                const endTime = slot.endTime.toTimeString().slice(0, 5)
                const isSelected = formData.startTime === startTime
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, startTime }))}
                    className={`p-2 rounded-md text-sm transition-colors ${
                      isSelected
                        ? 'bg-brand-cyan text-white'
                        : 'bg-pure-white text-dark-gray hover:bg-brand-cyan/10 hover:text-brand-cyan border border-brand-cyan/20'
                    }`}
                  >
                    {startTime} - {endTime}
                  </button>
                )
              })}
            </div>
          </div>
        )}

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