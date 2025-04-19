import React, { useState, useEffect } from 'react';
import { IcsService } from '../../../services/icsService';
// import './IcsFormStyles.css'; // Shared styles

const SupportRequestForm: React.FC = () => {
    const [customerName, setCustomerName] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
    const [startHour, setStartHour] = useState('09'); // Default to 09
    const [startMinute, setStartMinute] = useState('00'); // Default to 00
    const [durationHours, setDurationHours] = useState('1'); // Default to 1 hour
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Options for dropdowns
    const hourOptions = Array.from({ length: 24 }, (_, i) => ('0' + i).slice(-2));
    const minuteOptions = ['00', '30'];
    const durationOptions = Array.from({ length: 8 }, (_, i) => (i + 1).toString()); // 1 to 8 hours

    const handleGenerate = async () => {
        setError(null);
        if (!customerName.trim()) { setError('Please enter a Customer Name.'); return; }
        if (!trackingId.trim()) { setError('Please enter a Tracking ID.'); return; }
        if (!startDate) { setError('Please select a Start Date.'); return; }

        // Construct the full start date/time
        const startDateTimeString = `${startDate}T${startHour}:${startMinute}:00`;
        const startDateTime = new Date(startDateTimeString);

        if (isNaN(startDateTime.getTime())) {
            setError('Invalid start date/time constructed. Please check inputs.');
            return;
        }

        // Calculate End Date
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
            // Clear fields on success
            setCustomerName('');
            setTrackingId('');
            setStartDate('');
            setStartHour('09');
            setStartMinute('00');
            setDurationHours('1');
        } catch (err) {
            console.error("Error in SupportRequestForm:", err);
            setError('Failed to generate ICS file. See console for details.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="ics-form-container">
            <h3>On-Call Duty Support Request</h3>
            <p>Generate an .ics file for a customer support entry.</p>

            <div className="form-group">
                <label htmlFor="customerName">Customer Name:</label>
                <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="trackingId">Tracking ID:</label>
                <input
                    type="text"
                    id="trackingId"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="supportStartDate">Start Date/Time:</label>
                <div className="datetime-group">
                    <input
                        type="date"
                        id="supportStartDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        style={{ width: 'auto', marginRight: '5px' }}
                    />
                    <select
                        id="supportStartHour"
                        value={startHour}
                        onChange={(e) => setStartHour(e.target.value)}
                        style={{ width: 'auto', marginRight: '5px', padding: '8px' }}
                        aria-label="Start Hour" // Added aria-label
                    >
                        {hourOptions.map(hour => <option key={hour} value={hour}>{hour}</option>)}
                    </select>
                    :
                    <select
                        id="supportStartMinute"
                        value={startMinute}
                        onChange={(e) => setStartMinute(e.target.value)}
                        style={{ width: 'auto', marginLeft: '5px', padding: '8px' }}
                        aria-label="Start Minute" // Added aria-label
                    >
                        {minuteOptions.map(min => <option key={min} value={min}>{min}</option>)}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="supportDuration">Duration:</label>
                <select
                    id="supportDuration"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    style={{ width: 'auto', padding: '8px' }}
                >
                    {durationOptions.map(hour => (
                        <option key={hour} value={hour}>
                            {hour} hour{parseInt(hour, 10) > 1 ? 's' : ''}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-actions">
                <button 
                  className="btn btn-primary"
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
