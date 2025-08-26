'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallbackPage() {
  const router = useRouter()

  return (
    <>
      <AuthenticateWithRedirectCallback 
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/onboarding"
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan mx-auto"></div>
          <p className="mt-4 text-dark-gray">Completing sign in...</p>
        </div>
      </div>
    </>
  )
}