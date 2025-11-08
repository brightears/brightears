import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withRole } from '@/lib/api-auth'

const prisma = new PrismaClient()

/**
 * GET /api/admin/applications/[id]
 *
 * Get complete application details (all 23 fields)
 * Requires ADMIN role
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRole(req, 'ADMIN', async () => {
    try {
      const { id } = await params

      const application = await prisma.application.findUnique({
        where: { id }
      })

      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(application)

    } catch (error) {
      console.error('Error fetching application:', error)

      return NextResponse.json(
        { error: 'Failed to fetch application details' },
        { status: 500 }
      )
    }
  })
}
