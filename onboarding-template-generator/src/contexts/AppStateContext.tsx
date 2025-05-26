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
  authorizedContacts: AuthorizedContact[];
  selectedTier: string;
  // Removed tenants from CustomerInfo as they are now top-level
}

interface AppState {
  customerInfo: CustomerInfo;
  emailData: EmailFormData | null;
  language: Language;
  showAlphaBetaFeatures: boolean;
  darkMode: boolean;
  crmData: Customer[]; // Customers data
  allTenants: Tenant[]; // All tenants data, top-level
  allAuthorizedContacts: AuthorizedContact[]; // New: All authorized contacts data, top-level
  selectedCustomerId: string | null;
  activeFeatureId: string | null;
}

interface AppStateContextType {
  state: AppState;
  setSelectedCustomerId: (customerId: string | null) => void;
  setActiveFeatureId: (featureId: string | null) => void;
  updateCustomerInfo: (field: string, value: any) => void;
  updateContacts: (contacts: AuthorizedContact[]) => void;
  updateTier: (tier: string) => void;
  updateEmailData: (data: EmailFormData) => void;
  updateLanguage: (language: Language) => void;
  updateProposedSlots: (slots: Date[]) => void;
  updateShowAlphaBetaFeatures: (value: boolean) => void;
  toggleDarkMode: () => void;
  resetState: () => void;
  updateCrmData: (customers: Customer[]) => Promise<void>; // Add this line
  // CRM Data Actions (now interacting with crmStorageService)
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  addAuthorizedContactToCustomer: (customerId: string, contact: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => Promise<void>;
  updateAuthorizedContact: (contact: AuthorizedContact) => Promise<void>; // Modified signature
  deleteAuthorizedContact: (customerId: string, contactId: string) => Promise<void>;
  // Tenant actions for top-level tenants
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => Promise<void>;
  updateTenant: (tenant: Tenant) => Promise<void>;
  deleteTenant: (tenantId: string) => Promise<void>;
  deleteTenants: (tenantIds: string[]) => Promise<void>;
  matchTenantToCustomer: (tenantId: string, newCustomerId: string | null) => Promise<void>;
  updateAllTenants: (tenants: Tenant[]) => Promise<void>; // Add this line
}

const defaultState: AppState = {
  customerInfo: {
    contactName: '',
    contactEmail: '',
    proposedSlots: [],
    authorizedContacts: [{ id: 'default-contact-1', customerId: '', fullName: '', email: '', createdAt: new Date().toISOString() }],
    selectedTier: 'silver',
  },
  emailData: null,
  language: 'en',
  showAlphaBetaFeatures: false,
  darkMode: false,
  crmData: [],
  allTenants: [],
  allAuthorizedContacts: [], // Initialize allAuthorizedContacts as an empty array
  selectedCustomerId: null,
  activeFeatureId: null,
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
          'selectedCustomerId',
          'activeFeatureId'
        ]);

        if (savedState) {
          const newState = { ...defaultState };

          if (savedState.customerInfo) {
            let customerInfo = { ...savedState.customerInfo };

            if (customerInfo.proposedSlots && Array.isArray(customerInfo.proposedSlots)) {
              customerInfo.proposedSlots = customerInfo.proposedSlots
                .map((slotString: string) => {
                  const parsedDate = new Date(slotString);
                  return !isNaN(parsedDate.getTime()) ? parsedDate : null;
                })
                .filter((slot: Date | null): slot is Date => slot !== null);
            } else {
              customerInfo.proposedSlots = [];
            }

            // Removed old tenant processing from customerInfo.tenants
            // if (customerInfo.tenants && Array.isArray(customerInfo.tenants)) {
            //   customerInfo.tenants = customerInfo.tenants.map((tenant: any) => {
            //     let processedTenant = { ...tenant };
            //     if (processedTenant.implementationDeadline) {
            //       const parsedDeadline = new Date(processedTenant.implementationDeadline);
            //       processedTenant.implementationDeadline = !isNaN(parsedDeadline.getTime()) ? parsedDeadline : null;
            //     } else {
            //       processedTenant.implementationDeadline = null;
            //     }
            //     if (typeof processedTenant.hasAzure === 'undefined') {
            //       processedTenant.hasAzure = false;
            //     }
            //     return processedTenant as TenantInfo;
            //   });
            // }

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

          if (typeof savedState.showAlphaBetaFeatures === 'boolean') {
            newState.showAlphaBetaFeatures = savedState.showAlphaBetaFeatures;
          }
          if (typeof savedState.darkMode === 'boolean') {
            newState.darkMode = savedState.darkMode;
          }

          // Load crmData (customers and tenants) from crmStorageService
          try {
            const crmDataFromStorage = await crmStorageService.getStorageData();
            newState.crmData = crmDataFromStorage.customers;
            newState.allTenants = crmDataFromStorage.tenants;
            newState.allAuthorizedContacts = crmDataFromStorage.customers.flatMap(customer =>
              customer.contacts?.map(contact => {
                const [firstName = '', lastName = ''] = contact.fullName.split(' ').filter(Boolean); // Derive first/last from fullName
                return {
                  ...contact,
                  customerId: customer.id,
                  firstName: contact.firstName || firstName, // Use existing or derived
                  lastName: contact.lastName || lastName,   // Use existing or derived
                };
              }) || []
            );

            // Handle migration of old nested tenants to new top-level tenants
            let migratedTenants: Tenant[] = [];
            let customersToUpdate: Customer[] = [];

            if (crmDataFromStorage.customers.length > 0) {
              crmDataFromStorage.customers.forEach(customer => {
                if ((customer as any).tenants && Array.isArray((customer as any).tenants)) {
                  (customer as any).tenants.forEach((nestedTenant: Tenant) => {
                    migratedTenants.push({ ...nestedTenant, customerId: nestedTenant.customerId || customer.id });
                  });
                  const { tenants, ...customerWithoutTenants } = customer as any;
                  customersToUpdate.push(customerWithoutTenants);
                } else {
                  customersToUpdate.push(customer);
                }
              });

              if (migratedTenants.length > 0) {
                const updatedStorageData = {
                  customers: customersToUpdate,
                  tenants: [...crmDataFromStorage.tenants, ...migratedTenants.filter(mt => !crmDataFromStorage.tenants.some(t => t.id === mt.id))]
                };
                await crmStorageService.setStorageData(updatedStorageData);
                newState.crmData = updatedStorageData.customers;
                newState.allTenants = updatedStorageData.tenants;
              }
            }

            // Set selectedCustomerId logic remains the same
            if (newState.crmData.length > 0 && !savedState.selectedCustomerId) {
              newState.selectedCustomerId = newState.crmData[0].id;
            } else if (savedState.selectedCustomerId && !newState.crmData.some(c => c.id === savedState.selectedCustomerId)) {
              newState.selectedCustomerId = newState.crmData.length > 0 ? newState.crmData[0].id : null;
            } else if (savedState.selectedCustomerId) {
              newState.selectedCustomerId = savedState.selectedCustomerId;
            }

          } catch (err) {
            console.error("Error loading CRM data from storage:", err);
            newState.crmData = [];
            newState.allTenants = [];
            newState.selectedCustomerId = null;
          }

          if (savedState.activeFeatureId) {
            newState.activeFeatureId = savedState.activeFeatureId;
          }

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
    StorageService.set('selectedCustomerId', state.selectedCustomerId);
    StorageService.set('activeFeatureId', state.activeFeatureId);
    // No need to save crmData or allTenants here, as crmStorageService handles it
  }, [state.customerInfo, state.emailData, state.language, state.showAlphaBetaFeatures, state.darkMode, state.selectedCustomerId, state.activeFeatureId]);

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

  const updateProposedSlots = (slots: Date[]) => {
    setState(prevState => ({
      ...prevState,
      customerInfo: {
        ...prevState.customerInfo,
        proposedSlots: slots
      }
    }));
  };

  const updateContacts = (contacts: AuthorizedContact[]) => {
    setState(prevState => ({
      ...prevState,
      customerInfo: {
        ...prevState.customerInfo,
        authorizedContacts: contacts
      }
    }));
  };

  // Removed updateTenants as they are now top-level
  // const updateTenants = (tenants: TenantInfo[]) => {
  //   setState(prevState => ({
  //     ...prevState,
  //     customerInfo: {
  //       ...prevState.customerInfo,
  //       tenants
  //     }
  //   }));
  // };

  const updateTier = (tier: string) => {
    const newTierLimit = supportTiers[tier]?.authorizedContacts;

    setState(prevState => {
      let updatedContacts = prevState.customerInfo.authorizedContacts;

      if (newTierLimit !== undefined && updatedContacts.length > newTierLimit) {
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

  const updateCrmData = async (customers: Customer[]) => {
    try {
      // Get current tenants and contacts to merge with new customers
      const currentStorage = await crmStorageService.getStorageData();
      const updatedStorage = {
        customers: customers,
        tenants: currentStorage.tenants, // Keep existing tenants
        // If contacts are nested within customers, they will be updated via the new customers array
        // If contacts are top-level, they might need separate handling or re-derivation
      };
      await crmStorageService.setStorageData(updatedStorage);
      setState(prevState => ({
        ...prevState,
        crmData: customers,
        // Re-derive allAuthorizedContacts if they are derived from crmData
        allAuthorizedContacts: customers.flatMap(customer =>
          customer.contacts?.map(contact => ({
            ...contact,
            customerId: customer.id,
            firstName: contact.firstName || contact.fullName.split(' ')[0] || '',
            lastName: contact.lastName || contact.fullName.split(' ')[1] || '',
          })) || []
        ),
      }));
    } catch (error) {
      console.error("Error updating CRM data:", error);
      throw error; // Re-throw to allow SettingsPage to handle error
    }
  };

  const setSelectedCustomerId = (customerId: string | null) => {
    setState(prevState => ({
      ...prevState,
      selectedCustomerId: customerId,
    }));
  };

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
    }
  };

  const deleteCustomer = async (customerId: string) => {
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

  const updateAuthorizedContact = async (contactToUpdate: AuthorizedContact) => {
    try {
      // Update in crmStorageService
      await crmStorageService.updateAuthorizedContact(contactToUpdate);

      setState(prevState => {
        // Update allAuthorizedContacts directly
        const updatedAllAuthorizedContacts = prevState.allAuthorizedContacts.map(contact =>
          contact.id === contactToUpdate.id ? contactToUpdate : contact
        );

        // Also update the specific customer's contacts array within crmData
        const updatedCrmData = prevState.crmData.map(customer => {
          if (customer.id === contactToUpdate.customerId) {
            return {
              ...customer,
              contacts: customer.contacts?.map(c =>
                c.id === contactToUpdate.id ? contactToUpdate : c
              ),
            };
          }
          return customer;
        });

        return {
          ...prevState,
          allAuthorizedContacts: updatedAllAuthorizedContacts,
          crmData: updatedCrmData,
        };
      });
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

  // New tenant actions for top-level tenants
  const addTenant = async (tenantData: Omit<Tenant, 'id' | 'createdAt'>) => {
    try {
      const newTenant = await crmStorageService.addTenant(tenantData);
      setState(prevState => ({
        ...prevState,
        allTenants: [...prevState.allTenants, newTenant],
      }));
    } catch (error) {
      console.error("Error adding tenant:", error);
    }
  };

  const updateTenant = async (tenantData: Tenant) => {
    try {
      const updatedTenant = await crmStorageService.updateTenant(tenantData);
      setState(prevState => ({
        ...prevState,
        allTenants: prevState.allTenants.map(t => (t.id === updatedTenant.id ? updatedTenant : t)),
      }));
    } catch (error) {
      console.error("Error updating tenant:", error);
    }
  };

  const deleteTenant = async (tenantId: string) => {
    try {
      await crmStorageService.deleteTenant(tenantId);
      setState(prevState => ({
        ...prevState,
        allTenants: prevState.allTenants.filter(t => t.id !== tenantId),
      }));
    } catch (error) {
      console.error("Error deleting tenant:", error);
    }
  };

  const deleteTenants = async (tenantIds: string[]) => {
    try {
      await crmStorageService.deleteTenants(tenantIds);
      setState(prevState => ({
        ...prevState,
        allTenants: prevState.allTenants.filter(t => !tenantIds.includes(t.id)),
      }));
    } catch (error) {
      console.error("Error deleting multiple tenants:", error);
    }
  };

  const matchTenantToCustomer = async (tenantId: string, newCustomerId: string | null) => {
    try {
      await crmStorageService.matchTenantToCustomer(tenantId, newCustomerId);
      // Re-fetch all tenants to update their customerId in state
      const data = await crmStorageService.getStorageData();
      setState(prevState => ({
        ...prevState,
        allTenants: data.tenants,
      }));
    } catch (error) {
      console.error("Error matching tenant to customer:", error);
    }
  };

  const updateAllTenants = async (tenants: Tenant[]) => {
    try {
      // Get current customers and contacts to merge with new tenants
      const currentStorage = await crmStorageService.getStorageData();
      const updatedStorage = {
        customers: currentStorage.customers,
        tenants: tenants,
      };
      await crmStorageService.setStorageData(updatedStorage);
      setState(prevState => ({
        ...prevState,
        allTenants: tenants,
      }));
    } catch (error) {
      console.error("Error updating all tenants:", error);
      throw error;
    }
  };

  return (
    <AppStateContext.Provider value={{
      state,
      setSelectedCustomerId,
      setActiveFeatureId,
      updateCustomerInfo,
      updateContacts,
      // Removed updateTenants
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
      addTenant,
      updateTenant,
      deleteTenant,
      deleteTenants,
      matchTenantToCustomer,
      updateCrmData,
      updateAllTenants, // Add this line
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
