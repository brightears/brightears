'use client';

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...'
}: SearchBarProps) {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          block w-full pl-10 pr-3 py-3
          bg-white/70 backdrop-blur-md
          border border-white/20
          rounded-full
          text-gray-900
          placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-cyan-500
          transition-all duration-300
        "
      />
    </div>
  );
}