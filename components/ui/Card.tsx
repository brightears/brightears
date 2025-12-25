"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = true
}) => {
  const baseClasses = "rounded-xl transition-all duration-300";
  
  const variants = {
    default: "card-modern",
    glass: "glass",
    elevated: "bg-white shadow-xl border border-gray-100",
    bordered: "bg-white border-2 border-brand-cyan/20"
  };
  
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };
  
  const hoverClass = hover ? "hover:scale-[1.02] hover:shadow-2xl" : "";
  
  return (
    <div className={`
      ${baseClasses}
      ${variants[variant]}
      ${paddings[padding]}
      ${hoverClass}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;