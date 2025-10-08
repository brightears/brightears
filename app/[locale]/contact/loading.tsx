import FormSkeleton from '@/components/ui/FormSkeleton'

/**
 * Contact Page Loading State
 *
 * Displays skeleton loaders for the contact page while content is being fetched.
 * Matches the actual layout with page title, contact form, and contact info cards.
 *
 * Components:
 * - Page title
 * - Contact form with fields and textarea
 * - Contact information cards (email, phone, location)
 */
export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 w-64 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form Skeleton (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg">
              <FormSkeleton
                fields={4}
                showTextarea
                showSubmitButton
                showTitle
              />
            </div>
          </div>

          {/* Contact Info Cards Skeleton (1/3 width on desktop) */}
          <div className="space-y-6">
            {/* Email Card */}
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="h-10 w-10 bg-brand-cyan/20 rounded-lg animate-pulse mb-4" />
              <div className="h-5 w-24 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse mb-3" />
              <div className="h-4 w-40 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
            </div>

            {/* Phone Card */}
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="h-10 w-10 bg-brand-cyan/20 rounded-lg animate-pulse mb-4" />
              <div className="h-5 w-24 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse mb-3" />
              <div className="h-4 w-36 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
            </div>

            {/* Location Card */}
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="h-10 w-10 bg-brand-cyan/20 rounded-lg animate-pulse mb-4" />
              <div className="h-5 w-24 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-br from-brand-cyan/10 to-soft-lavender/10 border border-brand-cyan/20 rounded-xl p-6">
              <div className="h-6 w-48 bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse mb-3" />
              <div className="h-4 w-full bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Alternative Contact Methods Skeleton */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-8 w-64 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg"
              >
                <div className="h-12 w-12 mx-auto bg-brand-cyan/20 rounded-full animate-pulse mb-4" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="h-5 w-32 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse mb-2" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                <div className="h-4 w-40 mx-auto bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20 rounded animate-pulse" style={{ animationDelay: `${i * 100 + 100}ms` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Screen reader text */}
        <span className="sr-only">Loading contact page, please wait...</span>
      </div>
    </div>
  )
}
