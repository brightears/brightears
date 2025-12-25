import { Suspense } from 'react'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-brand-cyan/20 rounded"></div>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  )
}