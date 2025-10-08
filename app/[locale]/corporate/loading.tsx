import HeroSkeleton from '@/components/ui/HeroSkeleton'
import StatsSkeleton from '@/components/ui/StatsSkeleton'
import CardSkeleton from '@/components/ui/CardSkeleton'

/**
 * Corporate Page Loading State
 *
 * Displays skeleton loaders for the corporate page while content is being fetched.
 * Matches the actual layout with hero, features, stats, and case studies.
 *
 * Components:
 * - Hero section
 * - Features grid
 * - Statistics section
 * - Case studies/testimonials
 * - CTA section
 */
export default function CorporateLoading() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-br from-deep-teal via-brand-cyan to-earthy-brown overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative">
          <HeroSkeleton
            showBadge
            showCTA
            subtitleLines={2}
            variant="default"
          />
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="h-10 w-96 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-[500px] mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg opacity-100 transition-all duration-500"
                style={{
                  animationDelay: `${i * 100}ms`
                }}
              >
                {/* Icon */}
                <div className="h-12 w-12 bg-brand-cyan/20 rounded-lg animate-pulse mb-4" />
                {/* Title */}
                <div className="h-6 w-3/4 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse mb-3" />
                {/* Description lines */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section Skeleton */}
      <section className="py-16 bg-gradient-to-br from-deep-teal to-brand-cyan">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-32 mx-auto bg-white/30 rounded-lg animate-pulse mb-3" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="h-5 w-40 mx-auto bg-white/20 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies/Testimonials Section Skeleton */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="h-10 w-80 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse mb-4" />
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton
                key={i}
                layout="review"
                animationDelay={i * 150}
                textLines={3}
              />
            ))}
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
      <span className="sr-only">Loading corporate page, please wait...</span>
    </div>
  )
}
