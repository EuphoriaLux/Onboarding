import { formatSlot } from '../features/emailBuilder/utils/dateSlotGenerator';

interface SlotGroup {
  [key: string]: Date[];
}

interface TimeBlock {
  morning: Date[];
  afternoon: Date[];
}

/**
 * Generates available meeting slots for the next N weeks
 */
export const generateMeetingSlots = (weeksAhead: number): Date[] => {
  const slots: Date[] = [];
  const now = new Date();
  
  // Generate slots for next N weeks (Tuesdays and Thursdays)
  for (let i = 0; i < weeksAhead * 7; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    
    // Only Tuesdays (2) and Thursdays (4)
    if ([2, 4].includes(date.getDay())) {
      // Morning slots (10:00, 10:30, 11:00, 11:30)
      for (let hour = 10; hour < 12; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slot = new Date(date);
          slot.setHours(hour, minute, 0, 0);
          slots.push(slot);
        }
      }
      
      // Afternoon slots (14:00, 14:30, 15:00, 15:30)
      for (let hour = 14; hour < 16; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slot = new Date(date);
          slot.setHours(hour, minute, 0, 0);
          slots.push(slot);
        }
      }
    }
  }
  
  return slots;
};

/**
 * Groups slots by day (YYYY-MM-DD)
 */
export const groupSlotsByDay = (slots: Date[]): SlotGroup => {
  const grouped: SlotGroup = {};
  slots.forEach(slot => {
    const dayKey = slot.toISOString().split('T')[0];
    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }
    grouped[dayKey].push(slot);
  });
  return grouped;
};

/**
 * Gets time blocks (morning/afternoon) for a day's slots
 */
export const getTimeBlocks = (slots: Date[]): TimeBlock => {
  return {
    morning: slots.filter(s => s.getHours() >= 10 && s.getHours() < 12),
    afternoon: slots.filter(s => s.getHours() >= 14 && s.getHours() < 16)
  };
};

/**
 * Checks if all slots in a block are selected
 */
export const isBlockSelected = (blockSlots: Date[], selectedSlots: Date[]): boolean => {
  return blockSlots.length > 0 && 
    blockSlots.every(bs => selectedSlots.some(ss => ss.getTime() === bs.getTime()));
};

/**
 * Formats a time slot for display
 */
export const formatTimeSlot = (slot: Date, language: string): string => {
  return formatSlot(slot, language);
};
