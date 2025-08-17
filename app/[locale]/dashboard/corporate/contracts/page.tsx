import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function CorporateContractsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'CORPORATE') {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-playfair font-bold text-dark-gray mb-4">
          Corporate Contracts
        </h1>
        <p className="text-dark-gray/70 font-inter">
          Manage your corporate contracts and agreements.
        </p>
        <div className="mt-8 bg-background rounded-lg shadow-md p-8 text-center">
          <p className="text-dark-gray/70 font-inter">
            This feature is coming soon. Contact support for contract assistance.
          </p>
        </div>
      </div>
    </div>
  )
}