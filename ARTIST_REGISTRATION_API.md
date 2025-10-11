# Artist Registration API - Complete Documentation

## Overview

The enhanced artist registration API (`/api/auth/register/artist`) creates new artist accounts with proper initialization of all verification and onboarding fields required for the 5-step onboarding wizard.

**File:** `/app/api/auth/register/artist/route.ts`
**Last Updated:** October 11, 2025
**Status:** Day 11-12 Implementation Complete

---

## Key Features

### 1. Profile Completeness Calculation

The API includes a sophisticated `calculateProfileCompleteness()` helper function that scores the initial profile based on provided fields:

**Scoring Breakdown (100 points total):**

| Category | Points | Fields |
|----------|--------|--------|
| **Basic Info** | 30 | stageName (10) + category (10) + baseCity (10) |
| **Contact** | 10 | phone/lineId (5) + social media (5) |
| **Pricing** | 20 | hourlyRate (15) + minimumHours (5) |
| **Description** | 20 | bio ≥50 chars (15) + bioTh ≥50 chars (5) |
| **Service Details** | 20 | serviceAreas (5) + genres (5) + languages >1 (5) + realName (5) |

**Example Scores:**
- Minimal registration (email, password, stageName, category, baseCity): **30%**
- With pricing and contact: **60%**
- Full profile with bio and details: **95-100%**

---

## Verification Fields Initialization

### Verification Level
```typescript
verificationLevel: 'UNVERIFIED'  // All new artists start unverified
verifiedAt: null                 // Set when admin approves
```

### ID Verification Documents (All null until Step 4)
```typescript
verificationDocumentUrl: null      // Cloudinary URL after upload
verificationDocumentType: null     // "national_id", "passport", "driver_license"
verificationSubmittedAt: null      // When documents submitted
verificationReviewedAt: null       // When admin reviews
verificationReviewedBy: null       // Admin user ID
verificationRejectionReason: null  // If rejected by admin
```

### Verification Fee Tracking (฿1,500 one-time fee)
```typescript
verificationFeeRequired: true           // Can be waived for special cases
verificationFeePaid: false             // Set true when payment confirmed
verificationFeeAmount: 1500.00         // THB (Decimal)
verificationFeePaidAt: null            // Set in Step 5 when paid
verificationFeeTransactionId: null     // Payment gateway transaction ID
```

---

## Onboarding Progress Tracking

### 5-Step Onboarding Flow

**Step 1: Basic Info** (Completed by this API endpoint)
- Create account (email, password)
- Set stageName, category, baseCity
- Initial profile completeness calculated

**Step 2: Profile Details**
- Upload profile photo, cover image, gallery
- Add detailed bio (EN/TH)
- Upload audio/video samples

**Step 3: Pricing & Availability**
- Set hourly rate, minimum hours
- Configure service areas, travel radius
- Set up availability calendar

**Step 4: Verification Documents**
- Upload ID/passport for verification
- Submit for admin review
- Wait for approval

**Step 5: Payment & Go Live**
- Pay ฿1,500 verification fee via PromptPay
- Admin confirms payment
- Profile goes live (isDraft: false)

### Onboarding Fields
```typescript
onboardingStep: 1                    // Current step (1-5)
onboardingStartedAt: new Date()      // Track when they started
onboardingCompletedAt: null          // Set when all 5 steps complete
```

---

## Profile Management

### Profile Visibility Control
```typescript
isDraft: true                        // Profile NOT publicly visible
lastProfileUpdate: new Date()        // Track profile changes
profilePublishedAt: null             // When profile went live
```

**Draft Mode Behavior:**
- Profile not searchable in public artist directory
- Profile page shows "Coming Soon" message
- Artist can preview their profile
- Must complete onboarding to go live

---

## API Request/Response

### Request Schema

```typescript
POST /api/auth/register/artist

{
  // Required Fields
  "email": "artist@example.com",
  "password": "securepassword123",
  "stageName": "DJ Thunder",
  "category": "DJ",
  "baseCity": "Bangkok",

  // Optional Fields (improve profile completeness)
  "phone": "+66812345678",
  "realName": "Somchai Thongchai",
  "bio": "Professional DJ with 10 years experience in electronic music...",
  "bioTh": "ดีเจมืออาชีพด้วยประสบการณ์ 10 ปี...",
  "hourlyRate": 5000,
  "minimumHours": 3,
  "genres": ["House", "Techno", "EDM"],
  "languages": ["en", "th"],
  "serviceAreas": ["Bangkok", "Phuket", "Chiang Mai"],
  "travelRadius": 500,
  "lineId": "@djthunder",
  "facebook": "https://facebook.com/djthunder",
  "instagram": "https://instagram.com/djthunder",
  "website": "https://djthunder.com",
  "subCategories": ["Electronic", "House Music"]
}
```

### Success Response (201 Created)

```typescript
{
  "user": {
    "id": "uuid-string",
    "email": "artist@example.com",
    "phone": "+66812345678",
    "role": "ARTIST",
    "createdAt": "2025-10-11T10:30:00.000Z",
    // password omitted for security
  },

  "artist": {
    "id": "uuid-string",
    "stageName": "DJ Thunder",
    "category": "DJ",
    "baseCity": "Bangkok",

    // Onboarding state for frontend wizard
    "onboardingStep": 1,
    "profileCompleteness": 75,  // Calculated percentage
    "verificationLevel": "UNVERIFIED",
    "isDraft": true,

    // Verification fee information
    "verificationFeeRequired": true,
    "verificationFeePaid": false,
    "verificationFeeAmount": "1500.00"
  },

  // Next steps guidance for frontend
  "nextSteps": {
    "currentStep": 1,
    "totalSteps": 5,
    "message": "Account created! Complete your profile to start receiving bookings.",
    "actions": [
      "Add profile photos and media samples",
      "Set your pricing and availability",
      "Upload verification documents",
      "Pay verification fee (฿1,500)",
      "Publish your profile"
    ]
  }
}
```

### Error Responses

**400 Bad Request - Duplicate User**
```json
{
  "error": "User with this email or phone already exists"
}
```

**400 Bad Request - Validation Error**
```json
{
  "error": "Invalid data",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["stageName"],
      "message": "Required"
    }
  ]
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to register artist"
}
```

---

## Frontend Integration Guide

### 1. Registration Form Submit

```typescript
async function handleArtistRegistration(formData: ArtistRegistrationData) {
  try {
    const response = await fetch('/api/auth/register/artist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }

    const data = await response.json()

    // Store user/artist data in session
    sessionStorage.setItem('artistId', data.artist.id)
    sessionStorage.setItem('userId', data.user.id)

    // Redirect to onboarding wizard Step 2
    router.push('/onboarding/artist?step=2')

  } catch (error) {
    console.error('Registration failed:', error)
    showErrorToast(error.message)
  }
}
```

### 2. Onboarding Wizard Component

```typescript
'use client'

import { useState, useEffect } from 'react'

interface OnboardingState {
  currentStep: number
  totalSteps: number
  profileCompleteness: number
  verificationLevel: string
  verificationFeeRequired: boolean
  verificationFeePaid: boolean
}

export default function ArtistOnboardingWizard() {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    totalSteps: 5,
    profileCompleteness: 30,
    verificationLevel: 'UNVERIFIED',
    verificationFeeRequired: true,
    verificationFeePaid: false
  })

  // Load current state from API
  useEffect(() => {
    async function loadOnboardingState() {
      const response = await fetch('/api/artist/onboarding/status')
      const data = await response.json()
      setState(data)
    }
    loadOnboardingState()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Step {state.currentStep} of {state.totalSteps}
          </span>
          <span className="text-sm text-gray-600">
            {state.profileCompleteness}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-cyan h-2 rounded-full transition-all"
            style={{ width: `${(state.currentStep / state.totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      {state.currentStep === 1 && <Step1BasicInfo />}
      {state.currentStep === 2 && <Step2ProfileDetails />}
      {state.currentStep === 3 && <Step3PricingAvailability />}
      {state.currentStep === 4 && <Step4Verification />}
      {state.currentStep === 5 && <Step5Payment />}
    </div>
  )
}
```

### 3. Profile Completeness Indicator

```typescript
interface ProfileCompletenessProps {
  completeness: number
}

export function ProfileCompletenessIndicator({ completeness }: ProfileCompletenessProps) {
  const getStatusColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusText = (score: number) => {
    if (score >= 80) return 'Great! Almost complete'
    if (score >= 50) return 'Good progress'
    return 'Let\'s complete your profile'
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Profile Completeness</h3>
        <span className="text-2xl font-bold">{completeness}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full transition-all ${getStatusColor(completeness)}`}
          style={{ width: `${completeness}%` }}
        />
      </div>

      <p className="text-sm text-gray-600">{getStatusText(completeness)}</p>

      {completeness < 100 && (
        <button className="mt-4 text-brand-cyan hover:underline text-sm">
          See what's missing →
        </button>
      )}
    </div>
  )
}
```

---

## Database Schema Reference

```prisma
model Artist {
  // ... other fields ...

  // Verification
  verificationLevel VerificationLevel @default(UNVERIFIED)
  verifiedAt        DateTime?

  // ID Verification Documents
  verificationDocumentUrl      String?
  verificationDocumentType     String?
  verificationSubmittedAt      DateTime?
  verificationReviewedAt       DateTime?
  verificationReviewedBy       String?
  verificationRejectionReason  String?   @db.Text

  // Verification Fee Tracking
  verificationFeeRequired      Boolean   @default(true)
  verificationFeePaid         Boolean   @default(false)
  verificationFeePaidAt       DateTime?
  verificationFeeAmount       Decimal?  @db.Decimal(10, 2) @default(1500.00)
  verificationFeeTransactionId String?

  // Onboarding Progress Tracking
  onboardingStep              Int       @default(1)
  onboardingStartedAt         DateTime  @default(now())
  onboardingCompletedAt       DateTime?

  // Profile Completeness
  profileCompleteness         Int       @default(0)

  // Profile Management
  isDraft                     Boolean   @default(true)
  lastProfileUpdate           DateTime?
  profilePublishedAt          DateTime?
}

enum VerificationLevel {
  UNVERIFIED  // New artists (default)
  PENDING     // Documents submitted, awaiting review
  BASIC       // ID verified
  VERIFIED    // Full verification complete
  TRUSTED     // High-reputation artists
  REJECTED    // Verification rejected
}
```

---

## Testing Guide

### Test Case 1: Minimal Registration

**Input:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "stageName": "Test Artist",
  "category": "DJ",
  "baseCity": "Bangkok"
}
```

**Expected Output:**
- Profile completeness: **30%** (basic info only)
- Onboarding step: **1**
- Verification level: **UNVERIFIED**
- isDraft: **true**

### Test Case 2: Full Registration

**Input:**
```json
{
  "email": "full@example.com",
  "password": "password123",
  "stageName": "Professional DJ",
  "category": "DJ",
  "baseCity": "Bangkok",
  "realName": "John Doe",
  "phone": "+66812345678",
  "bio": "Experienced DJ with 10+ years in the industry, specializing in house and techno music",
  "bioTh": "ดีเจมืออาชีพที่มีประสบการณ์มากกว่า 10 ปี เชี่ยวชาญดนตรีแนวเฮาส์และเทคโน",
  "hourlyRate": 5000,
  "minimumHours": 3,
  "genres": ["House", "Techno"],
  "languages": ["en", "th", "jp"],
  "serviceAreas": ["Bangkok", "Phuket"],
  "facebook": "https://facebook.com/test",
  "instagram": "https://instagram.com/test"
}
```

**Expected Output:**
- Profile completeness: **95-100%** (all categories filled)
- Onboarding step: **1**
- Verification level: **UNVERIFIED**
- isDraft: **true**

### Test Case 3: Duplicate Email

**Input:**
```json
{
  "email": "existing@example.com",  // Email already in database
  "password": "password123",
  "stageName": "Test",
  "category": "DJ",
  "baseCity": "Bangkok"
}
```

**Expected Output:**
- HTTP Status: **400 Bad Request**
- Error: "User with this email or phone already exists"

---

## Changelog

### Version 1.1 (October 11, 2025) - Day 11-12 Enhancement
- Added complete verification field initialization
- Implemented `calculateProfileCompleteness()` helper function
- Added onboarding step tracking (1-5)
- Enhanced response with `nextSteps` guidance
- Added comprehensive JSDoc comments
- Improved error handling

### Version 1.0 (Previous)
- Basic artist registration
- User account creation
- Activity tracking

---

## Next Steps

1. **Create Onboarding API Endpoints** (Day 13-14)
   - `/api/artist/onboarding/status` - Get current onboarding state
   - `/api/artist/onboarding/update` - Update onboarding progress
   - `/api/artist/onboarding/complete` - Mark onboarding complete

2. **Build Frontend Onboarding Wizard** (Day 15-16)
   - 5-step wizard component
   - Progress tracking UI
   - Profile completeness indicator
   - Step validation and navigation

3. **Verification Document Upload** (Day 17-18)
   - Cloudinary integration for ID uploads
   - Document type selection
   - Submission API endpoint
   - Admin review interface

4. **Verification Fee Payment** (Day 19-20)
   - PromptPay QR code generation
   - Payment confirmation flow
   - Transaction tracking
   - Admin verification

---

## Related Files

- **API Route:** `/app/api/auth/register/artist/route.ts`
- **Database Schema:** `/prisma/schema.prisma`
- **Activity Tracker:** `/lib/activity-tracker.ts`
- **Frontend Registration:** `/app/[locale]/register/artist/page.tsx`

---

**Documentation Last Updated:** October 11, 2025
**Implementation Status:** ✅ Complete and Ready for Frontend Integration
