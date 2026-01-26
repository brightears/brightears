/**
 * DJ/Artist Application Form Validation Schemas
 *
 * Comprehensive validation for artist applications with Thai market specifics
 */

import { z } from 'zod';

// =====================================================
// THAI-SPECIFIC VALIDATORS
// =====================================================

/**
 * Instagram Handle Validator (optional, strips @ if provided)
 */
const instagramSchema = z.string()
  .max(30, 'Instagram handle is too long')
  .transform((val) => val.startsWith('@') ? val.slice(1) : val)
  .optional();

/**
 * LINE ID Validator (automatically prepends @ if missing)
 */
const lineIdSchema = z.string()
  .min(1, 'LINE ID is required')
  .max(50, 'LINE ID is too long')
  .transform((val) => val.startsWith('@') ? val : `@${val}`);

/**
 * Bio Length Validator (100-500 characters)
 */
const bioSchema = z.string()
  .min(100, 'Bio must be at least 100 characters')
  .max(500, 'Bio must not exceed 500 characters')
  .refine(
    (bio) => bio.trim().length >= 100,
    { message: 'Bio must be at least 100 characters (excluding leading/trailing spaces)' }
  );

/**
 * URL Validator (optional, but must be valid if provided)
 */
const urlSchema = z.string()
  .optional()
  .refine(
    (url) => {
      if (!url || url.trim() === '') return true;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Please enter a valid URL starting with http:// or https://' }
  );

// =====================================================
// ARTIST CATEGORIES & GENRES
// =====================================================

const artistCategories = [
  'DJ',
  'BAND',
  'SINGER',
  'MUSICIAN',
  'MC',
  'COMEDIAN',
  'MAGICIAN',
  'DANCER',
  'PHOTOGRAPHER',
  'SPEAKER'
] as const;

const musicGenres = [
  'House',
  'Techno',
  'EDM',
  'Hip Hop',
  'R&B',
  'Jazz',
  'Rock',
  'Pop',
  'Latin',
  'Reggae',
  'Funk',
  'Soul',
  'Disco',
  'Trance',
  'Drum & Bass',
  'Dubstep',
  'Ambient',
  'Classical',
  'Thai Pop',
  'Thai Rock',
  'Thai Country (Luk Thung)',
  'Thai Folk (Mor Lam)',
  'K-Pop',
  'Acoustic',
  'Live Lounge',
  'Beach House',
  'Chill Out',
  'Deep House',
  'Tech House',
  'Other'
] as const;

const thaiCities = [
  'Bangkok',
  'Phuket',
  'Chiang Mai',
  'Pattaya',
  'Koh Samui',
  'Krabi',
  'Hua Hin',
  'Chiang Rai',
  'Khon Kaen',
  'Nakhon Ratchasima (Korat)',
  'Udon Thani',
  'Rayong',
  'Other'
] as const;

// =====================================================
// MAIN APPLICATION FORM SCHEMA
// =====================================================

export const djApplicationSchema = z.object({
  // REQUIRED FIELDS
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .toLowerCase(),

  lineId: lineIdSchema,

  instagram: instagramSchema,

  stageName: z.string()
    .min(2, 'Stage name must be at least 2 characters')
    .max(50, 'Stage name must not exceed 50 characters'),

  bio: bioSchema,

  category: z.enum(artistCategories, {
    message: 'Please select a category'
  }),

  genres: z.string()
    .min(1, 'Please enter your music genres or specialties')
    .max(200, 'Genres must not exceed 200 characters'),

  // Note: profilePhoto (file upload) is validated separately in the form/API

  // OPTIONAL FIELDS
  website: urlSchema,

  socialMediaLinks: z.string()
    .max(500, 'Social media links must not exceed 500 characters')
    .optional(),

  yearsExperience: z.number()
    .int('Years of experience must be a whole number')
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Please enter a realistic number of years')
    .optional()
    .or(z.literal('')),

  equipmentOwned: z.string()
    .max(1000, 'Equipment description must not exceed 1000 characters')
    .optional(),

  portfolioLinks: z.string()
    .max(1000, 'Portfolio links must not exceed 1000 characters')
    .optional(),

  baseLocation: z.enum(thaiCities, {
    message: 'Please select your base location'
  }).optional(),

  hourlyRateExpectation: z.number()
    .int('Hourly rate must be a whole number')
    .min(500, 'Hourly rate must be at least ฿500')
    .max(100000, 'Hourly rate must not exceed ฿100,000')
    .optional()
    .or(z.literal('')),

  // MUSIC DESIGN SERVICE INTEREST
  interestedInMusicDesign: z.boolean().default(false),

  designFee: z.number()
    .int('Design fee must be a whole number')
    .min(0, 'Design fee cannot be negative')
    .max(500000, 'Design fee must not exceed ฿500,000')
    .optional()
    .or(z.literal(''))
    .nullable(),

  monthlyFee: z.number()
    .int('Monthly fee must be a whole number')
    .min(0, 'Monthly fee cannot be negative')
    .max(200000, 'Monthly fee must not exceed ฿200,000')
    .optional()
    .or(z.literal(''))
    .nullable(),
}).refine(
  (data) => {
    // If interested in music design, at least one fee must be provided
    if (data.interestedInMusicDesign) {
      const hasDesignFee = data.designFee && data.designFee > 0;
      const hasMonthlyFee = data.monthlyFee && data.monthlyFee > 0;
      return hasDesignFee || hasMonthlyFee;
    }
    return true;
  },
  {
    message: 'If interested in music design services, please provide at least one fee (design or monthly)',
    path: ['designFee']
  }
);

export type DJApplicationFormData = z.infer<typeof djApplicationSchema>;

// =====================================================
// EXPORT ENUMS FOR FORM OPTIONS
// =====================================================

export const ARTIST_CATEGORIES = artistCategories;
export const MUSIC_GENRES = musicGenres;
export const THAI_CITIES = thaiCities;

// =====================================================
// RATE LIMITING SCHEMA
// =====================================================

/**
 * Rate limit: 3 applications per email/phone per day
 */
export const APPLICATION_RATE_LIMIT = {
  maxApplications: 3,
  windowHours: 24
} as const;
