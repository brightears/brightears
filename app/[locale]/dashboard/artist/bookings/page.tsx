import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BookingsManager from '@/components/dashboard/BookingsManager'

export default async function BookingsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ARTIST') {
    redirect(`/${locale}/login`)
  }

  const artist = user.artist
  if (!artist) {
    redirect(`/${locale}/dashboard`)
  }

  // Fetch real bookings data
  const bookings = await prisma.booking.findMany({
    where: { artistId: artist.id },
    include: {
      customer: {
        select: {
          email: true,
          customer: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          isRead: true,
          sender: {
            select: {
              id: true,
              role: true
            }
          }
        }
      },
      _count: {
        select: {
          messages: {
            where: {
              senderId: { not: user.id },
              isRead: false
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Format bookings for display
  const formattedBookings = bookings.map(booking => ({
    ...booking,
    customerName: booking.customer.customer ? 
      `${booking.customer.customer.firstName || ''} ${booking.customer.customer.lastName || ''}`.trim() ||
      booking.customer.email :
      booking.customer.email,
    customerEmail: booking.customer.email,
    lastMessage: booking.messages[0] || null,
    unreadMessages: booking._count.messages,
    eventDate: booking.eventDate.toISOString(),
    startTime: booking.startTime.toISOString(),
    endTime: booking.endTime.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    confirmedAt: booking.confirmedAt?.toISOString(),
    completedAt: booking.completedAt?.toISOString(),
    cancelledAt: booking.cancelledAt?.toISOString()
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Bookings Management
        </h1>
        <p className="mt-2 text-dark-gray">
          Review, accept, and manage your booking requests.
        </p>
      </div>

      {/* Bookings Manager */}
      <BookingsManager bookings={formattedBookings} artistId={artist.id} locale={locale} />
    </div>
  )
}