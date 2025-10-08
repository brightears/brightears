import CardSkeleton from '@/components/ui/CardSkeleton'
import FormSkeleton from '@/components/ui/FormSkeleton'

/**
 * Browse Artists Loading State
 *
 * Displays skeleton loaders for the artists browsing page while content is being fetched.
 * Matches the actual layout with search bar, filters, and artist cards grid.
 *
 * Components:
 * - Page title
 * - Search and filter bar
 * - Artist cards grid (9 cards)
 */
export default function ArtistsLoading() {
  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse mb-3" />
          <div className="h-6 w-96 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
        </div>

        {/* Search and Filters Skeleton */}
        <div className="mb-8 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
          <FormSkeleton
            fields={1}
            variant="inline"
            showSubmitButton={false}
            className="mb-4"
          />

          {/* Category Tabs Skeleton */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Sort and View Options Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-32 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse" />
            <div className="h-10 w-10 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Artist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <CardSkeleton
              key={i}
              layout="artist"
              animationDelay={i * 100}
            />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Screen reader text */}
        <span className="sr-only">Loading artists, please wait...</span>
      </div>
    </div>
  )
}
