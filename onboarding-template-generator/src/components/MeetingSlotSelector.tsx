import React from 'react';
import type { Language } from '../services/i18n';
import {
  groupSlotsByDay,
  getTimeBlocks,
  isBlockSelected,
  formatTimeSlot
} from '../utils/slotUtils';

interface MeetingSlotSelectorProps {
  availableSlots: Date[];
  selectedSlots: Date[];
  includeMeetingSlots: boolean;
  language: Language;
  onIncludeToggle: (isChecked: boolean) => void;
  onSlotsChange: (slots: Date[]) => void;
}

const MeetingSlotSelector: React.FC<MeetingSlotSelectorProps> = ({
  availableSlots,
  selectedSlots,
  includeMeetingSlots,
  language,
  onIncludeToggle,
  onSlotsChange
}) => {
  const slotsByDay = groupSlotsByDay(availableSlots);
  const availableDays = Object.keys(slotsByDay).sort();

  return (
    // Container with spacing
    <div className="space-y-4">
      {/* Header with toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Propose Meeting Slots</h2>
        <div className="flex items-center">
          {/* Checkbox styling */}
          <input
            type="checkbox"
            id="includeMeetingSlots"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
            checked={includeMeetingSlots}
            onChange={(e) => onIncludeToggle(e.target.checked)}
          />
          {/* Label styling */}
          <label htmlFor="includeMeetingSlots" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Include Meeting Proposal</label>
        </div>
      </div>
      {/* Description styling */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Select potential 30-minute slots for the onboarding call (Tuesdays/Thursdays, 10-12 & 14-16).
      </p>

      {/* Grid container for day columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableDays.length > 0 ? (
          availableDays.map((dayKey) => {
            const dayDate = new Date(dayKey + 'T00:00:00Z'); // Ensure UTC interpretation
            const dayLabel = dayDate.toLocaleDateString(language, { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric'
            });
            const { morning, afternoon } = getTimeBlocks(slotsByDay[dayKey]);

            return (
              // Day column styling
              <div key={dayKey} className="p-3 border border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
                {/* Day header styling */}
                <h4 className="text-sm font-medium text-center text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-600">{dayLabel}</h4>

                {/* Block group styling */}
                <div className="space-y-2">
                  {morning.length > 0 && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`morning-${dayKey}`}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                        checked={isBlockSelected(morning, selectedSlots)}
                        onChange={(e) => {
                          const newSlots = e.target.checked
                            ? [...selectedSlots, ...morning.filter(s => !selectedSlots.some(sel => sel.getTime() === s.getTime()))]
                            : selectedSlots.filter(s => !morning.some(m => m.getTime() === s.getTime()));
                          onSlotsChange(newSlots.sort((a, b) => a.getTime() - b.getTime()));
                        }}
                        disabled={!includeMeetingSlots}
                      />
                      <label htmlFor={`morning-${dayKey}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Morning (10-12)</label>
                    </div>
                  )}
                  {afternoon.length > 0 && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`afternoon-${dayKey}`}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                        checked={isBlockSelected(afternoon, selectedSlots)}
                        onChange={(e) => {
                          const newSlots = e.target.checked
                            ? [...selectedSlots, ...afternoon.filter(s => !selectedSlots.some(sel => sel.getTime() === s.getTime()))]
                            : selectedSlots.filter(s => !afternoon.some(m => m.getTime() === s.getTime()));
                          onSlotsChange(newSlots.sort((a, b) => a.getTime() - b.getTime()));
                        }}
                        disabled={!includeMeetingSlots}
                      />
                      <label htmlFor={`afternoon-${dayKey}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Afternoon (14-16)</label>
                    </div>
                  )}
                </div>

                {/* Divider styling */}
                {(morning.length > 0 || afternoon.length > 0) && (
                  <hr className="border-gray-200 dark:border-gray-600 my-2" />
                )}

                {/* Individual slot checkboxes */}
                <div className="space-y-1">
                  {slotsByDay[dayKey].map((slot) => {
                    const slotId = `slot-${slot.toISOString()}`;
                    const isChecked = selectedSlots.some(s => s.getTime() === slot.getTime());
                    const timeLabel = formatTimeSlot(slot, language);

                    return (
                      <div key={slotId} className="flex items-center">
                        <input
                          type="checkbox"
                          id={slotId}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                          checked={isChecked}
                          onChange={(e) => {
                            const newSlots = e.target.checked
                              ? [...selectedSlots, slot]
                              : selectedSlots.filter(s => s.getTime() !== slot.getTime());
                            onSlotsChange(newSlots.sort((a, b) => a.getTime() - b.getTime()));
                          }}
                          disabled={!includeMeetingSlots}
                        />
                        <label htmlFor={slotId} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{timeLabel}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full text-center">No available slots found in the coming weeks.</p>
        )}
      </div>
    </div>
  );
};

export default MeetingSlotSelector;
