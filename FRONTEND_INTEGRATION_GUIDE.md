# Frontend Integration Guide - Artist Onboarding

## Quick Start

This guide shows frontend developers how to integrate with the enhanced artist registration API and build the 5-step onboarding wizard.

**Last Updated:** October 11, 2025
**API Endpoint:** `/api/auth/register/artist`
**Status:** Ready for Integration

---

## 1. Registration Form Integration

### Basic Implementation

```typescript
// app/[locale]/register/artist/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ArtistRegistrationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      stageName: formData.get('stageName') as string,
      category: formData.get('category') as string,
      baseCity: formData.get('baseCity') as string,
      // Optional fields
      phone: formData.get('phone') as string || undefined,
      bio: formData.get('bio') as string || undefined,
      hourlyRate: formData.get('hourlyRate') ? Number(formData.get('hourlyRate')) : undefined,
    }

    try {
      const response = await fetch('/api/auth/register/artist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      const result = await response.json()

      // Store artist/user IDs for onboarding wizard
      sessionStorage.setItem('artistId', result.artist.id)
      sessionStorage.setItem('userId', result.user.id)

      // Redirect to onboarding Step 2
      router.push('/onboarding/artist?step=2')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-playfair mb-6">Join as an Entertainer</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Required Fields */}
      <div className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          required
          minLength={6}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="text"
          name="stageName"
          placeholder="Stage Name / Artist Name"
          required
          className="w-full px-4 py-2 border rounded"
        />

        <select
          name="category"
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Category</option>
          <option value="DJ">DJ</option>
          <option value="BAND">Band</option>
          <option value="SINGER">Singer</option>
          <option value="MUSICIAN">Musician</option>
          <option value="MC">MC/Host</option>
          <option value="COMEDIAN">Comedian</option>
          <option value="MAGICIAN">Magician</option>
          <option value="DANCER">Dancer</option>
          <option value="PHOTOGRAPHER">Photographer</option>
          <option value="SPEAKER">Speaker</option>
        </select>

        <input
          type="text"
          name="baseCity"
          placeholder="Base City (e.g., Bangkok, Phuket)"
          required
          className="w-full px-4 py-2 border rounded"
        />

        {/* Optional Fields to Boost Profile Completeness */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone (optional, +10% completeness)"
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="number"
          name="hourlyRate"
          placeholder="Hourly Rate in THB (optional, +15% completeness)"
          className="w-full px-4 py-2 border rounded"
        />

        <textarea
          name="bio"
          placeholder="Tell us about yourself (optional, +15% completeness if ≥50 characters)"
          rows={4}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-brand-cyan text-white py-3 rounded-lg font-semibold hover:bg-brand-cyan/90 disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
```

---

## 2. Onboarding Wizard Component

### Multi-Step Wizard with Progress Tracking

```typescript
// app/[locale]/onboarding/artist/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface OnboardingState {
  artistId: string
  currentStep: number
  totalSteps: number
  profileCompleteness: number
  verificationLevel: string
  verificationFeeRequired: boolean
  verificationFeePaid: boolean
}

export default function ArtistOnboardingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<OnboardingState | null>(null)
  const [loading, setLoading] = useState(true)

  // Load current onboarding state
  useEffect(() => {
    async function loadState() {
      try {
        // Get artist ID from session
        const artistId = sessionStorage.getItem('artistId')
        if (!artistId) {
          router.push('/register/artist')
          return
        }

        // Fetch current onboarding status
        const response = await fetch(`/api/artist/${artistId}/onboarding`)
        const data = await response.json()

        setState({
          artistId,
          currentStep: data.onboardingStep,
          totalSteps: 5,
          profileCompleteness: data.profileCompleteness,
          verificationLevel: data.verificationLevel,
          verificationFeeRequired: data.verificationFeeRequired,
          verificationFeePaid: data.verificationFeePaid,
        })
      } catch (error) {
        console.error('Failed to load onboarding state:', error)
      } finally {
        setLoading(false)
      }
    }

    loadState()
  }, [router])

  if (loading || !state) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const currentStep = Number(searchParams.get('step')) || state.currentStep

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={state.totalSteps}
        completeness={state.profileCompleteness}
      />

      {/* Step Content */}
      <div className="mt-8">
        {currentStep === 1 && <Step1BasicInfo artistId={state.artistId} />}
        {currentStep === 2 && <Step2ProfileDetails artistId={state.artistId} />}
        {currentStep === 3 && <Step3PricingAvailability artistId={state.artistId} />}
        {currentStep === 4 && <Step4Verification artistId={state.artistId} />}
        {currentStep === 5 && <Step5Payment artistId={state.artistId} />}
      </div>

      {/* Navigation */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={state.totalSteps}
        artistId={state.artistId}
      />
    </div>
  )
}

// Progress Bar Component
function ProgressBar({
  currentStep,
  totalSteps,
  completeness,
}: {
  currentStep: number
  totalSteps: number
  completeness: number
}) {
  return (
    <div>
      {/* Step Indicator */}
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-600">
          {completeness}% Profile Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-brand-cyan h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-8">
        <div className={currentStep >= 1 ? 'text-brand-cyan font-medium' : ''}>
          Basic Info
        </div>
        <div className={currentStep >= 2 ? 'text-brand-cyan font-medium' : ''}>
          Profile
        </div>
        <div className={currentStep >= 3 ? 'text-brand-cyan font-medium' : ''}>
          Pricing
        </div>
        <div className={currentStep >= 4 ? 'text-brand-cyan font-medium' : ''}>
          Verification
        </div>
        <div className={currentStep >= 5 ? 'text-brand-cyan font-medium' : ''}>
          Go Live
        </div>
      </div>
    </div>
  )
}
```

---

## 3. Profile Completeness Widget

### Real-time Completeness Indicator

```typescript
// components/artist/ProfileCompletenessWidget.tsx
'use client'

interface ProfileCompletenessProps {
  completeness: number
  missingFields?: string[]
}

export function ProfileCompletenessWidget({
  completeness,
  missingFields = [],
}: ProfileCompletenessProps) {
  const getStatusColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusText = (score: number) => {
    if (score >= 90) return 'Excellent! Your profile is complete'
    if (score >= 70) return 'Great! Almost there'
    if (score >= 50) return 'Good progress, keep going'
    return 'Let\'s complete your profile'
  }

  const getStatusEmoji = (score: number) => {
    if (score >= 90) return '🎉'
    if (score >= 70) return '🌟'
    if (score >= 50) return '💪'
    return '🚀'
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Profile Completeness</h3>
        <span className="text-3xl font-bold text-gray-900">{completeness}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${getStatusColor(completeness)}`}
          style={{ width: `${completeness}%` }}
        />
      </div>

      {/* Status Message */}
      <p className="text-sm text-gray-600 mb-4">
        {getStatusEmoji(completeness)} {getStatusText(completeness)}
      </p>

      {/* Missing Fields */}
      {missingFields.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Add these to boost your profile:
          </p>
          <ul className="space-y-1">
            {missingFields.map((field, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="text-brand-cyan mr-2">+</span>
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}

      {completeness < 100 && (
        <button className="mt-4 w-full text-brand-cyan hover:bg-brand-cyan/5 border border-brand-cyan rounded-lg py-2 text-sm font-medium transition-colors">
          Complete Profile
        </button>
      )}
    </div>
  )
}
```

---

## 4. API Response Handling

### TypeScript Types

```typescript
// types/artist-registration.ts

export interface ArtistRegistrationRequest {
  // Required
  email: string
  password: string
  stageName: string
  category: ArtistCategory
  baseCity: string

  // Optional
  phone?: string
  realName?: string
  bio?: string
  bioTh?: string
  subCategories?: string[]
  serviceAreas?: string[]
  travelRadius?: number
  hourlyRate?: number
  minimumHours?: number
  languages?: string[]
  genres?: string[]
  lineId?: string
  facebook?: string
  instagram?: string
  website?: string
}

export type ArtistCategory =
  | 'DJ'
  | 'BAND'
  | 'SINGER'
  | 'MUSICIAN'
  | 'MC'
  | 'COMEDIAN'
  | 'MAGICIAN'
  | 'DANCER'
  | 'PHOTOGRAPHER'
  | 'SPEAKER'

export interface ArtistRegistrationResponse {
  user: {
    id: string
    email: string
    phone?: string
    role: 'ARTIST'
    createdAt: string
  }
  artist: {
    id: string
    stageName: string
    category: ArtistCategory
    baseCity: string
    onboardingStep: number
    profileCompleteness: number
    verificationLevel: 'UNVERIFIED' | 'PENDING' | 'BASIC' | 'VERIFIED' | 'TRUSTED' | 'REJECTED'
    isDraft: boolean
    verificationFeeRequired: boolean
    verificationFeePaid: boolean
    verificationFeeAmount: string // Decimal as string
  }
  nextSteps: {
    currentStep: number
    totalSteps: number
    message: string
    actions: string[]
  }
}

export interface ArtistRegistrationError {
  error: string
  details?: Array<{
    code: string
    path: string[]
    message: string
  }>
}
```

---

## 5. Error Handling

### Robust Error Display

```typescript
// components/artist/RegistrationErrorDisplay.tsx

interface ErrorDisplayProps {
  error: {
    error: string
    details?: Array<{
      code: string
      path: string[]
      message: string
    }>
  }
}

export function RegistrationErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {error.error}
          </h3>
          {error.details && (
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc pl-5 space-y-1">
                {error.details.map((detail, index) => (
                  <li key={index}>
                    {detail.path.join('.')}: {detail.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## 6. Profile Completeness Calculation Reference

**For Frontend Display:**

| Field Category | Points | Criteria |
|---------------|--------|----------|
| Basic Info | 30 | Always scored (required fields) |
| Contact | 5 | Phone OR LINE ID provided |
| Social Media | 5 | Any of: Facebook, Instagram, Website |
| Hourly Rate | 15 | Rate > 0 provided |
| Minimum Hours | 5 | Value > 0 provided |
| Bio (English) | 15 | Length ≥ 50 characters |
| Bio (Thai) | 5 | Length ≥ 50 characters |
| Service Areas | 5 | At least 1 area provided |
| Genres | 5 | At least 1 genre provided |
| Languages | 5 | More than 1 language |
| Real Name | 5 | Provided |

**Total:** 100 points

---

## 7. Next API Endpoints Needed

The following endpoints should be created to support the onboarding wizard:

```typescript
// GET /api/artist/[artistId]/onboarding
// Returns current onboarding state
{
  "onboardingStep": 2,
  "profileCompleteness": 65,
  "verificationLevel": "UNVERIFIED",
  "isDraft": true,
  "verificationFeeRequired": true,
  "verificationFeePaid": false
}

// PUT /api/artist/[artistId]/onboarding
// Updates onboarding progress
{
  "onboardingStep": 3,
  "updatedFields": ["profileImage", "bio", "gallery"]
}

// POST /api/artist/[artistId]/verification/upload
// Uploads verification documents
FormData with verificationDocument file

// POST /api/artist/[artistId]/verification/submit
// Submits verification for admin review
{
  "documentType": "national_id"
}

// POST /api/artist/[artistId]/verification/payment
// Records verification fee payment
{
  "transactionId": "promptpay-123456",
  "amount": 1500.00
}

// PUT /api/artist/[artistId]/publish
// Publishes profile (isDraft: false)
{
  "publish": true
}
```

---

## 8. Testing Checklist

- [ ] Registration with minimal fields (30% completeness)
- [ ] Registration with partial fields (60% completeness)
- [ ] Registration with all fields (100% completeness)
- [ ] Duplicate email error handling
- [ ] Duplicate phone error handling
- [ ] Validation error display
- [ ] Profile completeness widget updates
- [ ] Onboarding wizard navigation
- [ ] Step progress persistence
- [ ] Session management across steps
- [ ] Mobile responsive design
- [ ] Bilingual support (EN/TH)

---

**Need Help?**
- API Documentation: `ARTIST_REGISTRATION_API.md`
- Test Script: `scripts/test-artist-registration.ts`
- Backend Route: `app/api/auth/register/artist/route.ts`

**Last Updated:** October 11, 2025
