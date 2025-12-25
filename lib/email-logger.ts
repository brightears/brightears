import { writeFile, appendFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

/**
 * Email logging system for tracking email delivery and debugging
 * In production, this could be enhanced with structured logging (Winston, Pino)
 * or integrated with monitoring services (DataDog, New Relic, etc.)
 */

export interface EmailLogEntry {
  timestamp: string
  id: string
  to: string[]
  subject: string
  template: string
  locale: string
  status: 'sent' | 'failed' | 'queued' | 'retrying'
  messageId?: string
  error?: string
  retryCount?: number
  deliveryTime?: number
  metadata?: Record<string, any>
}

export interface EmailAnalytics {
  totalSent: number
  totalFailed: number
  successRate: number
  averageDeliveryTime: number
  templateStats: Record<string, { sent: number; failed: number }>
  localeStats: Record<string, { sent: number; failed: number }>
  errorStats: Record<string, number>
  recentActivity: EmailLogEntry[]
}

class EmailLogger {
  private logDirectory: string
  private currentDate: string
  private logFile: string

  constructor() {
    this.logDirectory = path.join(process.cwd(), 'logs', 'emails')
    this.currentDate = this.getDateString()
    this.logFile = path.join(this.logDirectory, `emails-${this.currentDate}.json`)
    this.ensureLogDirectory()
  }

  private getDateString(): string {
    return new Date().toISOString().split('T')[0]
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      if (!existsSync(this.logDirectory)) {
        await mkdir(this.logDirectory, { recursive: true })
      }
    } catch (error) {
      console.error('Failed to create log directory:', error)
    }
  }

  private async updateLogFile(): Promise<void> {
    const newDate = this.getDateString()
    if (newDate !== this.currentDate) {
      this.currentDate = newDate
      this.logFile = path.join(this.logDirectory, `emails-${this.currentDate}.json`)
    }
  }

  /**
   * Log email event
   */
  async logEmail(entry: Omit<EmailLogEntry, 'timestamp' | 'id'>): Promise<void> {
    try {
      await this.updateLogFile()

      const logEntry: EmailLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
        id: this.generateLogId()
      }

      // Log to console for development
      console.log('EMAIL LOG:', {
        id: logEntry.id,
        to: logEntry.to.join(', '),
        subject: logEntry.subject,
        template: logEntry.template,
        status: logEntry.status,
        error: logEntry.error,
        deliveryTime: logEntry.deliveryTime
      })

      // Log to database
      try {
        const { prisma } = await import('./prisma')
        
        const dbStatus = this.mapStatusToDb(logEntry.status)
        
        await prisma.emailLog.create({
          data: {
            toAddresses: logEntry.to,
            subject: logEntry.subject,
            templateName: logEntry.template,
            locale: logEntry.locale,
            status: dbStatus,
            messageId: logEntry.messageId,
            error: logEntry.error,
            retryCount: logEntry.retryCount || 0,
            relatedId: logEntry.metadata?.relatedId as string,
            relatedType: logEntry.metadata?.relatedType as string,
            userId: logEntry.metadata?.userId as string,
            sentAt: logEntry.status === 'sent' ? new Date() : null,
            metadata: logEntry.metadata,
            scheduledAt: new Date()
          }
        })
      } catch (dbError) {
        console.error('Failed to log email to database:', dbError)
        // Fall back to file logging
        const logLine = JSON.stringify(logEntry) + '\n'
        await appendFile(this.logFile, logLine, 'utf8')
      }

    } catch (error) {
      console.error('Failed to log email:', error)
      // Don't throw error to avoid breaking email flow
    }
  }

  /**
   * Map internal status to database enum
   */
  private mapStatusToDb(status: string): 'SENT' | 'FAILED' | 'QUEUED' | 'SENDING' {
    const statusMap: Record<string, 'SENT' | 'FAILED' | 'QUEUED' | 'SENDING'> = {
      'sent': 'SENT',
      'failed': 'FAILED',
      'queued': 'QUEUED',
      'retrying': 'SENDING'
    }
    return statusMap[status] || 'QUEUED'
  }

  /**
   * Log successful email delivery
   */
  async logSuccess(data: {
    to: string[]
    subject: string
    template: string
    locale: string
    messageId?: string
    deliveryTime?: number
    retryCount?: number
    metadata?: Record<string, any>
  }): Promise<void> {
    await this.logEmail({
      ...data,
      status: 'sent'
    })
  }

  /**
   * Log failed email delivery
   */
  async logFailure(data: {
    to: string[]
    subject: string
    template: string
    locale: string
    error: string
    retryCount?: number
    metadata?: Record<string, any>
  }): Promise<void> {
    await this.logEmail({
      ...data,
      status: 'failed'
    })
  }

  /**
   * Log email queued for delivery
   */
  async logQueued(data: {
    to: string[]
    subject: string
    template: string
    locale: string
    metadata?: Record<string, any>
  }): Promise<void> {
    await this.logEmail({
      ...data,
      status: 'queued'
    })
  }

  /**
   * Log retry attempt
   */
  async logRetry(data: {
    to: string[]
    subject: string
    template: string
    locale: string
    retryCount: number
    error?: string
    metadata?: Record<string, any>
  }): Promise<void> {
    await this.logEmail({
      ...data,
      status: 'retrying'
    })
  }

  /**
   * Get email analytics for a date range
   */
  async getAnalytics(options: {
    startDate?: Date
    endDate?: Date
    template?: string
    locale?: string
  } = {}): Promise<EmailAnalytics> {
    try {
      const { startDate, endDate, template, locale } = options
      
      // For this implementation, we'll return mock data
      // In production, this would parse log files or query a database
      const analytics: EmailAnalytics = {
        totalSent: 0,
        totalFailed: 0,
        successRate: 0,
        averageDeliveryTime: 0,
        templateStats: {},
        localeStats: {},
        errorStats: {},
        recentActivity: []
      }

      // TODO: Implement actual log parsing
      // This would involve reading log files and aggregating data
      console.log('Email analytics requested:', { startDate, endDate, template, locale })

      return analytics

    } catch (error) {
      console.error('Failed to get email analytics:', error)
      return {
        totalSent: 0,
        totalFailed: 0,
        successRate: 0,
        averageDeliveryTime: 0,
        templateStats: {},
        localeStats: {},
        errorStats: {},
        recentActivity: []
      }
    }
  }

  /**
   * Get recent email activity
   */
  async getRecentActivity(limit: number = 50): Promise<EmailLogEntry[]> {
    try {
      // TODO: Implement actual log reading
      // This would read the most recent log entries from files
      console.log(`Getting recent email activity (limit: ${limit})`)
      return []
    } catch (error) {
      console.error('Failed to get recent activity:', error)
      return []
    }
  }

  /**
   * Search email logs
   */
  async searchLogs(criteria: {
    to?: string
    subject?: string
    template?: string
    status?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }): Promise<EmailLogEntry[]> {
    try {
      // TODO: Implement log searching
      console.log('Email log search requested:', criteria)
      return []
    } catch (error) {
      console.error('Failed to search logs:', error)
      return []
    }
  }

  private generateLogId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

// Singleton instance
const emailLogger = new EmailLogger()

// Export convenience functions
export const logEmailSuccess = (data: Parameters<EmailLogger['logSuccess']>[0]) => 
  emailLogger.logSuccess(data)

export const logEmailFailure = (data: Parameters<EmailLogger['logFailure']>[0]) => 
  emailLogger.logFailure(data)

export const logEmailQueued = (data: Parameters<EmailLogger['logQueued']>[0]) => 
  emailLogger.logQueued(data)

export const logEmailRetry = (data: Parameters<EmailLogger['logRetry']>[0]) => 
  emailLogger.logRetry(data)

export const getEmailAnalytics = (options?: Parameters<EmailLogger['getAnalytics']>[0]) => 
  emailLogger.getAnalytics(options)

export const getRecentEmailActivity = (limit?: number) => 
  emailLogger.getRecentActivity(limit)

export const searchEmailLogs = (criteria: Parameters<EmailLogger['searchLogs']>[0]) => 
  emailLogger.searchLogs(criteria)

/**
 * Enhanced email tracking for integration with existing email functions
 */
export function createEmailTracker(templateName: string, locale: string = 'en') {
  return {
    trackQueued: (to: string[], subject: string, metadata?: Record<string, any>) => 
      logEmailQueued({ to, subject, template: templateName, locale, metadata }),
    
    trackSent: (to: string[], subject: string, messageId?: string, deliveryTime?: number, retryCount?: number) => 
      logEmailSuccess({ to, subject, template: templateName, locale, messageId, deliveryTime, retryCount }),
    
    trackFailed: (to: string[], subject: string, error: string, retryCount?: number) => 
      logEmailFailure({ to, subject, template: templateName, locale, error, retryCount }),
    
    trackRetry: (to: string[], subject: string, retryCount: number, error?: string) => 
      logEmailRetry({ to, subject, template: templateName, locale, retryCount, error })
  }
}

/**
 * Middleware function to wrap email sending with automatic logging
 */
export function withEmailLogging<T extends (...args: any[]) => Promise<any>>(
  emailFunction: T,
  templateName: string,
  locale: string = 'en'
): T {
  return (async (...args: Parameters<T>) => {
    const tracker = createEmailTracker(templateName, locale)
    const startTime = Date.now()
    
    try {
      // Extract email data from arguments (this would need to be customized per function)
      const emailData = args[0] // Assuming first argument contains email data
      const to = Array.isArray(emailData.to) ? emailData.to : [emailData.to]
      const subject = emailData.subject || `${templateName} email`
      
      tracker.trackQueued(to, subject)
      
      const result = await emailFunction(...args)
      
      if (result.success) {
        const deliveryTime = Date.now() - startTime
        tracker.trackSent(to, subject, result.messageId, deliveryTime, result.retryCount)
      } else {
        tracker.trackFailed(to, subject, result.error || 'Unknown error', result.retryCount)
      }
      
      return result
    } catch (error) {
      const emailData = args[0]
      const to = Array.isArray(emailData?.to) ? emailData.to : [emailData?.to || 'unknown']
      const subject = emailData?.subject || `${templateName} email`
      
      tracker.trackFailed(to, subject, error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }) as T
}

export default emailLogger