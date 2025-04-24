import React, { useState } from 'react';
import { IcsService } from '../../../services/icsService';

const SupportRequestForm: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const startDateTime = new Date(startDate);

    if (isNaN(startDateTime.getTime())) {
      setError('Invalid start date/time constructed. Please check inputs.');
      return;
    }

    setIsGenerating(true);
    try {
      await IcsService.generateSupportRequestIcs(
        customerName,
        trackingId,
        startDateTime,
        startDateTime
      );
      setCustomerName('');
      setTrackingId('');
      setStartDate('');
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

      <div className="mb-4">
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Customer Name:
        </label>
        <input
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tracking ID:
        </label>
        <input
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          id="trackingId"
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="supportStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Start Date/Time:
        </label>
        <input
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          type="datetime-local"
          id="supportStartDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

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
