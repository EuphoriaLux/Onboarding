import React, { useState } from 'react';
import { IcsService } from '../../../services/icsService';
import FormField from '../../../components/FormField';

const OnCallDutyForm: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
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
      await IcsService.generateOnCallDutyIcs(startDateTime, endDateTime);
      setStartDate('');
      setEndDate('');
    } catch (err) {
      console.error('Error in OnCallDutyForm:', err);
      setError('Failed to generate ICS file. See console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-200">
      <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">On-Call Duty Availability Request</h3>
      <p className="mb-4 dark:text-gray-400">Generate an .ics file to block your calendar for on-call duty.</p>

      <FormField
        label="Start Date & Time:"
        id="onCallStartDate"
        type="datetime-local"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <FormField
        label="End Date & Time:"
        id="onCallEndDate"
        type="datetime-local"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate .ics File'}
        </button>
      </div>
    </div>
  );
};

export default OnCallDutyForm;
