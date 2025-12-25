import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SSEManager } from '@/lib/sse-manager'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify user has access to this booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { customerId: user.id },
          { artist: { userId: user.id } }
        ]
      }
    })

    if (!booking) {
      return new NextResponse('Booking not found or access denied', { status: 404 })
    }

    const connectionId = `${user.id}-${bookingId}-${Date.now()}`

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Store connection in SSE manager
        SSEManager.addConnection(connectionId, controller, user.id, bookingId)

        // Send initial connection confirmation
        controller.enqueue(`data: ${JSON.stringify({
          type: 'connected',
          connectionId,
          activeConnections: SSEManager.getActiveConnectionsCount(bookingId),
          timestamp: new Date().toISOString()
        })}\n\n`)

        // Send keep-alive ping every 30 seconds
        const keepAlive = setInterval(() => {
          SSEManager.sendPing(connectionId)
        }, 30000)

        // Cleanup function
        const cleanup = () => {
          clearInterval(keepAlive)
          SSEManager.removeConnection(connectionId)
        }

        // Store cleanup function on the controller for later use
        ;(controller as any).cleanup = cleanup
      },
      cancel() {
        SSEManager.removeConnection(connectionId)
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    })

  } catch (error) {
    console.error('SSE connection error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}