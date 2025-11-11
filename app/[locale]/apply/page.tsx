import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import DJApplicationForm from '@/components/forms/DJApplicationForm';
import { SparklesIcon, MusicalNoteIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'สมัครเป็นศิลปิน | Bright Ears'
    : 'Apply as DJ/Artist | Bright Ears';

  const description = locale === 'th'
    ? 'สมัครเข้าร่วม Bright Ears ในฐานะดีเจ วงดนตรี หรือศิลปิน เราจะตรวจสอบและติดต่อกลับภายใน 3-5 วันทำการ'
    : 'Apply to join the Bright Ears roster as a DJ, band, or artist. We review all applications and get back to you within 3-5 business days.';

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'สมัครดีเจ, สมัครวงดนตรี, สมัครศิลปิน, Bright Ears, งานดีเจ, รายได้ดีเจ'
      : 'apply DJ, apply band, apply artist, Bright Ears, DJ jobs, musician jobs, entertainment gigs',
    openGraph: {
      title,
      description,
      url: `/${locale}/apply`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-apply.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - สมัครเป็นศิลปิน'
          : 'Bright Ears - Apply as Artist'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-apply.jpg']
    },
    alternates: {
      canonical: `/${locale}/apply`,
      languages: {
        'en': '/en/apply',
        'th': '/th/apply',
      }
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function ApplyPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('apply');

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-brand-cyan/5 to-soft-lavender/10">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-soft-lavender/20 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-earthy-brown/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 backdrop-blur-md rounded-full mb-6">
            <SparklesIcon className="w-5 h-5 text-brand-cyan" />
            <span className="font-inter text-sm font-medium text-brand-cyan">
              {t('badge')}
            </span>
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-deep-teal mb-6">
            {t('title')}
          </h1>

          <p className="font-inter text-lg sm:text-xl text-dark-gray/80 max-w-3xl mx-auto mb-8">
            {t('subtitle')}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <MusicalNoteIcon className="w-8 h-8 text-brand-cyan mx-auto mb-2" />
              <p className="font-playfair text-3xl font-bold text-deep-teal mb-1">500+</p>
              <p className="font-inter text-sm text-dark-gray/70">{t('stats.artists')}</p>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <UserGroupIcon className="w-8 h-8 text-brand-cyan mx-auto mb-2" />
              <p className="font-playfair text-3xl font-bold text-deep-teal mb-1">10,000+</p>
              <p className="font-inter text-sm text-dark-gray/70">{t('stats.events')}</p>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <SparklesIcon className="w-8 h-8 text-brand-cyan mx-auto mb-2" />
              <p className="font-playfair text-3xl font-bold text-deep-teal mb-1">0%</p>
              <p className="font-inter text-sm text-dark-gray/70">{t('stats.commission')}</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="font-playfair text-2xl font-bold text-deep-teal mb-6 text-center">
            {t('benefits.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-inter font-semibold text-deep-teal mb-1">{t('benefits.item1Title')}</h3>
                <p className="font-inter text-sm text-dark-gray/70">{t('benefits.item1Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-inter font-semibold text-deep-teal mb-1">{t('benefits.item2Title')}</h3>
                <p className="font-inter text-sm text-dark-gray/70">{t('benefits.item2Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-inter font-semibold text-deep-teal mb-1">{t('benefits.item3Title')}</h3>
                <p className="font-inter text-sm text-dark-gray/70">{t('benefits.item3Desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-inter font-semibold text-deep-teal mb-1">{t('benefits.item4Title')}</h3>
                <p className="font-inter text-sm text-dark-gray/70">{t('benefits.item4Desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <DJApplicationForm locale={locale} />

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="font-inter text-sm text-dark-gray/60">
            {t('footer.privacy')}
          </p>
        </div>
      </div>
    </div>
  );
}
