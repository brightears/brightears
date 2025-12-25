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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Media Gallery
        </h1>
        <p className="mt-2 text-dark-gray">
          Upload and manage your photos and audio samples to showcase your work. All files are stored securely in the cloud.
        </p>
      </div>

      {/* Media Gallery Manager */}
      <MediaGalleryManager 
        artistId={artist.id}
        locale={locale}
      />
    </div>
  )
}