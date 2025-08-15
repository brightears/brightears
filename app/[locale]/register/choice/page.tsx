'use client'

import { Link } from '@/components/navigation'
import { useTranslations } from 'next-intl'
import { 
  MicrophoneIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  MusicalNoteIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

export default function RegisterChoicePage() {
  const t = useTranslations('auth')

  return (
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-dark-gray mb-4">
            Join Bright Ears
          </h1>
          <p className="text-lg text-dark-gray/80 font-inter">
            Choose how you want to use our platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Artist Registration */}
          <div className="bg-pure-white rounded-xl shadow-lg p-8 border-2 border-earthy-brown/20 hover:border-earthy-brown transition-all">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-earthy-brown/10 rounded-full mb-4">
                <MicrophoneIcon className="w-8 h-8 text-earthy-brown" />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-dark-gray mb-2">
                I'm an Artist
              </h2>
              <p className="text-dark-gray/70 font-inter">
                Musicians, DJs, Bands, Performers
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <SparklesIcon className="w-5 h-5 text-earthy-brown mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Create your professional profile
                </span>
              </li>
              <li className="flex items-start">
                <CurrencyDollarIcon className="w-5 h-5 text-earthy-brown mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  0% commission on all bookings
                </span>
              </li>
              <li className="flex items-start">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-earthy-brown mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Direct communication with clients
                </span>
              </li>
              <li className="flex items-start">
                <CalendarDaysIcon className="w-5 h-5 text-earthy-brown mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Manage bookings & availability
                </span>
              </li>
            </ul>

            <Link
              href="/register/artist"
              className="block w-full py-3 px-4 text-center text-pure-white bg-earthy-brown rounded-lg hover:bg-earthy-brown/90 transition-colors font-medium font-inter"
            >
              Register as Artist
            </Link>
          </div>

          {/* Customer Registration */}
          <div className="bg-pure-white rounded-xl shadow-lg p-8 border-2 border-brand-cyan/20 hover:border-brand-cyan transition-all">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-cyan/10 rounded-full mb-4">
                <UserGroupIcon className="w-8 h-8 text-brand-cyan" />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-dark-gray mb-2">
                I'm a Customer
              </h2>
              <p className="text-dark-gray/70 font-inter">
                Looking for entertainment
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <MusicalNoteIcon className="w-5 h-5 text-brand-cyan mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Browse verified artists
                </span>
              </li>
              <li className="flex items-start">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-brand-cyan mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Request quotes directly
                </span>
              </li>
              <li className="flex items-start">
                <CalendarDaysIcon className="w-5 h-5 text-brand-cyan mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Book for private events
                </span>
              </li>
              <li className="flex items-start">
                <SparklesIcon className="w-5 h-5 text-brand-cyan mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Leave reviews & ratings
                </span>
              </li>
            </ul>

            <Link
              href="/register?type=customer"
              className="block w-full py-3 px-4 text-center text-pure-white bg-brand-cyan rounded-lg hover:bg-brand-cyan/90 transition-colors font-medium font-inter"
            >
              Sign up as Customer
            </Link>
          </div>

          {/* Corporate Registration */}
          <div className="bg-pure-white rounded-xl shadow-lg p-8 border-2 border-deep-teal/20 hover:border-deep-teal transition-all">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-teal/10 rounded-full mb-4">
                <BuildingOfficeIcon className="w-8 h-8 text-deep-teal" />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-dark-gray mb-2">
                I'm a Business
              </h2>
              <p className="text-dark-gray/70 font-inter">
                Hotels, Venues, Event Planners
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <UserGroupIcon className="w-5 h-5 text-deep-teal mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Access to all artist categories
                </span>
              </li>
              <li className="flex items-start">
                <CalendarDaysIcon className="w-5 h-5 text-deep-teal mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Book for recurring events
                </span>
              </li>
              <li className="flex items-start">
                <CurrencyDollarIcon className="w-5 h-5 text-deep-teal mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Corporate invoicing available
                </span>
              </li>
              <li className="flex items-start">
                <SparklesIcon className="w-5 h-5 text-deep-teal mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-dark-gray font-inter">
                  Priority support & features
                </span>
              </li>
            </ul>

            <Link
              href="/register?type=corporate"
              className="block w-full py-3 px-4 text-center text-pure-white bg-deep-teal rounded-lg hover:bg-deep-teal/90 transition-colors font-medium font-inter"
            >
              Sign up as Business
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-dark-gray/70 font-inter">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-cyan hover:text-brand-cyan/80 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}