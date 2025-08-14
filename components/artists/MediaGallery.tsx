'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnail?: string
  title?: string
  description?: string
}

interface MediaGalleryProps {
  media: MediaItem[]
  artistName: string
}

export default function MediaGallery({ media, artistName }: MediaGalleryProps) {
  const t = useTranslations('artists')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all')

  const filteredMedia = media.filter(item => 
    activeFilter === 'all' || item.type === activeFilter
  )

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item)
  }

  const closeModal = () => {
    setSelectedMedia(null)
  }

  // Group media by type for display
  const images = media.filter(m => m.type === 'image')
  const videos = media.filter(m => m.type === 'video')
  const audio = media.filter(m => m.type === 'audio')

  if (media.length === 0) {
    return (
      <div className="bg-pure-white rounded-lg p-8 text-center">
        <p className="text-dark-gray/60">No media available yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 font-inter text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'text-brand-cyan border-b-2 border-brand-cyan'
              : 'text-dark-gray/60 hover:text-dark-gray'
          }`}
        >
          All ({media.length})
        </button>
        {images.length > 0 && (
          <button
            onClick={() => setActiveFilter('image')}
            className={`px-4 py-2 font-inter text-sm font-medium transition-colors ${
              activeFilter === 'image'
                ? 'text-brand-cyan border-b-2 border-brand-cyan'
                : 'text-dark-gray/60 hover:text-dark-gray'
            }`}
          >
            Photos ({images.length})
          </button>
        )}
        {videos.length > 0 && (
          <button
            onClick={() => setActiveFilter('video')}
            className={`px-4 py-2 font-inter text-sm font-medium transition-colors ${
              activeFilter === 'video'
                ? 'text-brand-cyan border-b-2 border-brand-cyan'
                : 'text-dark-gray/60 hover:text-dark-gray'
            }`}
          >
            Videos ({videos.length})
          </button>
        )}
        {audio.length > 0 && (
          <button
            onClick={() => setActiveFilter('audio')}
            className={`px-4 py-2 font-inter text-sm font-medium transition-colors ${
              activeFilter === 'audio'
                ? 'text-brand-cyan border-b-2 border-brand-cyan'
                : 'text-dark-gray/60 hover:text-dark-gray'
            }`}
          >
            Audio ({audio.length})
          </button>
        )}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => handleMediaClick(item)}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
          >
            {item.type === 'image' && (
              <Image
                src={item.url}
                alt={item.title || `${artistName} photo`}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            )}
            {item.type === 'video' && (
              <div className="relative w-full h-full bg-dark-gray/10">
                <Image
                  src={item.thumbnail || '/video-placeholder.jpg'}
                  alt={item.title || `${artistName} video`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-brand-cyan/90 rounded-full p-3">
                    <svg className="w-6 h-6 text-pure-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            {item.type === 'audio' && (
              <div className="relative w-full h-full bg-gradient-to-br from-brand-cyan to-deep-teal flex items-center justify-center">
                <svg className="w-12 h-12 text-pure-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <p className="text-pure-white text-xs truncate">{item.title}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-pure-white hover:text-brand-cyan transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'image' && (
              <div className="relative w-full h-full">
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.title || `${artistName} photo`}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            )}
            {selectedMedia.type === 'video' && (
              <video
                controls
                autoPlay
                className="w-full max-h-[80vh]"
                src={selectedMedia.url}
              >
                Your browser does not support the video tag.
              </video>
            )}
            {selectedMedia.type === 'audio' && (
              <div className="bg-pure-white rounded-lg p-8">
                <h3 className="font-playfair text-2xl font-bold text-dark-gray mb-4">
                  {selectedMedia.title || 'Audio Track'}
                </h3>
                <audio
                  controls
                  autoPlay
                  className="w-full"
                  src={selectedMedia.url}
                >
                  Your browser does not support the audio tag.
                </audio>
                {selectedMedia.description && (
                  <p className="mt-4 text-dark-gray/70">{selectedMedia.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}