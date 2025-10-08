import FormSkeleton from '@/components/ui/FormSkeleton'
import ListSkeleton from '@/components/ui/ListSkeleton'

/**
 * FAQ Page Loading State
 *
 * Displays skeleton loaders for the FAQ page while content is being fetched.
 * Matches the actual FAQ layout with search bar, category tabs, and question list.
 *
 * Components:
 * - Page title
 * - Search bar
 * - Category tabs
 * - FAQ accordion list (8 items)
 */
export default function FAQLoading() {
  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Page Title Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 w-64 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <FormSkeleton
            fields={1}
            variant="inline"
            showSubmitButton={false}
          />
        </div>

        {/* Category Tabs Skeleton */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-4 border-b border-gray-200">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-32 flex-shrink-0 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>

        {/* FAQ List Skeleton */}
        <ListSkeleton
          count={8}
          variant="accordion"
          showIcons={false}
        />

        {/* Help Footer Skeleton */}
        <div className="mt-16 text-center bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-8">
          <div className="h-8 w-64 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse mb-6" />
          <div className="h-12 w-48 mx-auto bg-brand-cyan/30 rounded-full animate-pulse" />
        </div>

        {/* Screen reader text */}
        <span className="sr-only">Loading frequently asked questions, please wait...</span>
      </div>
    </div>
  )
}
