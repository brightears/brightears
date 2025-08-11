import { getTranslations } from 'next-intl/server'
import ArtistListing from '@/components/artists/ArtistListing'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'artists' })
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function ArtistsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'artists' })
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl opacity-90">
            {t('subtitle')}
          </p>
        </div>
      </div>
      
      <ArtistListing locale={locale} />
    </div>
  )
}