// src/features/common/components/App.tsx
import React, { useState } from 'react';
import { TierSelector } from '../../supportTiers';
import { ContactsForm } from '../../contacts';
import { TenantManager } from '../../tenants';
import { EmailForm, EmailPreview } from '../../emailBuilder';
import LanguageSelector from './LanguageSelector';
import { useAppState } from '../../../contexts/AppStateContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import '../../../styles/App.css';

interface AppProps {
  // You can add props here if needed in the future
}

/**
 * Main App Component for the Onboarding Template Generator
 * Uses contexts for state management and i18n
 */
const App: React.FC<AppProps> = () => {
  const { 
    state, 
    updateCustomerInfo, 
    updateContacts, 
    updateTenants,
    updateTier,
    updateEmailData
  } = useAppState();
  
  const { language, setLanguage, getLanguageDisplay } = useLanguage();
  
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Handle date change with proper type handling
  const handleDateChange = (date: string) => {
    try {
      // Create a Date object safely
      const newDate = new Date(date);
      
      // Verify it's a valid date before setting it
      if (!isNaN(newDate.getTime())) {
        updateCustomerInfo('proposedDate', newDate);
      } else {
        console.warn("Invalid date input: ", date);
      }
    } catch (err) {
      console.error("Error parsing date: ", err);
    }
  };

  // Prepare data for Email Form
  const getEmailCustomerInfo = () => {
    // Use the first tenant's info for the email by default
    const primaryTenant = state.customerInfo.tenants[0] || { id: '', companyName: '' };
    
    return {
      companyName: primaryTenant.companyName,
      contactName: state.customerInfo.contactName,
      contactEmail: state.customerInfo.contactEmail,
      proposedDate: state.customerInfo.proposedDate,
      tenantId: primaryTenant.id,
      authorizedContacts: state.customerInfo.authorizedContacts,
      selectedTier: state.customerInfo.selectedTier
    };
  };

  // Generate email preview
  const handleEmailPreview = (data: any) => {
    // Make sure language is included in preview data
    const dataWithLanguage = {
      ...data,
      language
    };
    updateEmailData(dataWithLanguage);
    setShowEmailPreview(true);
  };

  // Return to form editing
  const handleBackToEdit = () => {
    setShowEmailPreview(false);
  };

  return (
    <div className="app-container onboarding-container">
      {!showEmailPreview && (
        <div className="language-option">
          <LanguageSelector 
            selectedLanguage={language}
            onChange={setLanguage}
          />
        </div>
      )}

      {showEmailPreview && state.emailData ? (
        <EmailPreview 
          emailData={{...state.emailData, language}} 
          onBackToEdit={handleBackToEdit}
        />
      ) : (
        <div className="comprehensive-form">
          <div className="form-section tier-section">
            <TierSelector 
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateTier}
            />
          </div>
          
          <div className="form-section customer-info-section">
            <h2>Customer Contact Information</h2>
            
            <div className="form-group">
              <label htmlFor="contact-name">Primary Contact Name</label>
              <input
                id="contact-name"
                type="text"
                value={state.customerInfo.contactName}
                onChange={(e) => updateCustomerInfo('contactName', e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-email">Primary Contact Email</label>
              <input
                id="contact-email"
                type="email"
                value={state.customerInfo.contactEmail}
                onChange={(e) => updateCustomerInfo('contactEmail', e.target.value)}
                placeholder="email@company.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="proposed-date">Proposed Meeting Date</label>
              <input
                id="proposed-date"
                type="date"
                value={state.customerInfo.proposedDate instanceof Date && !isNaN(state.customerInfo.proposedDate.getTime())
                  ? state.customerInfo.proposedDate.toISOString().split('T')[0]
                  : ''}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-section tenant-section">
            <TenantManager
              tenants={state.customerInfo.tenants}
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateTenants}
            />
          </div>
          
          <div className="form-section contacts-section">
            <ContactsForm
              contacts={state.customerInfo.authorizedContacts}
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateContacts}
            />
          </div>
          
          <div className="form-section email-section">
            <h2>Email Builder</h2>
            <p className="section-description">
              Customize the email template that will be sent to the customer as part of the onboarding process.
            </p>
            <EmailForm
              customerInfo={getEmailCustomerInfo()}
              onSaveEmailData={updateEmailData}
              onPreviewEmail={handleEmailPreview}
              language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;