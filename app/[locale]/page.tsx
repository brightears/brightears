import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/navigation';
import Hero from '@/components/home/Hero';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <FeaturedArtists />
      </main>
      <Footer />
    </>
  );
}
