'use client';

import React from 'react';
import { StarIcon, FireIcon, BoltIcon, ClockIcon } from '@heroicons/react/24/solid';

export type PopularityType = 'trending' | 'popular' | 'highly-rated' | 'almost-booked';

interface PopularityIndicatorProps {
  type: PopularityType;
  metric?: string | number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PopularityIndicator: React.FC<PopularityIndicatorProps> = ({
  type,
  metric,
  animated = true,
  size = 'md',
  className = ''
}) => {
  const configs = {
    trending: {
      icon: FireIcon,
      label: 'Trending',
      emoji: '🔥',
      color: 'bg-orange-500/15 border-orange-500/40 text-orange-600',
      iconColor: 'text-orange-500',
      tooltip: 'Most booked this week'
    },
    popular: {
      icon: StarIcon,
      label: 'Popular Choice',
      emoji: '⭐',
      color: 'bg-brand-cyan/15 border-brand-cyan/40 text-brand-cyan',
      iconColor: 'text-brand-cyan',
      tooltip: 'High booking rate'
    },
    'highly-rated': {
      icon: StarIcon,
      label: metric ? `${metric} ★` : '4.9 ★',
      emoji: '⭐',
      color: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-700',
      iconColor: 'text-yellow-500',
      tooltip: 'Highly rated by customers'
    },
    'almost-booked': {
      icon: BoltIcon,
      label: metric ? `Only ${metric} left` : 'Almost Booked',
      emoji: '⚡',
      color: 'bg-red-500/15 border-red-500/40 text-red-600',
      iconColor: 'text-red-500',
      tooltip: 'Limited availability this month'
    }
  };

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5 text-sm gap-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2 text-base gap-2',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const config = configs[type];
  const Icon = config.icon;
  const sizeClass = sizeClasses[size];

  return (
    <div className={`relative inline-flex group ${className}`}>
      {/* Badge */}
      <div
        className={`
          inline-flex items-center rounded-full border font-inter font-semibold
          backdrop-blur-sm transition-all duration-300
          ${config.color}
          ${sizeClass.container}
          ${animated ? 'animate-live-pulse' : ''}
        `}
        role="status"
        aria-label={`${config.label}: ${config.tooltip}`}
        title={config.tooltip}
      >
        {/* Icon with animation */}
        <Icon
          className={`${sizeClass.icon} ${config.iconColor} ${animated ? 'animate-pulse' : ''}`}
          aria-hidden="true"
        />

        {/* Label */}
        <span className={`font-bold ${sizeClass.text}`}>
          {config.label}
        </span>
      </div>

      {/* Optional tooltip on hover */}
      <div
        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          pointer-events-none opacity-0
          group-hover:opacity-100
          transition-opacity duration-300 z-50
        "
        role="tooltip"
      >
        <div className="bg-dark-gray/95 backdrop-blur-md rounded-lg shadow-xl px-3 py-2 whitespace-nowrap">
          <p className="font-inter text-xs text-white">
            {config.tooltip}
          </p>
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-dark-gray/95"></div>
        </div>
      </div>
    </div>
  );
};

export default PopularityIndicator;
