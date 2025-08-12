'use client'

import { useState } from 'react'

interface ArtistData {
  id: string
  website?: string | null
  facebook?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
  spotify?: string | null
  soundcloud?: string | null
  mixcloud?: string | null
  lineId?: string | null
}

interface SocialLinksFormProps {
  artist: ArtistData
  locale: string
}

const socialPlatforms = [
  {
    key: 'website',
    name: 'Website',
    icon: '🌐',
    placeholder: 'https://yourwebsite.com',
    prefix: ''
  },
  {
    key: 'facebook',
    name: 'Facebook',
    icon: '📘',
    placeholder: 'facebook.com/yourpage',
    prefix: 'https://facebook.com/'
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: '📷',
    placeholder: 'instagram.com/yourusername',
    prefix: 'https://instagram.com/'
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    placeholder: 'tiktok.com/@yourusername',
    prefix: 'https://tiktok.com/@'
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: '📺',
    placeholder: 'youtube.com/c/yourchannel',
    prefix: 'https://youtube.com/'
  },
  {
    key: 'spotify',
    name: 'Spotify',
    icon: '🎶',
    placeholder: 'open.spotify.com/artist/yourid',
    prefix: 'https://open.spotify.com/'
  },
  {
    key: 'soundcloud',
    name: 'SoundCloud',
    icon: '🔊',
    placeholder: 'soundcloud.com/yourusername',
    prefix: 'https://soundcloud.com/'
  },
  {
    key: 'mixcloud',
    name: 'Mixcloud',
    icon: '🎧',
    placeholder: 'mixcloud.com/yourusername',
    prefix: 'https://mixcloud.com/'
  },
  {
    key: 'lineId',
    name: 'LINE ID',
    icon: '💬',
    placeholder: 'your-line-id',
    prefix: ''
  }
]

export default function SocialLinksForm({ artist, locale }: SocialLinksFormProps) {
  const [formData, setFormData] = useState({
    website: artist.website || '',
    facebook: artist.facebook || '',
    instagram: artist.instagram || '',
    tiktok: artist.tiktok || '',
    youtube: artist.youtube || '',
    spotify: artist.spotify || '',
    soundcloud: artist.soundcloud || '',
    mixcloud: artist.mixcloud || '',
    lineId: artist.lineId || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/artist/social-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Social links updated successfully!')
      } else {
        setMessage('Error updating social links. Please try again.')
      }
    } catch (error) {
      setMessage('Error updating social links. Please try again.')
    }

    setIsLoading(false)
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const validateUrl = (url: string, platform: any) => {
    if (!url) return true
    
    if (platform.key === 'website') {
      return url.startsWith('http://') || url.startsWith('https://')
    }
    
    if (platform.key === 'lineId') {
      return true // LINE ID doesn't need URL validation
    }
    
    return url.includes(platform.key === 'tiktok' ? 'tiktok.com' : platform.key)
  }

  const getFullUrl = (value: string, platform: any) => {
    if (!value) return ''
    if (platform.key === 'website' || platform.key === 'lineId') return value
    if (value.startsWith('http')) return value
    return platform.prefix + value.replace(platform.prefix, '')
  }

  return (
    <div className="bg-pure-white rounded-lg shadow-md p-6">
      <h2 className="font-playfair text-xl font-semibold text-dark-gray mb-6">
        Social Media & Online Presence
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPlatforms.map(platform => (
            <div key={platform.key}>
              <label htmlFor={platform.key} className="block text-sm font-medium text-dark-gray mb-2">
                <span className="mr-2">{platform.icon}</span>
                {platform.name}
              </label>
              <div className="relative">
                {platform.prefix && (
                  <span className="absolute left-3 top-2 text-gray-500 text-sm">
                    {platform.prefix}
                  </span>
                )}
                <input
                  type={platform.key === 'website' ? 'url' : 'text'}
                  id={platform.key}
                  value={formData[platform.key as keyof typeof formData]}
                  onChange={(e) => handleInputChange(platform.key, e.target.value)}
                  className={`w-full ${platform.prefix ? 'pl-32' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan`}
                  placeholder={platform.placeholder}
                />
              </div>
              {formData[platform.key as keyof typeof formData] && !validateUrl(formData[platform.key as keyof typeof formData], platform) && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid {platform.name} URL
                </p>
              )}
              {formData[platform.key as keyof typeof formData] && (
                <p className="text-gray-500 text-xs mt-1">
                  Preview: {getFullUrl(formData[platform.key as keyof typeof formData], platform)}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Social Media Tips */}
        <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg p-4">
          <h4 className="font-medium text-brand-cyan mb-2">💡 Social Media Tips</h4>
          <ul className="text-sm text-dark-gray space-y-1">
            <li>• Complete profiles with professional photos and descriptions</li>
            <li>• Post regularly to show you're active and engaged</li>
            <li>• Share samples of your work, behind-the-scenes content</li>
            <li>• Engage with your audience and respond to comments</li>
            <li>• Use relevant hashtags to increase discoverability</li>
            <li>• Cross-promote between different platforms</li>
          </ul>
        </div>

        {/* Platform-specific advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">🎵 For Musicians & DJs</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Spotify/SoundCloud: Essential for music discovery</li>
              <li>• Mixcloud: Great for DJ mixes and sets</li>
              <li>• YouTube: Perfect for live performance videos</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">📱 For Thai Market</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• LINE: Essential for Thai customer communication</li>
              <li>• Facebook: Still very popular in Thailand</li>
              <li>• TikTok: Growing rapidly among younger audience</li>
            </ul>
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
            {isLoading ? 'Saving...' : 'Save Social Links'}
          </button>
        </div>
      </form>
    </div>
  )
}