/**
 * PromptPay QR Code Generator
 * Generates QR codes for PromptPay payments (Thai EMVCo standard)
 */

import QRCode from 'qrcode'

/**
 * Generate PromptPay QR code as Data URL
 * @param promptPayId - PromptPay ID (phone number or tax ID)
 * @param amount - Payment amount in THB
 * @returns Promise<string> - QR code as data URL
 */
export async function generatePromptPayQR(
  promptPayId: string,
  amount: number
): Promise<string> {
  // Format PromptPay payload according to EMVCo specification
  const payload = formatPromptPayPayload(promptPayId, amount)

  // Generate QR code as data URL
  const qrCodeDataURL = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 300,
  })

  return qrCodeDataURL
}

/**
 * Format PromptPay payload according to EMVCo QR Code Specification
 * @param promptPayId - PromptPay ID
 * @param amount - Payment amount
 * @returns Formatted payload string
 */
function formatPromptPayPayload(promptPayId: string, amount: number): string {
  // Remove all non-numeric characters from PromptPay ID
  const cleanId = promptPayId.replace(/\D/g, '')

  // Convert phone number to PromptPay format
  // For mobile: 0066 + last 9 digits
  // For tax ID: use as is (13 digits)
  let formattedId = cleanId
  if (cleanId.length === 10 && cleanId.startsWith('0')) {
    // Thai mobile number
    formattedId = '0066' + cleanId.substring(1)
  }

  // Format amount (2 decimal places)
  const formattedAmount = amount.toFixed(2)

  // Build EMVCo payload
  const payload = [
    '000201', // Payload Format Indicator
    '010212', // Point of Initiation Method (12 = QR is static and used multiple times)
    buildTag('29', [
      // Merchant Account Information
      buildTag('00', 'A000000677010111'), // Application ID (PromptPay)
      buildTag('01', formattedId), // PromptPay ID
    ]),
    '5303764', // Transaction Currency (764 = THB)
    buildTag('54', formattedAmount), // Transaction Amount
    '5802TH', // Country Code (TH = Thailand)
    buildTag('59', 'Bright Ears'), // Merchant Name
    buildTag('60', 'Bangkok'), // Merchant City
    '6304', // CRC placeholder (will be calculated)
  ].join('')

  // Calculate and append CRC
  const crc = calculateCRC(payload)
  return payload + crc
}

/**
 * Build EMVCo tag-length-value structure
 * @param tag - Tag identifier
 * @param value - Tag value (string or array of tags)
 * @returns Formatted tag string
 */
function buildTag(tag: string, value: string | string[]): string {
  const content = Array.isArray(value) ? value.join('') : value
  const length = content.length.toString().padStart(2, '0')
  return tag + length + content
}

/**
 * Calculate CRC-16/CCITT-FALSE checksum
 * @param payload - Payload string (without CRC)
 * @returns 4-character hex CRC
 */
function calculateCRC(payload: string): string {
  let crc = 0xffff
  const polynomial = 0x1021

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ polynomial : crc << 1
    }
  }

  const result = (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
  return result
}

/**
 * Generate PromptPay deep link URL
 * @param promptPayId - PromptPay ID
 * @param amount - Payment amount in THB
 * @returns PromptPay app deep link
 */
export function generatePromptPayDeepLink(
  promptPayId: string,
  amount: number
): string {
  const cleanId = promptPayId.replace(/\D/g, '')
  return `promptpay://pay?id=${cleanId}&amount=${amount.toFixed(2)}`
}
