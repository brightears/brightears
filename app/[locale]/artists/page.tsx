import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import ArtistListing from '@/components/artists/ArtistListing'
import PageHero from '@/components/ui/PageHero'

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
    <div className="min-h-screen">
      {/* Modern Hero Section with Glass Morphism */}
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        variant="default"
        showGradientBlobs={true}
        className="bg-gradient-to-br from-deep-teal via-brand-cyan to-deep-teal"
      />
      
      {/* Content Section with improved background */}
      <div className="relative bg-gradient-to-b from-off-white to-pure-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand-cyan/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-lavender/5 rounded-full blur-3xl" />
        </div>
        
        <Suspense fallback={
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="animate-pulse">
              {/* Skeleton loader with glass morphism effect */}
              <div className="mb-12 text-center">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-96 mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="group">
                    <div className="bg-pure-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-6">
                      {/* Image skeleton */}
                      <div className="bg-gradient-to-br from-gray-200 to-gray-100 h-48 rounded-xl mb-4 animate-pulse"></div>
                      
                      {/* Content skeleton */}
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-gray-200 to-gray-100 h-6 rounded w-3/4 animate-pulse"></div>
                        <div className="bg-gradient-to-r from-gray-200 to-gray-100 h-4 rounded w-full animate-pulse"></div>
                        <div className="bg-gradient-to-r from-gray-200 to-gray-100 h-4 rounded w-2/3 animate-pulse"></div>
                      </div>
                      
                      {/* Button skeleton */}
                      <div className="mt-6 bg-gradient-to-r from-gray-200 to-gray-100 h-10 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }>
          <div className="relative z-10">
            <ArtistListing locale={locale} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}