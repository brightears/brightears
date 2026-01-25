import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import DJApplicationForm from '@/components/forms/DJApplicationForm';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'สมัครเข้าร่วม | Bright Ears'
    : 'Apply to Join | Bright Ears';

  const description = locale === 'th'
    ? 'สมัครเป็นดีเจหรือศิลปินกับ Bright Ears ไม่มีค่าคอมมิชชั่น เก็บรายได้ 100% รับงานจากโรงแรมและสถานที่ชั้นนำในกรุงเทพ'
    : 'Apply to become a DJ or artist with Bright Ears. Zero commission, keep 100% of your earnings. Get booked by premium hotels and venues in Bangkok.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/apply`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/apply`,
      languages: {
        'en': '/en/apply',
        'th': '/th/apply',
        'x-default': '/en/apply',
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
    <main className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal via-deep-teal/95 to-brand-cyan/80 overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand-cyan/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-soft-lavender/20 rounded-full filter blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <svg className="w-5 h-5 text-brand-cyan" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
              <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="16" cy="16" r="2" fill="currentColor"/>
            </svg>
            <span className="font-inter text-sm text-white/90">{t('badge')}</span>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h1>
          <p className="font-inter text-lg text-white/80 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Benefits Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="font-playfair text-xl font-bold text-white mb-6">
                  {t('benefits.title')}
                </h2>

                <div className="space-y-5">
                  {/* Benefit 1: Quality Clients */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-cyan/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-white">{t('benefits.item1Title')}</h3>
                      <p className="font-inter text-sm text-white/70">{t('benefits.item1Desc')}</p>
                    </div>
                  </div>

                  {/* Benefit 2: We Handle the Admin */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-cyan/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-white">{t('benefits.item2Title')}</h3>
                      <p className="font-inter text-sm text-white/70">{t('benefits.item2Desc')}</p>
                    </div>
                  </div>

                  {/* Benefit 3: Work on Your Terms */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-cyan/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-white">{t('benefits.item3Title')}</h3>
                      <p className="font-inter text-sm text-white/70">{t('benefits.item3Desc')}</p>
                    </div>
                  </div>

                  {/* Benefit 4: Marketing Support */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-cyan/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-white">{t('benefits.item4Title')}</h3>
                      <p className="font-inter text-sm text-white/70">{t('benefits.item4Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <DJApplicationForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
