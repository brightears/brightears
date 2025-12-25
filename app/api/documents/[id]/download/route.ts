/**
 * GET /api/documents/[id]/download
 * Download a generated document PDF
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch document from database
    const document = await prisma.document.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    if (!document.pdfUrl) {
      return NextResponse.json(
        { error: 'PDF not available for this document' },
        { status: 400 }
      )
    }

    // Redirect to Cloudinary URL
    // The browser will handle the download
    return NextResponse.redirect(document.pdfUrl)
  } catch (error) {
    console.error('Error downloading document:', error)
    return NextResponse.json(
      {
        error: 'Failed to download document',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
