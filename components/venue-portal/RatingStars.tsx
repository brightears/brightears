'use client';

import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface RatingStarsProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showValue?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export default function RatingStars({
  rating,
  onChange,
  size = 'md',
  readonly = false,
  showValue = false,
}: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const filled = star <= rating;
        const Icon = filled ? StarIconSolid : StarIcon;

        return readonly ? (
          <Icon
            key={star}
            className={`${sizeClasses[size]} ${
              filled ? 'text-brand-cyan' : 'text-gray-600'
            }`}
          />
        ) : (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`${sizeClasses[size]} ${
              filled ? 'text-brand-cyan' : 'text-gray-600'
            } hover:text-brand-cyan transition-colors`}
            aria-label={`Rate ${star} stars`}
          >
            <Icon className="w-full h-full" />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm text-gray-400">{rating}/5</span>
      )}
    </div>
  );
}
