import { Suspense } from 'react'

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-dark-gray font-inter">Loading registration...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
