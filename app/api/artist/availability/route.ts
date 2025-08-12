import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const artist = user.artist
    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { date, isAvailable, startTime = '09:00', endTime = '23:00' } = body

    // Parse the date and time
    const eventDate = new Date(date)
    const startDateTime = new Date(`${date}T${startTime}:00`)
    const endDateTime = new Date(`${date}T${endTime}:00`)

    // Check if availability already exists for this date
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        artistId: artist.id,
        date: eventDate
      }
    })

    let availability

    if (existingAvailability) {
      // Update existing availability
      availability = await prisma.availability.update({
        where: { id: existingAvailability.id },
        data: {
          isAvailable,
          startTime: startDateTime,
          endTime: endDateTime
        }
      })
    } else {
      // Create new availability
      availability = await prisma.availability.create({
        data: {
          artistId: artist.id,
          date: eventDate,
          startTime: startDateTime,
          endTime: endDateTime,
          isAvailable
        }
      })
    }

    return NextResponse.json({ success: true, availability })
  } catch (error) {
    console.error('Error updating artist availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const artist = user.artist
    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let whereClause: any = { artistId: artist.id }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      
      whereClause.date = {
        gte: startDate,
        lte: endDate
      }
    }

    const availability = await prisma.availability.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    })

    return NextResponse.json({ availability })
  } catch (error) {
    console.error('Error fetching artist availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}