import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.forgotPassword' })
  
  return {
    title: `${t('title')} - Bright Ears`,
    description: t('description')
  }
}

export default async function ForgotPasswordPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordForm locale={locale} />
    </Suspense>
  )
}

function ForgotPasswordSkeleton() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  )
}

function ForgotPasswordForm({ locale }: { locale: string }) {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-playfair font-bold text-dark-gray mb-4">
            Password Reset
          </h1>
          <p className="text-dark-gray font-inter">
            This feature is coming soon. For now, please contact support at support@brightears.io for password reset assistance.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <a
            href={`/${locale}/login`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition-colors font-inter font-medium"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}