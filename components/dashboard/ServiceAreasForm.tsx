'use client'

import { useState } from 'react'

interface ArtistData {
  id: string
  baseCity: string
  serviceAreas: string[]
  travelRadius?: number | null
}

interface ServiceAreasFormProps {
  artist: ArtistData
  locale: string
}

const thailandProvinces = [
  'Bangkok', 'Chiang Mai', 'Chiang Rai', 'Lampang', 'Mae Hong Son',
  'Nakhon Ratchasima', 'Buri Ram', 'Surin', 'Si Sa Ket', 'Ubon Ratchathani',
  'Yasothon', 'Chaiyaphum', 'Amnat Charoen', 'Nong Bua Lam Phu', 'Khon Kaen',
  'Udon Thani', 'Loei', 'Nong Khai', 'Maha Sarakham', 'Roi Et',
  'Kalasin', 'Sakon Nakhon', 'Nakhon Phanom', 'Mukdahan', 'Chonburi',
  'Rayong', 'Chanthaburi', 'Trat', 'Chachoengsao', 'Prachin Buri',
  'Nakhon Nayok', 'Sa Kaeo', 'Nakhon Pathom', 'Ratchaburi', 'Kanchanaburi',
  'Suphan Buri', 'Ayutthaya', 'Ang Thong', 'Sing Buri', 'Saraburi',
  'Lop Buri', 'Chai Nat', 'Uthai Thani', 'Nakhon Sawan', 'Tak',
  'Sukhothai', 'Phitsanulok', 'Kamphaeng Phet', 'Phichit', 'Phetchabun',
  'Utharadit', 'Nan', 'Phayao', 'Phrae', 'Nakhon Si Thammarat',
  'Krabi', 'Phang Nga', 'Phuket', 'Surat Thani', 'Ranong',
  'Chumphon', 'Prachuap Khiri Khan', 'Phetchaburi', 'Hua Hin', 'Samut Songkhram',
  'Samut Sakhon', 'Nonthaburi', 'Pathum Thani', 'Phra Nakhon Si Ayutthaya',
  'Songkhla', 'Satun', 'Trang', 'Phatthalung', 'Pattani', 'Yala', 'Narathiwat'
]

export default function ServiceAreasForm({ artist, locale }: ServiceAreasFormProps) {
  const [formData, setFormData] = useState({
    serviceAreas: artist.serviceAreas || [artist.baseCity],
    travelRadius: artist.travelRadius?.toString() || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/artist/service-areas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          travelRadius: formData.travelRadius ? parseInt(formData.travelRadius) : null
        }),
      })

      if (response.ok) {
        setMessage('Service areas updated successfully!')
      } else {
        setMessage('Error updating service areas. Please try again.')
      }
    } catch (error) {
      setMessage('Error updating service areas. Please try again.')
    }

    setIsLoading(false)
  }

  const handleAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }))
  }

  const selectAll = () => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: thailandProvinces
    }))
  }

  const clearAll = () => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: [artist.baseCity]
    }))
  }

  // Group provinces by region for better organization
  const regions = {
    'Central': ['Bangkok', 'Nakhon Pathom', 'Ratchaburi', 'Kanchanaburi', 'Suphan Buri', 'Ayutthaya', 'Ang Thong', 'Sing Buri', 'Saraburi', 'Lop Buri', 'Chai Nat', 'Uthai Thani', 'Nakhon Sawan', 'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram'],
    'North': ['Chiang Mai', 'Chiang Rai', 'Lampang', 'Mae Hong Son', 'Tak', 'Sukhothai', 'Phitsanulok', 'Kamphaeng Phet', 'Phichit', 'Phetchabun', 'Utharadit', 'Nan', 'Phayao', 'Phrae'],
    'Northeast': ['Nakhon Ratchasima', 'Buri Ram', 'Surin', 'Si Sa Ket', 'Ubon Ratchathani', 'Yasothon', 'Chaiyaphum', 'Amnat Charoen', 'Nong Bua Lam Phu', 'Khon Kaen', 'Udon Thani', 'Loei', 'Nong Khai', 'Maha Sarakham', 'Roi Et', 'Kalasin', 'Sakon Nakhon', 'Nakhon Phanom', 'Mukdahan'],
    'East': ['Chonburi', 'Rayong', 'Chanthaburi', 'Trat', 'Chachoengsao', 'Prachin Buri', 'Nakhon Nayok', 'Sa Kaeo'],
    'South': ['Nakhon Si Thammarat', 'Krabi', 'Phang Nga', 'Phuket', 'Surat Thani', 'Ranong', 'Chumphon', 'Prachuap Khiri Khan', 'Phetchaburi', 'Songkhla', 'Satun', 'Trang', 'Phatthalung', 'Pattani', 'Yala', 'Narathiwat']
  }

  return (
    <div className="bg-pure-white rounded-lg shadow-md p-6">
      <h2 className="font-playfair text-xl font-semibold text-dark-gray mb-6">
        Service Areas
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Travel Radius */}
        <div>
          <label htmlFor="travelRadius" className="block text-sm font-medium text-dark-gray mb-2">
            Maximum Travel Radius (km)
          </label>
          <input
            type="number"
            id="travelRadius"
            min="0"
            max="1000"
            value={formData.travelRadius}
            onChange={(e) => setFormData(prev => ({ ...prev, travelRadius: e.target.value }))}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
            placeholder="e.g., 100"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty if you're willing to travel anywhere
          </p>
        </div>

        {/* Service Areas Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-dark-gray">
              Cities & Provinces You Serve
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={selectAll}
                className="px-3 py-1 text-sm bg-brand-cyan text-pure-white rounded-md hover:bg-brand-cyan/90"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="px-3 py-1 text-sm bg-gray-200 text-dark-gray rounded-md hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(regions).map(([region, provinces]) => (
              <div key={region}>
                <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">
                  {region} Thailand
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {provinces.map(province => (
                    <button
                      key={province}
                      type="button"
                      onClick={() => handleAreaToggle(province)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                        formData.serviceAreas.includes(province)
                          ? 'bg-brand-cyan text-pure-white'
                          : 'bg-gray-100 text-dark-gray hover:bg-gray-200'
                      } ${province === artist.baseCity ? 'ring-2 ring-earthy-brown' : ''}`}
                    >
                      {province}
                      {province === artist.baseCity && (
                        <span className="ml-1 text-xs">🏠</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{formData.serviceAreas.length}</strong> areas selected. 
              Your base city ({artist.baseCity}) is marked with 🏠 and cannot be removed.
            </p>
          </div>
        </div>

        {/* Service Area Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">💡 Service Area Tips</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Select areas where you can realistically travel for gigs</li>
            <li>• Consider transportation costs and time when setting your radius</li>
            <li>• More service areas = more booking opportunities</li>
            <li>• You can always adjust travel fees in your pricing</li>
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
            {isLoading ? 'Saving...' : 'Save Service Areas'}
          </button>
        </div>
      </form>
    </div>
  )
}