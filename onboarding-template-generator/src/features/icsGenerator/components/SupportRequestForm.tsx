import React, { useState } from 'react';
import { IcsService } from '../../../services/icsService';
import FormField from '../../../components/FormField';

const SupportRequestForm: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [durationHours, setDurationHours] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hourOptions = Array.from({ length: 24 }, (_, i) => ('0' + i).slice(-2));
  const minuteOptions = ['00', '30'];
  const durationOptions = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

  const handleGenerate = async () => {
    setError(null);
    if (!customerName.trim()) {
      setError('Please enter a Customer Name.');
      return;
    }
    if (!trackingId.trim()) {
      setError('Please enter a Tracking ID.');
      return;
    }
    if (!startDate) {
      setError('Please select a Start Date.');
      return;
    }

    const startDateTimeString = `${startDate}T${startHour}:${startMinute}:00`;
    const startDateTime = new Date(startDateTimeString);

    if (isNaN(startDateTime.getTime())) {
      setError('Invalid start date/time constructed. Please check inputs.');
      return;
    }

    const durationMs = parseInt(durationHours, 10) * 60 * 60 * 1000;
    const endDateTime = new Date(startDateTime.getTime() + durationMs);

    setIsGenerating(true);
    try {
      await IcsService.generateSupportRequestIcs(
        customerName,
        trackingId,
        startDateTime,
        endDateTime
      );
      setCustomerName('');
      setTrackingId('');
      setStartDate('');
      setStartHour('09');
      setStartMinute('00');
      setDurationHours('1');
    } catch (err) {
      console.error('Error in SupportRequestForm:', err);
      setError('Failed to generate ICS file. See console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-200">
      <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">On-Call Duty Support Request</h3>
      <p className="mb-4 dark:text-gray-400">Generate an .ics file for a customer support entry.</p>

      <FormField
        label="Customer Name:"
        id="customerName"
        type="text"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />

      <FormField
        label="Tracking ID:"
        id="trackingId"
        type="text"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
        required
      />

      <div className="mb-4">
        <label htmlFor="supportStartDate" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Start Date/Time:
        </label>
        <div className="flex items-center">
          <input
            type="date"
            id="supportStartDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline mr-2"
          />
          <select
            id="supportStartHour"
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline mr-2"
            aria-label="Start Hour"
          >
            {hourOptions.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          <span className="dark:text-gray-300">:</span>
          <select
            id="supportStartMinute"
            value={startMinute}
            onChange={(e) => setStartMinute(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline ml-2"
            aria-label="Start Minute"
          >
            {minuteOptions.map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="supportDuration" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Duration:
        </label>
        <select
          id="supportDuration"
          value={durationHours}
          onChange={(e) => setDurationHours(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
        >
          {durationOptions.map((hour) => (
            <option key={hour} value={hour}>
              {hour} hour{parseInt(hour, 10) > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Support Request .ics'}
        </button>
      </div>
    </div>
  );
};

export default SupportRequestForm;
