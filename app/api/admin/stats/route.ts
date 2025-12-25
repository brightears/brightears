import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withRole } from '@/lib/api-auth'

const prisma = new PrismaClient()

/**
 * GET /api/admin/stats
 *
 * Get dashboard statistics for admin overview
 * Requires ADMIN role
 *
 * Returns:
 * - Application counts by status
 * - Total artists and their status
 * - Active bookings by status
 * - Monthly revenue metrics
 */
export async function GET(req: NextRequest) {
  return withRole(req, 'ADMIN', async () => {
    try {
      // Get current date for monthly calculations
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

      // Parallel queries for better performance
      const [
        applicationStats,
        artistStats,
        bookingStats,
        revenueThisMonth,
        revenueLastMonth
      ] = await Promise.all([
        // Application statistics
        prisma.application.groupBy({
          by: ['status'],
          _count: true
        }),

        // Artist statistics
        prisma.artist.aggregate({
          _count: {
            id: true
          }
        }),

        // Booking statistics
        prisma.booking.groupBy({
          by: ['status'],
          _count: true
        }),

        // Revenue this month (sum of confirmed/paid/completed bookings)
        prisma.booking.aggregate({
          where: {
            status: {
              in: ['CONFIRMED', 'PAID', 'COMPLETED']
            },
            createdAt: {
              gte: firstDayOfMonth
            }
          },
          _sum: {
            quotedPrice: true
          },
          _count: true
        }),

        // Revenue last month for comparison
        prisma.booking.aggregate({
          where: {
            status: {
              in: ['CONFIRMED', 'PAID', 'COMPLETED']
            },
            createdAt: {
              gte: firstDayOfLastMonth,
              lte: lastDayOfLastMonth
            }
          },
          _sum: {
            quotedPrice: true
          }
        })
      ])

      // Process application stats
      const appCounts = {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
      }

      applicationStats.forEach(stat => {
        const count = stat._count
        appCounts.total += count

        if (stat.status === 'PENDING') appCounts.pending = count
        if (stat.status === 'APPROVED') appCounts.approved = count
        if (stat.status === 'REJECTED') appCounts.rejected = count
      })

      // Process booking stats
      const bookingCounts = {
        active: 0,
        inquiry: 0,
        quoted: 0,
        confirmed: 0,
        paid: 0,
        completed: 0,
        thisMonth: 0
      }

      bookingStats.forEach(stat => {
        const count = stat._count

        if (stat.status !== 'CANCELLED') {
          bookingCounts.active += count
        }

        if (stat.status === 'INQUIRY') bookingCounts.inquiry = count
        if (stat.status === 'QUOTED') bookingCounts.quoted = count
        if (stat.status === 'CONFIRMED') bookingCounts.confirmed = count
        if (stat.status === 'PAID') bookingCounts.paid = count
        if (stat.status === 'COMPLETED') bookingCounts.completed = count
      })

      bookingCounts.thisMonth = revenueThisMonth._count

      // Calculate revenue change
      const thisMonthRevenue = Number(revenueThisMonth._sum.quotedPrice || 0)
      const lastMonthRevenue = Number(revenueLastMonth._sum.quotedPrice || 0)

      let revenueChange = 0
      if (lastMonthRevenue > 0) {
        revenueChange = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      } else if (thisMonthRevenue > 0) {
        revenueChange = 100 // First month with revenue
      }

      // Get artist breakdown
      const [artistsWithBookings, newArtistsThisMonth] = await Promise.all([
        prisma.artist.count({
          where: {
            totalBookings: {
              gt: 0
            }
          }
        }),
        prisma.artist.count({
          where: {
            createdAt: {
              gte: firstDayOfMonth
            }
          }
        })
      ])

      return NextResponse.json({
        applications: appCounts,
        artists: {
          total: artistStats._count.id,
          active: artistsWithBookings,
          newThisMonth: newArtistsThisMonth
        },
        bookings: bookingCounts,
        revenue: {
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          change: revenueChange.toFixed(1) + '%',
          currency: 'THB'
        }
      })

    } catch (error) {
      console.error('Error fetching admin stats:', error)

      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      )
    }
  })
}
