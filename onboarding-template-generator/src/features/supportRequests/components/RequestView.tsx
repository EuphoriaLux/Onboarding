import React from 'react';
import { useSupportRequests } from '../hooks/useSupportRequests';
import { SupportRequest } from '../types'; // Import the type

interface RequestViewProps {
  // Props could be added later if needed
}

export const RequestView: React.FC<RequestViewProps> = () => {
  const { selectedRequest, isDetailLoading, detailError, selectedBlobName } = useSupportRequests();

  if (isDetailLoading) {
    return <p>Loading request details...</p>;
  }

  if (detailError) {
    return <p style={{ color: 'red' }}>Error loading details: {detailError.message}</p>;
  }

  if (!selectedRequest) {
    return <p>{selectedBlobName ? 'Select a request from the list to view details.' : ''}</p>; // Show message only if a blob was selected but details are null/not loaded yet
  }

  // Helper to format date string
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div>
      <h4>Request Details: {selectedRequest.id || selectedBlobName}</h4>
      <div style={{ border: '1px solid #eee', padding: '10px', marginTop: '10px' }}>
        <p><strong>Subject:</strong> {selectedRequest.subject || 'N/A'}</p>
        <p><strong>Status:</strong> {selectedRequest.status || 'N/A'}</p>
        <p><strong>Priority:</strong> {selectedRequest.priority || 'N/A'}</p>
        <p><strong>Created:</strong> {formatDate(selectedRequest.createdDate)}</p>
        <p><strong>Last Updated:</strong> {formatDate(selectedRequest.lastUpdated)}</p>
        <p><strong>Description:</strong></p>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', background: '#f9f9f9', padding: '5px', border: '1px solid #ddd' }}>
          {selectedRequest.description || 'No description provided.'}
        </pre>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};
