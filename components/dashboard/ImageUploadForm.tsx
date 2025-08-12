'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'

interface ImageUploadFormProps {
  artist: {
    id: string
    profileImage: string | null
    coverImage: string | null
    stageName: string | null
  }
  locale: string
}

export default function ImageUploadForm({ artist, locale }: ImageUploadFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleImageUpload = async (type: 'profile' | 'cover', file: File) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    // For now, we'll convert to base64 and store directly
    // Later this will use Cloudinary
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const base64 = reader.result as string
        
        const response = await fetch('/api/artist/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            artistId: artist.id,
            type,
            image: base64,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed')
        }

        setSuccess(`${type === 'profile' ? 'Profile' : 'Cover'} image updated successfully!`)
        router.refresh()
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Upload failed')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-pure-white rounded-lg shadow p-6">
      <h2 className="font-playfair text-xl font-bold text-dark-gray mb-6">
        Profile Images
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-dark-gray mb-2">
            Profile Photo
          </label>
          <div className="flex items-start space-x-4">
            <div className="relative w-32 h-32 bg-off-white rounded-lg overflow-hidden">
              {artist.profileImage ? (
                <Image
                  src={artist.profileImage}
                  alt={artist.stageName || 'Profile'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <PhotoIcon className="w-12 h-12 text-dark-gray/30" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload('profile', file)
                  }}
                  disabled={isLoading}
                />
                <div className="inline-flex items-center px-4 py-2 bg-brand-cyan text-pure-white rounded-md hover:bg-brand-cyan/90 transition-colors">
                  <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                  Upload New Photo
                </div>
              </label>
              <p className="mt-2 text-xs text-dark-gray/60">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-dark-gray mb-2">
            Cover Photo
          </label>
          <div className="space-y-4">
            <div className="relative w-full h-48 bg-off-white rounded-lg overflow-hidden">
              {artist.coverImage ? (
                <Image
                  src={artist.coverImage}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <PhotoIcon className="w-16 h-16 text-dark-gray/30" />
                </div>
              )}
            </div>
            <div>
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload('cover', file)
                  }}
                  disabled={isLoading}
                />
                <div className="inline-flex items-center px-4 py-2 bg-brand-cyan text-pure-white rounded-md hover:bg-brand-cyan/90 transition-colors">
                  <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                  Upload Cover Photo
                </div>
              </label>
              <p className="mt-2 text-xs text-dark-gray/60">
                Recommended: 1920x480px or 4:1 aspect ratio
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-soft-lavender/10 rounded-lg border border-soft-lavender/20">
        <p className="text-sm text-dark-gray">
          <strong>Note:</strong> High-quality images help attract more bookings. 
          Make sure your photos are well-lit and professional.
        </p>
      </div>
    </div>
  )
}