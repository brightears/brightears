'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';
import { DJAssignment } from './OnboardingWizard';

interface DJ {
  id: string;
  stageName: string;
  genres: string[];
  profileImage: string | null;
}

interface Step3AssignDJsProps {
  selectedDJs: DJAssignment[];
  onChange: (djs: DJAssignment[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3AssignDJs({
  selectedDJs,
  onChange,
  onNext,
  onBack,
}: Step3AssignDJsProps) {
  const [djs, setDJs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDJs();
  }, []);

  const fetchDJs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/djs-global?sortBy=name');
      if (!response.ok) {
        throw new Error('Failed to fetch DJs');
      }
      const data = await response.json();
      setDJs(
        data.djs.map((dj: DJ) => ({
          id: dj.id,
          stageName: dj.stageName,
          genres: dj.genres,
          profileImage: dj.profileImage,
        }))
      );
    } catch (error) {
      console.error('Error fetching DJs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDJ = (dj: DJ) => {
    const isSelected = selectedDJs.some((s) => s.djId === dj.id);

    if (isSelected) {
      onChange(selectedDJs.filter((s) => s.djId !== dj.id));
    } else {
      onChange([...selectedDJs, { djId: dj.id, djName: dj.stageName }]);
    }
  };

  const filteredDJs = djs.filter((dj) =>
    dj.stageName.toLowerCase().includes(search.toLowerCase()) ||
    dj.genres.some((g) => g.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-white">Assign DJs</h2>
        <p className="text-gray-400 mt-1">
          Select the DJs who will be available to play at this venue.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or genre..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
        />
      </div>

      {/* Selected Count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {selectedDJs.length} DJ{selectedDJs.length !== 1 ? 's' : ''} selected
        </span>
        {selectedDJs.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-brand-cyan hover:text-brand-cyan/80"
          >
            Clear all
          </button>
        )}
      </div>

      {/* DJ List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-cyan border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {filteredDJs.map((dj) => {
            const isSelected = selectedDJs.some((s) => s.djId === dj.id);

            return (
              <button
                key={dj.id}
                type="button"
                onClick={() => toggleDJ(dj)}
                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'bg-brand-cyan/20 border border-brand-cyan'
                    : 'bg-white/[0.02] border border-white/5 hover:border-white/20'
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-deep-teal">
                  {dj.profileImage ? (
                    <Image
                      src={dj.profileImage}
                      alt={dj.stageName}
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                      {dj.stageName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{dj.stageName}</div>
                  <div className="text-gray-500 text-sm truncate">
                    {dj.genres.slice(0, 2).join(', ')}
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-brand-cyan flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}

          {filteredDJs.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No DJs found matching your search.
            </div>
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
          onClick={onNext}
          className="px-6 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-white font-medium rounded-lg transition-colors"
        >
          Next: Schedule
        </button>
      </div>
    </div>
  );
}
