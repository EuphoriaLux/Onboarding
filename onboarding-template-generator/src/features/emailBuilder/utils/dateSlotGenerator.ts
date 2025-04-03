/**
 * Generates potential meeting slots based on specified criteria.
 * Only includes Tuesdays and Thursdays between 10:00-12:00 and 14:00-16:00 local time.
 * Generates slots for the next specified number of weeks, starting from tomorrow.
 *
 * @param weeksToGenerate Number of weeks ahead to generate slots for (default: 2).
 * @returns An array of Date objects representing the start time of each 30-minute slot.
 */
export const generateMeetingSlots = (weeksToGenerate: number = 2): Date[] => {
  const slots: Date[] = [];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start checking from tomorrow

  const daysToGenerate = weeksToGenerate * 7;
  const targetDays = [2, 4]; // Tuesday (2), Thursday (4)
  const targetHours = [
    // Morning slots (start times for 30 min duration)
    { hour: 10, minute: 0 },
    { hour: 10, minute: 30 },
    { hour: 11, minute: 0 },
    { hour: 11, minute: 30 },
    // Afternoon slots (start times for 30 min duration)
    { hour: 14, minute: 0 },
    { hour: 14, minute: 30 },
    { hour: 15, minute: 0 },
    { hour: 15, minute: 30 },
  ];

  for (let i = 0; i < daysToGenerate; i++) {
    const currentDate = new Date(tomorrow);
    currentDate.setDate(tomorrow.getDate() + i);
    const dayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    if (targetDays.includes(dayOfWeek)) {
      targetHours.forEach(time => {
        const slotDate = new Date(currentDate);
        slotDate.setHours(time.hour, time.minute, 0, 0); // Set hours and minutes, reset seconds/ms
        slots.push(slotDate);
      });
    }
  }

  return slots;
};

/**
 * Formats a Date object representing a slot start time into a user-friendly string.
 * Example: "Tuesday, April 8, 10:00 - 10:30"
 *
 * @param slotStartDate The Date object for the slot start time.
 * @param locale Optional locale string (e.g., 'en-US', 'de-DE'). Defaults to 'en-US'.
 * @returns A formatted string representation of the slot.
 */
export const formatSlot = (slotStartDate: Date, locale: string = 'en-US'): string => {
  const optionsDate: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format internally for easier calculation
  };

  const startDateString = slotStartDate.toLocaleDateString(locale, optionsDate);
  const startTimeString = slotStartDate.toLocaleTimeString(locale, optionsTime);

  // Calculate end time (30 minutes later)
  const endDate = new Date(slotStartDate.getTime() + 30 * 60000);
  const endTimeString = endDate.toLocaleTimeString(locale, optionsTime);

  return `${startDateString}, ${startTimeString} - ${endTimeString}`;
};
