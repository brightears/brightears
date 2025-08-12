import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ArtistDashboardSidebar from '@/components/dashboard/ArtistDashboardSidebar'

export default async function ArtistDashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(`/${locale}/login`)
  }

  if (user.role !== 'ARTIST') {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="flex">
        <ArtistDashboardSidebar locale={locale} user={user} />
        <main className="flex-1 lg:pl-64">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}