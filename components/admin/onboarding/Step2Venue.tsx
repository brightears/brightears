'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { VenueData, VenueSlot } from './OnboardingWizard';

interface Step2VenueProps {
  data: VenueData;
  onChange: (data: VenueData) => void;
  onNext: () => void;
  onBack: () => void;
}

const VENUE_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bar', label: 'Bar' },
  { value: 'club', label: 'Club / Nightclub' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'lounge', label: 'Lounge' },
  { value: 'rooftop', label: 'Rooftop' },
  { value: 'beachclub', label: 'Beach Club' },
  { value: 'event', label: 'Event Space' },
];

export default function Step2Venue({ data, onChange, onNext, onBack }: Step2VenueProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (name === 'hasMultipleSlots') {
      onChange({
        ...data,
        hasMultipleSlots: newValue as boolean,
        slots: newValue
          ? [
              { name: 'Early', startTime: data.startTime, endTime: '21:00' },
              { name: 'Late', startTime: '21:00', endTime: data.endTime },
            ]
          : [],
      });
    } else {
      onChange({ ...data, [name]: newValue });
    }

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSlotChange = (
    index: number,
    field: keyof VenueSlot,
    value: string
  ) => {
    const newSlots = [...data.slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    onChange({ ...data, slots: newSlots });
  };

  const addSlot = () => {
    onChange({
      ...data,
      slots: [
        ...data.slots,
        { name: `Slot ${data.slots.length + 1}`, startTime: '21:00', endTime: '02:00' },
      ],
    });
  };

  const removeSlot = (index: number) => {
    onChange({
      ...data,
      slots: data.slots.filter((_, i) => i !== index),
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.venueName.trim()) {
      newErrors.venueName = 'Venue name is required';
    }
    if (!data.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!data.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (data.hasMultipleSlots && data.slots.length === 0) {
      newErrors.slots = 'At least one slot is required when using multiple slots';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-white">Venue Details</h2>
        <p className="text-gray-400 mt-1">
          Configure the venue and its operating hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Venue Name *</label>
          <input
            type="text"
            name="venueName"
            value={data.venueName}
            onChange={handleChange}
            placeholder="e.g., NOBU"
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
              errors.venueName ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.venueName && (
            <p className="text-red-400 text-sm mt-1">{errors.venueName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Venue Type</label>
          <select
            name="venueType"
            value={data.venueType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
          >
            {VENUE_TYPES.map((type) => (
              <option key={type.value} value={type.value} className="bg-deep-teal">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Opening Time *</label>
          <input
            type="time"
            name="startTime"
            value={data.startTime}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
              errors.startTime ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.startTime && (
            <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Closing Time *</label>
          <input
            type="time"
            name="endTime"
            value={data.endTime}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50 ${
              errors.endTime ? 'border-red-500' : 'border-white/10'
            }`}
          />
          {errors.endTime && (
            <p className="text-red-400 text-sm mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* Multiple Slots Toggle */}
      <div className="border-t border-white/10 pt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="hasMultipleSlots"
            checked={data.hasMultipleSlots}
            onChange={handleChange}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-cyan focus:ring-brand-cyan/50"
          />
          <span className="text-white">This venue has multiple DJ slots per night</span>
        </label>
        <p className="text-gray-500 text-sm mt-1 ml-8">
          e.g., Early set (18:00-21:00) and Late set (21:00-02:00)
        </p>
      </div>

      {/* Slots Configuration */}
      {data.hasMultipleSlots && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">DJ Slots</h3>
            <button
              type="button"
              onClick={addSlot}
              className="flex items-center gap-1 text-brand-cyan hover:text-brand-cyan/80 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Slot
            </button>
          </div>

          {data.slots.map((slot, index) => (
            <div
              key={index}
              className="flex items-end gap-4 p-4 bg-white/[0.02] rounded-lg"
            >
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Slot Name</label>
                <input
                  type="text"
                  value={slot.name}
                  onChange={(e) => handleSlotChange(index, 'name', e.target.value)}
                  placeholder="e.g., Early"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                />
              </div>

              <div className="w-32">
                <label className="block text-sm text-gray-500 mb-1">Start</label>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                />
              </div>

              <div className="w-32">
                <label className="block text-sm text-gray-500 mb-1">End</label>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                />
              </div>

              {data.slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          {errors.slots && (
            <p className="text-red-400 text-sm">{errors.slots}</p>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-white font-medium rounded-lg transition-colors"
        >
          Next: Assign DJs
        </button>
      </div>
    </div>
  );
}
