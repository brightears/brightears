import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MediaGalleryManager from '@/components/dashboard/MediaGalleryManager'

export default async function MediaPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ARTIST') {
    redirect(`/${locale}/login`)
  }

  const artist = user.artist
  if (!artist) {
    redirect(`/${locale}/dashboard`)
  }

  // Mock media data - will be replaced with real API calls
  const mockMedia = {
    profileImage: artist.profileImage || null,
    coverImage: artist.coverImage || null,
    images: artist.images || [
      '/placeholder-image-1.jpg',
      '/placeholder-image-2.jpg',
      '/placeholder-image-3.jpg'
    ],
    videos: artist.videos || [
      {
        id: '1',
        url: 'https://youtube.com/watch?v=example1',
        title: 'Live Performance at Wedding',
        thumbnail: '/placeholder-video-thumb-1.jpg'
      },
      {
        id: '2',
        url: 'https://youtube.com/watch?v=example2',
        title: 'DJ Set at Corporate Event',
        thumbnail: '/placeholder-video-thumb-2.jpg'
      }
    ],
    audioSamples: artist.audioSamples || [
      {
        id: '1',
        url: '/placeholder-audio-1.mp3',
        title: 'Pop Music Mix',
        duration: '3:45'
      },
      {
        id: '2',
        url: '/placeholder-audio-2.mp3',
        title: 'Jazz Collection',
        duration: '4:20'
      }
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Media Gallery
        </h1>
        <p className="mt-2 text-dark-gray">
          Upload and manage your photos, videos, and audio samples to showcase your work.
        </p>
      </div>

      {/* Media Gallery Manager */}
      <MediaGalleryManager 
        artistId={artist.id}
        media={mockMedia}
        locale={locale}
      />
    </div>
  )
}