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
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Vibrant Hero Section */}
      <div className="relative min-h-[60vh] overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-deep-teal to-earthy-brown opacity-90" />
        
        {/* Animated Gradient Mesh Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--brand-cyan)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_right,_var(--soft-lavender)_0%,_transparent_50%)] opacity-40 animate-pulse" />
        
        {/* Glass Morphism Pattern Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        {/* Floating Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-brand-cyan/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-soft-lavender/20 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-earthy-brown/20 rounded-full blur-3xl animate-float-fast" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-brand-cyan/30 rounded-full blur-2xl animate-blob" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-soft-lavender/25 rounded-full blur-2xl animate-blob animation-delay-2000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center min-h-[60vh]">
          <div className="max-w-4xl mx-auto text-center">
            {/* Glass Card Background for Content */}
            <div className="relative inline-block">
              {/* Glass morphism card */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl -m-8 md:-m-12 border border-white/20" />
              
              <div className="relative px-8 py-6 md:px-12 md:py-8">
                {/* Title with gradient text */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-pure-white mb-4 md:mb-6 drop-shadow-lg animate-hero-search-enter">
                  {t('title')}
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg md:text-xl font-inter text-pure-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow mb-8 animate-hero-search-enter animation-delay-200">
                  {t('subtitle')}
                </p>

                {/* Premium Stats Counter */}
                <div className="flex justify-center space-x-8 md:space-x-12 mb-8 animate-hero-search-enter animation-delay-400">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-pure-white font-inter animate-count-up">500+</div>
                    <div className="text-sm text-pure-white/80 font-inter">{t('verified_artists') || 'Verified Artists'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-pure-white font-inter animate-count-up animation-delay-100">50k+</div>
                    <div className="text-sm text-pure-white/80 font-inter">{t('bookings') || 'Successful Bookings'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-pure-white font-inter animate-count-up animation-delay-200">4.9</div>
                    <div className="text-sm text-pure-white/80 font-inter">{t('rating') || 'Average Rating'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0,20 C480,60 960,60 1440,20 L1440,60 L0,60 Z" fill="var(--off-white)" fillOpacity="1" />
          </svg>
        </div>
      </div>
      
      {/* Content Section with Enhanced Background */}
      <div className="relative bg-gradient-to-b from-off-white via-pure-white to-off-white">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-brand-cyan/3 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-soft-lavender/4 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-earthy-brown/3 rounded-full blur-3xl animate-float-fast" />
          
          {/* Gradient mesh overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(0,187,228,0.05)_0%,_transparent_50%),_radial-gradient(circle_at_80%_50%,_rgba(213,158,201,0.05)_0%,_transparent_50%),_radial-gradient(circle_at_40%_80%,_rgba(164,119,100,0.05)_0%,_transparent_50%)]" />
        </div>
        
        <Suspense fallback={
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="animate-pulse">
              {/* Premium Skeleton Loader */}
              <div className="mb-12">
                <div className="glass rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
                  <div className="h-12 bg-gradient-to-r from-brand-cyan/20 to-deep-teal/20 rounded-xl w-full mb-4 animate-skeleton-loading"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="group animate-card-entrance" style={{animationDelay: `${i * 100}ms`}}>
                    <div className="card-modern p-6 h-80">
                      <div className="bg-gradient-to-br from-brand-cyan/10 to-deep-teal/10 h-40 rounded-xl mb-4 animate-skeleton-loading"></div>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-brand-cyan/20 to-transparent h-6 rounded-lg w-3/4 animate-skeleton-loading"></div>
                        <div className="bg-gradient-to-r from-earthy-brown/20 to-transparent h-4 rounded w-full animate-skeleton-loading"></div>
                        <div className="bg-gradient-to-r from-soft-lavender/20 to-transparent h-4 rounded w-2/3 animate-skeleton-loading"></div>
                      </div>
                      <div className="mt-6 bg-gradient-to-r from-brand-cyan/20 to-deep-teal/20 h-10 rounded-xl animate-skeleton-loading"></div>
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