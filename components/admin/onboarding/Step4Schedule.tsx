'use client';

import { useState } from 'react';
import { VenueData, DJAssignment, ScheduleEntry } from './OnboardingWizard';

interface Step4ScheduleProps {
  venue: VenueData;
  assignedDJs: DJAssignment[];
  schedule: ScheduleEntry[];
  onChange: (schedule: ScheduleEntry[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function Step4Schedule({
  venue,
  assignedDJs,
  schedule,
  onChange,
  onNext,
  onBack,
}: Step4ScheduleProps) {
  const [skipSchedule, setSkipSchedule] = useState(schedule.length === 0);

  // Get slots to display
  const slots = venue.hasMultipleSlots && venue.slots.length > 0
    ? venue.slots
    : [{ name: 'Main', startTime: venue.startTime, endTime: venue.endTime }];

  const getScheduleEntry = (dayOfWeek: number, slotIndex: number): string | null => {
    const entry = schedule.find(
      (s) => s.dayOfWeek === dayOfWeek && s.slotIndex === slotIndex
    );
    return entry?.djId || null;
  };

  const setScheduleEntry = (dayOfWeek: number, slotIndex: number, djId: string | null) => {
    const existingIndex = schedule.findIndex(
      (s) => s.dayOfWeek === dayOfWeek && s.slotIndex === slotIndex
    );

    let newSchedule = [...schedule];

    if (djId === null || djId === '') {
      // Remove entry
      if (existingIndex >= 0) {
        newSchedule = newSchedule.filter((_, i) => i !== existingIndex);
      }
    } else if (existingIndex >= 0) {
      // Update existing
      newSchedule[existingIndex] = { dayOfWeek, slotIndex, djId };
    } else {
      // Add new
      newSchedule.push({ dayOfWeek, slotIndex, djId });
    }

    onChange(newSchedule);
  };

  const handleSkipToggle = () => {
    if (!skipSchedule) {
      // Clearing the schedule when skipping
      onChange([]);
    }
    setSkipSchedule(!skipSchedule);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-white">Initial Schedule</h2>
        <p className="text-gray-400 mt-1">
          Set up a recurring weekly schedule for this venue. You can always modify it later.
        </p>
      </div>

      {/* Skip Schedule Option */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={skipSchedule}
          onChange={handleSkipToggle}
          className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-cyan focus:ring-brand-cyan/50"
        />
        <span className="text-white">Skip schedule setup for now</span>
      </label>

      {!skipSchedule && (
        <>
          {assignedDJs.length === 0 ? (
            <div className="bg-white/[0.02] rounded-lg p-6 text-center">
              <p className="text-gray-400">
                No DJs assigned yet. Go back to assign DJs before setting up a schedule.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-400 py-2 pr-4">
                      Day
                    </th>
                    {slots.map((slot, index) => (
                      <th
                        key={index}
                        className="text-left text-sm font-medium text-gray-400 py-2 px-2"
                      >
                        <div>{slot.name}</div>
                        <div className="text-xs text-gray-500 font-normal">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS_OF_WEEK.map((day) => (
                    <tr key={day.value} className="border-t border-white/5">
                      <td className="py-3 pr-4 text-white">{day.label}</td>
                      {slots.map((_, slotIndex) => (
                        <td key={slotIndex} className="py-3 px-2">
                          <select
                            value={getScheduleEntry(day.value, slotIndex) || ''}
                            onChange={(e) =>
                              setScheduleEntry(day.value, slotIndex, e.target.value || null)
                            }
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan/50"
                          >
                            <option value="" className="bg-deep-teal">
                              -- Select DJ --
                            </option>
                            {assignedDJs.map((dj) => (
                              <option
                                key={dj.djId}
                                value={dj.djId}
                                className="bg-deep-teal"
                              >
                                {dj.djName}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Schedule Summary */}
          {schedule.length > 0 && (
            <div className="text-sm text-gray-400">
              {schedule.length} slot{schedule.length !== 1 ? 's' : ''} configured
            </div>
          )}
        </>
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
          Next: Credentials
        </button>
      </div>
    </div>
  );
}
