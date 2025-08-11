import { getTranslations } from 'next-intl/server'
import ArtistProfile from '@/components/artists/ArtistProfile'

interface ArtistPageProps {
  params: {
    locale: string
    id: string
  }
}

export async function generateMetadata({ params }: ArtistPageProps) {
  const artistResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/artists/${params.id}`,
    { cache: 'no-store' }
  )
  
  if (!artistResponse.ok) {
    return {
      title: 'Artist Not Found | Bright Ears',
      description: 'The artist you are looking for could not be found.'
    }
  }
  
  const artist = await artistResponse.json()
  
  return {
    title: `${artist.stageName} | Bright Ears Entertainment`,
    description: artist.bio || `Book ${artist.stageName} for your next event. Professional ${artist.category.toLowerCase()} available in ${artist.baseCity}.`,
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: 'artist' })
  
  return <ArtistProfile artistId={params.id} locale={params.locale} />
}