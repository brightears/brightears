import HeroSkeleton from '@/components/ui/HeroSkeleton'
import ListSkeleton from '@/components/ui/ListSkeleton'

/**
 * How It Works for Artists Page Loading State
 *
 * Displays skeleton loaders for the "How It Works for Artists" page.
 * Matches the actual layout with hero section, artist journey steps, and CTA.
 *
 * Components:
 * - Hero section
 * - Artist journey step-by-step cards
 * - Benefits list
 * - Success stories
 * - CTA section
 */
export default function HowItWorksArtistsLoading() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-br from-deep-teal via-brand-cyan to-soft-lavender overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative">
          <HeroSkeleton
            showBadge
            showCTA
            subtitleLines={2}
            variant="centered"
          />
        </div>
      </section>

      {/* Artist Journey Steps Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="h-10 w-96 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-[500px] mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
          </div>

          {/* Journey Steps Cards */}
          <div className="max-w-5xl mx-auto space-y-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg opacity-100 transition-all duration-500"
                style={{
                  animationDelay: `${i * 150}ms`
                }}
              >
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-gradient-to-br from-brand-cyan/30 to-soft-lavender/30 rounded-full animate-pulse" />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div className="h-7 w-3/4 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse" style={{ animationDelay: `${i * 150 + 50}ms` }} />

                    {/* Description */}
                    <div className="space-y-2">
                      <div className="h-5 w-full bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" style={{ animationDelay: `${i * 150 + 100}ms` }} />
                      <div className="h-5 w-5/6 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" style={{ animationDelay: `${i * 150 + 150}ms` }} />
                    </div>

                    {/* Action Button */}
                    <div className="h-10 w-40 bg-brand-cyan/30 rounded-lg animate-pulse" style={{ animationDelay: `${i * 150 + 200}ms` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section Skeleton */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="h-10 w-80 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse" />
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg"
              >
                <div className="h-12 w-12 bg-brand-cyan/20 rounded-lg animate-pulse mb-4" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="h-6 w-3/4 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse mb-3" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 100}ms` }} />
                  <div className="h-4 w-5/6 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 150}ms` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="h-10 w-72 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse" />
          </div>

          {/* Success Stories List */}
          <div className="max-w-4xl mx-auto">
            <ListSkeleton
              count={3}
              variant="detailed"
              showIcons
              detailLines={3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 bg-gradient-to-br from-brand-cyan to-deep-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 w-3/4 mx-auto bg-white/30 rounded-lg animate-pulse mb-6" />
            <div className="space-y-3 mb-8">
              <div className="h-6 w-full bg-white/20 rounded animate-pulse" />
              <div className="h-6 w-5/6 mx-auto bg-white/20 rounded animate-pulse" />
            </div>
            <div className="h-14 w-56 mx-auto bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Screen reader text */}
      <span className="sr-only">Loading how it works for artists page, please wait...</span>
    </div>
  )
}
