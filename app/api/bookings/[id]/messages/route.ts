import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SSEManager } from '@/lib/sse-manager'
import { z } from 'zod'

const createMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  messageType: z.enum(['TEXT', 'IMAGE', 'FILE', 'SYSTEM']).optional().default('TEXT'),
  attachmentUrl: z.string().url().optional(),
  parentMessageId: z.string().uuid().optional()
})

const getMessagesSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
  before: z.string().optional() // For cursor-based pagination
})

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

    const { searchParams } = new URL(request.url)
    const queryParams = getMessagesSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
      before: searchParams.get('before') || undefined
    })

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

    // Build where clause for pagination
    let whereClause: any = { bookingId: id }
    if (queryParams.before) {
      whereClause.createdAt = { lt: new Date(queryParams.before) }
    }

    // Get messages for this booking with pagination
    const messages = await prisma.message.findMany({
      where: whereClause,
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
        },
        parentMessage: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                artist: { select: { stageName: true } },
                customer: { select: { firstName: true, lastName: true } }
              }
            }
          }
        },
        replies: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                artist: { select: { stageName: true } },
                customer: { select: { firstName: true, lastName: true } }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: queryParams.limit
    })

    // Mark unread messages as read and update delivery status
    const updatedMessages = await prisma.message.updateMany({
      where: {
        bookingId: id,
        senderId: { not: user.id },
        deliveryStatus: { in: ['SENT', 'DELIVERED'] }
      },
      data: { 
        isRead: true,
        readAt: new Date(),
        deliveredAt: new Date(),
        deliveryStatus: 'READ'
      }
    })

    // Broadcast delivery status updates if any messages were updated
    if (updatedMessages.count > 0) {
      const readMessageIds = await prisma.message.findMany({
        where: {
          bookingId: id,
          senderId: { not: user.id },
          deliveryStatus: 'READ',
          readAt: { gte: new Date(Date.now() - 1000) } // Messages read in the last second
        },
        select: { id: true }
      })

      for (const msg of readMessageIds) {
        await SSEManager.broadcastDeliveryStatus(id, msg.id, 'READ')
      }
    }

    // Format messages (reverse to show newest first in UI)
    const formattedMessages = messages.reverse().map(message => ({
      id: message.id,
      content: message.content,
      messageType: message.messageType,
      attachmentUrl: message.attachmentUrl,
      createdAt: message.createdAt,
      isRead: message.isRead,
      readAt: message.readAt,
      deliveredAt: message.deliveredAt,
      deliveryStatus: message.deliveryStatus,
      parentMessage: message.parentMessage ? {
        id: message.parentMessage.id,
        content: message.parentMessage.content,
        senderName: message.parentMessage.sender.role === 'ARTIST'
          ? message.parentMessage.sender.artist?.stageName || message.parentMessage.sender.email
          : message.parentMessage.sender.customer
            ? `${message.parentMessage.sender.customer.firstName || ''} ${message.parentMessage.sender.customer.lastName || ''}`.trim() || message.parentMessage.sender.email
            : message.parentMessage.sender.email
      } : null,
      replies: message.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        senderName: reply.sender.role === 'ARTIST'
          ? reply.sender.artist?.stageName || reply.sender.email
          : reply.sender.customer
            ? `${reply.sender.customer.firstName || ''} ${reply.sender.customer.lastName || ''}`.trim() || reply.sender.email
            : reply.sender.email
      })),
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

    // Get pagination info
    const hasMore = messages.length === queryParams.limit
    const nextCursor = hasMore ? messages[messages.length - 1]?.createdAt.toISOString() : null

    return NextResponse.json({ 
      messages: formattedMessages,
      pagination: {
        hasMore,
        nextCursor,
        page: queryParams.page,
        limit: queryParams.limit
      }
    })

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
    const validatedData = createMessageSchema.parse(body)

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

    // Create the message with enhanced features
    const message = await prisma.message.create({
      data: {
        content: validatedData.content.trim(),
        messageType: validatedData.messageType,
        attachmentUrl: validatedData.attachmentUrl,
        parentMessageId: validatedData.parentMessageId,
        senderId: user.id,
        artistId: artistId,
        bookingId: id,
        deliveryStatus: 'SENT'
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
        },
        parentMessage: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                artist: { select: { stageName: true } },
                customer: { select: { firstName: true, lastName: true } }
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
      messageType: message.messageType,
      attachmentUrl: message.attachmentUrl,
      createdAt: message.createdAt,
      isRead: message.isRead,
      readAt: message.readAt,
      deliveredAt: message.deliveredAt,
      deliveryStatus: message.deliveryStatus,
      parentMessage: message.parentMessage ? {
        id: message.parentMessage.id,
        content: message.parentMessage.content,
        senderName: message.parentMessage.sender.role === 'ARTIST'
          ? message.parentMessage.sender.artist?.stageName || message.parentMessage.sender.email
          : message.parentMessage.sender.customer
            ? `${message.parentMessage.sender.customer.firstName || ''} ${message.parentMessage.sender.customer.lastName || ''}`.trim() || message.parentMessage.sender.email
            : message.parentMessage.sender.email
      } : null,
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

    // Broadcast message to other connected clients via SSE
    try {
      await SSEManager.broadcastMessage(id, formattedMessage, user.id)
      
      // Update delivery status to DELIVERED for real-time feedback
      await prisma.message.update({
        where: { id: message.id },
        data: { 
          deliveryStatus: 'DELIVERED',
          deliveredAt: new Date()
        }
      })
      
      // Broadcast delivery status update
      await SSEManager.broadcastDeliveryStatus(id, message.id, 'DELIVERED')
    } catch (error) {
      console.error('Error broadcasting message:', error)
      // Don't fail the API call if broadcasting fails
    }

    return NextResponse.json({ 
      success: true, 
      message: { ...formattedMessage, deliveryStatus: 'DELIVERED' }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating message:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid message data', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}