import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import OnboardingWizard from '@/components/artist/onboarding/OnboardingWizard'

export const metadata = {
  title: 'Artist Onboarding | Bright Ears',
  description: 'Complete your artist profile to start receiving bookings'
}

export default async function OnboardingPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in?redirect=/artist/onboarding')
  }

  // Get user with artist profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      artist: true
    }
  })

  // Check if user is an artist
  if (!user || user.role !== 'ARTIST' || !user.artist) {
    redirect('/dashboard')
  }

  const artist = user.artist

  // If onboarding already completed, redirect to dashboard
  if (artist.onboardingCompletedAt) {
    redirect('/dashboard')
  }

  // Prepare initial data for wizard
  const initialData = {
    // Step 1: Basic Info (from registration)
    email: user.email,
    stageName: artist.stageName,
    category: artist.category,
    baseCity: artist.baseCity,
    phone: user.phone || undefined,
    realName: artist.realName || undefined,

    // Step 2: Profile Details
    profileImage: artist.profileImage || undefined,
    coverImage: artist.coverImage || undefined,
    bio: artist.bio || undefined,
    bioTh: artist.bioTh || undefined,

    // Step 3: Pricing & Availability
    hourlyRate: artist.hourlyRate ? parseFloat(artist.hourlyRate.toString()) : undefined,
    minimumHours: artist.minimumHours,
    serviceAreas: artist.serviceAreas,
    travelRadius: artist.travelRadius || undefined,
    genres: artist.genres,
    languages: artist.languages,

    // Step 4: Verification
    verificationDocumentUrl: artist.verificationDocumentUrl || undefined,
    verificationDocumentType: artist.verificationDocumentType as 'national_id' | 'passport' | 'driver_license' | undefined,
    verificationSubmittedAt: artist.verificationSubmittedAt || undefined,

    // Step 5: Payment
    verificationFeeAmount: artist.verificationFeeAmount ? parseFloat(artist.verificationFeeAmount.toString()) : 1500,
    verificationFeePaid: artist.verificationFeePaid,
    verificationFeePaidAt: artist.verificationFeePaidAt || undefined,
    // Note: paymentSlipUrl would be stored in Booking table with special reference
  }

  return (
    <OnboardingWizard
      artistId={artist.id}
      initialStep={artist.onboardingStep}
      initialData={initialData}
      profileCompleteness={artist.profileCompleteness}
    />
  )
}
