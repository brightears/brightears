'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface DJAvatarProps {
  src: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showHoverEffect?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-48 h-48 text-2xl',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-16 h-16',
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default function DJAvatar({
  src,
  name,
  size = 'md',
  className = '',
  showHoverEffect = false,
}: DJAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const showImage = src && !hasError;
  const initials = getInitials(name);

  return (
    <div
      className={`relative bg-deep-teal overflow-hidden flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {showImage ? (
        <>
          <Image
            src={src}
            alt={name}
            fill
            className={`object-cover object-top transition-all duration-300 ${
              showHoverEffect ? 'group-hover:scale-105' : ''
            } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
          />
          {/* Show fallback while loading */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-deep-teal">
              <div className="animate-pulse bg-gray-700 w-full h-full" />
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-deep-teal to-deep-teal/80">
          {initials ? (
            <span className="font-semibold text-gray-300">{initials}</span>
          ) : (
            <UserGroupIcon className={`${iconSizes[size]} text-gray-600`} />
          )}
        </div>
      )}
    </div>
  );
}
