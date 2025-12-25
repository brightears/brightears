"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  StarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  TicketIcon,
  ExclamationTriangleIcon,
  FolderOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export interface EmptyStateProps {
  variant?: 'search' | 'bookings' | 'reviews' | 'favorites' | 'messages' | 'events' | 'warning' | 'generic' | 'artists' | 'custom';
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showGlassEffect?: boolean;
}

/**
 * EmptyState Component
 *
 * A reusable component for displaying empty states throughout the platform.
 * Includes predefined variants for common use cases and full customization options.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   variant="search"
 *   title="No artists found"
 *   description="Try adjusting your filters"
 *   actionLabel="Clear Filters"
 *   onAction={() => clearFilters()}
 * />
 * ```
 */
export default function EmptyState({
  variant = 'generic',
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className = '',
  size = 'md',
  showGlassEffect = true,
}: EmptyStateProps) {

  // Get default icon based on variant
  const getDefaultIcon = (): ReactNode => {
    const iconClass = size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';
    const iconColor = 'text-brand-cyan';

    switch (variant) {
      case 'search':
        return <MagnifyingGlassIcon className={`${iconClass} ${iconColor}`} />;
      case 'bookings':
        return <CalendarIcon className={`${iconClass} ${iconColor}`} />;
      case 'reviews':
        return <StarIcon className={`${iconClass} ${iconColor}`} />;
      case 'favorites':
        return <HeartIcon className={`${iconClass} ${iconColor}`} />;
      case 'messages':
        return <ChatBubbleLeftIcon className={`${iconClass} ${iconColor}`} />;
      case 'events':
        return <TicketIcon className={`${iconClass} ${iconColor}`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-earthy-brown`} />;
      case 'artists':
        return <UserGroupIcon className={`${iconClass} ${iconColor}`} />;
      case 'generic':
      default:
        return <FolderOpenIcon className={`${iconClass} ${iconColor}`} />;
    }
  };

  // Size-based styling
  const sizeClasses = {
    sm: {
      container: 'py-8 px-6',
      title: 'text-xl',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm',
    },
    md: {
      container: 'py-12 px-8',
      title: 'text-2xl sm:text-3xl',
      description: 'text-base sm:text-lg',
      button: 'px-6 py-3 text-base',
    },
    lg: {
      container: 'py-16 px-12',
      title: 'text-3xl sm:text-4xl',
      description: 'text-lg sm:text-xl',
      button: 'px-8 py-4 text-lg',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center ${sizes.container} ${className}`}>
      {/* Card Container */}
      <div
        className={`
          ${showGlassEffect ? 'bg-white/70 backdrop-blur-md border border-white/20 shadow-lg' : 'bg-white border border-gray-200 shadow-sm'}
          rounded-3xl max-w-2xl text-center transition-all duration-300 hover:shadow-xl
          ${sizes.container}
        `}
      >

        {/* Icon */}
        <div className="mb-6 flex justify-center animate-float-slow">
          <div className="relative">
            {icon || getDefaultIcon()}
            {/* Subtle pulse effect background */}
            <div className="absolute inset-0 bg-brand-cyan/10 rounded-full blur-xl animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-playfair ${sizes.title} font-bold text-dark-gray mb-4`}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className={`font-inter ${sizes.description} text-dark-gray/70 mb-8 max-w-md mx-auto`}>
            {description}
          </p>
        )}

        {/* Action Buttons */}
        {(actionLabel && (actionHref || onAction)) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary Action */}
            {actionHref ? (
              <Link
                href={actionHref}
                className={`
                  group inline-flex items-center justify-center gap-2
                  bg-brand-cyan text-white ${sizes.button} rounded-full
                  font-inter font-semibold
                  transition-all duration-300
                  hover:bg-deep-teal hover:scale-105 hover:shadow-xl
                  shadow-brand-cyan/30 transform
                `}
              >
                {actionLabel}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : onAction ? (
              <button
                onClick={onAction}
                className={`
                  group inline-flex items-center justify-center gap-2
                  bg-brand-cyan text-white ${sizes.button} rounded-full
                  font-inter font-semibold
                  transition-all duration-300
                  hover:bg-deep-teal hover:scale-105 hover:shadow-xl
                  shadow-brand-cyan/30 transform
                `}
              >
                {actionLabel}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            ) : null}

            {/* Secondary Action */}
            {(secondaryActionLabel && (secondaryActionHref || onSecondaryAction)) && (
              secondaryActionHref ? (
                <Link
                  href={secondaryActionHref}
                  className={`
                    group inline-flex items-center justify-center gap-2
                    bg-white/50 backdrop-blur-sm text-dark-gray
                    border border-gray-300 ${sizes.button} rounded-full
                    font-inter font-semibold
                    transition-all duration-300
                    hover:bg-white hover:border-brand-cyan hover:scale-105
                    transform
                  `}
                >
                  {secondaryActionLabel}
                </Link>
              ) : onSecondaryAction ? (
                <button
                  onClick={onSecondaryAction}
                  className={`
                    group inline-flex items-center justify-center gap-2
                    bg-white/50 backdrop-blur-sm text-dark-gray
                    border border-gray-300 ${sizes.button} rounded-full
                    font-inter font-semibold
                    transition-all duration-300
                    hover:bg-white hover:border-brand-cyan hover:scale-105
                    transform
                  `}
                >
                  {secondaryActionLabel}
                </button>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Pre-configured empty state variants for common use cases
export const EmptyStateVariants = {
  NoSearchResults: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      variant="search"
      title="No artists found matching your search"
      description="Try adjusting your filters or search terms to find the perfect entertainer."
      actionLabel="Clear Filters"
      secondaryActionLabel="Browse All Artists"
      secondaryActionHref="/artists"
      {...props}
    />
  ),

  NoBookings: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      variant="bookings"
      title="You haven't booked any entertainment yet"
      description="Browse our talented artists and book your first performance to get started."
      actionLabel="Browse Artists"
      actionHref="/artists"
      {...props}
    />
  ),

  NoReviews: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      variant="reviews"
      title="No reviews yet"
      description="Be the first to share your experience and help others make informed decisions."
      actionLabel="Leave a Review"
      {...props}
    />
  ),

  NoFavorites: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      variant="favorites"
      title="You haven't saved any favorites yet"
      description="Browse artists and save your favorites to easily find them later."
      actionLabel="Discover Artists"
      actionHref="/artists"
      {...props}
    />
  ),

  NoMessages: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      variant="messages"
      title="Your inbox is empty"
      description="Start a conversation with artists to discuss your event needs and get quotes."
      actionLabel="Browse Artists"
      actionHref="/artists"
      {...props}
    />
  ),

  NoEvents: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      variant="events"
      title="No upcoming events"
      description="Book entertainment for your next event and create memorable experiences."
      actionLabel="Book Entertainment"
      actionHref="/artists"
      {...props}
    />
  ),

  NoArtistsFound: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      variant="artists"
      title="No artists available in this category"
      description="Check back soon or explore other entertainment categories."
      actionLabel="View All Categories"
      actionHref="/artists"
      {...props}
    />
  ),

  GenericError: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      variant="warning"
      title="Something went wrong"
      description="We're having trouble loading this content. Please try again."
      actionLabel="Retry"
      {...props}
    />
  ),
};
