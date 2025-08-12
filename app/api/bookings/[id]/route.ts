import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                preferredLanguage: true
              }
            }
          }
        },
        artist: {
          select: {
            id: true,
            userId: true,
            stageName: true,
            profileImage: true,
            category: true,
            hourlyRate: true,
            currency: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                artist: {
                  select: {
                    stageName: true,
                    profileImage: true
                  }
                },
                customer: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user has access to this booking
    const isCustomer = booking.customerId === user.id
    const isArtist = booking.artist.userId === user.id

    if (!isCustomer && !isArtist) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Format the booking data
    const formattedBooking = {
      ...booking,
      customerName: booking.customer.customer ? 
        `${booking.customer.customer.firstName || ''} ${booking.customer.customer.lastName || ''}`.trim() ||
        booking.customer.email :
        booking.customer.email,
      customerEmail: booking.customer.email,
      artistName: booking.artist.stageName,
      artistImage: booking.artist.profileImage,
      artistCategory: booking.artist.category,
      messages: booking.messages.map(message => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        isRead: message.isRead,
        sender: {
          id: message.sender.id,
          email: message.sender.email,
          role: message.sender.role,
          name: message.sender.role === 'ARTIST' 
            ? message.sender.artist?.stageName || message.sender.email
            : message.sender.customer
              ? `${message.sender.customer.firstName || ''} ${message.sender.customer.lastName || ''}`.trim() || message.sender.email
              : message.sender.email,
          profileImage: message.sender.artist?.profileImage || null
        },
        isOwn: message.senderId === user.id
      })),
      isCustomer,
      isArtist
    }

    return NextResponse.json({ booking: formattedBooking })

  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Verify the booking exists and user has permission
    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: {
        artist: { select: { id: true, userId: true } }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check permissions based on what's being updated
    const isCustomer = booking.customerId === user.id
    const isArtist = booking.artist.userId === user.id

    if (!isCustomer && !isArtist) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Different update permissions
    let updateData: any = {}

    // Artist can update: quotedPrice, finalPrice, status, notes
    if (isArtist) {
      const { quotedPrice, finalPrice, status, notes, artistNotes } = body
      
      if (quotedPrice !== undefined) updateData.quotedPrice = quotedPrice
      if (finalPrice !== undefined) updateData.finalPrice = finalPrice
      if (notes !== undefined) updateData.notes = notes
      if (artistNotes !== undefined) {
        updateData.notes = booking.notes ? `${booking.notes}\n\nArtist Notes: ${artistNotes}` : `Artist Notes: ${artistNotes}`
      }
      
      if (status !== undefined) {
        updateData.status = status
        
        // Update timestamps based on status
        if (status === 'CONFIRMED') {
          updateData.confirmedAt = new Date()
        } else if (status === 'CANCELLED') {
          updateData.cancelledAt = new Date()
        } else if (status === 'COMPLETED') {
          updateData.completedAt = new Date()
        }
      }
    }

    // Customer can update: venue details, guest count, special requests (only if status is INQUIRY)
    if (isCustomer && booking.status === 'INQUIRY') {
      const { venue, venueAddress, guestCount, specialRequests, eventType, eventDate, startTime, endTime } = body
      
      if (venue !== undefined) updateData.venue = venue
      if (venueAddress !== undefined) updateData.venueAddress = venueAddress
      if (guestCount !== undefined) updateData.guestCount = guestCount
      if (specialRequests !== undefined) updateData.specialRequests = specialRequests
      if (eventType !== undefined) updateData.eventType = eventType
      
      // Handle date/time updates with validation
      if (eventDate !== undefined) {
        const eventDateTime = new Date(eventDate)
        if (eventDateTime < new Date()) {
          return NextResponse.json({ error: 'Event date cannot be in the past' }, { status: 400 })
        }
        updateData.eventDate = eventDateTime
      }
      
      if (startTime !== undefined && endTime !== undefined) {
        const startDateTime = new Date(startTime)
        const endDateTime = new Date(endTime)
        
        if (endDateTime <= startDateTime) {
          return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
        }
        
        updateData.startTime = startDateTime
        updateData.endTime = endDateTime
        updateData.duration = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60))
      }
    }

    // Both can update cancellation reason if cancelling
    if (body.status === 'CANCELLED' && body.cancellationReason) {
      updateData.cancellationReason = body.cancellationReason
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: updateData,
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
        artist: {
          select: {
            stageName: true,
            profileImage: true,
            userId: true
          }
        }
      }
    })

    // Create notification for status changes
    if (updateData.status) {
      const recipientId = isArtist ? booking.customerId : updatedBooking.artist.userId
      const senderName = isArtist ? updatedBooking.artist.stageName : 
        updatedBooking.customer.customer ? 
          `${updatedBooking.customer.customer.firstName || ''} ${updatedBooking.customer.customer.lastName || ''}`.trim() :
          updatedBooking.customer.email

      let notificationContent = ''
      let notificationContentTh = ''

      switch (updateData.status) {
        case 'CONFIRMED':
          notificationContent = `Your booking has been confirmed by ${senderName}`
          notificationContentTh = `การจองของคุณได้รับการยืนยันจาก ${senderName}`
          break
        case 'CANCELLED':
          notificationContent = `Your booking has been cancelled by ${senderName}`
          notificationContentTh = `การจองของคุณถูกยกเลิกโดย ${senderName}`
          break
        case 'COMPLETED':
          notificationContent = `Your booking has been marked as completed`
          notificationContentTh = `การจองของคุณได้ถูกทำเครื่องหมายว่าเสร็จสมบูรณ์`
          break
      }

      if (notificationContent) {
        await prisma.notification.create({
          data: {
            userId: recipientId,
            type: 'booking_update',
            title: 'Booking Status Updated',
            titleTh: 'อัปเดตสถานะการจอง',
            content: notificationContent,
            contentTh: notificationContentTh,
            relatedId: booking.id,
            relatedType: 'booking'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      booking: {
        ...updatedBooking,
        customerName: updatedBooking.customer.customer ? 
          `${updatedBooking.customer.customer.firstName || ''} ${updatedBooking.customer.customer.lastName || ''}`.trim() ||
          updatedBooking.customer.email :
          updatedBooking.customer.email,
        customerEmail: updatedBooking.customer.email,
        artistName: updatedBooking.artist.stageName,
        artistImage: updatedBooking.artist.profileImage
      }
    })

  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: {
        artist: { select: { userId: true } }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only allow deletion by customer and only if status is INQUIRY
    const isCustomer = booking.customerId === user.id
    
    if (!isCustomer || booking.status !== 'INQUIRY') {
      return NextResponse.json({ 
        error: 'Only customers can delete inquiries, and only in INQUIRY status' 
      }, { status: 403 })
    }

    // Delete associated messages and notifications
    await prisma.$transaction([
      prisma.message.deleteMany({
        where: { bookingId: id }
      }),
      prisma.notification.deleteMany({
        where: { 
          relatedId: id,
          relatedType: 'booking'
        }
      }),
      prisma.booking.delete({
        where: { id: id }
      })
    ])

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}