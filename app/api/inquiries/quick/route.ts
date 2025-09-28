import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for quick inquiry
const quickInquirySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  phoneNumber: z.string().regex(/^(\+66|0)[0-9]{9,10}$/, 'Invalid Thai phone number'),
  eventDate: z.string().transform(str => new Date(str)),
  eventType: z.enum(['WEDDING', 'CORPORATE', 'PARTY', 'FESTIVAL', 'PRIVATE', 'OTHER']),
  artistId: z.string(),
  message: z.string().optional(),
})

// Generate a simple 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Format phone number to international format
function formatPhoneNumber(phone: string): string {
  // Remove any spaces or special characters
  let cleaned = phone.replace(/\D/g, '')
  
  // Convert Thai local format to international
  if (cleaned.startsWith('0')) {
    cleaned = '66' + cleaned.substring(1)
  } else if (cleaned.startsWith('66')) {
    // Already in international format
  } else {
    // Assume it needs +66
    cleaned = '66' + cleaned
  }
  
  return '+' + cleaned
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = quickInquirySchema.parse(body)
    const formattedPhone = formatPhoneNumber(validatedData.phoneNumber)
    
    // Check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: validatedData.artistId },
      include: { 
        user: {
          select: { 
            email: true, 
            firstName: true,
            lastName: true 
          }
        }
      }
    })
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }
    
    // Check if user exists with this phone number
    let user = await prisma.user.findFirst({
      where: { phone: formattedPhone }
    })
    
    // For progressive signup, we'll create a minimal inquiry record
    // and let Clerk handle the authentication when they want to view status
    if (!user) {
      // Create a temporary user record for the inquiry
      // This will be converted to a full Clerk user when they authenticate
      user = await prisma.user.create({
        data: {
          phone: formattedPhone,
          firstName: validatedData.firstName,
          // Create a temporary email from phone (will be updated when they sign up with Clerk)
          email: `${formattedPhone.replace('+', '')}@temp.brightears.io`,
          role: 'CUSTOMER',
          // Mark as unverified - they'll verify through Clerk when checking status
          isPhoneVerified: false,
        }
      })
      
      // Send SMS notification (optional - they can also check status via link)
      console.log(`[SMS] New inquiry from ${validatedData.firstName} - check status at ${process.env.NEXT_PUBLIC_APP_URL}/inquiry-status?phone=${encodeURIComponent(formattedPhone)}`)
    }
    
    // Create the booking inquiry with minimal required fields
    const eventDateTime = new Date(validatedData.eventDate)
    eventDateTime.setHours(18, 0, 0, 0) // Default to 6 PM
    const endDateTime = new Date(eventDateTime)
    endDateTime.setHours(23, 0, 0, 0) // Default to 11 PM (5 hours duration)
    
    const booking = await prisma.booking.create({
      data: {
        customerId: user.id,
        artistId: validatedData.artistId,
        eventDate: validatedData.eventDate,
        eventType: validatedData.eventType,
        status: 'INQUIRY',
        // Required fields with defaults (will be updated when artist responds)
        startTime: eventDateTime,
        endTime: endDateTime,
        duration: 5, // Default 5 hours
        venue: 'To be determined',
        venueAddress: 'To be determined',
        quotedPrice: 0, // Will be set when artist sends quote
        specialRequests: validatedData.message || `Hi, I'm interested in booking you for my ${validatedData.eventType.toLowerCase()} on ${validatedData.eventDate.toLocaleDateString()}.`,
      },
      include: {
        artist: {
          select: {
            stageName: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        customer: {
          select: {
            firstName: true,
            phone: true,
          }
        }
      }
    })
    
    // Track the activity
    // TODO: Implement activity tracking when ActivityFeed model is added to schema
    // await prisma.activityFeed.create({
    //   data: {
    //     type: 'BOOKING_REQUEST',
    //     description: `${validatedData.firstName} requested a quote from ${artist.stageName}`,
    //     userId: user.id,
    //     metadata: {
    //       bookingId: booking.id,
    //       artistId: artist.id,
    //       eventType: validatedData.eventType,
    //       eventDate: validatedData.eventDate.toISOString(),
    //     }
    //   }
    // })
    
    // TODO: Send notification to artist (email/LINE/SMS)
    console.log(`[NOTIFICATION] New inquiry for ${artist.stageName} from ${validatedData.firstName}`)
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Inquiry sent successfully!',
      data: {
        bookingId: booking.id,
        phoneNumber: formattedPhone,
        statusUrl: `/inquiry-status?phone=${encodeURIComponent(formattedPhone)}&booking=${booking.id}`,
        // Provide SMS-friendly short URL for status checking
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/i/${booking.id}`,
      }
    })
    
  } catch (error: any) {
    console.error('Quick inquiry error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to send inquiry. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to check inquiry status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')
  const phone = searchParams.get('phone')
  
  if (!bookingId || !phone) {
    return NextResponse.json(
      { error: 'Missing bookingId or phone' },
      { status: 400 }
    )
  }
  
  const formattedPhone = formatPhoneNumber(phone)
  
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        customer: {
          phone: formattedPhone
        }
      },
      include: {
        artist: {
          select: {
            stageName: true,
            profileImage: true,
          }
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        }
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status,
        eventDate: booking.eventDate,
        eventType: booking.eventType,
        artist: booking.artist,
        hasQuote: booking.quotes.length > 0,
        quote: booking.quotes[0] || null,
      }
    })
    
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    )
  }
}