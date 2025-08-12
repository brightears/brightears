import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const artist = user.artist
    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { status } = body

    // Verify the booking belongs to this artist
    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: { artist: true }
    })

    if (!booking || booking.artistId !== artist.id) {
      return NextResponse.json({ error: 'Booking not found or unauthorized' }, { status: 404 })
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: {
        status,
        confirmedAt: status === 'CONFIRMED' ? new Date() : booking.confirmedAt,
        cancelledAt: status === 'CANCELLED' ? new Date() : booking.cancelledAt,
        completedAt: status === 'COMPLETED' ? new Date() : booking.completedAt
      }
    })

    return NextResponse.json({ success: true, booking: updatedBooking })
  } catch (error) {
    console.error('Error updating booking status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}