import React, { useState } from 'react';
import { IcsService } from '../../../services/icsService';

const VacationRequestForm: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description for the vacation request.');
      return;
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      setError('Invalid date format selected.');
      return;
    }

    if (endDateTime <= startDateTime) {
      setError('End date must be after start date.');
      return;
    }

    setIsGenerating(true);
    try {
      await IcsService.generateVacationRequestIcs(startDateTime, endDateTime, description);
      setStartDate('');
      setEndDate('');
      setDescription('');
    } catch (err) {
      console.error('Error in VacationRequestForm:', err);
      setError('Failed to generate ICS file. See console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-200">
      <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Vacation Request</h3>
      <p className="mb-4 dark:text-gray-400">Generate an .ics file for your vacation time.</p>

      <div className="mb-4">
<label htmlFor="vacationStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
  Start Date & Time:
</label>
        <input
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          id="vacationStartDate"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
<label htmlFor="vacationEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
  End Date & Time:
</label>
        <input
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          id="vacationEndDate"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
<label htmlFor="vacationDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
  Description:
</label>
        <input
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          id="vacationDescription"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Annual Leave"
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
          {isGenerating ? 'Generating...' : 'Generate Vacation Request .ics'}
        </button>
      </div>
    </div>
  );
};

export default VacationRequestForm;
