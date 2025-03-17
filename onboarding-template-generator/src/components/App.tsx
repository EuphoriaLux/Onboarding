// src/components/App.tsx
import React, { useState, useEffect } from 'react';
import TierSelector from './TierSelector';
import ContactsForm from './ContactsForm';
import TenantManager, { TenantInfo } from './TenantManager';
import EmailForm from './EmailForm';
import EmailPreview from './EmailPreview';
import LanguageSelector from './LanguageSelector';
import { Language } from './LanguageSelector';
import { EmailFormData } from '../utils/emailBuilder';
import { supportTiers } from '../data/supportTiers';
import '../styles/App.css';

interface Contact {
  name: string;
  email: string;
  phone: string;
}

/**
 * Comprehensive App Component with all forms integrated
 * and multi-tenant support based on tier selection
 */
const App: React.FC = () => {
  // State for all form data
  const [customerInfo, setCustomerInfo] = useState({
    contactName: '',
    contactEmail: '',
    proposedDate: new Date(),
    authorizedContacts: [{ name: '', email: '', phone: '' }] as Contact[],
    selectedTier: 'silver', // Default tier
    tenants: [{ id: '', companyName: '' }] as TenantInfo[],
  });
  
  const [emailData, setEmailData] = useState<EmailFormData | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [language, setLanguage] = useState<Language>('en'); // Add language state

  // Load saved data on initial render
  useEffect(() => {
    chrome.storage.sync.get(['customerInfo', 'emailData', 'language'], (data) => {
      if (data.customerInfo) {
        // Convert date string back to Date object
        const storedInfo = data.customerInfo;
        try {
          if (storedInfo.proposedDate) {
            const parsedDate = new Date(storedInfo.proposedDate);
            // Verify it's a valid date
            if (!isNaN(parsedDate.getTime())) {
              storedInfo.proposedDate = parsedDate;
            } else {
              // If the date is invalid, set to current date
              storedInfo.proposedDate = new Date();
            }
          } else {
            // If no date, use current date
            storedInfo.proposedDate = new Date();
          }
          
          // Ensure tenants array exists
          if (!storedInfo.tenants || !Array.isArray(storedInfo.tenants)) {
            storedInfo.tenants = [{ id: '', companyName: '' }];
          }
          
          setCustomerInfo(storedInfo);
        } catch (err) {
          console.error("Error parsing stored data:", err);
          // Use default values if there's an error
          setCustomerInfo({
            ...storedInfo,
            proposedDate: new Date(),
            tenants: [{ id: '', companyName: '' }]
          });
        }
      }
      
      if (data.emailData) {
        setEmailData(data.emailData);
      }
      
      // Load saved language preference
      if (data.language) {
        setLanguage(data.language);
      }
    });
  }, []);

  // Save customer info when it changes
  useEffect(() => {
    chrome.storage.sync.set({ customerInfo });
  }, [customerInfo]);
  
  // Save language preference when it changes
  useEffect(() => {
    chrome.storage.sync.set({ language });
  }, [language]);

  // Handle tier selection - adjust tenants and contacts based on tier limits
  const handleTierChange = (tier: string) => {
    const selectedTierObj = supportTiers[tier];
    let updatedTenants = [...customerInfo.tenants];
    let updatedContacts = [...customerInfo.authorizedContacts];
    
    // Limit tenants to the new tier's maximum
    if (updatedTenants.length > selectedTierObj.tenants) {
      updatedTenants = updatedTenants.slice(0, selectedTierObj.tenants);
    }
    
    // Limit contacts to the new tier's maximum
    if (updatedContacts.length > selectedTierObj.authorizedContacts) {
      updatedContacts = updatedContacts.slice(0, selectedTierObj.authorizedContacts);
    }
    
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      selectedTier: tier,
      tenants: updatedTenants,
      authorizedContacts: updatedContacts
    }));
  };

  // Handle contact updates
  const handleContactsChange = (contacts: Contact[]) => {
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      authorizedContacts: contacts
    }));
  };

  // Handle tenant updates
  const handleTenantsChange = (tenants: TenantInfo[]) => {
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      tenants: tenants
    }));
  };

  // Handle customer info field changes
  const handleCustomerInfoChange = (field: string, value: any) => {
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      [field]: value
    }));
  };

  // Handle date change
  const handleDateChange = (date: string) => {
    try {
      // Create a Date object safely
      const newDate = new Date(date);
      
      // Verify it's a valid date before setting it
      if (!isNaN(newDate.getTime())) {
        setCustomerInfo(prevInfo => ({
          ...prevInfo,
          proposedDate: newDate
        }));
      } else {
        console.warn("Invalid date input: ", date);
      }
    } catch (err) {
      console.error("Error parsing date: ", err);
    }
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  // Prepare data for Email Form
  const getEmailCustomerInfo = () => {
    // Use the first tenant's info for the email by default
    const primaryTenant = customerInfo.tenants[0] || { id: '', companyName: '' };
    
    return {
      companyName: primaryTenant.companyName,
      contactName: customerInfo.contactName,
      contactEmail: customerInfo.contactEmail,
      proposedDate: customerInfo.proposedDate,
      tenantId: primaryTenant.id,
      authorizedContacts: customerInfo.authorizedContacts,
      selectedTier: customerInfo.selectedTier
    };
  };

  // Handle email data updates from email form
  const handleEmailDataSave = (data: EmailFormData) => {
    // Make sure language is included in saved data
    const dataWithLanguage = {
      ...data,
      language
    };
    setEmailData(dataWithLanguage);
    chrome.storage.sync.set({ emailData: dataWithLanguage });
  };

  // Generate email preview
  const handleEmailPreview = (data: EmailFormData) => {
    // Make sure language is included in preview data
    const dataWithLanguage = {
      ...data,
      language
    };
    setEmailData(dataWithLanguage);
    setShowEmailPreview(true);
  };

  // Return to form editing
  const handleBackToEdit = () => {
    setShowEmailPreview(false);
  };

  return (
    <div className="app-container options-page">
      <header className="generator-header">
        <h1>Microsoft Support Onboarding Tool</h1>
        <p>Configure customer details and generate rich text emails for onboarding</p>
        
        {/* Add language selector to header */}
        <div className="language-option">
          <LanguageSelector 
            selectedLanguage={language}
            onChange={handleLanguageChange}
          />
        </div>
      </header>

      {showEmailPreview && emailData ? (
        <EmailPreview 
          emailData={{...emailData, language}} // Ensure language is passed
          onBackToEdit={handleBackToEdit}
        />
      ) : (
        <div className="comprehensive-form">
          <div className="form-section tier-section">
            <TierSelector 
              selectedTier={customerInfo.selectedTier}
              onChange={handleTierChange}
            />
          </div>
          
          <div className="form-section customer-info-section">
            <h2>Customer Contact Information</h2>
            
            <div className="form-group">
              <label htmlFor="contact-name">Primary Contact Name</label>
              <input
                id="contact-name"
                type="text"
                value={customerInfo.contactName}
                onChange={(e) => handleCustomerInfoChange('contactName', e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-email">Primary Contact Email</label>
              <input
                id="contact-email"
                type="email"
                value={customerInfo.contactEmail}
                onChange={(e) => handleCustomerInfoChange('contactEmail', e.target.value)}
                placeholder="email@company.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="proposed-date">Proposed Meeting Date</label>
              <input
                id="proposed-date"
                type="date"
                value={customerInfo.proposedDate instanceof Date && !isNaN(customerInfo.proposedDate.getTime())
                  ? customerInfo.proposedDate.toISOString().split('T')[0]
                  : ''}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-section tenant-section">
            <TenantManager
              tenants={customerInfo.tenants}
              selectedTier={customerInfo.selectedTier}
              onChange={handleTenantsChange}
            />
          </div>
          
          <div className="form-section contacts-section">
            <ContactsForm
              contacts={customerInfo.authorizedContacts}
              selectedTier={customerInfo.selectedTier}
              onChange={handleContactsChange}
            />
          </div>
          
          <div className="form-section email-section">
            <h2>Email Builder</h2>
            <p className="section-description">
              Customize the email template that will be sent to the customer as part of the onboarding process.
            </p>
            <EmailForm
              customerInfo={getEmailCustomerInfo()}
              onSaveEmailData={handleEmailDataSave}
              onPreviewEmail={handleEmailPreview}
              language={language} // Pass language to EmailForm
            />
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>Microsoft Support Onboarding Tool - v1.0.2</p>
      </footer>
    </div>
  );
};

export default App;