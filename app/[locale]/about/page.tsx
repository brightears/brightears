import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import JsonLd from '@/components/JsonLd';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema
} from '@/lib/schemas/structured-data';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'เกี่ยวกับ Bright Ears - เอเจนซี่บันเทิงของไทย'
    : 'About Bright Ears - Thailand\'s Entertainment Agency';

  const description = locale === 'th'
    ? 'ตั้งแต่ปี 2007 เราได้ร่วมงานกับโรงแรมและสถานที่ชั้นนำของประเทศไทย เพื่อสร้างประสบการณ์ความบันเทิงที่ไร้รอยต่อและเฉพาะตัว'
    : 'Since 2007, we\'ve partnered with Thailand\'s finest hotels and venues to create seamless, bespoke entertainment experiences.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/about`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = useTranslations('about');

  // Generate structured data
  const organizationSchema = generateOrganizationSchema({
    locale,
    url: `https://brightears.onrender.com/${locale}/about`
  });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      {
        name: locale === 'th' ? 'หน้าแรก' : 'Home',
        url: `https://brightears.onrender.com/${locale}`
      },
      {
        name: locale === 'th' ? 'เกี่ยวกับเรา' : 'About',
        url: `https://brightears.onrender.com/${locale}/about`
      }
    ]
  });

  const features = [
    {
      feature: t('features.matching.feature'),
      benefit: t('features.matching.benefit'),
    },
    {
      feature: t('features.preparation.feature'),
      benefit: t('features.preparation.benefit'),
    },
    {
      feature: t('features.management.feature'),
      benefit: t('features.management.benefit'),
    },
    {
      feature: t('features.oneContact.feature'),
      benefit: t('features.oneContact.benefit'),
    },
    {
      feature: t('features.transparent.feature'),
      benefit: t('features.transparent.benefit'),
    },
    {
      feature: t('features.ai.feature'),
      benefit: t('features.ai.benefit'),
    },
  ];

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-deep-teal py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 187, 228, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(164, 119, 100, 0.3) 0%, transparent 50%)'
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="font-inter text-xl text-white/90 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-dark-gray mb-8">
              {t('story.title')}
            </h2>

            <div className="space-y-6 font-inter text-lg text-dark-gray/80 leading-relaxed">
              <p>{t('story.p1')}</p>
              <p>{t('story.p2')}</p>
              <p>{t('story.p3')}</p>
            </div>
          </div>
        </section>

        {/* What You Get - Features & Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-off-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-dark-gray mb-4">
                {t('whatYouGet.title')}
              </h2>
              <p className="font-inter text-lg text-dark-gray/70">
                {t('whatYouGet.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-cyan/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-dark-gray mb-2">
                        {item.feature}
                      </h3>
                      <p className="font-inter text-dark-gray/70 text-sm">
                        {item.benefit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal to-deep-teal/90">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="font-inter text-lg text-white/80 mb-8">
              {t('cta.subtitle')}
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 bg-white text-deep-teal px-8 py-4 rounded-full hover:bg-off-white transition-all duration-300 font-inter font-semibold hover:scale-105 shadow-lg"
            >
              {t('cta.button')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
