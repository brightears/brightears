import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schema for analytics query
const analyticsQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y', 'all']).default('30d'),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

// GET - Get platform analytics (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only admins can access analytics
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Validate query parameters
    const validationResult = analyticsQuerySchema.safeParse(queryParams)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid analytics parameters', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { period, startDate, endDate } = validationResult.data

    // Calculate date range
    let dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else if (period !== 'all') {
      const now = new Date()
      const daysBack = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365
      const startOfPeriod = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
      dateFilter = {
        gte: startOfPeriod,
        lte: now
      }
    }

    // Execute analytics queries in parallel
    const [
      // User metrics
      totalUsers,
      newUsers,
      activeUsers,
      usersByRole,
      
      // Booking metrics
      totalBookings,
      newBookings,
      bookingsByStatus,
      completedBookings,
      
      // Financial metrics
      totalRevenue,
      totalPayments,
      paymentsByMethod,
      
      // Content metrics
      totalArtists,
      verifiedArtists,
      artistsByCategory,
      
      // Engagement metrics
      totalMessages,
      totalNotifications,
      averageResponseTime
    ] = await Promise.all([
      // User metrics
      prisma.user.count(),
      prisma.user.count({
        where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}
      }),
      prisma.user.count({
        where: {
          lastLogin: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
          }
        }
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: true
      }),
      
      // Booking metrics
      prisma.booking.count(),
      prisma.booking.count({
        where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}
      }),
      prisma.booking.groupBy({
        by: ['status'],
        _count: true
      }),
      prisma.booking.count({
        where: {
          status: 'COMPLETED',
          ...(Object.keys(dateFilter).length > 0 ? { completedAt: dateFilter } : {})
        }
      }),
      
      // Financial metrics
      prisma.payment.aggregate({
        where: {
          status: 'verified',
          ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.payment.count({
        where: {
          status: 'verified',
          ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
        }
      }),
      prisma.payment.groupBy({
        by: ['paymentMethod'],
        where: {
          status: 'verified',
          ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
        },
        _count: true,
        _sum: { amount: true }
      }),
      
      // Content metrics
      prisma.artist.count(),
      prisma.artist.count({
        where: { verificationLevel: 'VERIFIED' }
      }),
      prisma.artist.groupBy({
        by: ['category'],
        _count: true
      }),
      
      // Engagement metrics
      prisma.message.count({
        where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}
      }),
      prisma.notification.count({
        where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}
      }),
      // Average response time calculation (simplified)
      prisma.message.aggregate({
        _avg: {
          createdAt: true
        }
      })
    ])

    // Calculate growth rates for previous period
    const previousPeriodFilter = { ...dateFilter }
    if (Object.keys(dateFilter).length > 0) {
      const periodLength = new Date(dateFilter.lte).getTime() - new Date(dateFilter.gte).getTime()
      previousPeriodFilter.gte = new Date(new Date(dateFilter.gte).getTime() - periodLength)
      previousPeriodFilter.lte = new Date(dateFilter.gte)
    }

    const [previousUsers, previousBookings, previousRevenue] = await Promise.all([
      prisma.user.count({
        where: Object.keys(previousPeriodFilter).length > 0 ? { createdAt: previousPeriodFilter } : {}
      }),
      prisma.booking.count({
        where: Object.keys(previousPeriodFilter).length > 0 ? { createdAt: previousPeriodFilter } : {}
      }),
      prisma.payment.aggregate({
        where: {
          status: 'verified',
          ...(Object.keys(previousPeriodFilter).length > 0 ? { createdAt: previousPeriodFilter } : {})
        },
        _sum: { amount: true }
      })
    ])

    // Calculate growth percentages
    const userGrowth = previousUsers > 0 ? ((newUsers - previousUsers) / previousUsers) * 100 : 0
    const bookingGrowth = previousBookings > 0 ? ((newBookings - previousBookings) / previousBookings) * 100 : 0
    const revenueGrowth = (previousRevenue._sum.amount && Number(previousRevenue._sum.amount) > 0) 
      ? ((Number(totalRevenue._sum.amount || 0) - Number(previousRevenue._sum.amount)) / Number(previousRevenue._sum.amount)) * 100 
      : 0

    // Get top performing artists
    const topArtists = await prisma.artist.findMany({
      take: 10,
      orderBy: [
        { completedBookings: 'desc' },
        { averageRating: 'desc' }
      ],
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Get recent activity
    const recentActivity = await prisma.booking.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        artist: {
          select: {
            stageName: true
          }
        },
        customer: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Format category data
    const categoryStats: Record<string, number> = {}
    artistsByCategory.forEach(item => {
      if (item.category) {
        categoryStats[item.category] = (categoryStats[item.category] || 0) + item._count
      }
    })

    return NextResponse.json({
      period,
      dateRange: Object.keys(dateFilter).length > 0 ? {
        start: dateFilter.gte,
        end: dateFilter.lte
      } : null,
      
      // Overview metrics
      overview: {
        totalUsers,
        totalArtists,
        totalBookings,
        totalRevenue: Number(totalRevenue._sum.amount || 0),
        activeUsers,
        completedBookings,
        verifiedArtists
      },
      
      // Growth metrics
      growth: {
        users: {
          current: newUsers,
          previous: previousUsers,
          growth: Math.round(userGrowth * 100) / 100
        },
        bookings: {
          current: newBookings,
          previous: previousBookings,
          growth: Math.round(bookingGrowth * 100) / 100
        },
        revenue: {
          current: Number(totalRevenue._sum.amount || 0),
          previous: Number(previousRevenue._sum.amount || 0),
          growth: Math.round(revenueGrowth * 100) / 100
        }
      },
      
      // Breakdown analytics
      breakdowns: {
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count
        })),
        bookingsByStatus: bookingsByStatus.map(item => ({
          status: item.status,
          count: item._count
        })),
        paymentsByMethod: paymentsByMethod.map(item => ({
          method: item.paymentMethod,
          count: item._count,
          amount: Number(item._sum.amount || 0)
        })),
        artistsByCategory: Object.entries(categoryStats).map(([category, count]) => ({
          category,
          count
        }))
      },
      
      // Top performers
      topArtists: topArtists.map(artist => ({
        id: artist.id,
        stageName: artist.stageName,
        name: artist.user.name,
        completedBookings: artist.completedBookings,
        averageRating: artist.averageRating || 0,
        verificationLevel: artist.verificationLevel
      })),
      
      // Recent activity
      recentActivity: recentActivity.map(booking => ({
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        eventDate: booking.eventDate,
        createdAt: booking.createdAt,
        artistName: booking.artist.stageName,
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`
      })),
      
      // Platform health
      platformHealth: {
        totalMessages,
        totalNotifications,
        totalPayments,
        conversionRate: totalUsers > 0 ? (completedBookings / totalUsers) * 100 : 0,
        averageBookingValue: completedBookings > 0 ? Number(totalRevenue._sum.amount || 0) / completedBookings : 0
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch platform analytics')
  }
}