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

    // Verify user has access to this booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        artist: { select: { userId: true } },
        customer: { select: { id: true } }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user is either the customer or the artist
    const isCustomer = booking.customerId === user.id
    const isArtist = booking.artist.userId === user.id

    if (!isCustomer && !isArtist) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get messages for this booking
    const messages = await prisma.message.findMany({
      where: { bookingId: id },
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
      },
      orderBy: { createdAt: 'asc' }
    })

    // Mark messages as read for current user
    await prisma.message.updateMany({
      where: {
        bookingId: id,
        senderId: { not: user.id },
        isRead: false
      },
      data: { 
        isRead: true,
        readAt: new Date()
      }
    })

    // Format messages
    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      isRead: message.isRead,
      readAt: message.readAt,
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
    }))

    return NextResponse.json({ messages: formattedMessages })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
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
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    // Verify user has access to this booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        artist: { 
          select: { 
            id: true,
            userId: true,
            stageName: true
          } 
        },
        customer: { 
          select: { 
            id: true,
            email: true,
            customer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          } 
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user is either the customer or the artist
    const isCustomer = booking.customerId === user.id
    const isArtist = booking.artist.userId === user.id

    if (!isCustomer && !isArtist) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get artist ID for the message relation
    let artistId: string
    if (isArtist) {
      artistId = booking.artist.id
    } else {
      artistId = booking.artist.id
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: user.id,
        artistId: artistId,
        bookingId: id
      },
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
    })

    // Create notification for the other party
    const recipientUserId = isArtist ? booking.customerId : booking.artist.userId
    const senderName = isArtist 
      ? booking.artist.stageName 
      : booking.customer.customer
        ? `${booking.customer.customer.firstName || ''} ${booking.customer.customer.lastName || ''}`.trim() || booking.customer.email
        : booking.customer.email

    await prisma.notification.create({
      data: {
        userId: recipientUserId,
        type: 'message',
        title: 'New Message',
        titleTh: 'ข้อความใหม่',
        content: `You have a new message from ${senderName} regarding your booking`,
        contentTh: `คุณมีข้อความใหม่จาก ${senderName} เกี่ยวกับการจองของคุณ`,
        relatedId: booking.id,
        relatedType: 'booking'
      }
    })

    // Format the response
    const formattedMessage = {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      isRead: message.isRead,
      readAt: message.readAt,
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
      isOwn: true
    }

    return NextResponse.json({ 
      success: true, 
      message: formattedMessage 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}