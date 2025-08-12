'use client'

import { useState } from 'react'

interface VideoItem {
  id: string
  url: string
  title: string
  thumbnail: string
}

interface AudioItem {
  id: string
  url: string
  title: string
  duration: string
}

interface MediaData {
  profileImage: string | null
  coverImage: string | null
  images: string[]
  videos: VideoItem[]
  audioSamples: AudioItem[]
}

interface MediaGalleryManagerProps {
  artistId: string
  media: MediaData
  locale: string
}

export default function MediaGalleryManager({ artistId, media, locale }: MediaGalleryManagerProps) {
  const [activeTab, setActiveTab] = useState('photos')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<any>(null)

  const tabs = [
    { id: 'photos', name: 'Photos', icon: '📸', count: media.images.length },
    { id: 'videos', name: 'Videos', icon: '🎬', count: media.videos.length },
    { id: 'audio', name: 'Audio', icon: '🎵', count: media.audioSamples.length }
  ]

  const handleFileUpload = async (type: 'image' | 'video' | 'audio', file: File) => {
    setIsUploading(true)
    try {
      // Placeholder for actual upload logic
      // In real implementation, this would upload to Cloudinary or similar
      console.log('Uploading', type, file.name)
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Upload successful! (This is a placeholder)')
    } catch (error) {
      alert('Upload failed. Please try again.')
    }
    setIsUploading(false)
  }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      // Placeholder for actual delete logic
      console.log('Deleting', type, id)
      alert('Item deleted! (This is a placeholder)')
    } catch (error) {
      alert('Delete failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile & Cover Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Image */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
            Profile Image
          </h3>
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto">
              {media.profileImage ? (
                <img
                  src={media.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-4 border-brand-cyan"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <label className="cursor-pointer inline-flex items-center space-x-2 bg-brand-cyan text-pure-white px-4 py-2 rounded-md hover:bg-brand-cyan/90">
                <span>📤</span>
                <span>{media.profileImage ? 'Change Photo' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('image', e.target.files[0])}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Recommended: Square image, at least 400x400px
            </p>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
            Cover Image
          </h3>
          <div className="space-y-4">
            <div className="w-full h-32">
              {media.coverImage ? (
                <img
                  src={media.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🖼️</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <label className="cursor-pointer inline-flex items-center space-x-2 bg-earthy-brown text-pure-white px-4 py-2 rounded-md hover:bg-earthy-brown/90">
                <span>📤</span>
                <span>{media.coverImage ? 'Change Cover' : 'Upload Cover'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('image', e.target.files[0])}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Recommended: 16:9 aspect ratio, at least 1200x675px
            </p>
          </div>
        </div>
      </div>

      {/* Main Gallery */}
      <div className="bg-pure-white rounded-lg shadow-md">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-brand-cyan text-brand-cyan'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Button */}
          <div className="mb-6">
            <label className={`cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-md text-pure-white font-medium ${
              activeTab === 'photos' ? 'bg-brand-cyan hover:bg-brand-cyan/90' :
              activeTab === 'videos' ? 'bg-deep-teal hover:bg-deep-teal/90' :
              'bg-soft-lavender hover:bg-soft-lavender/90'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span>📤</span>
              <span>
                {isUploading ? 'Uploading...' : 
                 activeTab === 'photos' ? 'Add Photos' :
                 activeTab === 'videos' ? 'Add Video Link' :
                 'Add Audio Sample'}
              </span>
              {activeTab === 'photos' && (
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => {
                    if (e.target.files) {
                      Array.from(e.target.files).forEach(file => handleFileUpload('image', file))
                    }
                  }}
                />
              )}
            </label>
          </div>

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              {media.images.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-lg font-medium text-dark-gray mb-2">No photos yet</h3>
                  <p className="text-gray-500 mb-4">Upload some photos to showcase your work</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => setSelectedMedia({ type: 'image', src: image })}
                      />
                      <button
                        onClick={() => handleDelete('image', index.toString())}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="space-y-4">
              {media.videos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="text-lg font-medium text-dark-gray mb-2">No videos yet</h3>
                  <p className="text-gray-500 mb-4">Add YouTube or Vimeo links to showcase your performances</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {media.videos.map((video) => (
                    <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <button className="bg-pure-white rounded-full p-3 hover:bg-gray-100">
                            <svg className="w-6 h-6 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => handleDelete('video', video.id)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-dark-gray">{video.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{video.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {media.audioSamples.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-lg font-medium text-dark-gray mb-2">No audio samples yet</h3>
                  <p className="text-gray-500 mb-4">Upload audio files to let clients hear your music style</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {media.audioSamples.map((audio) => (
                    <div key={audio.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-soft-lavender rounded-lg flex items-center justify-center">
                          <span className="text-xl">🎵</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-dark-gray">{audio.title}</h4>
                          <p className="text-sm text-gray-500">{audio.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-brand-cyan text-pure-white rounded-full hover:bg-brand-cyan/90">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete('audio', audio.id)}
                          className="p-2 bg-red-600 text-pure-white rounded-full hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
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
              <li>• Professional headshots</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">🎬 Videos</h5>
            <ul className="space-y-1">
              <li>• Live performance footage</li>
              <li>• Good audio quality essential</li>
              <li>• Show crowd engagement</li>
              <li>• Keep under 3 minutes</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">🎵 Audio</h5>
            <ul className="space-y-1">
              <li>• High-quality recordings</li>
              <li>• Showcase different genres</li>
              <li>• Mix of popular and original</li>
              <li>• 30-60 second samples</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-90">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative">
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {selectedMedia.type === 'image' && (
                <img
                  src={selectedMedia.src}
                  alt="Full size"
                  className="max-w-full max-h-[90vh] object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}