'use client'

import { useState } from 'react'
import { useSignIn, useSignUp } from '@clerk/nextjs'

interface PhoneAuthProps {
  phone: string
  onSuccess: (userId: string) => void
  onError: (error: string) => void
}

export function PhoneAuth({ phone, onSuccess, onError }: PhoneAuthProps) {
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<'initiate' | 'verify'>('initiate')

  const handlePhoneAuth = async () => {
    if (!signInLoaded || !signUpLoaded) return

    setIsLoading(true)
    try {
      // First try to sign in with existing phone number
      try {
        await signIn.create({
          identifier: phone,
        })
        
        const firstFactor = signIn.supportedFirstFactors.find(factor => 
          factor.strategy === 'phone_code'
        )
        
        if (firstFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId: (firstFactor as any).phoneNumberId,
          })
          setStep('verify')
          return
        }
      } catch (signInError) {
        // If sign in fails, try to sign up
        console.log('Sign in failed, trying sign up:', signInError)
      }

      // Try to create new user with phone
      await signUp.create({
        phoneNumber: phone,
      })

      await signUp.preparePhoneNumberVerification()
      setStep('verify')

    } catch (error: any) {
      onError(error.errors?.[0]?.longMessage || 'Failed to send verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!signInLoaded || !signUpLoaded) return

    setIsLoading(true)
    try {
      // Try to complete sign in first
      if (signIn.status === 'needs_first_factor') {
        const result = await signIn.attemptFirstFactor({
          strategy: 'phone_code',
          code: verificationCode,
        })

        if (result.status === 'complete') {
          onSuccess(result.createdUserId!)
          return
        }
      }

      // If not signing in, try to complete sign up
      const result = await signUp.attemptPhoneNumberVerification({
        code: verificationCode,
      })

      if (result.status === 'complete') {
        onSuccess(result.createdUserId!)
      }

    } catch (error: any) {
      onError(error.errors?.[0]?.longMessage || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'initiate') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-dark-gray mb-2">
            Verify Your Phone
          </h3>
          <p className="text-dark-gray/70 mb-4">
            We'll send a verification code to {phone}
          </p>
        </div>

        <button
          onClick={handlePhoneAuth}
          disabled={isLoading}
          className="w-full bg-brand-cyan text-white py-3 px-4 rounded-md font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Sending Code...' : 'Send Verification Code'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-dark-gray mb-2">
          Enter Verification Code
        </h3>
        <p className="text-dark-gray/70 mb-4">
          We sent a code to {phone}
        </p>
      </div>

      <div>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="123456"
          maxLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan text-center text-lg tracking-widest"
        />
      </div>

      <div className="space-y-3">
        <button
          onClick={handleVerifyCode}
          disabled={isLoading || verificationCode.length !== 6}
          className="w-full bg-brand-cyan text-white py-3 px-4 rounded-md font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          onClick={handlePhoneAuth}
          disabled={isLoading}
          className="w-full text-brand-cyan border border-brand-cyan py-2 px-4 rounded-md font-medium hover:bg-brand-cyan/10 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  )
}