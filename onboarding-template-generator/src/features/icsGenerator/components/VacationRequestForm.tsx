import React, { useState } from 'react';
import { IcsService } from '../../../services/icsService';
// import './IcsFormStyles.css'; // Shared styles

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
            // Clear fields on success
            setStartDate('');
            setEndDate('');
            setDescription('');
        } catch (err) {
            console.error("Error in VacationRequestForm:", err);
            setError('Failed to generate ICS file. See console for details.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="ics-form-container">
            <h3>Vacation Request</h3>
            <p>Generate an .ics file for your vacation time.</p>

            <div className="form-group">
                <label htmlFor="vacationStartDate">Start Date & Time:</label>
                <input
                    type="datetime-local"
                    id="vacationStartDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="vacationEndDate">End Date & Time:</label>
                <input
                    type="datetime-local"
                    id="vacationEndDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="vacationDescription">Description:</label>
                <input
                    type="text"
                    id="vacationDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Annual Leave"
                    required
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-actions">
                <button 
                  className="btn btn-primary"
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
