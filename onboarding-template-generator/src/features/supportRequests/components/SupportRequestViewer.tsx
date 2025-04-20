import React, { useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSupportRequests } from '../hooks/useSupportRequests';
import './SupportRequestViewer.css';
import { RequestList } from './RequestList';
import { RequestView } from './RequestView';
import { CreateRequestForm } from './CreateRequestForm'; // Import the new form

// Wrap the feature components in a context provider if state needs deep sharing,
// but for now, hooks might be sufficient if components are direct children.
// If needed:
// import { SupportRequestsProvider } from '../contexts/SupportRequestsContext';

export const SupportRequestViewer: React.FC = () => {
  // Instantiate hooks here so child components share the same instance context
  // Note: This simple structure works if these components are rendered directly.
  // If hooks were used deeper down without a Provider, they'd get separate state.
  // For robustness, especially if the structure grows, using React Context is better.
  // Let's proceed without Context for now, assuming this structure is maintained.
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // We need useSupportRequests here if we want RequestList/View to share state
  // without prop drilling or context. But the hooks themselves manage their state.
  // Let's rely on the hooks being called within RequestList and RequestView directly.
  // We need fetchRequestsList here to refresh after creation.
  const { fetchRequestsList } = useSupportRequests();

  const handleTicketCreated = useCallback((blobName: string) => {
    console.log(`SupportRequestViewer: Ticket created (${blobName}), refreshing list.`);
    fetchRequestsList(); // Refresh the list
    // Optionally, could also automatically select the new ticket here
  }, [fetchRequestsList]);

  return (
    // Optional: Wrap with a Provider if Context API is used
    // <SupportRequestsProvider>
    <div className="support-viewer-container">
      <h2>Support Request Management Tool</h2>

      {/* Only show list, view, and create form if authenticated */}
      {isAuthenticated && !isAuthLoading && (
        <>
          <RequestList />
          <RequestView />
          <CreateRequestForm onTicketCreated={handleTicketCreated} /> {/* Add the form */}
        </>
      )}

      {/* Show message if not authenticated and not loading */}
      {!isAuthenticated && !isAuthLoading && (
        <p className="support-viewer-auth-message">
          Please log in with Azure AD to view support requests.
        </p>
      )}
    </div>
    // </SupportRequestsProvider>
  );
};

// Export all components from the feature index for easier imports elsewhere
export * from './RequestList';
export * from './RequestView';
export * from './CreateRequestForm'; // Export the new form
