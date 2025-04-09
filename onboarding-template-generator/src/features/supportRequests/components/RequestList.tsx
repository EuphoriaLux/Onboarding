import React from 'react';
import { useSupportRequests } from '../hooks/useSupportRequests';

interface RequestListProps {
  // Props could be added later if needed, e.g., for filtering
}

export const RequestList: React.FC<RequestListProps> = () => {
  const {
    requestsList,
    selectedBlobName,
    isListLoading,
    listError,
    selectRequest,
    fetchRequestsList, // Function to manually refresh the list
  } = useSupportRequests();

  const handleSelect = (blobName: string) => {
    selectRequest(blobName);
  };

  return (
    <div style={{ borderBottom: '1px solid #ccc', marginBottom: '10px', paddingBottom: '10px' }}>
      <h4>Support Requests</h4>
      <button onClick={fetchRequestsList} disabled={isListLoading} style={{ marginBottom: '10px' }}>
        {isListLoading ? 'Refreshing...' : 'Refresh List'}
      </button>

      {isListLoading && <p>Loading requests...</p>}
      {listError && <p style={{ color: 'red' }}>Error loading requests: {listError.message}</p>}

      {!isListLoading && !listError && (
        <>
          {requestsList.length === 0 ? (
            <p>No support requests found in the container.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
              {requestsList.map((request) => (
                <li
                  key={request.name}
                  onClick={() => handleSelect(request.name)}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedBlobName === request.name ? '#e0e0e0' : 'transparent',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {/* Display blob name - enhance later if metadata provides title/ID */}
                  {request.name}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
