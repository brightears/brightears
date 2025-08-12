import Link from 'next/link'

interface QuickActionsProps {
  locale: string
}

export default function QuickActions({ locale }: QuickActionsProps) {
  const actions = [
    {
      title: 'Update Profile',
      description: 'Edit your artist information and settings',
      href: `/dashboard/artist/profile`,
      icon: '👤',
      color: 'bg-brand-cyan hover:bg-brand-cyan/90'
    },
    {
      title: 'Manage Calendar',
      description: 'Set your availability and block dates',
      href: `/dashboard/artist/availability`,
      icon: '🗓️',
      color: 'bg-earthy-brown hover:bg-earthy-brown/90'
    },
    {
      title: 'View Bookings',
      description: 'Review and manage your bookings',
      href: `/dashboard/artist/bookings`,
      icon: '📅',
      color: 'bg-deep-teal hover:bg-deep-teal/90'
    },
    {
      title: 'Upload Media',
      description: 'Add photos, videos, and audio samples',
      href: `/dashboard/artist/media`,
      icon: '🎵',
      color: 'bg-soft-lavender hover:bg-soft-lavender/90'
    }
  ]

  return (
    <div className="bg-pure-white rounded-lg shadow-md p-6">
      <h2 className="font-playfair text-xl font-semibold text-dark-gray mb-6">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={`/${locale}${action.href}`}
            className={`block p-4 rounded-lg text-pure-white transition-colors ${action.color}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-pure-white/80">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}