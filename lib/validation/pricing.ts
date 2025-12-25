/**
 * Pricing Validation for Bright Ears Platform
 *
 * Ensures pricing data consistency across the platform
 * Prevents data entry errors that could lead to pricing discrepancies
 */

import { z } from 'zod'

// Thai Baht pricing constraints
const MIN_HOURLY_RATE = 500 // Minimum ฿500/hour
const MAX_HOURLY_RATE = 100000 // Maximum ฿100,000/hour
const MIN_HOURS = 1
const MAX_HOURS = 24

/**
 * Pricing validation schema for artists
 * Ensures all pricing fields are within reasonable bounds
 */
export const artistPricingSchema = z.object({
  hourlyRate: z.number()
    .positive('Hourly rate must be positive')
    .min(MIN_HOURLY_RATE, `Minimum hourly rate is ฿${MIN_HOURLY_RATE}`)
    .max(MAX_HOURLY_RATE, `Maximum hourly rate is ฿${MAX_HOURLY_RATE}`),

  minimumHours: z.number()
    .int('Minimum hours must be a whole number')
    .min(MIN_HOURS, `Minimum booking is ${MIN_HOURS} hour`)
    .max(MAX_HOURS, `Maximum minimum hours is ${MAX_HOURS}`)
    .optional(),

  // Optional premium/package rates
  weekendRate: z.number()
    .positive('Weekend rate must be positive')
    .min(MIN_HOURLY_RATE)
    .max(MAX_HOURLY_RATE)
    .optional(),

  holidayRate: z.number()
    .positive('Holiday rate must be positive')
    .min(MIN_HOURLY_RATE)
    .max(MAX_HOURLY_RATE)
    .optional(),

  corporateRate: z.number()
    .positive('Corporate rate must be positive')
    .min(MIN_HOURLY_RATE)
    .max(MAX_HOURLY_RATE)
    .optional(),
}).refine(
  (data) => {
    // Weekend rate should be >= base rate if provided
    if (data.weekendRate && data.weekendRate < data.hourlyRate) {
      return false
    }
    // Holiday rate should be >= base rate if provided
    if (data.holidayRate && data.holidayRate < data.hourlyRate) {
      return false
    }
    // Corporate rate can be different (higher or lower)
    return true
  },
  {
    message: 'Premium rates must be higher than or equal to base hourly rate',
    path: ['weekendRate', 'holidayRate']
  }
)

/**
 * Package pricing validation
 */
export const packagePricingSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number()
    .positive('Package price must be positive')
    .min(MIN_HOURLY_RATE, `Minimum package price is ฿${MIN_HOURLY_RATE}`),
  duration: z.number()
    .positive('Duration must be positive')
    .min(1)
    .max(24),
  description: z.string().max(500).optional()
}).refine(
  (data) => {
    // Package hourly rate should make sense
    const effectiveHourlyRate = data.price / data.duration
    return effectiveHourlyRate >= MIN_HOURLY_RATE / 2 // Allow some discount for packages
  },
  {
    message: 'Package pricing seems too low for the duration',
    path: ['price']
  }
)

/**
 * Validate pricing consistency
 * Use this when updating artist pricing to ensure no inconsistencies
 */
export function validatePricingConsistency(pricing: {
  hourlyRate: number
  weekendRate?: number
  holidayRate?: number
  corporateRate?: number
  packages?: Array<{ price: number; duration: number }>
}): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []

  // Check for unusually high multipliers
  if (pricing.weekendRate && pricing.weekendRate > pricing.hourlyRate * 2) {
    warnings.push('Weekend rate is more than 2x the base rate - verify this is intentional')
  }

  if (pricing.holidayRate && pricing.holidayRate > pricing.hourlyRate * 3) {
    warnings.push('Holiday rate is more than 3x the base rate - verify this is intentional')
  }

  // Check package pricing makes sense
  if (pricing.packages) {
    pricing.packages.forEach((pkg, index) => {
      const effectiveRate = pkg.price / pkg.duration
      if (effectiveRate < pricing.hourlyRate * 0.7) {
        warnings.push(`Package ${index + 1} offers >30% discount - verify this is intentional`)
      }
      if (effectiveRate > pricing.hourlyRate * 1.5) {
        warnings.push(`Package ${index + 1} is priced higher than hourly rate - verify this is intentional`)
      }
    })
  }

  // Check for common data entry errors
  if (pricing.hourlyRate % 1000 > 0 && pricing.hourlyRate > 10000) {
    warnings.push('Large hourly rate has unusual digits - check for data entry error')
  }

  return {
    valid: warnings.length === 0,
    warnings
  }
}

/**
 * Format validation errors for display
 */
export function formatPricingErrors(errors: z.ZodError): string[] {
  return errors.issues.map(issue => {
    const field = issue.path.join('.')
    return `${field}: ${issue.message}`
  })
}

/**
 * Suggest corrections for common pricing errors
 */
export function suggestPricingCorrection(value: number): number | null {
  // If value is likely missing a zero (e.g., 250 instead of 2500)
  if (value < MIN_HOURLY_RATE && value * 10 >= MIN_HOURLY_RATE && value * 10 <= MAX_HOURLY_RATE) {
    return value * 10
  }

  // If value has extra zeros (e.g., 25000 instead of 2500)
  if (value > 50000 && value % 10000 === 0) {
    const suggested = value / 10
    if (suggested >= MIN_HOURLY_RATE && suggested <= 20000) {
      return suggested
    }
  }

  return null
}

/**
 * Validate pricing for database storage
 * Ensures Decimal type compatibility
 */
export function validateForDatabase(hourlyRate: number): boolean {
  // Check if it's a valid number
  if (!Number.isFinite(hourlyRate)) return false

  // Check decimal places (max 2 for THB)
  const decimalPlaces = (hourlyRate.toString().split('.')[1] || '').length
  if (decimalPlaces > 2) return false

  // Check range
  if (hourlyRate < 0 || hourlyRate > 999999999.99) return false

  return true
}