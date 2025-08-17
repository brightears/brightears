'use client'

import { useState, useEffect } from 'react'
import ImageUpload from '@/components/upload/ImageUpload'
import AudioUpload from '@/components/upload/AudioUpload'
import MediaGallery from '@/components/upload/MediaGallery'

interface Artist {
  id: string
  profileImage?: string | null
  coverImage?: string | null
  images: string[]
  audioSamples: string[]
}

interface MediaGalleryManagerProps {
  artistId: string
  locale: string
}

export default function MediaGalleryManager({ artistId, locale }: MediaGalleryManagerProps) {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchArtistData()
  }, [artistId])

  const fetchArtistData = async () => {
    try {
      const response = await fetch(`/api/artists/${artistId}`)
      if (!response.ok) throw new Error('Failed to fetch artist data')
      
      const data = await response.json()
      setArtist({
        id: data.id,
        profileImage: data.profileImage,
        coverImage: data.coverImage,
        images: data.images || [],
        audioSamples: data.audioSamples || []
      })
    } catch (error) {
      setError('Failed to load artist data')
      console.error('Error fetching artist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (url: string) => {
    setSuccess('Upload successful!')
    setError(null)
    // Refresh artist data to show new upload
    fetchArtistData()
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage)
    setSuccess(null)
  }

  const handleMediaDeleted = (url: string, type: 'image' | 'audio') => {
    setSuccess('Media deleted successfully!')
    setError(null)
    // Refresh artist data to reflect deletion
    fetchArtistData()
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load artist data</p>
        <button 
          onClick={fetchArtistData}
          className="mt-4 px-4 py-2 bg-brand-cyan text-white rounded-md hover:bg-brand-cyan/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Status Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Profile & Cover Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Image */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
            Profile Image
          </h3>
          <ImageUpload
            type="profile"
            artistId={artistId}
            currentImage={artist.profileImage || undefined}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            className="h-64"
          />
        </div>

        {/* Cover Image */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
            Cover Image
          </h3>
          <ImageUpload
            type="cover"
            artistId={artistId}
            currentImage={artist.coverImage || undefined}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            className="h-64"
          />
        </div>
      </div>

      {/* Gallery Images Upload */}
      <div className="bg-pure-white rounded-lg shadow-md p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
          Gallery Images
        </h3>
        <ImageUpload
          type="gallery"
          artistId={artistId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          multiple={true}
        />
      </div>

      {/* Audio Samples Upload */}
      <div className="bg-pure-white rounded-lg shadow-md p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
          Audio Samples
        </h3>
        <AudioUpload
          artistId={artistId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>

      {/* Media Gallery Display */}
      <div className="bg-pure-white rounded-lg shadow-md p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
          Uploaded Media
        </h3>
        <MediaGallery
          images={artist.images}
          audioSamples={artist.audioSamples}
          artistId={artistId}
          onMediaDeleted={handleMediaDeleted}
        />
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-playfair text-lg font-medium text-blue-900 mb-3">
          💡 Media Tips for Better Bookings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">📸 Photos</h5>
            <ul className="space-y-1">
              <li>• High-quality, well-lit images</li>
              <li>• Show you in action at events</li>
              <li>• Include setup/equipment shots</li>
              <li>• Professional headshots work best</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">🎵 Audio</h5>
            <ul className="space-y-1">
              <li>• High-quality recordings only</li>
              <li>• Showcase different music genres</li>
              <li>• Mix of popular and original tracks</li>
              <li>• Keep samples 30-90 seconds</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">📱 Technical</h5>
            <ul className="space-y-1">
              <li>• Profile: Square format, 400x400px</li>
              <li>• Cover: Wide format, 1200x400px</li>
              <li>• Gallery: High resolution preferred</li>
              <li>• Audio: MP3, WAV, M4A formats</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}