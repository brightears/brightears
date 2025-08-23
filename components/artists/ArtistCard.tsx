"use client";

import React, { useState, useEffect } from 'react';
import { HeartIcon, PlayIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

interface ArtistCardProps {
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
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={`group relative card-modern overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] will-animate performance-optimized transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Premium Glass Morphism Overlay */}
      <div className="absolute inset-0 glass-strong opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Mouse Following Gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,187,228,0.1) 0%, transparent 70%)`
        }}
      />

      {/* Featured Badge with Enhanced Animation */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-20 animate-live-pulse">
          <div className="px-4 py-2 bg-gradient-to-r from-soft-lavender to-earthy-brown backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>Featured Artist</span>
            </div>
          </div>
        </div>
      )}

      {/* Image Container with Enhanced Effects */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-brand-cyan/20 via-deep-teal/20 to-earthy-brown/20">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-110 brightness-110' : 'scale-100'
          }`}
        />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/80 via-transparent to-transparent opacity-60" />
        <div className={`absolute inset-0 bg-gradient-to-br from-brand-cyan/20 via-transparent to-soft-lavender/20 transition-opacity duration-500 ${
          isHovered ? 'opacity-40' : 'opacity-0'
        }`} />

        {/* Premium Play Button with Ripple Effect */}
        <button
          onClick={onPlay}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-brand-cyan to-deep-teal backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-2xl hover:shadow-brand-cyan/50 touch-feedback ${
            isHovered ? 'opacity-100 scale-100 animate-live-pulse' : 'opacity-0 scale-75'
          }`}
        >
          <PlayIcon className="w-8 h-8 text-white ml-1" />
        </button>

        {/* Enhanced Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 z-20 w-12 h-12 glass rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-soft-lavender/30 touch-feedback"
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-6 h-6 text-soft-lavender animate-pulse" />
          ) : (
            <HeartIcon className="w-6 h-6 text-white group-hover:text-soft-lavender transition-colors" />
          )}
        </button>

        {/* Floating Particles */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-8 left-8 w-1 h-1 bg-white/60 rounded-full animate-float-fast" />
          <div className="absolute bottom-12 right-16 w-1.5 h-1.5 bg-brand-cyan/60 rounded-full animate-float-slow" />
          <div className="absolute top-16 right-8 w-1 h-1 bg-soft-lavender/60 rounded-full animate-float-medium" />
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="p-6 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-brand-cyan via-transparent to-soft-lavender" />
        </div>
        
        <div className="relative">
          {/* Artist Name with Enhanced Verification */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-playfair text-xl font-bold text-dark-gray truncate transition-colors duration-300 ${
              isHovered ? 'text-brand-cyan' : ''
            }`}>
              {name}
            </h3>
            {isVerified && (
              <CheckBadgeIcon className="w-5 h-5 text-brand-cyan flex-shrink-0 animate-pulse" />
            )}
          </div>

          {/* Genre with Badge Style */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-earthy-brown/10 to-brand-cyan/10 text-earthy-brown text-xs font-semibold rounded-full border border-earthy-brown/20">
              {genre}
            </span>
          </div>

          {/* Enhanced Stats Row */}
          <div className="flex items-center justify-between mb-6">
            {/* Followers with Icon Animation */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-deep-teal/5 border border-deep-teal/10">
              <UserGroupIcon className="w-4 h-4 text-deep-teal" />
              <span className="font-inter text-sm text-dark-gray/70 font-medium">{followers}</span>
            </div>

            {/* Enhanced Rating Display */}
            <div className="flex items-center gap-1 p-2 rounded-lg bg-earthy-brown/5 border border-earthy-brown/10">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 transition-all duration-200 ${
                    i < Math.floor(rating)
                      ? 'fill-earthy-brown text-earthy-brown scale-110'
                      : 'text-dark-gray/30 hover:scale-105'
                  }`}
                />
              ))}
              <span className="font-inter text-sm text-dark-gray/70 ml-2 font-bold">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Premium Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onFollow}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-cyan/30 hover:-translate-y-1 hover:scale-105 touch-feedback relative overflow-hidden"
            >
              <span className="relative z-10">Follow</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button
              onClick={onPlay}
              className="px-6 py-3 glass border border-deep-teal/20 text-deep-teal font-semibold rounded-xl transition-all duration-300 hover:bg-deep-teal hover:text-white hover:border-deep-teal hover:-translate-y-1 hover:scale-105 touch-feedback"
            >
              <PlayIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_60px_rgba(0,187,228,0.3),0_0_120px_rgba(0,187,228,0.1)]" />
      </div>
      
      {/* Premium Border Gradient */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-brand-cyan via-soft-lavender to-earthy-brown p-0.5">
          <div className="absolute inset-0.5 bg-white rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;