import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminArtistsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-playfair font-bold text-dark-gray mb-4">
          Artist Management
        </h1>
        <div className="bg-background rounded-lg shadow-md p-8 text-center">
          <p className="text-dark-gray/70 font-inter">
            Artist management tools are coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}