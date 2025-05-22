// src/contexts/AppStateContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../services/i18n';
import { StorageService } from '../services/storage';
import { TenantInfo } from '../features/emailBuilder/tenants/types'; // Adjusted path
import { EmailFormData } from '../features/emailBuilder/utils/types';
import { SupportTier } from '../features/emailBuilder/supportTiers/types'; // Adjusted path
import { supportTiers } from '../features/emailBuilder/supportTiers/data/supportTiers'; // Adjusted path // Import supportTiers
import { Customer, AuthorizedContact, Tenant } from '../features/crm/types/index'; // Updated import for CRM types
import * as crmStorageService from '../features/crm/services/crmStorageService'; // Import crmStorageService

interface CustomerInfo {
  contactName: string;
  contactEmail: string;
  proposedSlots: Date[];
  authorizedContacts: AuthorizedContact[]; // Changed from Contact to AuthorizedContact
  selectedTier: string;
  tenants: TenantInfo[];
}

interface AppState {
  customerInfo: CustomerInfo;
  emailData: EmailFormData | null;
  language: Language;
  showAlphaBetaFeatures: boolean;
  darkMode: boolean;
  crmData: Customer[]; // Add crmData property
  selectedCustomerId: string | null; // Add selectedCustomerId to state
  activeFeatureId: string | null; // New: Add activeFeatureId to state
}

interface AppStateContextType {
  state: AppState;
  setSelectedCustomerId: (customerId: string | null) => void; // Add setter for selectedCustomerId
  setActiveFeatureId: (featureId: string | null) => void; // New: Add setter for activeFeatureId
  updateCustomerInfo: (field: string, value: any) => void;
  updateContacts: (contacts: AuthorizedContact[]) => void; // Changed from Contact to AuthorizedContact
  updateTenants: (tenants: TenantInfo[]) => void;
  updateTier: (tier: string) => void;
  updateEmailData: (data: EmailFormData) => void;
  updateLanguage: (language: Language) => void;
  updateProposedSlots: (slots: Date[]) => void;
  updateShowAlphaBetaFeatures: (value: boolean) => void;
  toggleDarkMode: () => void;
  resetState: () => void;
  // CRM Data Actions (now interacting with crmStorageService)
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (customerId: string, etag: string) => Promise<void>;
  addAuthorizedContactToCustomer: (customerId: string, contact: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => Promise<void>;
  updateAuthorizedContact: (customerId: string, contact: AuthorizedContact) => Promise<void>;
  deleteAuthorizedContact: (customerId: string, contactId: string) => Promise<void>;
  addTenantToCustomer: (customerId: string, tenant: Omit<Tenant, 'id' | 'customerId' | 'createdAt'>) => Promise<void>;
  updateTenantInCustomer: (customerId: string, tenant: Tenant) => Promise<void>;
  deleteTenantFromCustomer: (customerId: string, tenantId: string) => Promise<void>;
}

const defaultState: AppState = {
  customerInfo: {
    contactName: '',
    contactEmail: '',
    proposedSlots: [], // Initialize as empty array
    authorizedContacts: [{ id: 'default-contact-1', customerId: '', name: '', email: '', phone: '', createdAt: new Date().toISOString(), jobTitle: '' }], // Updated to AuthorizedContact
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
  showAlphaBetaFeatures: false,
  darkMode: false, // Default to light mode
  crmData: [], // Initialize crmData as an empty array
  selectedCustomerId: null, // Initialize selectedCustomerId as null
  activeFeatureId: null, // New: Initialize activeFeatureId as null
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);

  // Load initial state from storage
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await StorageService.getAll([
          'customerInfo',
          'emailData',
          'language',
          'showAlphaBetaFeatures',
          'darkMode',
          'crmData',
          'selectedCustomerId', // Ensure selectedCustomerId is loaded
          'activeFeatureId' // New: Ensure activeFeatureId is loaded
        ]);

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

          // Load the toggle states
          if (typeof savedState.showAlphaBetaFeatures === 'boolean') {
            newState.showAlphaBetaFeatures = savedState.showAlphaBetaFeatures;
          }
          if (typeof savedState.darkMode === 'boolean') {
            newState.darkMode = savedState.darkMode;
          }

          // Load crmData from chrome.storage.local using crmStorageService
          try {
            const storedCustomers = await crmStorageService.listCustomers();
            const detailedCustomers: Customer[] = [];
            for (const summary of storedCustomers) {
              const detail = await crmStorageService.getCustomer(summary.id);
              if (detail) {
                detailedCustomers.push(detail);
              }
            }
            newState.crmData = detailedCustomers;
            // Set selectedCustomerId if there are customers and none is selected
            if (detailedCustomers.length > 0 && !savedState.selectedCustomerId) {
              newState.selectedCustomerId = detailedCustomers[0].id;
            } else if (savedState.selectedCustomerId && !detailedCustomers.some(c => c.id === savedState.selectedCustomerId)) {
              // If previously selected customer was deleted, select the first one or null
              newState.selectedCustomerId = detailedCustomers.length > 0 ? detailedCustomers[0].id : null;
            } else if (savedState.selectedCustomerId) {
              newState.selectedCustomerId = savedState.selectedCustomerId;
            }
          } catch (err) {
            console.error("Error loading CRM data from storage:", err);
            newState.crmData = [];
            newState.selectedCustomerId = null;
          }

          // New: Load activeFeatureId
          if (savedState.activeFeatureId) {
            newState.activeFeatureId = savedState.activeFeatureId;
          }

          // Apply the theme class based on the loaded state BEFORE setting the state
          if (newState.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
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
    StorageService.set('showAlphaBetaFeatures', state.showAlphaBetaFeatures);
    StorageService.set('darkMode', state.darkMode);
    StorageService.set('selectedCustomerId', state.selectedCustomerId); // Save selectedCustomerId to storage
    StorageService.set('activeFeatureId', state.activeFeatureId); // New: Save activeFeatureId to storage
  }, [state.customerInfo, state.emailData, state.language, state.showAlphaBetaFeatures, state.darkMode, state.selectedCustomerId, state.activeFeatureId]); // Add activeFeatureId to dependencies

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

  const updateContacts = (contacts: AuthorizedContact[]) => { // Changed from Contact to AuthorizedContact
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
          authorizedContacts: updatedContacts
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
      language: language
    }));
  };

  // Handler for updating the Alpha/Beta toggle state
  const updateShowAlphaBetaFeatures = (value: boolean) => {
    setState(prevState => ({
      ...prevState,
      showAlphaBetaFeatures: value
    }));
    StorageService.set('showAlphaBetaFeatures', value);
  };

  const toggleDarkMode = () => {
    setState(prevState => {
      const newDarkMode = !prevState.darkMode;
      // Update document class for Tailwind dark mode
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return {
        ...prevState,
        darkMode: newDarkMode
      };
    });
  };

  const resetState = () => {
    setState(defaultState);
    StorageService.clear();
  };

  const setSelectedCustomerId = (customerId: string | null) => {
    setState(prevState => ({
      ...prevState,
      selectedCustomerId: customerId,
    }));
  };

  // New: Add setActiveFeatureId function
  const setActiveFeatureId = (featureId: string | null) => {
    setState(prevState => ({
      ...prevState,
      activeFeatureId: featureId,
    }));
  };

  // CRM Data Actions (now interacting with crmStorageService)
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'>) => {
    try {
      const newCustomer = await crmStorageService.createCustomer(customerData);
      setState(prevState => ({
        ...prevState,
        crmData: [newCustomer, ...prevState.crmData],
        selectedCustomerId: newCustomer.id,
      }));
    } catch (error) {
      console.error("Error adding customer:", error);
      // Handle error in UI if needed
    }
  };

  const updateCustomer = async (customer: Customer) => {
    try {
      const updatedCustomer = await crmStorageService.updateCustomer(customer);
      setState(prevState => ({
        ...prevState,
        crmData: prevState.crmData.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c)),
      }));
    } catch (error) {
      console.error("Error updating customer:", error);
      // Handle error in UI if needed
    }
  };

  const deleteCustomer = async (customerId: string, etag: string) => {
    try {
      await crmStorageService.deleteCustomer(customerId);
      setState(prevState => {
        const updatedCrmData = prevState.crmData.filter(c => c.id !== customerId);
        let newSelectedCustomerId = prevState.selectedCustomerId;
        if (newSelectedCustomerId === customerId) {
          newSelectedCustomerId = updatedCrmData.length > 0 ? updatedCrmData[0].id : null;
        }
        return {
          ...prevState,
          crmData: updatedCrmData,
          selectedCustomerId: newSelectedCustomerId,
        };
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      // Handle error in UI if needed
    }
  };

  const addAuthorizedContactToCustomer = async (customerId: string, contact: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => {
    try {
      const updatedCustomer = await crmStorageService.addAuthorizedContactToCustomer(customerId, contact as AuthorizedContact);
      setState(prevState => ({
        ...prevState,
        crmData: prevState.crmData.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c)),
      }));
    } catch (error) {
      console.error("Error adding authorized contact:", error);
    }
  };

  const updateAuthorizedContact = async (customerId: string, contact: AuthorizedContact) => {
    try {
      const updatedCustomer = await crmStorageService.updateAuthorizedContact(customerId, contact);
      setState(prevState => ({
        ...prevState,
        crmData: prevState.crmData.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c)),
      }));
    } catch (error) {
      console.error("Error updating authorized contact:", error);
    }
  };

  const deleteAuthorizedContact = async (customerId: string, contactId: string) => {
    try {
      const updatedCustomer = await crmStorageService.deleteAuthorizedContact(customerId, contactId);
      setState(prevState => ({
        ...prevState,
        crmData: prevState.crmData.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c)),
      }));
    } catch (error) {
      console.error("Error deleting authorized contact:", error);
    }
  };

  const addTenantToCustomer = async (customerId: string, tenant: Omit<Tenant, 'id' | 'customerId' | 'createdAt'>) => {
    try {
      const updatedCustomer = await crmStorageService.addTenantToCustomer(customerId, tenant as Tenant);
      setState(prevState => ({
        ...prevState,
        crmData: prevState.crmData.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c)),
      }));
    } catch (error) {
      console.error("Error adding tenant:", error);
    }
  };

  const updateTenantInCustomer = async (customerId: string, tenant: Tenant) => {
    try {
      const updatedCustomer = await crmStorageService.updateTenantInCustomer(customerId, tenant);
      setState(prevState => ({
        ...prevState,
        crmData: prevState.crmData.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c)),
      }));
    } catch (error) {
      console.error("Error updating tenant:", error);
    }
  };

  const deleteTenantFromCustomer = async (customerId: string, tenantId: string) => {
    try {
      const updatedCustomer = await crmStorageService.deleteTenantFromCustomer(customerId, tenantId);
      setState(prevState => ({
        ...prevState,
        crmData: prevState.crmData.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c)),
      }));
    } catch (error) {
      console.error("Error deleting tenant:", error);
    }
  };

  return (
    <AppStateContext.Provider value={{
      state,
      setSelectedCustomerId,
      setActiveFeatureId, // New: Add setActiveFeatureId to context value
      updateCustomerInfo,
      updateContacts,
      updateTenants,
      updateTier,
      updateEmailData,
      updateLanguage,
      updateProposedSlots,
      updateShowAlphaBetaFeatures,
      toggleDarkMode,
      resetState,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addAuthorizedContactToCustomer,
      updateAuthorizedContact,
      deleteAuthorizedContact,
      addTenantToCustomer,
      updateTenantInCustomer,
      deleteTenantFromCustomer,
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
