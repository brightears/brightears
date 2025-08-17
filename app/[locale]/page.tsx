import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import CorporateSection from '@/components/home/CorporateSection';

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <CorporateSection />
    </>
  );
}
