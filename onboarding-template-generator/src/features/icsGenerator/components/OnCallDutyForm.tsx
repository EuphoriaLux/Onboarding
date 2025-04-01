import React, { useState } from 'react';
import { IcsService } from '../../../services/icsService';
// Consider adding a shared CSS file for ICS forms if styles repeat
// import './IcsFormStyles.css';

const OnCallDutyForm: React.FC = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setError(null); // Clear previous errors
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
            // Optionally clear fields or show success message here
            setStartDate('');
            setEndDate('');
        } catch (err) {
            console.error("Error in OnCallDutyForm:", err);
            setError('Failed to generate ICS file. See console for details.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="ics-form-container">
            <h3>On-Call Duty Availability Request</h3>
            <p>Generate an .ics file to block your calendar for on-call duty.</p>

            <div className="form-group">
                <label htmlFor="onCallStartDate">Start Date & Time:</label>
                <input
                    type="datetime-local"
                    id="onCallStartDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="onCallEndDate">End Date & Time:</label>
                <input
                    type="datetime-local"
                    id="onCallEndDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-actions">
                <button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate .ics File'}
                </button>
            </div>
        </div>
    );
};

export default OnCallDutyForm;
