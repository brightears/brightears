"use client";

import React, { useState } from 'react';
import { HeartIcon, PlayIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import QuickInquiryModal from '@/components/booking/QuickInquiryModal';

interface ArtistCardProps {
  id: string;
  name: string;
  genre: string;
  image: string;
  followers: string;
  rating: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  onPlay?: () => void;
  onFollow?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  id,
  name,
  genre,
  image,
  followers,
  rating,
  isVerified = false,
  isFeatured = false,
  onPlay = () => {},
  onFollow = () => {},
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  return (
    <div
      className="group relative bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-soft-lavender/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
          Featured Artist
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-brand-cyan/20 to-deep-teal/20">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/80 via-transparent to-transparent opacity-60" />

        {/* Play Button Overlay */}
        <button
          onClick={onPlay}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-brand-cyan/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-brand-cyan hover:scale-110 shadow-xl ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <PlayIcon className="w-8 h-8 text-white ml-1" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110"
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-5 h-5 text-soft-lavender animate-pulse" />
          ) : (
            <HeartIcon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Gradient border effect - matching How It Works page style */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-deep-teal to-earthy-brown rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
      <div className="absolute inset-[1px] bg-gradient-to-r from-brand-cyan via-deep-teal to-earthy-brown rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Artist Name with Verification */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-playfair text-xl font-bold text-dark-gray truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-cyan group-hover:to-deep-teal group-hover:bg-clip-text transition-all duration-300">
            {name}
          </h3>
          {isVerified && (
            <CheckBadgeIcon className="w-5 h-5 text-brand-cyan flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
          )}
        </div>

        {/* Genre */}
        <p className="font-inter text-sm text-dark-gray/70 mb-4">{genre}</p>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Followers */}
          <div className="flex items-center gap-1.5">
            <UserGroupIcon className="w-4 h-4 text-dark-gray/50" />
            <span className="font-inter text-sm text-dark-gray/70">{followers}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 transition-colors duration-300 ${
                  i < Math.floor(rating)
                    ? 'fill-earthy-brown text-earthy-brown'
                    : 'text-dark-gray/30'
                }`}
              />
            ))}
            <span className="font-inter text-sm text-dark-gray/70 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowInquiryModal(true)}
            className="group/btn relative flex-1 px-4 py-2.5 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-cyan/30 hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-deep-teal to-brand-cyan opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <span className="relative">Get Quote</span>
          </button>
          <button
            onClick={onPlay}
            className="px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-deep-teal/20 text-deep-teal font-semibold rounded-xl transition-all duration-300 hover:bg-deep-teal hover:text-white hover:border-deep-teal hover:-translate-y-0.5 hover:shadow-lg hover:shadow-deep-teal/30"
          >
            <PlayIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Animated pulse ring on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-cyan/20 to-soft-lavender/20 opacity-0 group-hover:opacity-100 animate-ping"></div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(0,187,228,0.3)]" />
      </div>

      {/* Quick Inquiry Modal */}
      <QuickInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        artistId={id}
        artistName={name}
        artistImage={image}
      />
    </div>
  );
};

export default ArtistCard;