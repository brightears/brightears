import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'

const paymentSlipSchema = z.object({
  bookingId: z.string().uuid()
})

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.general, `user:${user.id}`)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bookingIdParam = formData.get('bookingId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate parameters
    const validation = paymentSlipSchema.safeParse({ bookingId: bookingIdParam })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { bookingId } = validation.data

    // Verify booking exists and user has permission
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        artist: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check permission: customer who made booking or admin
    if (user.role === 'CUSTOMER') {
      if (booking.customerId !== user.customer?.id) {
        return NextResponse.json(
          { error: 'You can only upload payment slips for your own bookings' },
          { status: 403 }
        )
      }
    } else if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only customers or admins can upload payment slips' },
        { status: 403 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed formats: JPG, PNG, WebP, PDF` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: 10MB` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate public ID with booking reference
    const timestamp = Date.now()
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9]/g, '_')
    const publicId = `brightears/payment-slips/${bookingId}/${timestamp}_${cleanFilename}`

    // Determine resource type (image or raw for PDF)
    const resourceType = file.type === 'application/pdf' ? 'raw' : 'image'

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        public_id: publicId,
        resource_type: resourceType,
        folder: `brightears/payment-slips/${bookingId}`,
        use_filename: true,
        unique_filename: false,
      }

      // Add transformations for images
      if (resourceType === 'image') {
        uploadOptions.transformation = {
          quality: 'auto',
          fetch_format: 'auto'
        }
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const result = uploadResult as any

    // Update booking record with payment slip URL
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentSlipUrl: result.secure_url,
        paymentSlipUploadedAt: new Date()
        // Note: Status will be updated to PAID after admin verifies the payment slip
      }
    })

    // TODO: Send notification to artist/admin about payment slip upload
    // This can be implemented later with email/Line notification system

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      bookingId,
      message: 'Payment slip uploaded successfully'
    })

  } catch (error) {
    console.error('Payment slip upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
