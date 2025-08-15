import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'

export default function HowItWorksPage() {
  const t = useTranslations('common')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-dark-gray mb-4">
            How Bright Ears Works
          </h1>
          <p className="font-inter text-lg text-dark-gray opacity-80">
            Connecting you with Thailand's finest entertainment talent in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-brand-cyan w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="font-playfair text-xl font-semibold mb-2">Browse & Discover</h3>
            <p className="font-inter text-dark-gray opacity-80">
              Browse our curated selection of verified entertainers. Filter by location, category, and budget to find your perfect match.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-cyan w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="font-playfair text-xl font-semibold mb-2">Connect & Book</h3>
            <p className="font-inter text-dark-gray opacity-80">
              Contact artists directly through our platform. Discuss your event details and receive personalized quotes.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-cyan w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="font-playfair text-xl font-semibold mb-2">Enjoy Your Event</h3>
            <p className="font-inter text-dark-gray opacity-80">
              Relax and enjoy exceptional entertainment at your event. Leave reviews to help other customers.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/artists">
            <button className="bg-brand-cyan text-white px-8 py-3 rounded-lg font-inter font-medium hover:bg-brand-cyan/90 transition-colors">
              Start Browsing Artists
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}