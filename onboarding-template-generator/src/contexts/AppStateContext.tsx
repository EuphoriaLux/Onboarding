// src/contexts/AppStateContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../services/i18n';
import { StorageService } from '../services/storage';
import { TenantInfo } from '../features/tenants/types';
import { EmailFormData } from '../features/emailBuilder/utils/types';
import { SupportTier } from '../features/supportTiers/types';

interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface CustomerInfo {
  contactName: string;
  contactEmail: string;
  proposedDate: Date;
  authorizedContacts: Contact[];
  selectedTier: string;
  tenants: TenantInfo[];
}

interface AppState {
  customerInfo: CustomerInfo;
  emailData: EmailFormData | null;
  language: Language;
}

interface AppStateContextType {
  state: AppState;
  updateCustomerInfo: (field: string, value: any) => void;
  updateContacts: (contacts: Contact[]) => void;
  updateTenants: (tenants: TenantInfo[]) => void;
  updateTier: (tier: string) => void;
  updateEmailData: (data: EmailFormData) => void;
  updateLanguage: (language: Language) => void;
  resetState: () => void;
}

const defaultState: AppState = {
  customerInfo: {
    contactName: '',
    contactEmail: '',
    proposedDate: new Date(),
    authorizedContacts: [{ name: '', email: '', phone: '' }],
    selectedTier: 'silver',
    tenants: [{ id: '', companyName: '' }],
  },
  emailData: null,
  language: 'en'
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);

  // Load initial state from storage
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await StorageService.getAll(['customerInfo', 'emailData', 'language']);
        
        if (savedState) {
          const newState = { ...defaultState };
          
          if (savedState.customerInfo) {
            // Process proposedDate from storage (convert string to Date)
            let customerInfo = savedState.customerInfo;
            if (customerInfo.proposedDate) {
              const parsedDate = new Date(customerInfo.proposedDate);
              if (!isNaN(parsedDate.getTime())) {
                customerInfo.proposedDate = parsedDate;
              } else {
                customerInfo.proposedDate = new Date();
              }
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
  }, [state]);

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
    setState(prevState => ({
      ...prevState,
      customerInfo: {
        ...prevState.customerInfo,
        selectedTier: tier
      }
    }));
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