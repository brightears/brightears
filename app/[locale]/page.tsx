import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import CorporateSection from '@/components/home/CorporateSection';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <Categories />
        <CorporateSection />
      </main>
      <Footer />
    </>
  );
}
