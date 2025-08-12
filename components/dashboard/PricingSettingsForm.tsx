'use client'

import { useState } from 'react'

interface ArtistData {
  id: string
  hourlyRate?: number | null
  minimumHours: number
  currency: string
  instantBooking: boolean
  advanceNotice: number
  cancellationPolicy?: string | null
}

interface PricingSettingsFormProps {
  artist: ArtistData
  locale: string
}

export default function PricingSettingsForm({ artist, locale }: PricingSettingsFormProps) {
  const [formData, setFormData] = useState({
    hourlyRate: artist.hourlyRate?.toString() || '',
    minimumHours: artist.minimumHours || 2,
    currency: artist.currency || 'THB',
    instantBooking: artist.instantBooking || false,
    advanceNotice: artist.advanceNotice || 7,
    cancellationPolicy: artist.cancellationPolicy || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/artist/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null
        }),
      })

      if (response.ok) {
        setMessage('Pricing settings updated successfully!')
      } else {
        setMessage('Error updating pricing settings. Please try again.')
      }
    } catch (error) {
      setMessage('Error updating pricing settings. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="bg-pure-white rounded-lg shadow-md p-6">
      <h2 className="font-playfair text-xl font-semibold text-dark-gray mb-6">
        Pricing & Booking Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hourly Rate & Minimum Hours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-dark-gray mb-2">
              Hourly Rate
            </label>
            <div className="relative">
              <input
                type="number"
                id="hourlyRate"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
                placeholder="0.00"
              />
              <span className="absolute left-3 top-2 text-gray-500">₿</span>
            </div>
          </div>
          <div>
            <label htmlFor="minimumHours" className="block text-sm font-medium text-dark-gray mb-2">
              Minimum Hours
            </label>
            <input
              type="number"
              id="minimumHours"
              min="1"
              max="12"
              value={formData.minimumHours}
              onChange={(e) => setFormData(prev => ({ ...prev, minimumHours: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
              required
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-dark-gray mb-2">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
              required
            >
              <option value="THB">THB (Thai Baht)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="space-y-4">
          <h3 className="font-playfair text-lg font-medium text-dark-gray">
            Booking Options
          </h3>
          
          {/* Instant Booking */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <label htmlFor="instantBooking" className="font-medium text-dark-gray">
                Enable Instant Booking
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Allow clients to book you immediately without approval
              </p>
            </div>
            <input
              type="checkbox"
              id="instantBooking"
              checked={formData.instantBooking}
              onChange={(e) => setFormData(prev => ({ ...prev, instantBooking: e.target.checked }))}
              className="w-4 h-4 text-brand-cyan focus:ring-brand-cyan border-gray-300 rounded"
            />
          </div>

          {/* Advance Notice */}
          <div>
            <label htmlFor="advanceNotice" className="block text-sm font-medium text-dark-gray mb-2">
              Advance Notice Required (days)
            </label>
            <select
              id="advanceNotice"
              value={formData.advanceNotice}
              onChange={(e) => setFormData(prev => ({ ...prev, advanceNotice: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
              required
            >
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>1 week</option>
              <option value={14}>2 weeks</option>
              <option value={30}>1 month</option>
            </select>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div>
          <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-dark-gray mb-2">
            Cancellation Policy
          </label>
          <textarea
            id="cancellationPolicy"
            rows={3}
            value={formData.cancellationPolicy}
            onChange={(e) => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
            placeholder="Describe your cancellation policy, refund terms, and any fees..."
          />
        </div>

        {/* Pricing Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Pricing Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Research competitors' rates in your area</li>
            <li>• Consider your experience level and unique skills</li>
            <li>• Factor in equipment, travel, and setup time</li>
            <li>• Leave room for negotiation on longer bookings</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <div>
            {message && (
              <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-cyan text-pure-white px-6 py-2 rounded-md font-medium hover:bg-brand-cyan/90 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Pricing Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}