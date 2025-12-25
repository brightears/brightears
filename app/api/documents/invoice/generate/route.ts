/**
 * POST /api/documents/invoice/generate
 * Generate a tax-compliant invoice PDF for a booking
 */

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'
import { generateDocumentNumber } from '@/lib/document-generator'
import { generatePromptPayQR } from '@/lib/promptpay-qr'
import InvoiceTemplate, { InvoiceData, InvoiceLineItem } from '@/components/documents/InvoiceTemplate'
import { Readable } from 'stream'
import React from 'react'

// Helper to convert Buffer to Stream for Cloudinary
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

// Bright Ears company details (update with actual values)
const COMPANY_DETAILS = {
  name: 'Bright Ears Co., Ltd.',
  nameTh: 'บริษัท ไบร์ทเอียร์ส จำกัด',
  taxId: '0123456789012', // Update with actual tax ID
  address: '123 Music Street, Sukhumvit, Bangkok 10110, Thailand',
  addressTh: '123 ถนนมิวสิค สุขุมวิท กรุงเทพฯ 10110 ประเทศไทย',
  phone: '+66 2 123 4567',
  email: 'billing@brightears.com',
  bankName: 'Kasikorn Bank',
  accountName: 'Bright Ears Co., Ltd.',
  accountNumber: '123-4-56789-0', // Update with actual account
  promptPayNumber: '0123456789012', // Same as tax ID or phone number
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
        payments: {
          where: {
            status: 'verified',
          },
          orderBy: {
            paidAt: 'desc',
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

    // Check if invoice already exists for this booking
    const existingInvoice = await prisma.document.findFirst({
      where: {
        bookingId: booking.id,
        type: 'INVOICE',
      },
    })

    if (existingInvoice) {
      return NextResponse.json(
        {
          success: true,
          document: existingInvoice,
          message: 'Invoice already exists for this booking',
        },
        { status: 200 }
      )
    }

    // Generate document number
    const invoiceNumber = await generateDocumentNumber('INVOICE')

    // Calculate dates
    const invoiceDate = new Date().toLocaleDateString('en-GB') // DD/MM/YYYY
    const dueDateObj = new Date()
    dueDateObj.setDate(dueDateObj.getDate() + 7) // Due in 7 days
    const dueDate = dueDateObj.toLocaleDateString('en-GB')

    // Format event date and time
    const eventDate = new Date(booking.eventDate).toLocaleDateString('en-GB')
    const eventTime = new Date(booking.startTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

    // Get corporate details (if applicable)
    const corporate = await prisma.corporate.findFirst({
      where: { userId: booking.customerId },
    })

    // Build line items
    const items: InvoiceLineItem[] = []
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
    const vatRate = corporate?.taxId ? 7 : 0
    const vatAmount = vatRate > 0 ? (subtotal * vatRate) / 100 : 0
    const total = subtotal + vatAmount

    // Calculate payment status
    const totalPaid = booking.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    )
    const balanceDue = total - totalPaid

    let paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL'
    if (totalPaid >= total) {
      paymentStatus = 'PAID'
    } else if (totalPaid > 0) {
      paymentStatus = 'PARTIAL'
    } else {
      paymentStatus = 'UNPAID'
    }

    // Get latest payment details
    const latestPayment = booking.payments[0]

    // Generate PromptPay QR code if unpaid or partially paid
    let promptPayQRCode: string | undefined
    if (paymentStatus !== 'PAID') {
      const amountToPay = paymentStatus === 'PARTIAL' ? balanceDue : total
      promptPayQRCode = await generatePromptPayQR(
        COMPANY_DETAILS.promptPayNumber,
        amountToPay
      )
    }

    // Build invoice data
    const invoiceData: InvoiceData = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      locale: locale as 'en' | 'th',
      // Company details
      companyName: COMPANY_DETAILS.name,
      companyNameTh: COMPANY_DETAILS.nameTh,
      companyTaxId: COMPANY_DETAILS.taxId,
      companyAddress: COMPANY_DETAILS.address,
      companyAddressTh: COMPANY_DETAILS.addressTh,
      companyPhone: COMPANY_DETAILS.phone,
      companyEmail: COMPANY_DETAILS.email,
      // Customer details
      customerName: booking.customer.name || 'N/A',
      customerCompany: corporate?.companyName,
      customerEmail: booking.customer.email,
      customerPhone: booking.customer.phone || 'N/A',
      customerAddress: corporate?.companyAddress || undefined,
      customerTaxId: corporate?.taxId || undefined,
      // Event details
      eventType: booking.eventType,
      eventDate,
      eventTime,
      venue: booking.venue,
      // Line items
      items,
      subtotal,
      vatRate,
      vatAmount,
      total,
      // Payment details
      paymentStatus,
      paymentMethod: latestPayment?.paymentMethod,
      paidAmount: totalPaid,
      balanceDue: paymentStatus === 'PARTIAL' ? balanceDue : undefined,
      paidDate: latestPayment?.paidAt
        ? new Date(latestPayment.paidAt).toLocaleDateString('en-GB')
        : undefined,
      // Bank details
      bankName: COMPANY_DETAILS.bankName,
      accountName: COMPANY_DETAILS.accountName,
      accountNumber: COMPANY_DETAILS.accountNumber,
      promptPayNumber: COMPANY_DETAILS.promptPayNumber,
      promptPayQRCode,
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoiceTemplate, { data: invoiceData }) as any
    )

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `brightears/documents/invoices/${new Date().getFullYear()}`,
          public_id: invoiceNumber,
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
        type: 'INVOICE',
        documentNumber: invoiceNumber,
        bookingId: booking.id,
        customerId: booking.customerId,
        pdfUrl: uploadResult.secure_url,
        paidDate: paymentStatus === 'PAID' && latestPayment?.paidAt
          ? new Date(latestPayment.paidAt)
          : null,
        metadata: invoiceData as any,
      },
    })

    return NextResponse.json(
      {
        success: true,
        document,
        pdfUrl: uploadResult.secure_url,
        paymentStatus,
        balanceDue: paymentStatus !== 'PAID' ? balanceDue : 0,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate invoice',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
