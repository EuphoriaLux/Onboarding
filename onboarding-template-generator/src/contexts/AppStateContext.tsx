// src/contexts/AppStateContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../services/i18n';
import { StorageService } from '../services/storage';
import { TenantInfo } from '../features/tenants/types';
import { EmailFormData } from '../features/emailBuilder/utils/types';
import { SupportTier } from '../features/supportTiers/types';
import { supportTiers } from '../features/supportTiers/data/supportTiers'; // Import supportTiers

interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface CustomerInfo {
  contactName: string;
  contactEmail: string;
  proposedSlots: Date[]; // Changed from proposedDate
  authorizedContacts: Contact[];
  selectedTier: string;
  tenants: TenantInfo[];
}

interface AppState {
  customerInfo: CustomerInfo;
  emailData: EmailFormData | null;
  language: Language;
  showAlphaBetaFeatures: boolean; // Add state for the toggle
}

interface AppStateContextType {
  state: AppState;
  updateCustomerInfo: (field: string, value: any) => void;
  updateContacts: (contacts: Contact[]) => void;
  updateTenants: (tenants: TenantInfo[]) => void;
  updateTier: (tier: string) => void;
  updateEmailData: (data: EmailFormData) => void;
  updateLanguage: (language: Language) => void;
  updateProposedSlots: (slots: Date[]) => void; // Add handler for slots
  updateShowAlphaBetaFeatures: (value: boolean) => void; // Add handler for the toggle
  resetState: () => void;
}

const defaultState: AppState = {
  customerInfo: {
    contactName: '',
    contactEmail: '',
    proposedSlots: [], // Initialize as empty array
    authorizedContacts: [{ name: '', email: '', phone: '' }],
    selectedTier: 'silver',
    // Initialize default tenant with all flags
    tenants: [{ 
      id: '', 
      companyName: '', 
      tenantDomain: '', 
      microsoftTenantDomain: '', // Added MS Domain default
      implementationDeadline: null, 
      hasAzure: false
      // Removed includeRbacScript default
    }], 
  },
  emailData: null,
  language: 'en',
  showAlphaBetaFeatures: false // Default value for the toggle
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);

  // Load initial state from storage
  useEffect(() => {
    const loadState = async () => {
      try {
        // Include 'showAlphaBetaFeatures' in the keys to load
        const savedState = await StorageService.getAll(['customerInfo', 'emailData', 'language', 'showAlphaBetaFeatures']);

        if (savedState) {
          const newState = { ...defaultState };

          if (savedState.customerInfo) {
            let customerInfo = { ...savedState.customerInfo }; // Clone to modify

            // Process proposedSlots from storage (convert array of strings to Dates)
            if (customerInfo.proposedSlots && Array.isArray(customerInfo.proposedSlots)) {
              customerInfo.proposedSlots = customerInfo.proposedSlots
                .map((slotString: string) => {
                  const parsedDate = new Date(slotString);
                  return !isNaN(parsedDate.getTime()) ? parsedDate : null;
                })
                .filter((slot: Date | null): slot is Date => slot !== null); // Filter out invalid dates
            } else {
              customerInfo.proposedSlots = []; // Default to empty array if missing or invalid
            }


            // Also parse implementationDeadline and ensure boolean flags within tenants
            if (customerInfo.tenants && Array.isArray(customerInfo.tenants)) {
              customerInfo.tenants = customerInfo.tenants.map((tenant: any) => { // Use 'any' temporarily for processing
                let processedTenant = { ...tenant };

                // Parse deadline
                if (processedTenant.implementationDeadline) {
                  const parsedDeadline = new Date(processedTenant.implementationDeadline);
                  processedTenant.implementationDeadline = !isNaN(parsedDeadline.getTime()) ? parsedDeadline : null;
                } else {
                  processedTenant.implementationDeadline = null; // Ensure null if missing/falsy
                }

                // Ensure boolean flags exist, default to false if undefined
                if (typeof processedTenant.hasAzure === 'undefined') {
                  processedTenant.hasAzure = false;
                }
                 // Removed includeRbacScript check

                // Ensure other required fields have defaults if somehow missing (optional)
                processedTenant.id = processedTenant.id ?? '';
                processedTenant.companyName = processedTenant.companyName ?? '';
                processedTenant.tenantDomain = processedTenant.tenantDomain ?? '';
                processedTenant.microsoftTenantDomain = processedTenant.microsoftTenantDomain ?? ''; // Ensure MS Domain default on load


                return processedTenant as TenantInfo; // Cast back to TenantInfo
              });
            }
            
            newState.customerInfo = {
              ...defaultState.customerInfo,
              ...customerInfo
            };
          }
          
          if (savedState.emailData) {
            newState.emailData = savedState.emailData;
          }
          
          if (savedState.language) {
            newState.language = savedState.language;
          }

          // Load the toggle state
          if (typeof savedState.showAlphaBetaFeatures === 'boolean') {
            newState.showAlphaBetaFeatures = savedState.showAlphaBetaFeatures;
          }

          setState(newState);
        }
      } catch (error) {
        console.error('Error loading state from storage:', error);
      }
    };
    
    loadState();
  }, []);

  // Save state to storage when it changes
  useEffect(() => {
    StorageService.set('customerInfo', state.customerInfo);
    StorageService.set('language', state.language);
    if (state.emailData) {
      StorageService.set('emailData', state.emailData);
    }
    // Also save the toggle state whenever state changes
    StorageService.set('showAlphaBetaFeatures', state.showAlphaBetaFeatures);
  }, [state]); // state dependency includes showAlphaBetaFeatures now

  // Handler functions
  const updateCustomerInfo = (field: string, value: any) => {
    setState(prevState => ({
      ...prevState,
      customerInfo: {
        ...prevState.customerInfo,
        [field]: value
      }
    }));
  };

  // Add handler for updating proposed slots
  const updateProposedSlots = (slots: Date[]) => {
    setState(prevState => ({
      ...prevState,
      customerInfo: {
        ...prevState.customerInfo,
        proposedSlots: slots
      }
    }));
  };

  const updateContacts = (contacts: Contact[]) => {
    setState(prevState => ({
      ...prevState,
      customerInfo: {
        ...prevState.customerInfo,
        authorizedContacts: contacts
      }
    }));
  };

  const updateTenants = (tenants: TenantInfo[]) => {
    setState(prevState => ({
      ...prevState,
      customerInfo: {
        ...prevState.customerInfo,
        tenants
      }
    }));
  };

  const updateTier = (tier: string) => {
    // Get the contact limit for the new tier
    const newTierLimit = supportTiers[tier]?.authorizedContacts;

    setState(prevState => {
      let updatedContacts = prevState.customerInfo.authorizedContacts;

      // Check if the limit is defined and if the current contacts exceed it
      if (newTierLimit !== undefined && updatedContacts.length > newTierLimit) {
        // Truncate the contacts array to the new limit
        updatedContacts = updatedContacts.slice(0, newTierLimit);
      }

      return {
        ...prevState,
        customerInfo: {
          ...prevState.customerInfo,
          selectedTier: tier,
          authorizedContacts: updatedContacts // Update contacts along with the tier
        }
      };
    });
  };

  const updateEmailData = (data: EmailFormData) => {
    setState(prevState => ({
      ...prevState,
      emailData: data
    }));
  };

  const updateLanguage = (language: Language) => {
    setState(prevState => ({
      ...prevState,
      language
    }));
  };

  // Handler for updating the Alpha/Beta toggle state
  const updateShowAlphaBetaFeatures = (value: boolean) => {
    setState(prevState => ({
      ...prevState,
      showAlphaBetaFeatures: value
    }));
    // Immediately save the change to storage
    StorageService.set('showAlphaBetaFeatures', value);
  };

  const resetState = () => {
    setState(defaultState);
    StorageService.clear();
  };

  return (
    <AppStateContext.Provider value={{
      state,
      updateCustomerInfo,
      updateContacts,
      updateTenants,
      updateTier,
      updateEmailData,
      updateLanguage,
      updateProposedSlots,
      updateShowAlphaBetaFeatures, // Add the new handler to the context value
      resetState
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
