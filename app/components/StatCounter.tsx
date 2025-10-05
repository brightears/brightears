'use client';

import React, { useState, useEffect } from 'react';

interface StatCounterProps {
  label: string;
  value: number;
  suffix?: string;
}

export default function StatCounter({ label, value, suffix = '' }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500; // Total animation duration in ms
    const steps = 50; // Number of steps in animation
    const increment = value / steps;

    let currentValue = 0;
    const timer = setInterval(() => {
      currentValue += increment;
      setDisplayValue(Math.min(currentValue, value));

      if (currentValue >= value) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className="
        bg-white/70 backdrop-blur-md
        border border-white/20
        rounded-xl
        p-6
        text-center
        transition-all
        hover:shadow-xl
        hover:scale-105
      "
    >
      <div className="text-4xl font-bold text-cyan-500 mb-2">
        {Math.round(displayValue)}{suffix}
      </div>
      <div className="text-sm text-gray-600 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}