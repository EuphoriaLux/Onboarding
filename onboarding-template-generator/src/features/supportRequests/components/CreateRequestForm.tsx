import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { uploadRequest } from '../services/blobStorageService';
import { STORAGE_SCOPES } from '../services/authService'; // Import storage scopes
import { SupportRequest } from '../types';

interface CreateRequestFormProps {
  onTicketCreated: (blobName: string) => void; // Callback after successful creation
}

export const CreateRequestForm: React.FC<CreateRequestFormProps> = ({ onTicketCreated }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth(); // Use the hook to get token function

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const accessToken = await getAccessToken(STORAGE_SCOPES); // Get token with storage scope
      if (!accessToken) {
        throw new Error('Authentication token not available. Please ensure you are logged in.');
      }

      const newRequest: Partial<SupportRequest> = { // Use Partial as ID and dates are set later/by service
        subject,
        description,
        priority,
        status: 'Open', // Use 'Open' as the default status
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        // ID will be generated by uploadRequest if not provided
      };

      const blobName = await uploadRequest(newRequest as SupportRequest, accessToken);

      // Reset form and call callback
      setSubject('');
      setDescription('');
      setPriority('Medium');
      setIsSubmitting(false);
      onTicketCreated(blobName); // Notify parent component

    } catch (err: any) {
      console.error("Error creating ticket:", err);
      setError(err.message || 'Failed to create ticket.');
      setIsSubmitting(false);
    }
  }, [subject, description, priority, getAccessToken, onTicketCreated]);

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
      <h4>Create New Support Ticket</h4>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="subject" style={{ display: 'block', marginBottom: '5px' }}>Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="priority" style={{ display: 'block', marginBottom: '5px' }}>Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
};
