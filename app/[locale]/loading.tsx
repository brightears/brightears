import HeroSkeleton from '@/components/ui/HeroSkeleton'
import CardSkeleton from '@/components/ui/CardSkeleton'
import StatsSkeleton from '@/components/ui/StatsSkeleton'

/**
 * Homepage Loading State
 *
 * Displays skeleton loaders for the homepage while content is being fetched.
 * Matches the actual homepage layout to prevent Cumulative Layout Shift (CLS).
 *
 * Components:
 * - Hero section with badge, title, subtitle, and CTAs
 * - Statistics section with 4 stats
 * - Featured artists grid (6 cards)
 * - Corporate section preview
 */
export default function HomeLoading() {
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

      {/* Statistics Section Skeleton */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StatsSkeleton
            count={4}
            variant="horizontal"
            showIcons={false}
          />
        </div>
      </section>

      {/* Featured Artists Section Skeleton */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title Skeleton */}
          <div className="mb-12 text-center">
            <div className="h-10 w-64 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-96 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
          </div>

          {/* Artist Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton
                key={i}
                layout="featured"
                animationDelay={i * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Section Skeleton */}
      <section className="py-20 bg-gradient-to-br from-deep-teal to-brand-cyan">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <div className="h-12 w-3/4 mx-auto bg-white/20 rounded-lg animate-pulse mb-6" />

            {/* Subtitle */}
            <div className="space-y-3 mb-8">
              <div className="h-6 w-full bg-white/20 rounded animate-pulse" />
              <div className="h-6 w-5/6 mx-auto bg-white/20 rounded animate-pulse" />
            </div>

            {/* CTA Button */}
            <div className="h-14 w-48 mx-auto bg-white/30 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Screen reader text */}
      <span className="sr-only">Loading homepage content, please wait...</span>
    </div>
  )
}
