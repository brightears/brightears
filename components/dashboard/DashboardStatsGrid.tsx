interface DashboardStatsGridProps {
  stats: {
    totalBookings: number
    completedBookings: number
    earnings: number
    averageRating: number
  }
}

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: '📅',
      color: 'text-brand-cyan'
    },
    {
      title: 'Completed Bookings',
      value: stats.completedBookings.toString(),
      icon: '✅',
      color: 'text-green-600'
    },
    {
      title: 'Total Earnings',
      value: `₿${stats.earnings.toLocaleString()} THB`,
      icon: '💰',
      color: 'text-earthy-brown'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A',
      icon: '⭐',
      color: 'text-soft-lavender'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
            <div className="text-2xl">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}