/**
 * Document Number Generator
 * Generates unique document numbers for quotations, invoices, and contracts
 * Format: [PREFIX]-YYYYMMDD-XXX
 *
 * Examples:
 * - QT-20251108-001 (Quotation)
 * - INV-20251108-001 (Invoice)
 * - CT-20251108-001 (Contract)
 */

import { prisma } from '@/lib/prisma'
import { DocumentType } from '@prisma/client'

const DOCUMENT_PREFIXES = {
  QUOTATION: 'QT',
  INVOICE: 'INV',
  CONTRACT: 'CT',
} as const

/**
 * Generate a unique document number
 * @param type - Document type (QUOTATION, INVOICE, CONTRACT)
 * @returns Promise<string> - Unique document number
 */
export async function generateDocumentNumber(type: DocumentType): Promise<string> {
  const prefix = DOCUMENT_PREFIXES[type]
  const today = new Date()

  // Format: YYYYMMDD
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const dateString = `${year}${month}${day}`

  // Find the latest document number for today
  const latestDocument = await prisma.document.findFirst({
    where: {
      type,
      documentNumber: {
        startsWith: `${prefix}-${dateString}-`,
      },
    },
    orderBy: {
      documentNumber: 'desc',
    },
  })

  // Increment sequence number
  let sequence = 1
  if (latestDocument) {
    const lastSequence = parseInt(latestDocument.documentNumber.split('-')[2])
    sequence = lastSequence + 1
  }

  // Format: XXX (3 digits, padded with zeros)
  const sequenceString = String(sequence).padStart(3, '0')

  return `${prefix}-${dateString}-${sequenceString}`
}

/**
 * Validate document number format
 * @param documentNumber - Document number to validate
 * @returns boolean - True if valid
 */
export function validateDocumentNumber(documentNumber: string): boolean {
  const regex = /^(QT|INV|CT)-\d{8}-\d{3}$/
  return regex.test(documentNumber)
}

/**
 * Parse document number to extract components
 * @param documentNumber - Document number to parse
 * @returns Object with type, date, and sequence
 */
export function parseDocumentNumber(documentNumber: string) {
  const parts = documentNumber.split('-')
  if (parts.length !== 3) {
    throw new Error('Invalid document number format')
  }

  const [prefix, dateString, sequence] = parts

  // Parse date
  const year = parseInt(dateString.substring(0, 4))
  const month = parseInt(dateString.substring(4, 6))
  const day = parseInt(dateString.substring(6, 8))
  const date = new Date(year, month - 1, day)

  return {
    prefix,
    date,
    sequence: parseInt(sequence),
    type: Object.entries(DOCUMENT_PREFIXES).find(([_, p]) => p === prefix)?.[0] as DocumentType,
  }
}
