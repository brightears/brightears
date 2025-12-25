import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function CorporateProfilePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'CORPORATE') {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-playfair font-bold text-dark-gray mb-4">
          Company Profile
        </h1>
        <p className="text-dark-gray/70 font-inter">
          Manage your company information and settings.
        </p>
        <div className="mt-8 bg-background rounded-lg shadow-md p-8 text-center">
          <p className="text-dark-gray/70 font-inter">
            This feature is coming soon. Contact support to update your company profile.
          </p>
        </div>
      </div>
    </div>
  )
}