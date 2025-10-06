import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import StatCounter from '@/components/StatCounter';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'th' ? 'เกี่ยวกับเรา | Bright Ears' : 'About Us | Bright Ears',
    description: locale === 'th'
      ? 'เรื่องราวของ Bright Ears - แพลตฟอร์มการจองศิลปินที่ไร้ค่าธรรมเนียม'
      : 'The story of Bright Ears - Thailand\'s commission-free artist booking platform'
  };
}

export default function AboutPage() {
  const t = useTranslations('about');

  const stats = [
    { label: 'Verified Artists', value: 500 },
    { label: 'Events Delivered', value: 10000 },
    { label: 'Client Satisfaction', value: 99, suffix: '%' },
    { label: 'Support Hours', value: 24, suffix: '/7' }
  ];

  const values = [
    {
      title: t('values.transparency.title'),
      description: t('values.transparency.description'),
      icon: '🔍'
    },
    {
      title: t('values.artistEmpowerment.title'),
      description: t('values.artistEmpowerment.description'),
      icon: '🎨'
    },
    {
      title: t('values.customerSatisfaction.title'),
      description: t('values.customerSatisfaction.description'),
      icon: '❤️'
    },
    {
      title: t('values.thaiMarketFocus.title'),
      description: t('values.thaiMarketFocus.description'),
      icon: '🇹🇭'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* About Hero - Professional Split Design */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Left Side - Solid Deep Teal */}
          <div className="bg-deep-teal py-20 px-8 lg:px-12 flex items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <span className="text-2xl">✨</span>
                <span className="text-sm font-medium text-white">Our Story</span>
              </div>

              <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
                {t('title')}
              </h1>

              <p className="font-inter text-xl text-white/90 leading-relaxed">
                {t('subtitle')}
              </p>
            </div>
          </div>

          {/* Right Side - Soft Gradient with Mission */}
          <div
            className="py-20 px-8 lg:px-12 flex items-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 187, 228, 0.1) 0%, rgba(47, 99, 100, 0.05) 100%)',
            }}
          >
            {/* Subtle accent pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(0, 187, 228, 0.3) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}
            />

            <div className="relative z-10 max-w-xl">
              <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
                <h2 className="font-playfair text-3xl font-bold text-dark-gray mb-4">
                  {t('mission')}
                </h2>
                <p className="font-inter text-lg text-dark-gray/80 leading-relaxed">
                  {t('missionStatement')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-12 text-center">
              {t('story')}
            </h2>
            <div className="space-y-6 text-lg text-dark-gray/80 font-inter leading-relaxed">
              <p>{t('storyParagraph1')}</p>
              <p>{t('storyParagraph2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-off-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-12 text-center">
              {t('values')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-dark-gray mb-3">
                    {value.title}
                  </h3>
                  <p className="font-inter text-dark-gray/70 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-12 text-center">
              {t('platformStats')}
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StatCounter
                  key={index}
                  label={t(`stats.${stat.label.toLowerCase().replace(/\s/g, '')}`)}
                  value={stat.value}
                  suffix={stat.suffix}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-off-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-12 shadow-xl">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark-gray mb-6">
                {t('readyToConnect')}
              </h2>
              <p className="font-inter text-lg text-dark-gray/70 mb-8">
                Join our community of satisfied customers and talented artists
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-brand-cyan text-white px-8 py-4 rounded-full hover:bg-deep-teal transition-all duration-300 font-inter font-semibold hover:scale-105 hover:shadow-xl shadow-brand-cyan/30"
              >
                {t('contactCTA')}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
