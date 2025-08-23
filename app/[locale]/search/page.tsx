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
    <div className="min-h-screen bg-off-white relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-brand-cyan/10 rounded-full filter blur-3xl animate-blob opacity-60"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-soft-lavender/10 rounded-full filter blur-2xl animate-blob animation-delay-2000 opacity-40"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-earthy-brown/10 rounded-full filter blur-2xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section with Animated Gradient Background */}
      <div className="relative bg-gradient-to-br from-deep-teal via-earthy-brown to-deep-teal text-pure-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-brand-cyan/20 rounded-full filter blur-xl animate-float-slow opacity-60"></div>
          <div className="absolute top-20 right-10 w-48 h-48 bg-soft-lavender/15 rounded-full filter blur-2xl animate-float-medium opacity-40"></div>
          <div className="absolute -bottom-10 left-1/2 w-56 h-56 bg-pure-white/10 rounded-full filter blur-xl animate-float-fast transform -translate-x-1/2"></div>
        </div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pure-white/5 to-transparent backdrop-blur-xs"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-pure-white/10 backdrop-blur-md border border-pure-white/20 rounded-full px-6 py-3 mb-6 animate-hero-search-enter">
              <span className="text-brand-cyan text-sm font-medium">
                ✨ Discover • Connect • Experience
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4 bg-gradient-to-r from-pure-white via-pure-white to-pure-white/80 bg-clip-text text-transparent">
              {t('findPerfectArtist')}
            </h1>
            
            <p className="text-lg md:text-xl font-inter text-pure-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('searchSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Search Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Sidebar with Glass Morphism */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <div className="bg-pure-white/70 backdrop-blur-md border border-pure-white/30 rounded-2xl p-6 shadow-xl hover:bg-pure-white/80 transition-all duration-300">
                {/* Glass border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/10 to-soft-lavender/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="relative z-10">
                  <EnhancedSearch variant="full" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Results with Glass Container */}
          <div className="lg:col-span-3">
            <div className="bg-pure-white/60 backdrop-blur-md border border-pure-white/20 rounded-2xl p-8 shadow-xl">
              <Suspense fallback={<SearchResultsSkeleton />}>
                <SearchResults searchParams={search} locale={locale} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton with Premium Style */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <div className="h-8 w-40 bg-gradient-to-r from-brand-cyan/20 via-earthy-brown/20 to-soft-lavender/20 rounded-lg animate-skeleton-loading relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/40 to-transparent animate-skeleton-loading"></div>
          </div>
        </div>
        <div className="relative">
          <div className="h-12 w-48 bg-gradient-to-r from-earthy-brown/20 via-brand-cyan/20 to-deep-teal/20 rounded-xl animate-skeleton-loading relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/40 to-transparent animate-skeleton-loading"></div>
          </div>
        </div>
      </div>
      
      {/* Artist Cards Grid with Premium Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(9)].map((_, i) => (
          <div 
            key={i} 
            className="group animate-card-entrance"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Glass morphism card skeleton */}
            <div className="bg-pure-white/80 backdrop-blur-sm border border-pure-white/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
              {/* Image skeleton with gradient */}
              <div className="relative h-48 bg-gradient-to-br from-brand-cyan/20 via-earthy-brown/20 to-soft-lavender/20 animate-skeleton-loading overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/30 to-transparent animate-skeleton-loading"></div>
                {/* Floating orb effect */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-pure-white/20 rounded-full animate-pulse"></div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Name skeleton */}
                <div className="relative">
                  <div className="h-6 w-3/4 bg-gradient-to-r from-deep-teal/20 via-brand-cyan/20 to-earthy-brown/20 rounded-lg animate-skeleton-loading overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/40 to-transparent animate-skeleton-loading"></div>
                  </div>
                </div>
                
                {/* Genre skeleton */}
                <div className="relative">
                  <div className="h-4 w-1/2 bg-gradient-to-r from-soft-lavender/20 via-earthy-brown/20 to-brand-cyan/20 rounded-md animate-skeleton-loading overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/40 to-transparent animate-skeleton-loading"></div>
                  </div>
                </div>
                
                {/* Rating and price skeleton */}
                <div className="flex justify-between items-center">
                  <div className="relative">
                    <div className="h-5 w-20 bg-gradient-to-r from-brand-cyan/20 to-deep-teal/20 rounded-full animate-skeleton-loading overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/40 to-transparent animate-skeleton-loading"></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-5 w-16 bg-gradient-to-r from-earthy-brown/20 to-soft-lavender/20 rounded-md animate-skeleton-loading overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/40 to-transparent animate-skeleton-loading"></div>
                    </div>
                  </div>
                </div>
                
                {/* Button skeleton */}
                <div className="relative">
                  <div className="h-10 w-full bg-gradient-to-r from-deep-teal/20 via-brand-cyan/20 to-earthy-brown/20 rounded-xl animate-skeleton-loading overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/40 to-transparent animate-skeleton-loading"></div>
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-soft-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pulsing load more indicator */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-3">
          <div className="w-2 h-2 bg-brand-cyan/40 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-earthy-brown/40 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 bg-soft-lavender/40 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>
    </div>
  )
}