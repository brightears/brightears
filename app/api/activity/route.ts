import { NextRequest, NextResponse } from 'next/server'
import { getRecentActivity, getActivityStats } from '@/lib/activity-tracker'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20) // Max 20 items
    const includeStats = searchParams.get('stats') === 'true'
    
    if (includeStats) {
      // Return both activity and stats for homepage
      const stats = await getActivityStats()
      return NextResponse.json({
        success: true,
        data: {
          recentActivity: stats.recentActivity,
          stats: {
            totalBookings: stats.totalBookings,
            totalArtists: stats.totalArtists,
            totalInquiries: stats.totalInquiries
          }
        }
      })
    } else {
      // Return just recent activity
      const recentActivity = await getRecentActivity(limit)
      return NextResponse.json({
        success: true,
        data: {
          recentActivity
        }
      })
    }
    
  } catch (error) {
    console.error('Activity API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch activity data',
        data: {
          recentActivity: [],
          stats: {
            totalBookings: 0,
            totalArtists: 0,
            totalInquiries: 0
          }
        }
      },
      { status: 500 }
    )
  }
}

// POST endpoint for tracking new activity (called by other parts of the app)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body
    
    // Import the tracking function dynamically to avoid circular imports
    const { trackActivity } = await import('@/lib/activity-tracker')
    
    await trackActivity(type, data)
    
    return NextResponse.json({
      success: true,
      message: 'Activity tracked successfully'
    })
    
  } catch (error) {
    console.error('Activity tracking error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track activity' 
      },
      { status: 500 }
    )
  }
}