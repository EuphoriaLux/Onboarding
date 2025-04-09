import { useState, useEffect, useCallback } from 'react';
import { SupportRequest } from '../types';
import { listRequests as fetchList, getRequest as fetchDetails } from '../services/blobStorageService';
import { useAuth } from './useAuth'; // Import the hook
import { STORAGE_SCOPES } from '../services/authService'; // Import scopes
import * as msal from '@azure/msal-browser'; // Keep for error type checking (though less relevant now)

interface RequestListItem {
  name: string; // Blob name, potentially enhance with metadata later
}

interface SupportRequestsState {
  requestsList: RequestListItem[];
  selectedRequest: SupportRequest | null;
  selectedBlobName: string | null;
  isListLoading: boolean;
  isDetailLoading: boolean;
  listError: Error | null;
  detailError: Error | null;
}

interface UseSupportRequestsReturn extends SupportRequestsState {
  fetchRequestsList: () => Promise<void>;
  selectRequest: (blobName: string | null) => void;
}

const initialState: SupportRequestsState = {
  requestsList: [],
  selectedRequest: null,
  selectedBlobName: null,
  isListLoading: false,
  isDetailLoading: false,
  listError: null,
  detailError: null,
};

export const useSupportRequests = (): UseSupportRequestsReturn => {
  const [state, setState] = useState<SupportRequestsState>(initialState);
  // Destructure getAccessToken (correct name) along with other needed values from useAuth
  const { isAuthenticated, isLoading: isAuthLoading, getAccessToken, login } = useAuth();

  // Fetch the list of requests
  const fetchRequestsList = useCallback(async () => {
    if (!isAuthenticated || isAuthLoading) {
      console.log("useSupportRequests: Skipping list fetch - not authenticated or auth loading.");
      return;
    }

    console.log("useSupportRequests: Fetching request list...");
    setState(prev => ({ ...prev, isListLoading: true, listError: null }));
    try {
      // Get token first using the correct function and scopes
      const accessToken = await getAccessToken(STORAGE_SCOPES);
      if (!accessToken) {
        console.warn("useSupportRequests: Cannot fetch list, access token not available.");
        // Error state should be handled by useAuth hook now
        setState(prev => ({ ...prev, isListLoading: false })); // Just stop loading
        return;
      }

      const list = await fetchList(accessToken); // Pass token
      setState(prev => ({
        ...prev,
        requestsList: list,
        isListLoading: false,
      }));
      console.log("useSupportRequests: Request list fetched successfully.");
    } catch (error) {
      console.error("useSupportRequests: Error fetching request list", error);
       if (error instanceof msal.InteractionRequiredAuthError) { // Keep error check just in case
            console.warn("useSupportRequests: Fetching list requires login.");
            // await login(); // Example: Trigger login
       }
      setState(prev => ({
        ...prev,
        requestsList: [], // Clear list on error?
        isListLoading: false,
        listError: error instanceof Error ? error : new Error('Failed to fetch request list'),
      }));
    }
    // Add getAccessToken to dependency array
  }, [isAuthenticated, isAuthLoading, getAccessToken]);

  // Fetch details for the selected request
  useEffect(() => {
    const fetchRequestDetails = async (blobName: string) => {
      // Check authentication status first
      if (!isAuthenticated || isAuthLoading) {
        console.log("useSupportRequests: Skipping detail fetch - not authenticated or auth loading.");
        setState(prev => ({ ...prev, selectedRequest: null, detailError: null }));
        return;
      }

      console.log(`useSupportRequests: Fetching details for ${blobName}...`);
      setState(prev => ({
        ...prev,
        isDetailLoading: true,
        detailError: null,
        selectedRequest: null, // Clear previous details
      }));
      try {
        // Get token first using the correct function and scopes
        const accessToken = await getAccessToken(STORAGE_SCOPES);
        if (!accessToken) {
          console.warn(`useSupportRequests: Cannot fetch details for ${blobName}, access token not available.`);
           // Error state should be handled by useAuth hook now
          setState(prev => ({ ...prev, isDetailLoading: false })); // Just stop loading
          return;
        }

        const details = await fetchDetails(blobName, accessToken); // Pass token
        setState(prev => ({
          ...prev,
          selectedRequest: details,
          isDetailLoading: false,
        }));
        console.log(`useSupportRequests: Details for ${blobName} fetched successfully.`);
      } catch (error) {
        console.error(`useSupportRequests: Error fetching details for ${blobName}`, error);
        if (error instanceof msal.InteractionRequiredAuthError) { // Keep error check
            console.warn(`useSupportRequests: Fetching details for ${blobName} requires login.`);
            // await login();
        }
        setState(prev => ({
          ...prev,
          selectedRequest: null,
          isDetailLoading: false,
          detailError: error instanceof Error ? error : new Error(`Failed to fetch details for ${blobName}`),
        }));
      }
    };

    // Trigger fetch only if blobName is selected and user is authenticated
    if (state.selectedBlobName && isAuthenticated && !isAuthLoading) {
      fetchRequestDetails(state.selectedBlobName);
    } else if (!state.selectedBlobName) {
      // Clear details if blobName is null
      setState(prev => ({ ...prev, selectedRequest: null, isDetailLoading: false, detailError: null }));
    }
    // Add getAccessToken to dependencies
  }, [state.selectedBlobName, isAuthenticated, isAuthLoading, login, getAccessToken]);

  // Function for components to call to select a request
  const selectRequest = useCallback((blobName: string | null) => {
    setState(prev => ({ ...prev, selectedBlobName: blobName }));
  }, []);

  // Initial fetch of the list when authenticated
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchRequestsList();
    } else {
       // Clear list if not authenticated initially or during auth loading
       setState(prev => ({ ...prev, requestsList: [], listError: null }));
    }
    // Add getAccessToken to dependency array
  }, [isAuthenticated, isAuthLoading, fetchRequestsList, getAccessToken]);

  return {
    ...state,
    fetchRequestsList,
    selectRequest,
  };
};
