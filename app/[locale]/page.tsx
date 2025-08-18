import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ActivityFeed from '@/components/home/ActivityFeed';
import CorporateSection from '@/components/home/CorporateSection';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <>
      <Hero />
      <div className="py-16 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - 2/3 width */}
            <div className="lg:col-span-2">
              <FeaturedArtists locale={locale} />
            </div>
            
            {/* Activity feed - 1/3 width */}
            <div className="lg:col-span-1">
              <ActivityFeed 
                showStats={true}
                autoRefresh={true}
                refreshInterval={30}
                className="sticky top-6"
              />
            </div>
          </div>
        </div>
      </div>
      <Features />
      <Categories />
      <CorporateSection />
    </>
  );
}
