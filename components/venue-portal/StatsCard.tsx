'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'cyan' | 'lavender' | 'green' | 'amber' | 'red';
}

const colorClasses = {
  cyan: 'from-brand-cyan/20 to-brand-cyan/5 border-brand-cyan/30',
  lavender: 'from-soft-lavender/20 to-soft-lavender/5 border-soft-lavender/30',
  green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  red: 'from-red-500/20 to-red-500/5 border-red-500/30',
};

const iconColorClasses = {
  cyan: 'text-brand-cyan',
  lavender: 'text-soft-lavender',
  green: 'text-emerald-500',
  amber: 'text-amber-500',
  red: 'text-red-500',
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'cyan',
}: StatsCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br backdrop-blur-sm p-6 ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm ${
                trend.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white/5 ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
