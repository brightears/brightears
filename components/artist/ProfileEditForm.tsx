'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserIcon, MusicNoteIcon, GlobeAltIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

interface ArtistProfile {
  id: string
  stageName: string
  realName?: string | null
  bio?: string | null
  category: string
  subCategories?: string[]
  baseCity: string
  serviceAreas?: string[]
  languages?: string[]
  genres?: string[]
  hourlyRate?: number | null
  minimumHours?: number | null
  website?: string | null
  facebook?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
  lineId?: string | null
}

interface ProfileEditFormProps {
  artist: ArtistProfile
  locale: string
}

export default function ProfileEditForm({ artist, locale }: ProfileEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    stageName: artist.stageName || '',
    realName: artist.realName || '',
    bio: artist.bio || '',
    category: artist.category || 'SINGER',
    baseCity: artist.baseCity || 'Bangkok',
    languages: artist.languages?.join(', ') || 'English, Thai',
    genres: artist.genres?.join(', ') || '',
    hourlyRate: artist.hourlyRate?.toString() || '',
    minimumHours: artist.minimumHours?.toString() || '2',
    website: artist.website || '',
    facebook: artist.facebook || '',
    instagram: artist.instagram || '',
    tiktok: artist.tiktok || '',
    youtube: artist.youtube || '',
    lineId: artist.lineId || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/artist/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          languages: formData.languages.split(',').map(l => l.trim()).filter(l => l),
          genres: formData.genres.split(',').map(g => g.trim()).filter(g => g),
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
          minimumHours: formData.minimumHours ? parseInt(formData.minimumHours) : 2
        })
      })

      if (!response.ok) throw new Error('Failed to update profile')
      
      setSuccess('Profile updated successfully!')
      setTimeout(() => router.refresh(), 1500)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg">
          {success}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <UserIcon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Basic Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stage Name *
            </label>
            <input
              type="text"
              value={formData.stageName}
              onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Real Name
            </label>
            <input
              type="text"
              value={formData.realName}
              onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tell us about yourself and your performance style..."
            />
          </div>
        </div>
      </div>

      {/* Performance Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <MusicNoteIcon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Performance Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="SINGER">Singer</option>
              <option value="DJ">DJ</option>
              <option value="BAND">Band</option>
              <option value="DANCER">Dancer</option>
              <option value="COMEDIAN">Comedian</option>
              <option value="MAGICIAN">Magician</option>
              <option value="MC">MC/Host</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genres (comma separated)
            </label>
            <input
              type="text"
              value={formData.genres}
              onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Pop, Rock, Jazz..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages (comma separated)
            </label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="English, Thai, Chinese..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base City *
            </label>
            <input
              type="text"
              value={formData.baseCity}
              onChange={(e) => setFormData({ ...formData, baseCity: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <CurrencyDollarIcon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Pricing</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate (THB)
            </label>
            <input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Hours
            </label>
            <input
              type="number"
              value={formData.minimumHours}
              onChange={(e) => setFormData({ ...formData, minimumHours: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
              max="8"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <GlobeAltIcon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Social Links</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok
              </label>
              <input
                type="text"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LINE ID
              </label>
              <input
                type="text"
                value={formData.lineId}
                onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your LINE ID"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}