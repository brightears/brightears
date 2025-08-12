interface Event {
  id: string
  title: string
  date: string
  time: string
  venue: string
}

interface UpcomingEventsProps {
  events: Event[]
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `${diffDays} days`
    return formatDate(dateString)
  }

  return (
    <div className="bg-pure-white rounded-lg shadow-md p-6">
      <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
        Upcoming Events
      </h3>
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎵</div>
          <p className="text-gray-500 text-sm">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-dark-gray mb-1">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.venue}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>🕐 {event.time}</span>
                    <span>📍 {formatDate(event.date)}</span>
                  </div>
                </div>
                <div className="text-xs font-medium text-brand-cyan">
                  {getDaysUntil(event.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-brand-cyan hover:text-brand-cyan/80 text-sm font-medium">
            View All Events
          </button>
        </div>
      )}
    </div>
  )
}