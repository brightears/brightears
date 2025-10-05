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
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </section>

        <section className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-16 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">{t('mission')}</h2>
          <p className="text-lg text-gray-700">{t('missionStatement')}</p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">{t('story')}</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <p>{t('storyParagraph1')}</p>
            <p>{t('storyParagraph2')}</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">{t('values')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">{t('platformStats')}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                label={t(`stats.${stat.label.toLowerCase().replace(/\s/g, '')}`)}
                value={stat.value}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">{t('readyToConnect')}</h2>
          <a
            href="/contact"
            className="bg-cyan-500 text-white px-8 py-4 rounded-full hover:bg-cyan-600 transition-colors text-lg"
          >
            {t('contactCTA')}
          </a>
        </section>
      </div>
    </div>
  );
}