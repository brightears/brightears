/**
 * POST /api/documents/quotation/generate
 * Generate a quotation PDF for a booking
 */

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'
import { generateDocumentNumber } from '@/lib/document-generator'
import QuotationTemplate, { QuotationData, QuotationLineItem } from '@/components/documents/QuotationTemplate'
import { Readable } from 'stream'
import React from 'react'

// Helper to convert Buffer to Stream for Cloudinary
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable()
  readable._read = () => {} // _read is required but you can noop it
  readable.push(buffer)
  readable.push(null)
  return readable
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingId, locale = 'en' } = body

    // Validate booking ID
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Fetch booking data with related information
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        artist: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if quotation already exists for this booking
    const existingQuotation = await prisma.document.findFirst({
      where: {
        bookingId: booking.id,
        type: 'QUOTATION',
      },
    })

    if (existingQuotation) {
      return NextResponse.json(
        {
          success: true,
          document: existingQuotation,
          message: 'Quotation already exists for this booking',
        },
        { status: 200 }
      )
    }

    // Generate document number
    const quotationNumber = await generateDocumentNumber('QUOTATION')

    // Calculate dates
    const quotationDate = new Date().toLocaleDateString('en-GB') // DD/MM/YYYY
    const validUntilDate = new Date()
    validUntilDate.setDate(validUntilDate.getDate() + 30) // Valid for 30 days
    const validUntil = validUntilDate.toLocaleDateString('en-GB')

    // Format event date and time
    const eventDate = new Date(booking.eventDate).toLocaleDateString('en-GB')
    const eventTime = new Date(booking.startTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    // Build line items
    const items: QuotationLineItem[] = []
    let itemNo = 1

    // Artist performance fee
    const hourlyRate = Number(booking.artist.hourlyRate || 0)
    const performanceFee = hourlyRate * booking.duration
    items.push({
      no: itemNo++,
      description: `${booking.artist.stageName} Performance - ${booking.artist.category}`,
      descriptionTh: `การแสดงของ ${booking.artist.stageName} - ${booking.artist.category}`,
      quantity: booking.duration,
      unit: locale === 'th' ? 'ชั่วโมง' : 'hours',
      unitPrice: hourlyRate,
      amount: performanceFee,
    })

    // Travel expenses (if applicable)
    if (booking.travelCost && Number(booking.travelCost) > 0) {
      const travelCost = Number(booking.travelCost)
      items.push({
        no: itemNo++,
        description: `Travel Expenses (${booking.travelDistance || 0} km)`,
        descriptionTh: `ค่าเดินทาง (${booking.travelDistance || 0} กม.)`,
        quantity: 1,
        unit: locale === 'th' ? 'ครั้ง' : 'trip',
        unitPrice: travelCost,
        amount: travelCost,
      })
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

    // VAT calculation (7% for corporate customers with tax ID)
    const corporate = await prisma.corporate.findFirst({
      where: { userId: booking.customerId },
    })
    const vatRate = corporate?.taxId ? 7 : 0
    const vatAmount = vatRate > 0 ? (subtotal * vatRate) / 100 : 0
    const total = subtotal + vatAmount

    // Build quotation data
    const quotationData: QuotationData = {
      quotationNumber,
      quotationDate,
      validUntil,
      locale: locale as 'en' | 'th',
      customerName: booking.customer.name || 'N/A',
      customerCompany: corporate?.companyName,
      customerEmail: booking.customer.email,
      customerPhone: booking.customer.phone || 'N/A',
      customerTaxId: corporate?.taxId || undefined,
      eventType: booking.eventType,
      eventDate,
      eventTime,
      venue: booking.venue,
      venueAddress: booking.venueAddress,
      duration: booking.duration,
      artistName: booking.artist.stageName,
      artistCategory: booking.artist.category,
      items,
      subtotal,
      vatRate,
      vatAmount,
      total,
      paymentTerms: '50% deposit required to confirm booking. Balance due 7 days before event.',
      paymentTermsTh: 'ต้องชำระมัดจำ 50% เพื่อยืนยันการจอง ส่วนที่เหลือชำระก่อนงาน 7 วัน',
      terms: [
        'This quotation is valid for 30 days from the date of issue.',
        'Prices include artist performance fee for the specified duration.',
        'Additional hours will be charged at the same hourly rate.',
        'Cancellation must be made at least 15 days before the event for a 50% refund.',
        'Force majeure events (weather, government restrictions) may result in rescheduling.',
      ],
      termsTh: [
        'ใบเสนอราคานี้มีอายุ 30 วันนับจากวันที่ออก',
        'ราคารวมค่าแสดงของศิลปินตามระยะเวลาที่กำหนด',
        'ชั่วโมงเพิ่มเติมจะคิดตามอัตราต่อชั่วโมงเท่ากัน',
        'การยกเลิกต้องแจ้งล่วงหน้าอย่างน้อย 15 วันก่อนงานเพื่อคืนเงิน 50%',
        'เหตุสุดวิสัย (สภาพอากาศ ข้อจำกัดของรัฐบาล) อาจส่งผลให้ต้องเลื่อนงาน',
      ],
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(QuotationTemplate, { data: quotationData }) as any
    )

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `brightears/documents/quotations/${new Date().getFullYear()}`,
          public_id: quotationNumber,
          resource_type: 'raw',
          format: 'pdf',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      bufferToStream(pdfBuffer).pipe(uploadStream)
    })

    // Save document record to database
    const document = await prisma.document.create({
      data: {
        type: 'QUOTATION',
        documentNumber: quotationNumber,
        bookingId: booking.id,
        customerId: booking.customerId,
        pdfUrl: uploadResult.secure_url,
        validUntil: validUntilDate,
        metadata: quotationData as any,
      },
    })

    return NextResponse.json(
      {
        success: true,
        document,
        pdfUrl: uploadResult.secure_url,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error generating quotation:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate quotation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
