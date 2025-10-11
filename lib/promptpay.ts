/**
 * PromptPay QR Code Generator
 *
 * Generates QR codes for Thai PromptPay payment system following EMVCo QR Code Standard.
 * Used for verification fee payments (฿1,500) during artist onboarding.
 *
 * @see https://www.bot.or.th/Thai/PaymentSystems/StandardPS/Pages/PromptPay.aspx
 */

import QRCode from 'qrcode'

// EMVCo QR Code Field IDs
const EMV_FIELD_IDS = {
  PAYLOAD_FORMAT: '00',
  POINT_OF_INITIATION: '01',
  MERCHANT_ACCOUNT: '29',
  TRANSACTION_CURRENCY: '53',
  TRANSACTION_AMOUNT: '54',
  COUNTRY_CODE: '58',
  ADDITIONAL_DATA: '62',
  CRC: '63'
}

// PromptPay-specific IDs (inside Merchant Account field)
const PROMPTPAY_IDS = {
  AID: '00',
  MOBILE_NUMBER: '01',
  TAX_ID: '02'
}

// Additional Data Field IDs
const ADDITIONAL_DATA_IDS = {
  BILL_NUMBER: '01',
  REFERENCE_1: '02',
  REFERENCE_2: '03'
}

/**
 * Configuration for PromptPay payment
 */
export interface PromptPayConfig {
  /** PromptPay ID (mobile number or tax ID) */
  promptPayId: string
  /** Payment amount in Thai Baht */
  amount: number
  /** Reference ID for tracking (e.g., artistId-timestamp) */
  referenceId: string
  /** Optional merchant name */
  merchantName?: string
}

/**
 * Generate PromptPay QR code payload string
 * Follows EMVCo QR Code Specification for Payment Systems
 */
function generatePromptPayPayload(config: PromptPayConfig): string {
  const { promptPayId, amount, referenceId } = config

  // Normalize PromptPay ID (remove spaces, dashes, +66 prefix)
  let normalizedId = promptPayId.replace(/[\s\-]/g, '')

  // Handle Thai mobile format (+66, 0, or plain)
  if (normalizedId.startsWith('+66')) {
    normalizedId = '66' + normalizedId.slice(3)
  } else if (normalizedId.startsWith('0')) {
    normalizedId = '66' + normalizedId.slice(1)
  } else if (!normalizedId.startsWith('66')) {
    normalizedId = '66' + normalizedId
  }

  // Build PromptPay merchant account information
  const aidValue = 'A000000677010111' // Thailand PromptPay AID
  const aidField = formatField(PROMPTPAY_IDS.AID, aidValue)
  const mobileField = formatField(PROMPTPAY_IDS.MOBILE_NUMBER, normalizedId)
  const merchantAccount = aidField + mobileField

  // Build additional data field with reference ID
  const referenceField = formatField(ADDITIONAL_DATA_IDS.BILL_NUMBER, referenceId)
  const additionalData = formatField(EMV_FIELD_IDS.ADDITIONAL_DATA, referenceField)

  // Build main QR payload
  let payload = ''
  payload += formatField(EMV_FIELD_IDS.PAYLOAD_FORMAT, '01') // Version 01
  payload += formatField(EMV_FIELD_IDS.POINT_OF_INITIATION, '12') // Dynamic QR (one-time use)
  payload += formatField(EMV_FIELD_IDS.MERCHANT_ACCOUNT, merchantAccount)
  payload += formatField(EMV_FIELD_IDS.TRANSACTION_CURRENCY, '764') // THB currency code
  payload += formatField(EMV_FIELD_IDS.TRANSACTION_AMOUNT, amount.toFixed(2))
  payload += formatField(EMV_FIELD_IDS.COUNTRY_CODE, 'TH')
  payload += additionalData

  // Calculate and append CRC checksum
  const crc = calculateCRC16(payload + EMV_FIELD_IDS.CRC + '04')
  payload += formatField(EMV_FIELD_IDS.CRC, crc)

  return payload
}

/**
 * Format EMVCo field: ID (2 digits) + Length (2 digits) + Value
 */
function formatField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0')
  return id + length + value
}

/**
 * Calculate CRC-16/CCITT-FALSE checksum for EMVCo QR Code
 */
function calculateCRC16(data: string): string {
  let crc = 0xFFFF
  const polynomial = 0x1021

  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8

    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial
      } else {
        crc = crc << 1
      }
    }
  }

  crc = crc & 0xFFFF
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * Generate PromptPay QR code as data URL
 *
 * @param config - PromptPay payment configuration
 * @param options - QR code generation options
 * @returns Promise resolving to base64 data URL
 */
export async function generatePromptPayQR(
  config: PromptPayConfig,
  options: {
    size?: number
    margin?: number
  } = {}
): Promise<string> {
  const { size = 300, margin = 2 } = options

  try {
    const payload = generatePromptPayPayload(config)

    const qrCodeDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: size,
      margin: margin,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error('Failed to generate PromptPay QR code:', error)
    throw new Error('Failed to generate payment QR code')
  }
}

/**
 * Generate verification payment QR code for artist onboarding
 *
 * @param artistId - Unique artist identifier
 * @returns Promise resolving to QR code data URL and payment details
 */
export async function generateVerificationPaymentQR(artistId: string): Promise<{
  qrCodeUrl: string
  referenceId: string
  amount: number
  currency: string
  paymentDeadline: Date
}> {
  // Get PromptPay ID from environment
  const promptPayId = process.env.BRIGHTEARS_PROMPTPAY_ID || '0812345678' // Fallback for development

  // Generate unique reference ID
  const timestamp = Date.now()
  const referenceId = `VER-${artistId.slice(0, 8)}-${timestamp}`

  // Verification fee amount
  const amount = 1500.00

  // Generate QR code
  const qrCodeUrl = await generatePromptPayQR({
    promptPayId,
    amount,
    referenceId,
    merchantName: 'Bright Ears Entertainment'
  })

  // Payment deadline (30 minutes from now)
  const paymentDeadline = new Date(Date.now() + 30 * 60 * 1000)

  return {
    qrCodeUrl,
    referenceId,
    amount,
    currency: 'THB',
    paymentDeadline
  }
}

/**
 * Validate PromptPay ID format
 */
export function isValidPromptPayId(id: string): boolean {
  // Remove spaces and dashes
  const normalized = id.replace(/[\s\-]/g, '')

  // Check if it's a valid Thai mobile number (10 digits starting with 0, or 11 digits starting with 66)
  if (/^0[0-9]{9}$/.test(normalized) || /^66[0-9]{9}$/.test(normalized)) {
    return true
  }

  // Check if it's a valid Thai tax ID (13 digits)
  if (/^[0-9]{13}$/.test(normalized)) {
    return true
  }

  return false
}

/**
 * Format PromptPay ID for display
 */
export function formatPromptPayId(id: string): string {
  const normalized = id.replace(/[\s\-]/g, '')

  // Format Thai mobile number (0XX-XXX-XXXX)
  if (/^0[0-9]{9}$/.test(normalized)) {
    return normalized.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  // Format with country code (66X-XXX-XXXX)
  if (/^66[0-9]{9}$/.test(normalized)) {
    return normalized.replace(/(\d{2})(\d{1})(\d{3})(\d{4})/, '+$1 $2-$3-$4')
  }

  // Format tax ID (X-XXXX-XXXXX-XX-X)
  if (/^[0-9]{13}$/.test(normalized)) {
    return normalized.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5')
  }

  return id
}
