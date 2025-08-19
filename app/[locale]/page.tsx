import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ActivityFeed from '@/components/home/ActivityFeed';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CorporateSection from '@/components/home/CorporateSection';
import MobileOptimizedHomepage from '@/components/mobile/MobileOptimizedHomepage';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations();

  return <MobileOptimizedHomepage locale={locale} />;
}
