/**
 * POST /api/documents/contract/generate
 * Generate a service agreement contract PDF for a booking
 */

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'
import { generateDocumentNumber } from '@/lib/document-generator'
import ContractTemplate, { ContractData } from '@/components/documents/ContractTemplate'
import { Readable } from 'stream'
import React from 'react'

function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

const COMPANY_DETAILS = {
  name: 'Bright Ears Co., Ltd.',
  nameTh: 'บริษัท ไบร์ทเอียร์ส จำกัด',
  taxId: '0123456789012',
  address: '123 Music Street, Sukhumvit, Bangkok 10110, Thailand',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingId, locale = 'en' } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

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

    const existingContract = await prisma.document.findFirst({
      where: {
        bookingId: booking.id,
        type: 'CONTRACT',
      },
    })

    if (existingContract) {
      return NextResponse.json(
        {
          success: true,
          document: existingContract,
          message: 'Contract already exists for this booking',
        },
        { status: 200 }
      )
    }

    const contractNumber = await generateDocumentNumber('CONTRACT')
    const contractDate = new Date().toLocaleDateString('en-GB')
    const eventDate = new Date(booking.eventDate).toLocaleDateString('en-GB')
    const eventTime = new Date(booking.startTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const corporate = await prisma.corporate.findFirst({
      where: { userId: booking.customerId },
    })

    // Calculate financial details
    const hourlyRate = Number(booking.artist.hourlyRate || 0)
    const performanceFee = hourlyRate * booking.duration
    const travelCost = Number(booking.travelCost || 0)
    const subtotal = performanceFee + travelCost
    const vatRate = corporate?.taxId ? 7 : 0
    const vatAmount = vatRate > 0 ? (subtotal * vatRate) / 100 : 0
    const totalAmount = subtotal + vatAmount
    const depositPercentage = 50
    const depositAmount = totalAmount * (depositPercentage / 100)

    const balanceDueDate = new Date(booking.eventDate)
    balanceDueDate.setDate(balanceDueDate.getDate() - 7)
    const balanceDueDateStr = balanceDueDate.toLocaleDateString('en-GB')

    const contractData: ContractData = {
      contractNumber,
      contractDate,
      locale: locale as 'en' | 'th',
      providerName: COMPANY_DETAILS.name,
      providerNameTh: COMPANY_DETAILS.nameTh,
      providerAddress: COMPANY_DETAILS.address,
      providerTaxId: COMPANY_DETAILS.taxId,
      customerName: booking.customer.name || 'N/A',
      customerCompany: corporate?.companyName,
      customerAddress: corporate?.companyAddress || undefined,
      customerPhone: booking.customer.phone || 'N/A',
      eventType: booking.eventType,
      eventDate,
      eventTime,
      venue: booking.venue,
      venueAddress: booking.venueAddress,
      duration: booking.duration,
      artistName: booking.artist.stageName,
      artistCategory: booking.artist.category,
      totalAmount,
      depositAmount,
      depositPercentage,
      balanceDueDate: balanceDueDateStr,
      servicesProvided: [
        `Live performance by ${booking.artist.stageName} (${booking.artist.category})`,
        `Performance duration: ${booking.duration} hours`,
        travelCost > 0 ? `Travel to venue (${booking.travelDistance || 0} km)` : null,
        'Professional equipment setup and sound check',
        'Music selection appropriate for event type',
      ].filter(Boolean) as string[],
      servicesProvidedTh: [
        `การแสดงสดโดย ${booking.artist.stageName} (${booking.artist.category})`,
        `ระยะเวลาการแสดง: ${booking.duration} ชั่วโมง`,
        travelCost > 0 ? `การเดินทางไปสถานที่ (${booking.travelDistance || 0} กม.)` : null,
        'การติดตั้งอุปกรณ์และทดสอบเสียง',
        'การเลือกเพลงที่เหมาะสมกับประเภทงาน',
      ].filter(Boolean) as string[],
    }

    const pdfBuffer = await renderToBuffer(
      React.createElement(ContractTemplate, { data: contractData }) as any
    )

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `brightears/documents/contracts/${new Date().getFullYear()}`,
          public_id: contractNumber,
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

    const document = await prisma.document.create({
      data: {
        type: 'CONTRACT',
        documentNumber: contractNumber,
        bookingId: booking.id,
        customerId: booking.customerId,
        pdfUrl: uploadResult.secure_url,
        metadata: contractData as any,
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
    console.error('Error generating contract:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate contract',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
