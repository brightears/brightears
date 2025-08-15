import { getTranslations } from 'next-intl/server'
import EnhancedArtistProfile from '@/components/artists/EnhancedArtistProfile'

interface ArtistPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({ params }: ArtistPageProps) {
  try {
    const { id } = await params
    // Use a simpler title for now to avoid fetch issues
    return {
      title: `Artist Profile | Bright Ears Entertainment`,
      description: `View artist profile and book for your next event.`
    }
  } catch (error) {
    return {
      title: 'Artist | Bright Ears',
      description: 'Professional entertainment booking platform'
    }
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  try {
    const { locale, id } = await params
    
    // Validate locale
    if (!locale || !['en', 'th'].includes(locale)) {
      throw new Error('Invalid locale')
    }
    
    return <EnhancedArtistProfile artistId={id} locale={locale} />
  } catch (error) {
    // Return a simple error page
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-gray mb-4">Error Loading Artist</h1>
          <p className="text-dark-gray">Please try again later.</p>
        </div>
      </div>
    )
  }
}