'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Mobile-optimized conversion elements for Thai users
export const ThaiMobileHero = () => {
  const t = useTranslations('hero');
  const [currentTip, setCurrentTip] = useState(0);
  
  const mobileTips = [
    "🎉 ไม่มีค่าคอมมิชชั่น - ราคาโปร่งใส",
    "📱 จองผ่าน LINE ได้ทันที",
    "⭐ ศิลปินที่ผ่านการตรวจสอบ",
    "🏆 ได้รับความไว้วางใจจากโรงแรมชั้นนำ"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % mobileTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-deep-teal via-earthy-brown to-deep-teal pt-20 pb-12 min-h-[85vh] flex items-center">
      {/* Mobile-optimized hero content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Attention-grabbing headline */}
        <div className="mb-6">
          <div className="inline-flex items-center bg-brand-cyan/10 border border-brand-cyan/20 rounded-full px-4 py-2 mb-4">
            <span className="text-brand-cyan text-sm font-medium">
              {mobileTips[currentTip]}
            </span>
          </div>
          
          <h1 className="text-thai-mobile-2xl text-pure-white font-bold mb-4 thai-mobile-text">
            {t('title')}
          </h1>
          
          <p className="text-thai-mobile-base text-pure-white/90 mb-8 max-w-md mx-auto thai-mobile-text">
            {t('subtitle')}
          </p>
        </div>

        {/* Mobile-first CTA buttons */}
        <div className="space-y-4 mb-8">
          {/* Primary CTA - Large and prominent */}
          <button className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-pure-white font-semibold py-4 px-6 rounded-xl text-thai-mobile-lg shadow-lg active:scale-95 transition-all min-h-[56px]">
            🔍 ค้นหาศิลปินตอนนี้
          </button>
          
          {/* Secondary CTAs in grid */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-pure-white/10 border border-pure-white/30 text-pure-white font-medium py-3 px-4 rounded-lg text-thai-mobile-sm hover:bg-pure-white/20 transition-all min-h-[48px]">
              📱 จองผ่าน LINE
            </button>
            <button className="bg-pure-white/10 border border-pure-white/30 text-pure-white font-medium py-3 px-4 rounded-lg text-thai-mobile-sm hover:bg-pure-white/20 transition-all min-h-[48px]">
              🏢 สำหรับธุรกิจ
            </button>
          </div>
        </div>

        {/* Social proof - Mobile optimized */}
        <div className="bg-pure-white/10 backdrop-blur-sm rounded-xl p-4 border border-pure-white/20">
          <p className="text-pure-white/80 text-thai-mobile-xs mb-3 thai-mobile-text">
            ได้รับความไว้วางใจจาก
          </p>
          <div className="grid grid-cols-3 gap-4 opacity-80">
            <div className="text-center">
              <div className="text-2xl mb-1">🏨</div>
              <p className="text-pure-white text-thai-mobile-xs">โรงแรม 5 ดาว</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🎪</div>
              <p className="text-pure-white text-thai-mobile-xs">งานเทศกาล</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🏢</div>
              <p className="text-pure-white text-thai-mobile-xs">บริษัทชั้นนำ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-optimized background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-48 h-48 bg-brand-cyan rounded-full mix-blend-overlay filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-soft-lavender rounded-full mix-blend-overlay filter blur-xl opacity-15 animate-pulse"></div>
      </div>
    </section>
  );
};

// Mobile-optimized quick action cards
export const ThaiMobileQuickActions = () => {
  const quickActions = [
    {
      icon: '🎵',
      title: 'ดีเจ',
      description: 'จองดีเจมืออาชีพ',
      count: '50+',
      color: 'bg-purple-500',
      href: '/artists?category=dj'
    },
    {
      icon: '🎤',
      title: 'วงดนตรี',
      description: 'วงดนตรีสดทุกแนว',
      count: '30+',
      color: 'bg-blue-500',
      href: '/artists?category=band'
    },
    {
      icon: '🎭',
      title: 'นักร้อง',
      description: 'นักร้องเสียงดี',
      count: '25+',
      color: 'bg-pink-500',
      href: '/artists?category=singer'
    },
    {
      icon: '🎪',
      title: 'พิธีกร',
      description: 'พิธีกรมืออาชีพ',
      count: '15+',
      color: 'bg-orange-500',
      href: '/artists?category=mc'
    }
  ];

  return (
    <section className="py-12 bg-off-white">
      <div className="container mx-auto px-4">
        <h2 className="text-thai-mobile-xl text-deep-teal font-bold text-center mb-8 thai-mobile-text">
          เลือกประเภทศิลปิน
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="bg-pure-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all active:scale-95 min-h-[120px] flex flex-col justify-center items-center text-center"
            >
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-3`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              <h3 className="text-thai-mobile-base font-semibold text-deep-teal mb-1 thai-mobile-text">
                {action.title}
              </h3>
              <p className="text-thai-mobile-xs text-dark-gray/70 mb-2 thai-mobile-text">
                {action.description}
              </p>
              <span className="text-brand-cyan text-thai-mobile-xs font-medium">
                {action.count} ศิลปิน
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

// Mobile conversion-optimized trust section
export const ThaiMobileTrustSection = () => {
  const trustPoints = [
    {
      icon: '✅',
      title: 'ไม่มีค่าคอมมิชชั่น',
      description: 'ราคาโปร่งใส ไม่มีค่าธรรมเนียมแอบแฝง'
    },
    {
      icon: '🛡️',
      title: 'ศิลปินที่ผ่านการตรวจสอบ',
      description: 'ยืนยันตัวตนและคุณภาพแล้ว'
    },
    {
      icon: '⚡',
      title: 'ตอบกลับเร็วใน LINE',
      description: 'ติดต่อศิลปินได้ทันทีผ่าน LINE'
    },
    {
      icon: '🏆',
      title: 'รับประกันคุณภาพ',
      description: 'ความพึงพอใจ 98% จากลูกค้า'
    }
  ];

  return (
    <section className="py-12 bg-pure-white">
      <div className="container mx-auto px-4">
        <h2 className="text-thai-mobile-xl text-deep-teal font-bold text-center mb-8 thai-mobile-text">
          ทำไมต้องเลือก Bright Ears?
        </h2>
        
        <div className="space-y-4">
          {trustPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-brand-cyan/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{point.icon}</span>
              </div>
              <div>
                <h3 className="text-thai-mobile-base font-semibold text-deep-teal mb-1 thai-mobile-text">
                  {point.title}
                </h3>
                <p className="text-thai-mobile-sm text-dark-gray/70 thai-mobile-text">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Floating mobile action button (sticky CTA)
export const ThaiMobileFloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden">
      <div className="bg-gradient-to-r from-brand-cyan to-brand-cyan/90 text-pure-white rounded-xl shadow-2xl p-4 border border-brand-cyan/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-thai-mobile-sm font-semibold thai-mobile-text">
              หาศิลปินที่เหมาะกับคุณ
            </p>
            <p className="text-thai-mobile-xs opacity-90 thai-mobile-text">
              เริ่มต้นเพียง ฿500/ชั่วโมง
            </p>
          </div>
          <button className="bg-pure-white text-brand-cyan font-semibold py-2 px-4 rounded-lg text-thai-mobile-sm min-h-[44px] min-w-[80px] hover:bg-gray-50 transition-colors">
            ค้นหา
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile-optimized testimonial carousel
export const ThaiMobileTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: 'คุณสมใจ',
      event: 'งานแต่งงาน',
      rating: 5,
      comment: 'ดีเจเก่งมาก บรรยากาศสนุกสุดๆ แขกทุกคนเต้นกันจนไม่อยากกลับบ้าน',
      avatar: '👰'
    },
    {
      name: 'โรงแรมแกรนด์',
      event: 'งานบริษัท',
      rating: 5,
      comment: 'วงดนตรีมืออาชีพ เล่นได้ทุกแนว ลูกค้าต่างชาติประทับใจมาก',
      avatar: '🏨'
    },
    {
      name: 'คุณมาลี',
      event: 'งานวันเกิด',
      rating: 5,
      comment: 'นักร้องเสียงดีมาก ร้องเพลงตามคำขอได้หมด บุคลิกดี ราคาดีด้วย',
      avatar: '🎂'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-thai-mobile-xl text-deep-teal font-bold text-center mb-8 thai-mobile-text">
          ลูกค้าพูดถึงเรา
        </h2>
        
        <div className="relative">
          {/* Testimonial card */}
          <div className="bg-pure-white rounded-xl p-6 shadow-lg border border-gray-100 mx-auto max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-brand-cyan/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">{currentTestimonial.avatar}</span>
              </div>
              <div>
                <h3 className="text-thai-mobile-base font-semibold text-deep-teal thai-mobile-text">
                  {currentTestimonial.name}
                </h3>
                <p className="text-thai-mobile-sm text-dark-gray/70 thai-mobile-text">
                  {currentTestimonial.event}
                </p>
              </div>
            </div>
            
            <div className="flex text-yellow-400 mb-3 text-lg">
              {'⭐'.repeat(currentTestimonial.rating)}
            </div>
            
            <p className="text-thai-mobile-base text-dark-gray thai-mobile-text leading-relaxed">
              "{currentTestimonial.comment}"
            </p>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-brand-cyan' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Mobile urgency and scarcity indicators
export const ThaiMobileUrgency = ({ artist }: { artist: any }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Simulate booking urgency
    const updateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-pure-white rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">🔥</span>
            <p className="text-thai-mobile-sm font-semibold thai-mobile-text">
              จองด่วน!
            </p>
          </div>
          <p className="text-thai-mobile-xs opacity-90 thai-mobile-text">
            ราคาพิเศษหมดในอีก {timeLeft} ชม.
          </p>
        </div>
        <div className="text-center">
          <p className="text-thai-mobile-lg font-bold">-15%</p>
          <p className="text-thai-mobile-xs">ส่วนลด</p>
        </div>
      </div>
    </div>
  );
};