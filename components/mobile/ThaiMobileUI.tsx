'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Thai mobile-specific touch targets and UI patterns
export const ThaiMobileButton = ({ 
  children, 
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'line';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 active:scale-95 touch-manipulation";
  
  // Thai users prefer larger touch targets (minimum 44px)
  const sizeClasses = {
    sm: "px-4 py-2.5 text-sm min-h-[44px]",
    md: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[52px]",
    xl: "px-10 py-5 text-xl min-h-[56px]"
  };

  const variantClasses = {
    primary: "bg-brand-cyan text-pure-white hover:bg-brand-cyan/90 active:bg-brand-cyan/80 shadow-lg",
    secondary: "bg-earthy-brown text-pure-white hover:bg-earthy-brown/90 active:bg-earthy-brown/80 shadow-lg",
    outline: "border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-pure-white active:bg-brand-cyan/90",
    line: "bg-green-500 text-pure-white hover:bg-green-600 active:bg-green-700 shadow-lg" // LINE brand colors
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Thai mobile navigation optimized for one-handed use
export const ThaiBottomNav = () => {
  const t = useTranslations('nav');
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: '🏠', label: t('home'), href: '/' },
    { id: 'search', icon: '🔍', label: 'ค้นหา', href: '/artists' },
    { id: 'favorites', icon: '❤️', label: 'รายการโปรด', href: '/favorites' },
    { id: 'bookings', icon: '📅', label: 'การจอง', href: '/bookings' },
    { id: 'profile', icon: '👤', label: 'โปรไฟล์', href: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-pure-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center p-2 min-w-[60px] rounded-lg transition-all ${
              activeTab === item.id 
                ? 'text-brand-cyan bg-brand-cyan/10' 
                : 'text-dark-gray/60 hover:text-brand-cyan'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

// Thai mobile-specific search interface
export const ThaiMobileSearch = () => {
  const t = useTranslations('search');
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      {/* Quick search bar */}
      <div 
        className={`bg-pure-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 ${
          isExpanded ? 'rounded-b-none' : ''
        }`}
      >
        <div className="flex items-center p-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full pl-12 pr-4 py-3 text-base bg-gray-50 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-brand-cyan min-h-[48px]"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
          </div>
          
          {/* Voice search button (popular in Thailand) */}
          <button className="ml-3 p-3 bg-brand-cyan text-pure-white rounded-lg min-h-[48px] min-w-[48px]">
            🎤
          </button>
        </div>

        {/* Quick filters for Thai users */}
        {isExpanded && (
          <div className="border-t border-gray-100 p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {['ดีเจ', 'วงดนตรี', 'นักร้อง', 'งานแต่งงาน', 'งานบริษัท'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 bg-gray-100 text-dark-gray rounded-full text-sm hover:bg-brand-cyan hover:text-pure-white transition-colors min-h-[36px]"
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Location quick select */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-dark-gray">📍 สถานที่ยอดนิยม</p>
              <div className="flex flex-wrap gap-2">
                {['กรุงเทพฯ', 'สุขุมวิท', 'สีลม', 'รัชดา', 'บางนา'].map((location) => (
                  <button
                    key={location}
                    className="px-3 py-1.5 bg-earthy-brown/10 text-earthy-brown rounded-lg text-sm hover:bg-earthy-brown hover:text-pure-white transition-colors"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close expanded search */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-[-1]"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

// Thai mobile-specific artist card optimized for touch
export const ThaiMobileArtistCard = ({ artist }: { artist: any }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="bg-pure-white rounded-xl shadow-lg overflow-hidden mb-4 touch-manipulation">
      {/* Image with overlay controls */}
      <div className="relative h-48">
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover"
          loading="lazy"
          quality={85}
        />
        
        {/* Favorite button - larger for mobile */}
        <button
          className="absolute top-3 right-3 p-3 bg-pure-white/90 rounded-full shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <span className={`text-xl ${isFavorited ? '❤️' : '🤍'}`}>
            {isFavorited ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Quick book button overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <ThaiMobileButton variant="primary" size="md" className="w-full">
            📱 จองด่วนผ่าน LINE
          </ThaiMobileButton>
        </div>
      </div>

      {/* Content with touch-friendly spacing */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-deep-teal">{artist.name}</h3>
            <p className="text-dark-gray/70 text-sm">{artist.category} • 📍 {artist.location}</p>
          </div>
          <div className="text-right">
            <p className="text-earthy-brown font-bold">฿{artist.price}/ชม.</p>
            <p className="text-xs text-dark-gray/60">เริ่มต้น</p>
          </div>
        </div>

        {/* Rating with Thai format */}
        <div className="flex items-center space-x-2">
          <div className="flex text-yellow-400">
            {'⭐'.repeat(Math.floor(artist.rating))}
          </div>
          <span className="text-sm text-dark-gray/70">
            {artist.rating} ({artist.reviews} รีวิว)
          </span>
        </div>

        {/* Action buttons - Thai mobile optimized */}
        <div className="flex space-x-3 pt-2">
          <ThaiMobileButton variant="outline" size="md" className="flex-1">
            📞 ติดต่อ
          </ThaiMobileButton>
          <ThaiMobileButton variant="secondary" size="md" className="flex-1">
            👀 ดูโปรไฟล์
          </ThaiMobileButton>
        </div>
      </div>
    </div>
  );
};

// Thai mobile swipe gestures for image galleries
export const ThaiMobileGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="relative w-full h-64 flex-shrink-0">
              <Image
                src={image}
                alt={`Gallery ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
                quality={85}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thai mobile-friendly pagination dots */}
      <div className="flex justify-center space-x-2 mt-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              index === currentIndex ? 'bg-brand-cyan' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <span className="sr-only">Image {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Thai mobile swipe indicators */}
      <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center pointer-events-none">
        {currentIndex > 0 && (
          <div className="bg-pure-white/80 rounded-full p-2">
            <span className="text-brand-cyan">👈</span>
          </div>
        )}
      </div>
      <div className="absolute inset-y-0 right-0 w-16 flex items-center justify-center pointer-events-none">
        {currentIndex < images.length - 1 && (
          <div className="bg-pure-white/80 rounded-full p-2">
            <span className="text-brand-cyan">👉</span>
          </div>
        )}
      </div>
    </div>
  );
};