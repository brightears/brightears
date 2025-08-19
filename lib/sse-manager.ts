// Server-Sent Events connection manager for real-time messaging

interface SSEConnection {
  controller: ReadableStreamDefaultController<any>
  userId: string
  bookingId: string
  connectedAt: number
}

// Store active SSE connections
const connections = new Map<string, SSEConnection>()

export class SSEManager {
  static addConnection(
    connectionId: string,
    controller: ReadableStreamDefaultController<any>,
    userId: string,
    bookingId: string
  ) {
    connections.set(connectionId, {
      controller,
      userId,
      bookingId,
      connectedAt: Date.now()
    })
  }

  static removeConnection(connectionId: string) {
    connections.delete(connectionId)
  }

  static getActiveConnectionsCount(bookingId?: string): number {
    if (bookingId) {
      let count = 0
      for (const connection of connections.values()) {
        if (connection.bookingId === bookingId) {
          count++
        }
      }
      return count
    }
    return connections.size
  }

  // Broadcast message to all connected clients for a booking
  static async broadcastMessage(
    bookingId: string,
    message: any,
    excludeUserId?: string
  ) {
    const messageData = `data: ${JSON.stringify({
      type: 'message',
      data: message,
      timestamp: new Date().toISOString()
    })}\n\n`

    const connectionsToRemove: string[] = []

    // Find all connections for this booking
    for (const [connectionId, connection] of connections.entries()) {
      if (connection.bookingId === bookingId && connection.userId !== excludeUserId) {
        try {
          connection.controller.enqueue(messageData)
        } catch (error) {
          console.error(`Error broadcasting message to connection ${connectionId}:`, error)
          connectionsToRemove.push(connectionId)
        }
      }
    }

    // Clean up failed connections
    connectionsToRemove.forEach(connectionId => {
      connections.delete(connectionId)
    })
  }

  // Broadcast typing indicator
  static async broadcastTyping(
    bookingId: string,
    userId: string,
    isTyping: boolean,
    userName?: string
  ) {
    const typingData = `data: ${JSON.stringify({
      type: 'typing',
      data: {
        userId,
        userName,
        isTyping
      },
      timestamp: new Date().toISOString()
    })}\n\n`

    const connectionsToRemove: string[] = []

    // Find all connections for this booking except the sender
    for (const [connectionId, connection] of connections.entries()) {
      if (connection.bookingId === bookingId && connection.userId !== userId) {
        try {
          connection.controller.enqueue(typingData)
        } catch (error) {
          console.error(`Error broadcasting typing to connection ${connectionId}:`, error)
          connectionsToRemove.push(connectionId)
        }
      }
    }

    // Clean up failed connections
    connectionsToRemove.forEach(connectionId => {
      connections.delete(connectionId)
    })
  }

  // Broadcast delivery status updates
  static async broadcastDeliveryStatus(
    bookingId: string,
    messageId: string,
    status: string,
    targetUserId?: string
  ) {
    const statusData = `data: ${JSON.stringify({
      type: 'delivery_status',
      data: {
        messageId,
        status
      },
      timestamp: new Date().toISOString()
    })}\n\n`

    const connectionsToRemove: string[] = []

    // Broadcast to specific user or all connections for this booking
    for (const [connectionId, connection] of connections.entries()) {
      if (connection.bookingId === bookingId) {
        if (!targetUserId || connection.userId === targetUserId) {
          try {
            connection.controller.enqueue(statusData)
          } catch (error) {
            console.error(`Error broadcasting delivery status to connection ${connectionId}:`, error)
            connectionsToRemove.push(connectionId)
          }
        }
      }
    }

    // Clean up failed connections
    connectionsToRemove.forEach(connectionId => {
      connections.delete(connectionId)
    })
  }

  // Send system message (notifications, status updates)
  static async broadcastSystemMessage(
    bookingId: string,
    systemMessage: {
      type: string
      title: string
      content: string
      data?: any
    },
    targetUserId?: string
  ) {
    const messageData = `data: ${JSON.stringify({
      type: 'system',
      data: systemMessage,
      timestamp: new Date().toISOString()
    })}\n\n`

    const connectionsToRemove: string[] = []

    for (const [connectionId, connection] of connections.entries()) {
      if (connection.bookingId === bookingId) {
        if (!targetUserId || connection.userId === targetUserId) {
          try {
            connection.controller.enqueue(messageData)
          } catch (error) {
            console.error(`Error broadcasting system message to connection ${connectionId}:`, error)
            connectionsToRemove.push(connectionId)
          }
        }
      }
    }

    // Clean up failed connections
    connectionsToRemove.forEach(connectionId => {
      connections.delete(connectionId)
    })
  }

  // Send keep-alive ping
  static sendPing(connectionId: string) {
    const connection = connections.get(connectionId)
    if (connection) {
      try {
        connection.controller.enqueue(`data: ${JSON.stringify({
          type: 'ping',
          timestamp: new Date().toISOString()
        })}\n\n`)
      } catch (error) {
        console.error(`Error sending ping to connection ${connectionId}:`, error)
        connections.delete(connectionId)
      }
    }
  }

  // Clean up stale connections
  static cleanupStaleConnections(maxAgeMs: number = 5 * 60 * 1000) {
    const now = Date.now()
    const connectionsToRemove: string[] = []

    for (const [connectionId, connection] of connections.entries()) {
      if (now - connection.connectedAt > maxAgeMs) {
        connectionsToRemove.push(connectionId)
      }
    }

    connectionsToRemove.forEach(connectionId => {
      console.log(`Cleaning up stale connection: ${connectionId}`)
      connections.delete(connectionId)
    })

    return connectionsToRemove.length
  }

  // Get connection info for debugging
  static getConnectionInfo() {
    const info = {
      totalConnections: connections.size,
      connectionsByBooking: {} as Record<string, number>,
      connectionsByUser: {} as Record<string, number>
    }

    for (const connection of connections.values()) {
      // Count by booking
      if (!info.connectionsByBooking[connection.bookingId]) {
        info.connectionsByBooking[connection.bookingId] = 0
      }
      info.connectionsByBooking[connection.bookingId]++

      // Count by user
      if (!info.connectionsByUser[connection.userId]) {
        info.connectionsByUser[connection.userId] = 0
      }
      info.connectionsByUser[connection.userId]++
    }

    return info
  }
}

// Cleanup stale connections every minute
setInterval(() => {
  SSEManager.cleanupStaleConnections()
}, 60000)