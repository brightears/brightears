'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import BMAsiaHero from '@/components/bmasia/BMAsiaHero';
import ProblemSolution from '@/components/bmasia/ProblemSolution';
import ServiceTiers from '@/components/bmasia/ServiceTiers';
import HowItWorks from '@/components/bmasia/HowItWorks';
import Industries from '@/components/bmasia/Industries';
import Benefits from '@/components/bmasia/Benefits';
import FAQ from '@/components/bmasia/FAQ';
import ContactCTA from '@/components/bmasia/ContactCTA';

interface BMAsiaContentProps {
  locale: string;
}

export default function BMAsiaContent({ locale }: BMAsiaContentProps) {
  const t = useTranslations('bmasia');
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
      <BMAsiaHero locale={locale} mousePosition={mousePosition} />
      <ProblemSolution />
      <ServiceTiers />
      <HowItWorks />
      <Industries />
      <Benefits />
      <div className="bg-gradient-to-b from-white to-off-white">
        <FAQ />
      </div>
      <ContactCTA locale={locale} mousePosition={mousePosition} />
    </div>
  );
}
