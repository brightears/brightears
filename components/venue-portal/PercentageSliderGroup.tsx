'use client';

import { useEffect, useState } from 'react';

interface SliderItem {
  key: string;
  label: string;
  color: string;
}

interface PercentageSliderGroupProps {
  items: SliderItem[];
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
  disabled?: boolean;
}

export default function PercentageSliderGroup({
  items,
  values,
  onChange,
  disabled = false,
}: PercentageSliderGroupProps) {
  const [localValues, setLocalValues] = useState<Record<string, number>>(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const total = Object.values(localValues).reduce((sum, val) => sum + val, 0);
  const isValid = total === 100 || total === 0;

  const handleSliderChange = (key: string, newValue: number) => {
    const updated = { ...localValues, [key]: newValue };
    setLocalValues(updated);
    onChange(updated);
  };

  const handleDistributeEvenly = () => {
    const count = items.length;
    const baseValue = Math.floor(100 / count);
    const remainder = 100 % count;

    const evenValues: Record<string, number> = {};
    items.forEach((item, index) => {
      evenValues[item.key] = baseValue + (index < remainder ? 1 : 0);
    });

    setLocalValues(evenValues);
    onChange(evenValues);
  };

  const handleReset = () => {
    const resetValues: Record<string, number> = {};
    items.forEach((item) => {
      resetValues[item.key] = 0;
    });
    setLocalValues(resetValues);
    onChange(resetValues);
  };

  return (
    <div className="space-y-4">
      {/* Total indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              isValid ? 'text-emerald-400' : 'text-brand-cyan'
            }`}
          >
            Total: {total}%
          </span>
          {!isValid && (
            <span className="text-xs text-brand-cyan">(must equal 100%)</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDistributeEvenly}
            disabled={disabled}
            className="text-xs text-brand-cyan hover:text-brand-cyan/80 disabled:opacity-50"
          >
            Distribute evenly
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            className="text-xs text-gray-400 hover:text-gray-300 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Visual bar representation */}
      <div className="h-4 rounded-full overflow-hidden bg-white/10 flex">
        {items.map((item) => {
          const value = localValues[item.key] || 0;
          if (value === 0) return null;
          return (
            <div
              key={item.key}
              className="h-full transition-all duration-200"
              style={{
                width: `${value}%`,
                backgroundColor: item.color,
              }}
              title={`${item.label}: ${value}%`}
            />
          );
        })}
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </label>
              <span className="text-sm text-white font-medium w-12 text-right">
                {localValues[item.key] || 0}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localValues[item.key] || 0}
              onChange={(e) =>
                handleSliderChange(item.key, parseInt(e.target.value, 10))
              }
              disabled={disabled}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-brand-cyan
                         [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
