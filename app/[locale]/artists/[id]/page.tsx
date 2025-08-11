import { getTranslations } from 'next-intl/server'
import ArtistProfile from '@/components/artists/ArtistProfile'

interface ArtistPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({ params }: ArtistPageProps) {
  const { id } = await params
  const artistResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/artists/${id}`,
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
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'artist' })
  
  return <ArtistProfile artistId={id} locale={locale} />
}