import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import CustomerBookingsManager from '@/components/booking/CustomerBookingsManager'
import { getTranslations } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function BookingsPage({ params }: PageProps) {
  const { locale } = await params
  const user = await getCurrentUser()
  const t = await getTranslations('customerBookings')

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Redirect artists to their dashboard
  if (user.role === 'ARTIST') {
    redirect(`/${locale}/dashboard/artist/bookings`)
  }

  // Fetch customer bookings
  const bookings = await prisma.booking.findMany({
    where: { customerId: user.id },
    include: {
      artist: {
        select: {
          id: true,
          stageName: true,
          profileImage: true,
          category: true,
          userId: true
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
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Format bookings for display
  const formattedBookings = bookings.map(booking => ({
    ...booking,
    artistName: booking.artist.stageName,
    artistImage: booking.artist.profileImage,
    artistCategory: booking.artist.category,
    lastMessage: booking.messages[0] || null,
    unreadMessages: booking.messages.filter(m => !m.isRead && m.sender.id !== user.id).length
  }))

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <div className="bg-pure-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-dark-gray">
              {t('title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <CustomerBookingsManager
          bookings={formattedBookings}
          locale={params.locale}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const t = await getTranslations('customerBookings')
  
  return {
    title: t('meta.title'),
    description: t('meta.description')
  }
}