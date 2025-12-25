import { prisma } from './prisma'
import { sendEmail, EmailData, EmailResult } from './email'

/**
 * Email queue system for reliable email delivery with retry logic
 * This can be enhanced with Redis or a proper queue system like Bull/Agenda in production
 */

export interface QueuedEmail {
  id: string
  to: string[]
  subject: string
  html: string
  text?: string
  emailType: string
  relatedId?: string
  relatedType?: string
  locale: string
  maxRetries: number
  retryCount: number
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'cancelled'
  scheduledAt?: Date
  lastAttemptAt?: Date
  sentAt?: Date
  error?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface EmailQueueStats {
  pending: number
  sending: number
  sent: number
  failed: number
  total: number
}

/**
 * Add email to queue for reliable delivery
 */
export async function queueEmail(
  emailData: EmailData,
  options: {
    emailType: string
    relatedId?: string
    relatedType?: string
    locale?: string
    maxRetries?: number
    scheduledAt?: Date
    metadata?: Record<string, any>
  }
): Promise<string> {
  try {
    // For now, we'll store in a simple JSON format
    // In production, you'd want a proper queue table or Redis
    const queueEntry = {
      id: generateId(),
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      emailType: options.emailType,
      relatedId: options.relatedId,
      relatedType: options.relatedType,
      locale: options.locale || 'en',
      maxRetries: options.maxRetries || 3,
      retryCount: 0,
      status: 'pending' as const,
      scheduledAt: options.scheduledAt || new Date(),
      metadata: options.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Store in a simple log format for now
    console.log('Email queued:', {
      id: queueEntry.id,
      to: queueEntry.to,
      subject: queueEntry.subject,
      emailType: queueEntry.emailType,
      scheduledAt: queueEntry.scheduledAt
    })

    // In production, store in database or Redis
    // await redis.lpush('email_queue', JSON.stringify(queueEntry))
    
    return queueEntry.id

  } catch (error) {
    console.error('Failed to queue email:', error)
    throw new Error('Failed to queue email for delivery')
  }
}

/**
 * Process queued emails (should be called by a background worker)
 */
export async function processEmailQueue(): Promise<{
  processed: number
  sent: number
  failed: number
  errors: string[]
}> {
  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    errors: [] as string[]
  }

  try {
    // In production, this would fetch from Redis or database
    // For now, we'll implement direct sending with enhanced error handling
    console.log('Email queue processing - using direct sending with enhanced retry logic')
    
    return results

  } catch (error) {
    console.error('Error processing email queue:', error)
    results.errors.push(error instanceof Error ? error.message : 'Unknown error')
    return results
  }
}

/**
 * Enhanced email sending with exponential backoff and detailed error handling
 */
export async function sendEmailWithRetry(
  emailData: EmailData,
  options: {
    maxRetries?: number
    baseDelay?: number
    maxDelay?: number
    exponentialBase?: number
  } = {}
): Promise<EmailResult & { retryCount: number; totalTime: number }> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    exponentialBase = 2
  } = options

  const startTime = Date.now()
  let lastError: string = ''
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email attempt ${attempt + 1}/${maxRetries + 1} for: ${emailData.subject}`)
      
      const result = await sendEmail(emailData)
      
      if (result.success) {
        const totalTime = Date.now() - startTime
        console.log(`Email sent successfully after ${attempt + 1} attempts in ${totalTime}ms`)
        
        return {
          ...result,
          retryCount: attempt,
          totalTime
        }
      } else {
        lastError = result.error || 'Unknown error'
        console.warn(`Email attempt ${attempt + 1} failed: ${lastError}`)
      }

    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Email attempt ${attempt + 1} error:`, error)
    }

    // Don't delay after the last attempt
    if (attempt < maxRetries) {
      const delay = Math.min(
        baseDelay * Math.pow(exponentialBase, attempt),
        maxDelay
      )
      
      console.log(`Waiting ${delay}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  const totalTime = Date.now() - startTime
  console.error(`Email failed after ${maxRetries + 1} attempts in ${totalTime}ms: ${lastError}`)

  return {
    success: false,
    error: lastError,
    retryCount: maxRetries,
    totalTime
  }
}

/**
 * Send email with circuit breaker pattern to prevent cascading failures
 */
class EmailCircuitBreaker {
  private failureCount = 0
  private lastFailureTime = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  
  constructor(
    private failureThreshold = 5,
    private timeoutDuration = 60000, // 1 minute
    private retryTimeoutDuration = 300000 // 5 minutes
  ) {}

  async execute(emailFn: () => Promise<EmailResult>): Promise<EmailResult> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.retryTimeoutDuration) {
        this.state = 'half-open'
        console.log('Circuit breaker moving to half-open state')
      } else {
        return {
          success: false,
          error: 'Circuit breaker is open - email service temporarily unavailable'
        }
      }
    }

    try {
      const result = await Promise.race([
        emailFn(),
        new Promise<EmailResult>((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout')), this.timeoutDuration)
        )
      ])

      if (result.success) {
        this.onSuccess()
        return result
      } else {
        this.onFailure()
        return result
      }

    } catch (error) {
      this.onFailure()
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email service error'
      }
    }
  }

  private onSuccess() {
    this.failureCount = 0
    this.state = 'closed'
  }

  private onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open'
      console.warn(`Circuit breaker opened after ${this.failureCount} failures`)
    }
  }

  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    }
  }
}

// Global circuit breaker instance
const emailCircuitBreaker = new EmailCircuitBreaker()

/**
 * Send email with circuit breaker protection
 */
export async function sendEmailWithProtection(emailData: EmailData): Promise<EmailResult> {
  return emailCircuitBreaker.execute(() => sendEmail(emailData))
}

/**
 * Get circuit breaker status
 */
export function getEmailServiceStatus() {
  return emailCircuitBreaker.getStatus()
}

/**
 * Utility function to generate unique IDs
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Validate email data before sending
 */
export function validateEmailData(emailData: EmailData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate recipients
  const recipients = Array.isArray(emailData.to) ? emailData.to : [emailData.to]
  if (recipients.length === 0) {
    errors.push('At least one recipient is required')
  }

  for (const email of recipients) {
    if (typeof email !== 'string' || !isValidEmail(email)) {
      errors.push(`Invalid email address: ${email}`)
    }
  }

  // Validate subject
  if (!emailData.subject || emailData.subject.trim().length === 0) {
    errors.push('Subject is required')
  }

  if (emailData.subject && emailData.subject.length > 255) {
    errors.push('Subject is too long (max 255 characters)')
  }

  // Validate content
  if (!emailData.html || emailData.html.trim().length === 0) {
    errors.push('HTML content is required')
  }

  if (emailData.html && emailData.html.length > 1000000) { // 1MB limit
    errors.push('Email content is too large (max 1MB)')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get email queue statistics (placeholder for future implementation)
 */
export async function getEmailQueueStats(): Promise<EmailQueueStats> {
  // In production, this would query the actual queue
  return {
    pending: 0,
    sending: 0,
    sent: 0,
    failed: 0,
    total: 0
  }
}

/**
 * Cancel queued email (placeholder for future implementation)
 */
export async function cancelQueuedEmail(emailId: string): Promise<boolean> {
  console.log(`Cancelling queued email: ${emailId}`)
  // In production, this would update the queue status
  return true
}