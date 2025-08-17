import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage({
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
          Admin Dashboard
        </h1>
        <p className="text-dark-gray/70 font-inter mb-8">
          Platform administration and management tools.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Users', value: '0', color: 'bg-brand-cyan' },
            { title: 'Active Artists', value: '0', color: 'bg-earthy-brown' },
            { title: 'Total Bookings', value: '0', color: 'bg-soft-lavender' },
            { title: 'Platform Revenue', value: '฿0', color: 'bg-deep-teal' }
          ].map((stat, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-inter text-dark-gray/70 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-playfair font-bold text-dark-gray">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg`}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-playfair font-bold text-dark-gray mb-4">
            Admin Tools Coming Soon
          </h3>
          <p className="text-dark-gray/70 font-inter">
            Advanced administration features are under development.
          </p>
        </div>
      </div>
    </div>
  )
}