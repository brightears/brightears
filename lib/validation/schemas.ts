/**
 * Zod Validation Schemas for Bright Ears Platform
 *
 * Centralized validation schemas using Zod for type-safe form validation.
 * These schemas integrate with React Hook Form for real-time validation.
 */

import { z } from 'zod';

// =====================================================
// CUSTOM VALIDATORS (Thai-specific)
// =====================================================

/**
 * Thai Phone Number Validator
 * Accepts 10-digit numbers starting with 06, 08, or 09
 */
const thaiPhoneSchema = z.string()
  .regex(/^[0-9]+$/, 'Phone number can only contain digits')
  .length(10, 'Phone number must be exactly 10 digits')
  .refine(
    (phone) => ['06', '08', '09'].some(prefix => phone.startsWith(prefix)),
    { message: 'Phone number must start with 06, 08, or 09' }
  );

/**
 * Optional Thai Phone Number (empty string or valid phone)
 */
const optionalThaiPhoneSchema = z.union([
  z.literal(''),
  thaiPhoneSchema
]);

/**
 * Future Date Validator
 */
const futureDateSchema = z.string()
  .refine(
    (date) => {
      if (!date) return false;
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    { message: 'Please select a future date' }
  );

/**
 * Date with Minimum Days Ahead
 */
const minDaysAheadDate = (minDays: number) => z.string()
  .refine(
    (date) => {
      if (!date) return false;
      const selectedDate = new Date(date);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + minDays);
      minDate.setHours(0, 0, 0, 0);
      return selectedDate >= minDate;
    },
    { message: `Date must be at least ${minDays} days from today` }
  );

// =====================================================
// CONTACT FORM SCHEMAS
// =====================================================

/**
 * General Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z.string()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),

  subject: z.string()
    .min(1, 'Please select a subject'),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Corporate Contact Form Schema
 */
export const corporateContactFormSchema = z.object({
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),

  contactPerson: z.string()
    .min(2, 'Contact person name must be at least 2 characters')
    .max(50, 'Contact person name must be less than 50 characters'),

  email: z.string()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),

  phone: thaiPhoneSchema,

  eventType: z.string()
    .min(1, 'Please select an event type'),

  eventDate: minDaysAheadDate(7),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
});

export type CorporateContactFormData = z.infer<typeof corporateContactFormSchema>;

/**
 * Artist Support Contact Form Schema
 */
export const artistSupportFormSchema = z.object({
  artistName: z.string()
    .min(3, 'Artist name must be at least 3 characters')
    .max(30, 'Artist name must be less than 30 characters'),

  email: z.string()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),

  artistId: z.string().optional(),

  supportTopic: z.string()
    .min(1, 'Please select a support topic'),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
});

export type ArtistSupportFormData = z.infer<typeof artistSupportFormSchema>;

// =====================================================
// ARTIST REGISTRATION SCHEMA
// =====================================================

/**
 * Artist Registration Form Schema
 */
export const artistRegistrationSchema = z.object({
  // Basic Information
  stageName: z.string()
    .min(3, 'Stage name must be at least 3 characters')
    .max(30, 'Stage name must be less than 30 characters')
    .regex(/^[a-zA-Z0-9\s'-]+$/, 'Stage name can only contain letters, numbers, spaces, hyphens, and apostrophes'),

  email: z.string()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),

  phone: thaiPhoneSchema,

  // Artist Details
  category: z.enum(['DJ', 'BAND', 'MUSICIAN', 'SINGER', 'MC', 'DANCER', 'OTHER'], {
    errorMap: () => ({ message: 'Please select a category' })
  }),

  bio: z.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(500, 'Bio must be less than 500 characters'),

  // Pricing
  hourlyRate: z.number()
    .min(500, 'Hourly rate must be at least ฿500')
    .max(50000, 'Hourly rate cannot exceed ฿50,000')
    .or(z.string().regex(/^\d+$/).transform(Number).pipe(
      z.number()
        .min(500, 'Hourly rate must be at least ฿500')
        .max(50000, 'Hourly rate cannot exceed ฿50,000')
    )),

  minimumHours: z.number()
    .min(1, 'Minimum hours must be at least 1')
    .max(24, 'Minimum hours cannot exceed 24')
    .optional()
    .default(2),

  // Location
  baseCity: z.string()
    .min(1, 'Please select your base city'),

  // Terms
  termsAccepted: z.boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions'
    })
});

export type ArtistRegistrationFormData = z.infer<typeof artistRegistrationSchema>;

// =====================================================
// BOOKING INQUIRY SCHEMA
// =====================================================

/**
 * Quick Booking Inquiry Form Schema
 */
export const bookingInquirySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),

  email: z.string()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),

  phone: thaiPhoneSchema,

  eventDate: futureDateSchema,

  eventType: z.string()
    .min(1, 'Please select an event type'),

  message: z.string()
    .max(300, 'Message must be less than 300 characters')
    .optional()
});

export type BookingInquiryFormData = z.infer<typeof bookingInquirySchema>;

/**
 * Full Booking Inquiry Form Schema (with more details)
 */
export const fullBookingInquirySchema = bookingInquirySchema.extend({
  venue: z.string()
    .min(2, 'Venue name must be at least 2 characters')
    .max(100, 'Venue name must be less than 100 characters')
    .optional(),

  guestCount: z.number()
    .min(1, 'Guest count must be at least 1')
    .max(10000, 'Guest count cannot exceed 10,000')
    .optional()
    .or(z.string().regex(/^\d+$/).transform(Number).pipe(
      z.number()
        .min(1, 'Guest count must be at least 1')
        .max(10000, 'Guest count cannot exceed 10,000')
    ).optional()),

  budget: z.number()
    .min(500, 'Budget must be at least ฿500')
    .max(1000000, 'Budget cannot exceed ฿1,000,000')
    .optional()
    .or(z.string().regex(/^\d+$/).transform(Number).pipe(
      z.number()
        .min(500, 'Budget must be at least ฿500')
        .max(1000000, 'Budget cannot exceed ฿1,000,000')
    ).optional()),

  message: z.string()
    .max(500, 'Message must be less than 500 characters')
    .optional()
});

export type FullBookingInquiryFormData = z.infer<typeof fullBookingInquirySchema>;

// =====================================================
// SEARCH/FILTER SCHEMAS
// =====================================================

/**
 * Artist Search Filter Schema
 */
export const artistSearchFilterSchema = z.object({
  keyword: z.string().optional(),

  category: z.array(z.string()).optional(),

  minPrice: z.number()
    .min(0, 'Minimum price cannot be negative')
    .optional()
    .or(z.string().regex(/^\d+$/).transform(Number).optional()),

  maxPrice: z.number()
    .min(0, 'Maximum price cannot be negative')
    .optional()
    .or(z.string().regex(/^\d+$/).transform(Number).optional()),

  city: z.string().optional(),

  availability: z.string().optional(),

  verified: z.boolean().optional()
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.minPrice <= data.maxPrice;
    }
    return true;
  },
  {
    message: 'Minimum price must be less than or equal to maximum price',
    path: ['minPrice']
  }
);

export type ArtistSearchFilterData = z.infer<typeof artistSearchFilterSchema>;

/**
 * Date Range Filter Schema
 */
export const dateRangeFilterSchema = z.object({
  startDate: z.string()
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: 'Please enter a valid start date'
    }),

  endDate: z.string()
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: 'Please enter a valid end date'
    })
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start <= end;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['startDate']
  }
);

export type DateRangeFilterData = z.infer<typeof dateRangeFilterSchema>;

// =====================================================
// USER PROFILE SCHEMAS
// =====================================================

/**
 * Customer Profile Update Schema
 */
export const customerProfileSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),

  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),

  email: z.string()
    .email('Please enter a valid email address'),

  phone: optionalThaiPhoneSchema,

  lineId: z.string()
    .min(4, 'LINE ID must be at least 4 characters')
    .max(20, 'LINE ID must be less than 20 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'LINE ID can only contain letters, numbers, dots, underscores, and hyphens')
    .optional()
    .or(z.literal(''))
});

export type CustomerProfileData = z.infer<typeof customerProfileSchema>;

/**
 * Password Change Schema
 */
export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Please enter your current password'),

  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  confirmPassword: z.string()
    .min(1, 'Please confirm your password')
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

// =====================================================
// REVIEW SCHEMA
// =====================================================

/**
 * Review Submission Schema
 */
export const reviewSchema = z.object({
  rating: z.number()
    .min(1, 'Please select a rating')
    .max(5, 'Rating cannot exceed 5 stars'),

  title: z.string()
    .min(5, 'Review title must be at least 5 characters')
    .max(100, 'Review title must be less than 100 characters'),

  comment: z.string()
    .min(20, 'Review must be at least 20 characters')
    .max(500, 'Review must be less than 500 characters'),

  wouldRecommend: z.boolean()
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Create a conditional required schema
 * Makes a field required only if a condition is met
 */
export function conditionalRequired<T extends z.ZodTypeAny>(
  schema: T,
  condition: boolean,
  message: string = 'This field is required'
) {
  return condition
    ? schema.min(1, message)
    : schema.optional();
}

/**
 * Create a flexible email or phone schema
 * Requires at least one contact method
 */
export const emailOrPhoneSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: optionalThaiPhoneSchema
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Please provide either an email address or phone number',
    path: ['email']
  }
);
