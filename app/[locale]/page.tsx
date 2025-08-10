import { useTranslations } from 'next-intl';
import { Link } from '@/components/navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import CorporateSection from '@/components/home/CorporateSection';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const t = useTranslations();

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
