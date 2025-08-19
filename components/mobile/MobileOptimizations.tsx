'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Mobile-specific performance optimizations for Thai networks
export const MobilePerformanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const [networkSpeed, setNetworkSpeed] = useState<'fast' | 'slow' | 'unknown'>('unknown');

  useEffect(() => {
    // Detect network speed for Thai mobile networks
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      const effective = connection?.effectiveType;
      
      if (effective === '4g') {
        setNetworkSpeed('fast');
      } else if (effective === '3g' || effective === '2g' || effective === 'slow-2g') {
        setNetworkSpeed('slow');
      }
    }
  }, []);

  return (
    <div data-network-speed={networkSpeed}>
      {children}
    </div>
  );
};

// Optimized image component for Thai mobile networks
export const ThaiMobileImage = ({ 
  src, 
  alt, 
  priority = false,
  className = '',
  width,
  height,
  ...props 
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}) => {
  const [networkSpeed, setNetworkSpeed] = useState<'fast' | 'slow'>('fast');
  
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      const effective = connection?.effectiveType;
      setNetworkSpeed(effective === '4g' ? 'fast' : 'slow');
    }
  }, []);

  // Use lower quality for slow networks (common in Thailand)
  const qualityParams = networkSpeed === 'slow' ? '?q=60&w=800' : '?q=85&w=1200';
  const optimizedSrc = src.includes('cloudinary') ? `${src}${qualityParams}` : src;

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      {...props}
    />
  );
};

// Thai mobile-specific loading states
export const ThaiMobileLoader = ({ message = "กำลังโหลด..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="relative w-12 h-12 mb-4">
      <div className="absolute inset-0 border-4 border-brand-cyan/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-brand-cyan rounded-full animate-spin"></div>
    </div>
    <p className="text-dark-gray/70 text-sm font-medium">{message}</p>
    <p className="text-dark-gray/50 text-xs mt-1">กรุณารอสักครู่</p>
  </div>
);

// Progressive image loading for slow Thai networks
export const ProgressiveImage = ({ 
  lowQualitySrc, 
  highQualitySrc, 
  alt, 
  className = "" 
}: {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsLoaded(true);
    };
    img.src = highQualitySrc;
  }, [highQualitySrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={currentSrc}
        alt={alt}
        fill
        className={`object-cover transition-all duration-300 ${
          !isLoaded ? 'blur-sm scale-110' : 'blur-0 scale-100'
        }`}
      />
    </div>
  );
};