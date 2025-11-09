'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import DJMusicDesignHero from '@/components/dj-music-design/DJMusicDesignHero';
import ProblemSolution from '@/components/dj-music-design/ProblemSolution';
import ServiceCategories from '@/components/dj-music-design/ServiceCategories';
import HowItWorks from '@/components/dj-music-design/HowItWorks';
import Portfolio from '@/components/dj-music-design/Portfolio';
import PricingTiers from '@/components/dj-music-design/PricingTiers';
import Benefits from '@/components/dj-music-design/Benefits';
import Testimonials from '@/components/dj-music-design/Testimonials';
import ProcessTimeline from '@/components/dj-music-design/ProcessTimeline';
import FAQ from '@/components/dj-music-design/FAQ';
import ContactCTA from '@/components/dj-music-design/ContactCTA';

interface DJMusicDesignContentProps {
  locale: string;
}

export default function DJMusicDesignContent({ locale }: DJMusicDesignContentProps) {
  const t = useTranslations('djMusicDesign');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-off-white overflow-hidden">
      <DJMusicDesignHero locale={locale} mousePosition={mousePosition} />
      <ProblemSolution />
      <ServiceCategories />
      <HowItWorks />
      <Portfolio />
      <div className="bg-gradient-to-b from-off-white to-white">
        <PricingTiers />
      </div>
      <Benefits />
      <Testimonials />
      <ProcessTimeline />
      <div className="bg-gradient-to-b from-white to-off-white">
        <FAQ />
      </div>
      <ContactCTA locale={locale} mousePosition={mousePosition} />
    </div>
  );
}
