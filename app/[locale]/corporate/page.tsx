import { getTranslations } from 'next-intl/server'
import { Link } from '@/components/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return {
    title: `Corporate Entertainment Solutions - Bright Ears`,
    description: `Professional entertainment for corporate events in Thailand. Verified artists, dedicated account management, and world-class performers for your business events.`
  }
}

export default async function CorporatePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-dark-gray mb-4">
            Corporate Entertainment Solutions
          </h1>
          <p className="font-inter text-lg text-dark-gray opacity-80 max-w-3xl mx-auto">
            Elevate your corporate events with Thailand's premium entertainment talent. 
            From intimate executive dinners to grand company celebrations, we provide world-class performers 
            tailored to your business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-playfair text-2xl font-semibold mb-6">Why Choose Bright Ears for Corporate Events?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-brand-cyan text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">✓</span>
                <span className="font-inter">Verified, professional entertainers with corporate experience</span>
              </li>
              <li className="flex items-start">
                <span className="bg-brand-cyan text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">✓</span>
                <span className="font-inter">Dedicated account management for seamless event coordination</span>
              </li>
              <li className="flex items-start">
                <span className="bg-brand-cyan text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">✓</span>
                <span className="font-inter">Flexible booking options with corporate billing and contracts</span>
              </li>
              <li className="flex items-start">
                <span className="bg-brand-cyan text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">✓</span>
                <span className="font-inter">Multi-lingual performers for international events</span>
              </li>
              <li className="flex items-start">
                <span className="bg-brand-cyan text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">✓</span>
                <span className="font-inter">Comprehensive event planning support and consultation</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-playfair text-2xl font-semibold mb-6">Perfect for Any Corporate Event</h2>
            <div className="space-y-3">
              <div className="p-3 bg-soft-lavender/20 rounded">
                <h4 className="font-semibold">Product Launches</h4>
                <p className="text-sm opacity-80">Create buzz with dynamic entertainment</p>
              </div>
              <div className="p-3 bg-soft-lavender/20 rounded">
                <h4 className="font-semibold">Company Galas & Awards</h4>
                <p className="text-sm opacity-80">Celebrate achievements in style</p>
              </div>
              <div className="p-3 bg-soft-lavender/20 rounded">
                <h4 className="font-semibold">Conference Entertainment</h4>
                <p className="text-sm opacity-80">Energize attendees between sessions</p>
              </div>
              <div className="p-3 bg-soft-lavender/20 rounded">
                <h4 className="font-semibold">Executive Dinners</h4>
                <p className="text-sm opacity-80">Sophisticated background entertainment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-soft-lavender/20 p-8 rounded-lg">
          <h2 className="font-playfair text-2xl font-semibold mb-4">Ready to Elevate Your Corporate Events?</h2>
          <p className="font-inter mb-6 opacity-80">
            Contact our corporate team to discuss your entertainment needs and receive a custom proposal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/register`}>
              <button className="bg-brand-cyan text-white px-8 py-3 rounded-lg font-inter font-medium hover:bg-brand-cyan/90 transition-colors">
                Create Corporate Account
              </button>
            </Link>
            <Link href={`/${locale}/artists`}>
              <button className="border border-brand-cyan text-brand-cyan px-8 py-3 rounded-lg font-inter font-medium hover:bg-brand-cyan hover:text-white transition-colors">
                Browse Entertainers
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}