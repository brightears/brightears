import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import FeaturedArtists from '@/components/home/FeaturedArtists';
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
      <FeaturedArtists locale={locale} />
      <Features />
      <Categories />
      <CorporateSection />
    </>
  );
}
