/**
 * Pricing Utility Functions for Bright Ears Platform
 *
 * Standardizes price formatting across the entire platform following
 * Thai market best practices:
 * - Currency symbol: ฿ (Thai Baht)
 * - Format: ฿2,500 (symbol first, no space, comma separators)
 * - No decimals for whole numbers
 * - Range format: ฿2,500 - ฿5,000 (with spaces around dash)
 */

export interface PriceFormatOptions {
  showCurrency?: boolean;
  locale?: 'en' | 'th';
  showDecimals?: boolean;
}

export interface PriceRangeOptions extends PriceFormatOptions {
  unit?: string; // e.g., "/hour", "/event"
}

/**
 * Format a price in Thai Baht
 *
 * @param amount - The price amount in THB
 * @param options - Formatting options
 * @returns Formatted price string
 *
 * @example
 * formatPrice(2500) // "฿2,500"
 * formatPrice(2500, { showCurrency: false }) // "2,500"
 * formatPrice(2500.50, { showDecimals: true }) // "฿2,500.50"
 * formatPrice(2500, { locale: 'th' }) // "2,500 บาท"
 */
export function formatPrice(
  amount: number,
  options: PriceFormatOptions = {}
): string {
  const {
    showCurrency = true,
    locale = 'en',
    showDecimals = false
  } = options;

  // Handle invalid amounts
  if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
    return locale === 'th' ? 'ไม่ระบุราคา' : 'Price not set';
  }

  // Format the number with comma separators
  const formattedAmount = showDecimals
    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(amount).toLocaleString('en-US');

  // Return formatted price based on locale
  if (!showCurrency) {
    return formattedAmount;
  }

  if (locale === 'th') {
    return `${formattedAmount} บาท`;
  }

  return `฿${formattedAmount}`;
}

/**
 * Format a price range
 *
 * @param min - Minimum price in THB
 * @param max - Maximum price in THB
 * @param options - Formatting options
 * @returns Formatted price range string
 *
 * @example
 * formatPriceRange(2500, 5000) // "฿2,500 - ฿5,000"
 * formatPriceRange(2500, 5000, { locale: 'th' }) // "2,500 - 5,000 บาท"
 * formatPriceRange(2500, 5000, { unit: '/hour' }) // "฿2,500 - ฿5,000/hour"
 */
export function formatPriceRange(
  min: number,
  max: number,
  options: PriceRangeOptions = {}
): string {
  const { locale = 'en', unit = '' } = options;

  // Handle invalid ranges
  if (
    typeof min !== 'number' || isNaN(min) || min < 0 ||
    typeof max !== 'number' || isNaN(max) || max < 0
  ) {
    return locale === 'th' ? 'ติดต่อสอบถามราคา' : 'Contact for pricing';
  }

  // If min and max are the same, just show one price
  if (min === max) {
    return formatPrice(min, { locale, showCurrency: true }) + unit;
  }

  const formattedMin = Math.round(min).toLocaleString('en-US');
  const formattedMax = Math.round(max).toLocaleString('en-US');

  if (locale === 'th') {
    return `${formattedMin} - ${formattedMax} บาท${unit}`;
  }

  return `฿${formattedMin} - ฿${formattedMax}${unit}`;
}

/**
 * Format hourly rate with context
 *
 * @param rate - Hourly rate in THB
 * @param minimumHours - Minimum booking hours (optional)
 * @param locale - Locale for formatting
 * @returns Formatted hourly rate string
 *
 * @example
 * formatHourlyRate(2500) // "฿2,500/hour"
 * formatHourlyRate(2500, 3) // "฿2,500/hour (Min. 3 hours)"
 * formatHourlyRate(2500, 3, 'th') // "2,500 บาท/ชั่วโมง (ขั้นต่ำ 3 ชั่วโมง)"
 */
export function formatHourlyRate(
  rate: number,
  minimumHours?: number,
  locale: 'en' | 'th' = 'en'
): string {
  // Handle invalid rate
  if (typeof rate !== 'number' || isNaN(rate) || rate <= 0) {
    return locale === 'th' ? 'ติดต่อสอบถามราคา' : 'Contact for pricing';
  }

  const formattedRate = Math.round(rate).toLocaleString('en-US');
  const hourUnit = locale === 'th' ? 'ชั่วโมง' : 'hour';

  let result = locale === 'th'
    ? `${formattedRate} บาท/` + hourUnit
    : `฿${formattedRate}/${hourUnit}`;

  // Add minimum hours context if provided
  if (minimumHours && minimumHours > 1) {
    const minText = locale === 'th'
      ? ` (ขั้นต่ำ ${minimumHours} ชั่วโมง)`
      : ` (Min. ${minimumHours} hours)`;
    result += minText;
  }

  return result;
}

/**
 * Format package price with duration
 *
 * @param price - Package price in THB
 * @param duration - Package duration description
 * @param locale - Locale for formatting
 * @returns Formatted package price string
 *
 * @example
 * formatPackagePrice(15000, "4 hours") // "฿15,000 for 4 hours"
 * formatPackagePrice(15000, "Full event", 'th') // "15,000 บาท สำหรับทั้งงาน"
 */
export function formatPackagePrice(
  price: number,
  duration: string,
  locale: 'en' | 'th' = 'en'
): string {
  if (typeof price !== 'number' || isNaN(price) || price <= 0) {
    return locale === 'th' ? 'ติดต่อสอบถามราคา' : 'Contact for pricing';
  }

  const formattedPrice = Math.round(price).toLocaleString('en-US');
  const forText = locale === 'th' ? 'สำหรับ' : 'for';

  return locale === 'th'
    ? `${formattedPrice} บาท ${forText} ${duration}`
    : `฿${formattedPrice} ${forText} ${duration}`;
}

/**
 * Format deposit amount or percentage
 *
 * @param amount - Deposit amount in THB (optional if percentage is provided)
 * @param percentage - Deposit percentage (optional if amount is provided)
 * @param locale - Locale for formatting
 * @returns Formatted deposit string
 *
 * @example
 * formatDeposit(5000) // "Deposit: ฿5,000"
 * formatDeposit(null, 30) // "30% deposit required"
 * formatDeposit(5000, 30, 'th') // "มัดจำ: 5,000 บาท (30%)"
 */
export function formatDeposit(
  amount?: number | null,
  percentage?: number | null,
  locale: 'en' | 'th' = 'en'
): string {
  const depositLabel = locale === 'th' ? 'มัดจำ' : 'Deposit';

  // If both amount and percentage are provided
  if (amount && percentage) {
    const formattedAmount = Math.round(amount).toLocaleString('en-US');
    return locale === 'th'
      ? `${depositLabel}: ${formattedAmount} บาท (${percentage}%)`
      : `${depositLabel}: ฿${formattedAmount} (${percentage}%)`;
  }

  // If only amount is provided
  if (amount) {
    const formattedAmount = Math.round(amount).toLocaleString('en-US');
    return locale === 'th'
      ? `${depositLabel}: ${formattedAmount} บาท`
      : `${depositLabel}: ฿${formattedAmount}`;
  }

  // If only percentage is provided
  if (percentage) {
    return locale === 'th'
      ? `ต้องชำระมัดจำ ${percentage}%`
      : `${percentage}% deposit required`;
  }

  // No deposit information
  return locale === 'th' ? 'ไม่ระบุค่ามัดจำ' : 'Deposit not specified';
}

/**
 * Format "From" price label (for starting prices)
 *
 * @param amount - Starting price in THB
 * @param unit - Unit description (e.g., "hour", "event")
 * @param locale - Locale for formatting
 * @returns Formatted "from" price string
 *
 * @example
 * formatFromPrice(2500, "hour") // "From ฿2,500/hour"
 * formatFromPrice(2500, "hour", 'th') // "เริ่มต้นที่ 2,500 บาท/ชั่วโมง"
 */
export function formatFromPrice(
  amount: number,
  unit: string = 'hour',
  locale: 'en' | 'th' = 'en'
): string {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return locale === 'th' ? 'ติดต่อสอบถามราคา' : 'Contact for pricing';
  }

  const formattedAmount = Math.round(amount).toLocaleString('en-US');
  const fromLabel = locale === 'th' ? 'เริ่มต้นที่' : 'From';
  const unitLabel = locale === 'th'
    ? (unit === 'hour' ? 'ชั่วโมง' : unit)
    : unit;

  return locale === 'th'
    ? `${fromLabel} ${formattedAmount} บาท/${unitLabel}`
    : `${fromLabel} ฿${formattedAmount}/${unitLabel}`;
}

/**
 * Check if price should show "Contact for pricing"
 *
 * @param price - Price to check
 * @returns True if price is not set or invalid
 */
export function shouldShowContactForPricing(price?: number | null): boolean {
  return !price || price <= 0 || isNaN(price);
}

/**
 * Get contact for pricing text
 *
 * @param locale - Locale for text
 * @returns Localized "contact for pricing" text
 */
export function getContactForPricingText(locale: 'en' | 'th' = 'en'): string {
  return locale === 'th' ? 'ติดต่อสอบถามราคา' : 'Contact for pricing';
}

/**
 * Get negotiable pricing text
 *
 * @param locale - Locale for text
 * @returns Localized "negotiable" text
 */
export function getNegotiableText(locale: 'en' | 'th' = 'en'): string {
  return locale === 'th' ? 'ราคาต่อรองได้' : 'Negotiable';
}

/**
 * Calculate estimated total from hourly rate and duration
 *
 * @param hourlyRate - Rate per hour in THB
 * @param hours - Number of hours
 * @param locale - Locale for formatting
 * @returns Formatted estimated total
 *
 * @example
 * calculateEstimatedTotal(2500, 4) // "฿10,000"
 * calculateEstimatedTotal(2500, 4, 'th') // "10,000 บาท"
 */
export function calculateEstimatedTotal(
  hourlyRate: number,
  hours: number,
  locale: 'en' | 'th' = 'en'
): string {
  if (
    typeof hourlyRate !== 'number' || isNaN(hourlyRate) || hourlyRate <= 0 ||
    typeof hours !== 'number' || isNaN(hours) || hours <= 0
  ) {
    return locale === 'th' ? 'ติดต่อสอบถามราคา' : 'Contact for pricing';
  }

  const total = hourlyRate * hours;
  return formatPrice(total, { locale, showCurrency: true });
}

/**
 * Format compact price for cards (shorter format)
 *
 * @param amount - Price in THB
 * @param locale - Locale for formatting
 * @returns Compact formatted price
 *
 * @example
 * formatCompactPrice(2500) // "฿2.5K"
 * formatCompactPrice(15000) // "฿15K"
 * formatCompactPrice(150000) // "฿150K"
 */
export function formatCompactPrice(
  amount: number,
  locale: 'en' | 'th' = 'en'
): string {
  if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
    return locale === 'th' ? 'N/A' : 'N/A';
  }

  // For amounts under 1,000, show full amount
  if (amount < 1000) {
    return formatPrice(amount, { locale, showCurrency: true });
  }

  // For amounts 1,000 and above, use K notation
  const thousands = amount / 1000;
  const formattedAmount = thousands % 1 === 0
    ? thousands.toString()
    : thousands.toFixed(1);

  if (locale === 'th') {
    return `${formattedAmount}K บาท`;
  }

  return `฿${formattedAmount}K`;
}
