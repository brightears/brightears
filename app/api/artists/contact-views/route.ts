import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { artistId } = body

    if (!artistId) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      )
    }

    // Check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Get client IP and user agent for analytics
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')

    // Create or update contact view record
    const contactView = await prisma.contactView.upsert({
      where: {
        userId_artistId: {
          userId: user.id,
          artistId: artistId
        }
      },
      update: {
        viewedAt: new Date(),
        ipAddress: ipAddress,
        userAgent: userAgent
      },
      create: {
        userId: user.id,
        artistId: artistId,
        ipAddress: ipAddress,
        userAgent: userAgent
      }
    })

    return NextResponse.json({
      success: true,
      contactView: {
        id: contactView.id,
        viewedAt: contactView.viewedAt
      }
    })

  } catch (error) {
    console.error('Error tracking contact view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET endpoint to retrieve contact view analytics (for artists/admin)
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const artistId = searchParams.get('artistId')

    if (!artistId) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      )
    }

    // Check if user is the artist or admin
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: { user: true }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Only allow artist themselves or admin to view analytics
    if (artist.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get contact views with user information
    const contactViews = await prisma.contactView.findMany({
      where: { artistId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            customer: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            corporate: {
              select: {
                companyName: true,
                contactPerson: true
              }
            }
          }
        }
      },
      orderBy: { viewedAt: 'desc' }
    })

    // Get summary statistics
    const totalViews = contactViews.length
    const uniqueViewers = new Set(contactViews.map(cv => cv.userId)).size
    const viewsThisWeek = contactViews.filter(cv => 
      cv.viewedAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
    const viewsThisMonth = contactViews.filter(cv => 
      cv.viewedAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length

    return NextResponse.json({
      success: true,
      analytics: {
        totalViews,
        uniqueViewers,
        viewsThisWeek,
        viewsThisMonth
      },
      contactViews: contactViews.map(cv => {
        const displayName = cv.user.customer 
          ? `${cv.user.customer.firstName || ''} ${cv.user.customer.lastName || ''}`.trim()
          : cv.user.corporate
          ? `${cv.user.corporate.contactPerson} (${cv.user.corporate.companyName})`
          : cv.user.email || 'User'

        return {
          id: cv.id,
          viewedAt: cv.viewedAt,
          user: {
            id: cv.user.id,
            name: displayName,
            email: cv.user.email,
            role: cv.user.role,
            displayName: displayName
          }
        }
      })
    })

  } catch (error) {
    console.error('Error fetching contact view analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}