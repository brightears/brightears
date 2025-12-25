import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withRole } from '@/lib/api-auth'
import { z } from 'zod'

const prisma = new PrismaClient()

/**
 * Request body validation
 */
const rejectionSchema = z.object({
  rejectionReason: z.string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(1000, 'Rejection reason too long'),
  reviewNotes: z.string().max(1000).optional()
})

/**
 * POST /api/admin/applications/[id]/reject
 *
 * Reject application with reason
 * Requires ADMIN role
 *
 * Request Body:
 * - rejectionReason: Required explanation for rejection (shown to applicant)
 * - reviewNotes: Optional internal admin notes (not shown to applicant)
 *
 * Process:
 * 1. Validate application is PENDING
 * 2. Update application status to REJECTED
 * 3. Store rejection reason and notes
 * 4. Send rejection email (future)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRole(req, 'ADMIN', async () => {
    try {
      const { id } = await params
      const body = await req.json()

      // Validate request body
      const validationResult = rejectionSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid request body',
            details: validationResult.error.issues
          },
          { status: 400 }
        )
      }

      const { rejectionReason, reviewNotes } = validationResult.data

      // Fetch application
      const application = await prisma.application.findUnique({
        where: { id }
      })

      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        )
      }

      // Check if already reviewed
      if (application.status !== 'PENDING') {
        return NextResponse.json(
          {
            error: 'Application already reviewed',
            currentStatus: application.status
          },
          { status: 409 }
        )
      }

      // Update application
      const updatedApplication = await prisma.application.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || rejectionReason
        }
      })

      // TODO: Send rejection email
      // await sendRejectionEmail(application.email, rejectionReason)

      console.log(`❌ Application ${id} rejected. Reason: ${rejectionReason}`)

      return NextResponse.json(
        {
          success: true,
          message: 'Application rejected',
          application: {
            id: updatedApplication.id,
            status: updatedApplication.status,
            reviewedAt: updatedApplication.reviewedAt
          }
        },
        { status: 200 }
      )

    } catch (error) {
      console.error('Error rejecting application:', error)

      return NextResponse.json(
        {
          error: 'Failed to reject application',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })
}
