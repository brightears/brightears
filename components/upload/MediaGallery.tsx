'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MediaItem {
  url: string
  type: 'image' | 'audio'
}

interface MediaGalleryProps {
  images: string[]
  audioSamples: string[]
  artistId: string
  onMediaDeleted: (url: string, type: 'image' | 'audio') => void
  readOnly?: boolean
}

export default function MediaGallery({
  images = [],
  audioSamples = [],
  artistId,
  onMediaDeleted,
  readOnly = false
}: MediaGalleryProps) {
  const [deletingMedia, setDeletingMedia] = useState<string | null>(null)

  const deleteMedia = async (url: string, type: 'image' | 'audio') => {
    if (readOnly) return

    setDeletingMedia(url)

    try {
      // Extract public_id from Cloudinary URL
      const urlParts = url.split('/')
      const fileWithExt = urlParts[urlParts.length - 1]
      const fileName = fileWithExt.split('.')[0]
      
      // Reconstruct public_id (this is a simplified version)
      const folderPath = `brightears/artists/${artistId}/${type === 'image' ? 'gallery' : 'audio'}`
      const publicId = `${folderPath}/${fileName}`

      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          publicId,
          type: type === 'image' ? 'gallery' : 'audio',
          artistId,
          url
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
      }

      onMediaDeleted(url, type)
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Failed to delete ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDeletingMedia(null)
    }
  }

  const getAudioFileName = (url: string) => {
    const urlParts = url.split('/')
    const fileWithExt = urlParts[urlParts.length - 1]
    return decodeURIComponent(fileWithExt).replace(/^\d+_/, '') // Remove timestamp prefix
  }

  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="font-medium text-dark-gray mb-4">Gallery Images ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div key={imageUrl} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {!readOnly && (
                  <button
                    onClick={() => deleteMedia(imageUrl, 'image')}
                    disabled={deletingMedia === imageUrl}
                    className={`
                      absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
                      opacity-0 group-hover:opacity-100 transition-opacity
                      hover:bg-red-600 disabled:opacity-50
                      ${deletingMedia === imageUrl ? 'animate-spin' : ''}
                    `}
                    title="Delete image"
                  >
                    {deletingMedia === imageUrl ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Samples */}
      {audioSamples.length > 0 && (
        <div>
          <h3 className="font-medium text-dark-gray mb-4">Audio Samples ({audioSamples.length})</h3>
          <div className="space-y-3">
            {audioSamples.map((audioUrl, index) => (
              <div key={audioUrl} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-cyan/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-gray truncate">
                    {getAudioFileName(audioUrl)}
                  </p>
                  <audio
                    controls
                    className="w-full mt-2"
                    style={{ height: '32px' }}
                  >
                    <source src={audioUrl} />
                    Your browser does not support audio playback.
                  </audio>
                </div>

                {!readOnly && (
                  <button
                    onClick={() => deleteMedia(audioUrl, 'audio')}
                    disabled={deletingMedia === audioUrl}
                    className={`
                      flex-shrink-0 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg
                      transition-colors disabled:opacity-50
                    `}
                    title="Delete audio"
                  >
                    {deletingMedia === audioUrl ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {images.length === 0 && audioSamples.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p>No media uploaded yet</p>
          {!readOnly && <p className="text-sm mt-1">Use the upload sections above to add images and audio samples</p>}
        </div>
      )}
    </div>
  )
}