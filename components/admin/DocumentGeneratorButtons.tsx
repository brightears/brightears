/**
 * Document Generator Buttons
 * Admin UI component for generating quotations, invoices, and contracts
 * Display in booking details page with simple button interface
 */

'use client'

import { useState } from 'react'
import { DocumentType } from '@prisma/client'

interface DocumentGeneratorButtonsProps {
  bookingId: string
  locale?: 'en' | 'th'
  existingDocuments?: {
    quotation?: boolean
    invoice?: boolean
    contract?: boolean
  }
}

interface GeneratingState {
  quotation: boolean
  invoice: boolean
  contract: boolean
}

export default function DocumentGeneratorButtons({
  bookingId,
  locale = 'en',
  existingDocuments = {},
}: DocumentGeneratorButtonsProps) {
  const [generating, setGenerating] = useState<GeneratingState>({
    quotation: false,
    invoice: false,
    contract: false,
  })
  const [error, setError] = useState<string | null>(null)

  const generateDocument = async (type: 'quotation' | 'invoice' | 'contract') => {
    setGenerating(prev => ({ ...prev, [type]: true }))
    setError(null)

    try {
      const response = await fetch(`/api/documents/${type}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to generate ${type}`)
      }

      // Open PDF in new tab
      if (data.pdfUrl) {
        window.open(data.pdfUrl, '_blank')
      }

      // Refresh page to show updated document list
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to generate ${type}`)
      console.error(`Error generating ${type}:`, err)
    } finally {
      setGenerating(prev => ({ ...prev, [type]: false }))
    }
  }

  const DocumentButton = ({
    type,
    label,
    labelTh,
    icon,
    exists,
  }: {
    type: 'quotation' | 'invoice' | 'contract'
    label: string
    labelTh: string
    icon: string
    exists: boolean
  }) => (
    <button
      onClick={() => generateDocument(type)}
      disabled={generating[type]}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium
        transition-colors duration-200
        ${
          exists
            ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
            : 'bg-brand-cyan text-white hover:bg-brand-cyan/90'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={exists ? `${label} already exists` : `Generate ${label}`}
    >
      <span className="text-xl">{icon}</span>
      <span>
        {generating[type]
          ? locale === 'th'
            ? 'กำลังสร้าง...'
            : 'Generating...'
          : locale === 'th'
          ? labelTh
          : label}
      </span>
      {exists && (
        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
          {locale === 'th' ? 'มีแล้ว' : 'Exists'}
        </span>
      )}
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-deep-teal">
          {locale === 'th' ? 'สร้างเอกสาร' : 'Generate Documents'}
        </h3>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1"
          value={locale}
          onChange={(e) => {
            // Parent component should handle locale change
            window.location.search = `?locale=${e.target.value}`
          }}
        >
          <option value="en">English</option>
          <option value="th">ไทย (Thai)</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">
            {locale === 'th' ? 'เกิดข้อผิดพลาด:' : 'Error:'} {error}
          </p>
        </div>
      )}

      {/* Document Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <DocumentButton
          type="quotation"
          label="Quotation"
          labelTh="ใบเสนอราคา"
          icon="📄"
          exists={existingDocuments.quotation || false}
        />
        <DocumentButton
          type="invoice"
          label="Invoice"
          labelTh="ใบแจ้งหนี้"
          icon="🧾"
          exists={existingDocuments.invoice || false}
        />
        <DocumentButton
          type="contract"
          label="Contract"
          labelTh="สัญญา"
          icon="📋"
          exists={existingDocuments.contract || false}
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          {locale === 'th' ? (
            <>
              <strong>คำแนะนำ:</strong> คลิกปุ่มด้านบนเพื่อสร้างเอกสาร PDF
              เอกสารจะเปิดในแท็บใหม่และบันทึกไว้ในระบบ
            </>
          ) : (
            <>
              <strong>Instructions:</strong> Click a button above to generate a PDF document.
              The document will open in a new tab and be saved to the system.
            </>
          )}
        </p>
        <ul className="mt-2 text-xs text-blue-700 space-y-1">
          <li>
            • <strong>{locale === 'th' ? 'ใบเสนอราคา' : 'Quotation'}:</strong>{' '}
            {locale === 'th'
              ? 'ส่งราคาให้ลูกค้าก่อนยืนยันการจอง (ใช้ได้ 30 วัน)'
              : 'Send pricing proposal before booking confirmation (valid 30 days)'}
          </li>
          <li>
            • <strong>{locale === 'th' ? 'ใบแจ้งหนี้' : 'Invoice'}:</strong>{' '}
            {locale === 'th'
              ? 'เอกสารเรียกเก็บเงินแบบเต็มรูปแบบ (มี QR Code PromptPay)'
              : 'Official tax-compliant billing (includes PromptPay QR code)'}
          </li>
          <li>
            • <strong>{locale === 'th' ? 'สัญญา' : 'Contract'}:</strong>{' '}
            {locale === 'th'
              ? 'สัญญาจ้างบริการพร้อมข้อกำหนด'
              : 'Legal service agreement with terms & conditions'}
          </li>
        </ul>
      </div>
    </div>
  )
}
