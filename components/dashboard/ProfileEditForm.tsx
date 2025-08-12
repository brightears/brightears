'use client'

import { useState } from 'react'
import { ArtistCategory } from '@prisma/client'

interface ArtistData {
  id: string
  stageName: string
  realName?: string | null
  bio?: string | null
  bioTh?: string | null
  category: ArtistCategory
  subCategories: string[]
  baseCity: string
  languages: string[]
  genres: string[]
}

interface ProfileEditFormProps {
  artist: ArtistData
  locale: string
}

const categories = [
  'DJ', 'BAND', 'SINGER', 'MUSICIAN', 'MC', 'COMEDIAN', 
  'MAGICIAN', 'DANCER', 'PHOTOGRAPHER', 'SPEAKER'
]

const commonGenres = [
  'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip Hop',
  'R&B', 'Country', 'Folk', 'Reggae', 'Latin', 'World Music'
]

const cities = [
  'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Koh Samui',
  'Krabi', 'Hua Hin', 'Chiang Rai', 'Ayutthaya', 'Kanchanaburi'
]

export default function ProfileEditForm({ artist, locale }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    stageName: artist.stageName || '',
    realName: artist.realName || '',
    bio: artist.bio || '',
    bioTh: artist.bioTh || '',
    category: artist.category,
    subCategories: artist.subCategories || [],
    baseCity: artist.baseCity || '',
    languages: artist.languages || ['en'],
    genres: artist.genres || []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/artist/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Profile updated successfully!')
      } else {
        setMessage('Error updating profile. Please try again.')
      }
    } catch (error) {
      setMessage('Error updating profile. Please try again.')
    }

    setIsLoading(false)
  }

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  return (
    <div className="bg-pure-white rounded-lg shadow-md p-6">
      <h2 className="font-playfair text-xl font-semibold text-dark-gray mb-6">
        Basic Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stage Name & Real Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="stageName" className="block text-sm font-medium text-dark-gray mb-2">
              Stage Name *
            </label>
            <input
              type="text"
              id="stageName"
              value={formData.stageName}
              onChange={(e) => setFormData(prev => ({ ...prev, stageName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
              required
            />
          </div>
          <div>
            <label htmlFor="realName" className="block text-sm font-medium text-dark-gray mb-2">
              Real Name
            </label>
            <input
              type="text"
              id="realName"
              value={formData.realName}
              onChange={(e) => setFormData(prev => ({ ...prev, realName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
            />
          </div>
        </div>

        {/* Category & Base City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-dark-gray mb-2">
              Primary Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ArtistCategory }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="baseCity" className="block text-sm font-medium text-dark-gray mb-2">
              Base City *
            </label>
            <select
              id="baseCity"
              value={formData.baseCity}
              onChange={(e) => setFormData(prev => ({ ...prev, baseCity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
              required
            >
              <option value="">Select a city</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio in English */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-dark-gray mb-2">
            Bio (English)
          </label>
          <textarea
            id="bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
            placeholder="Tell clients about yourself, your experience, and what makes you unique..."
          />
        </div>

        {/* Bio in Thai */}
        <div>
          <label htmlFor="bioTh" className="block text-sm font-medium text-dark-gray mb-2">
            Bio (Thai)
          </label>
          <textarea
            id="bioTh"
            rows={4}
            value={formData.bioTh}
            onChange={(e) => setFormData(prev => ({ ...prev, bioTh: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
            placeholder="เล่าเกี่ยวกับตัวคุณ ประสบการณ์ และสิ่งที่ทำให้คุณพิเศษ..."
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-dark-gray mb-2">
            Languages Spoken
          </label>
          <div className="flex flex-wrap gap-2">
            {['en', 'th', 'zh', 'ja', 'ko'].map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageToggle(lang)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.languages.includes(lang)
                    ? 'bg-brand-cyan text-pure-white'
                    : 'bg-gray-100 text-dark-gray hover:bg-gray-200'
                }`}
              >
                {lang === 'en' ? 'English' : 
                 lang === 'th' ? 'Thai' :
                 lang === 'zh' ? 'Chinese' :
                 lang === 'ja' ? 'Japanese' : 'Korean'}
              </button>
            ))}
          </div>
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium text-dark-gray mb-2">
            Musical Genres
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {commonGenres.map(genre => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.genres.includes(genre)
                    ? 'bg-brand-cyan text-pure-white'
                    : 'bg-gray-100 text-dark-gray hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}