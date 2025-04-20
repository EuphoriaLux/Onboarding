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
    <div className="form-section meeting-slots-section">
      <div className="section-header-with-toggle">
        <h2>Propose Meeting Slots</h2>
        <div className="checkbox-container inline-label master-toggle">
          <input
            type="checkbox"
            id="includeMeetingSlots"
            checked={includeMeetingSlots}
            onChange={(e) => onIncludeToggle(e.target.checked)}
          />
          <label htmlFor="includeMeetingSlots">Include Meeting Proposal</label>
        </div>
      </div>
      <p className="section-description">
        Select potential 30-minute slots for the onboarding call (Tuesdays/Thursdays, 10-12 & 14-16).
      </p>

      <div className="slot-day-columns-container">
        {availableDays.length > 0 ? (
          availableDays.map((dayKey) => {
            const dayDate = new Date(dayKey + 'T00:00:00Z');
            const dayLabel = dayDate.toLocaleDateString(language, { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            });
            const { morning, afternoon } = getTimeBlocks(slotsByDay[dayKey]);

            return (
              <div key={dayKey} className="slot-day-column">
                <h4 className="slot-day-header">{dayLabel}</h4>
                
                <div className="slot-block-group">
                  {morning.length > 0 && (
                    <div className="checkbox-container slot-block-checkbox">
                      <input
                        type="checkbox"
                        id={`morning-${dayKey}`}
                        checked={isBlockSelected(morning, selectedSlots)}
                        onChange={(e) => {
                          const newSlots = e.target.checked
                            ? [...selectedSlots, ...morning.filter(s => !selectedSlots.some(sel => sel.getTime() === s.getTime()))]
                            : selectedSlots.filter(s => !morning.some(m => m.getTime() === s.getTime()));
                          onSlotsChange(newSlots.sort((a, b) => a.getTime() - b.getTime()));
                        }}
                        disabled={!includeMeetingSlots}
                      />
                      <label htmlFor={`morning-${dayKey}`}>Morning (10:00-12:00)</label>
                    </div>
                  )}
                  {afternoon.length > 0 && (
                    <div className="checkbox-container slot-block-checkbox">
                      <input
                        type="checkbox"
                        id={`afternoon-${dayKey}`}
                        checked={isBlockSelected(afternoon, selectedSlots)}
                        onChange={(e) => {
                          const newSlots = e.target.checked
                            ? [...selectedSlots, ...afternoon.filter(s => !selectedSlots.some(sel => sel.getTime() === s.getTime()))]
                            : selectedSlots.filter(s => !afternoon.some(m => m.getTime() === s.getTime()));
                          onSlotsChange(newSlots.sort((a, b) => a.getTime() - b.getTime()));
                        }}
                        disabled={!includeMeetingSlots}
                      />
                      <label htmlFor={`afternoon-${dayKey}`}>Afternoon (14:00-16:00)</label>
                    </div>
                  )}
                </div>

                {(morning.length > 0 || afternoon.length > 0) && (
                  <hr className="slot-divider" />
                )}

                <div className="slot-checkbox-group vertical">
                  {slotsByDay[dayKey].map((slot) => {
                    const slotId = `slot-${slot.toISOString()}`;
                    const isChecked = selectedSlots.some(s => s.getTime() === slot.getTime());
                    const timeLabel = formatTimeSlot(slot, language);

                    return (
                      <div key={slotId} className="checkbox-container slot-checkbox">
                        <input
                          type="checkbox"
                          id={slotId}
                          checked={isChecked}
                          onChange={(e) => {
                            const newSlots = e.target.checked
                              ? [...selectedSlots, slot]
                              : selectedSlots.filter(s => s.getTime() !== slot.getTime());
                            onSlotsChange(newSlots.sort((a, b) => a.getTime() - b.getTime()));
                          }}
                          disabled={!includeMeetingSlots}
                        />
                        <label htmlFor={slotId}>{timeLabel}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p>No available slots found in the coming weeks.</p>
        )}
      </div>
    </div>
  );
};

export default MeetingSlotSelector;
