import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import EnhancedSearch from '@/components/search/EnhancedSearch'
import SearchResults from '@/components/search/SearchResults'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('search')
  
  return {
    title: `${t('findPerfectArtist')} | Bright Ears`,
    description: t('searchDescription')
  }
}

export default async function SearchPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params
  const search = await searchParams
  const t = await getTranslations('search')

  return (
    <div className="bg-off-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-playfair font-bold text-3xl text-deep-teal sm:text-4xl mb-4">
            {t('findPerfectArtist')}
          </h1>
          <p className="text-dark-gray/80 max-w-2xl mx-auto text-lg">
            {t('searchSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <EnhancedSearch variant="full" />
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchResults searchParams={search} locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-pure-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}