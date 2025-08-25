'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

export default function SSOCallbackPage() {
  const router = useRouter()
  const { handleRedirectCallback } = useClerk()

  useEffect(() => {
    const handle = async () => {
      try {
        await handleRedirectCallback()
        
        // Check if we have a redirect URL in the query params
        const params = new URLSearchParams(window.location.search)
        const redirectUrl = params.get('redirect_url')
        
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          // Default redirect based on user role
          router.push('/dashboard')
        }
      } catch (err) {
        console.error('SSO callback error:', err)
        router.push('/sign-in')
      }
    }
    
    handle()
  }, [handleRedirectCallback, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan mx-auto"></div>
        <p className="mt-4 text-dark-gray">Completing sign in...</p>
      </div>
    </div>
  )
}