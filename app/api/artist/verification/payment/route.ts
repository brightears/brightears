/**
 * Artist Verification Payment API
 *
 * Handles verification fee payment processing for artist onboarding Step 5.
 * Generates PromptPay QR codes and processes payment slip uploads.
 *
 * Features:
 * - Generate unique payment reference IDs
 * - Create PromptPay QR codes with embedded payment details
 * - Upload and store payment slip images to Cloudinary
 * - Update Artist verification payment status
 * - Send notifications to admin for payment review
 *
 * @route POST /api/artist/verification/payment
 * @route PUT /api/artist/verification/payment (upload slip)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateVerificationPaymentQR } from '@/lib/promptpay'
import { cloudinary } from '@/lib/cloudinary'

/**
 * POST: Generate PromptPay QR code for verification payment
 *
 * Request body:
 * {
 *   artistId: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   qrCodeUrl: string (base64 data URL),
 *   referenceId: string,
 *   amount: number,
 *   currency: string,
 *   paymentDeadline: string (ISO date),
 *   instructions: string[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { artistId } = body

    if (!artistId) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      )
    }

    // Verify artist exists and belongs to current user
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      select: {
        id: true,
        userId: true,
        stageName: true,
        verificationFeePaid: true,
        verificationFeeAmount: true,
        onboardingStep: true
      }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    if (artist.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to artist profile' },
        { status: 403 }
      )
    }

    // Check if verification fee already paid
    if (artist.verificationFeePaid) {
      return NextResponse.json(
        { error: 'Verification fee has already been paid' },
        { status: 400 }
      )
    }

    // Generate PromptPay QR code
    const paymentDetails = await generateVerificationPaymentQR(artistId)

    // Create payment instructions
    const instructions = [
      'Open your mobile banking app',
      'Select PromptPay or QR Payment',
      'Scan the QR code above',
      'Verify amount is ฿1,500',
      'Complete the payment',
      'Upload your payment slip below'
    ]

    return NextResponse.json({
      success: true,
      ...paymentDetails,
      instructions
    })
  } catch (error) {
    console.error('Verification payment QR generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate payment QR code',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT: Upload payment slip and update verification status
 *
 * This endpoint handles payment slip uploads to Cloudinary and updates
 * the Artist record with payment information.
 *
 * Request body (multipart/form-data):
 * - file: File (payment slip image or PDF)
 * - artistId: string
 * - referenceId: string (payment reference from QR generation)
 *
 * Response:
 * {
 *   success: true,
 *   message: string,
 *   paymentSlipUrl: string,
 *   artist: {
 *     verificationFeeTransactionId: string,
 *     verificationFeePaidAt: string
 *   }
 * }
 */
export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const artistId = formData.get('artistId') as string
    const referenceId = formData.get('referenceId') as string

    if (!file || !artistId || !referenceId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, artistId, referenceId' },
        { status: 400 }
      )
    }

    // Verify artist exists and belongs to current user
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      select: {
        id: true,
        userId: true,
        stageName: true,
        verificationFeePaid: true
      }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    if (artist.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to artist profile' },
        { status: 403 }
      )
    }

    if (artist.verificationFeePaid) {
      return NextResponse.json(
        { error: 'Verification fee has already been paid' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPG, PNG, WebP, or PDF' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `brightears/payment-slips/verification/${artistId}`,
          resource_type: file.type === 'application/pdf' ? 'raw' : 'image',
          public_id: `verification-${referenceId}`,
          transformation: file.type !== 'application/pdf' ? [
            { quality: 'auto', fetch_format: 'auto' }
          ] : undefined
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(buffer)
    })

    // Update artist record with payment information
    const updatedArtist = await prisma.artist.update({
      where: { id: artistId },
      data: {
        verificationDocumentUrl: uploadResult.secure_url, // Store payment slip URL temporarily
        verificationFeeTransactionId: referenceId,
        verificationFeePaidAt: new Date(),
        verificationSubmittedAt: new Date(), // Mark as submitted for admin review
        lastProfileUpdate: new Date()
      },
      select: {
        id: true,
        stageName: true,
        verificationFeeTransactionId: true,
        verificationFeePaidAt: true,
        verificationSubmittedAt: true
      }
    })

    // TODO: Send notification to admin for payment verification
    // This would typically use an email service or notification system
    console.log(`[Admin Notification] New verification payment slip uploaded:`, {
      artistId: artist.id,
      artistName: artist.stageName,
      referenceId,
      uploadedAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Payment slip uploaded successfully. Your payment will be reviewed within 24-48 hours.',
      paymentSlipUrl: uploadResult.secure_url,
      artist: {
        verificationFeeTransactionId: updatedArtist.verificationFeeTransactionId,
        verificationFeePaidAt: updatedArtist.verificationFeePaidAt?.toISOString()
      }
    })
  } catch (error) {
    console.error('Payment slip upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload payment slip',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Rate limiting helper (in-memory, replace with Redis in production)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}
