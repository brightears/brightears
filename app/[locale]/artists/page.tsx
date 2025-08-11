import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import ArtistListing from '@/components/artists/ArtistListing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'artists' })
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function ArtistsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'artists' })
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brightears to-brightears-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl opacity-90">
            {t('subtitle')}
          </p>
        </div>
      </div>
      
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 h-64">
                  <div className="bg-gray-200 h-32 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <ArtistListing locale={locale} />
      </Suspense>
    </div>
  )
}