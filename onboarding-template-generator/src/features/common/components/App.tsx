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

// Collapsible Section component for onboarding components
const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}> = ({ title, children, initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div className="form-section collapsible-section">
      <div 
        className={`collapsible-header ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{title}</h3>
        <span className="toggle-icon">{isExpanded ? '−' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Main App Component for the Onboarding Template Generator
 * Uses contexts for state management and i18n
 */
const App: React.FC = () => {
  const { 
    state, 
    updateCustomerInfo, 
    updateContacts, 
    updateTenants,
    updateTier,
    updateEmailData
  } = useAppState();
  
  const { language, setLanguage } = useLanguage();
  
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState({
    to: state.customerInfo.contactEmail || '',
    cc: '',
    subject: ''
  });

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

  // Handle email recipient changes
  const handleEmailRecipientsChange = (field: string, value: string) => {
    setEmailRecipients({
      ...emailRecipients,
      [field]: value
    });
    
    // If it's the 'to' field, also update the primary contact email
    if (field === 'to') {
      updateCustomerInfo('contactEmail', value);
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

  // Generate email preview with all required properties
  const handlePreviewEmail = () => {
    // Create an EmailFormData object with all the collected data
    const emailData = {
      to: emailRecipients.to,
      cc: emailRecipients.cc,
      subject: emailRecipients.subject,
      // Add other fields from the form
      ...getEmailCustomerInfo(),
      // These objects need to be properly initialized to prevent the "checked" property undefined error
      gdap: {
        checked: true,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        roles: "Service Support Administrator",
        link: "https://partner.microsoft.com/dashboard/commerce/granularadmin"
      },
      rbac: {
        checked: true,
        groups: 'appropriate security groups',
        tenantId: state.customerInfo.tenants[0]?.id || '[your-tenant-id]',
        azure: true,
        m365: true,
        includeScript: true
      },
      conditionalAccess: {
        checked: true,
        mfa: true,
        location: true,
        device: true,
        signIn: true
      },
      authorizedContacts: {
        checked: true,
        roles: 'Technical and Administrative contacts'
      },
      // These would actually come from the form inputs
      senderName: "Your Name",
      senderTitle: "Support Specialist",
      senderCompany: "Microsoft Partner Support",
      senderContact: "support@example.com",
      currentDate: new Date().toLocaleDateString(),
      language: language
    };
    
    updateEmailData(emailData);
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
          <div className="generator-header">
            <h1>Microsoft Support Onboarding Template Generator</h1>
            <p>Create customized onboarding emails for new support customers</p>
          </div>
          
          {/* 1. Email Recipients & Subject */}
          <div className="form-section email-recipients-section">
            <h2>Email Recipients</h2>
            <div className="form-group">
              <label htmlFor="to-field">To:</label>
              <input
                id="to-field"
                type="email"
                value={emailRecipients.to}
                onChange={(e) => handleEmailRecipientsChange('to', e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cc-field">Cc:</label>
              <input
                id="cc-field"
                type="email"
                value={emailRecipients.cc}
                onChange={(e) => handleEmailRecipientsChange('cc', e.target.value)}
                placeholder="cc@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject-field">Subject:</label>
              <input
                id="subject-field"
                type="text"
                value={emailRecipients.subject}
                onChange={(e) => handleEmailRecipientsChange('subject', e.target.value)}
                placeholder="[CompanyName] Microsoft Support Onboarding - [TierName] Support Plan"
              />
              <small className="form-text">Leave blank to use the default subject based on tier and company name</small>
            </div>
          </div>
          
          {/* 2. Support Tier Selection */}
          <div className="form-section tier-section">
            <TierSelector 
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateTier}
            />
          </div>
          
          {/* 3. Customer Contact Information */}
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
                disabled={true}
              />
              <small className="form-text">This is synchronized with the email recipient above</small>
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
          
          {/* 4. Authorized Contacts */}
          <div className="form-section contacts-section">
            <ContactsForm
              contacts={state.customerInfo.authorizedContacts}
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateContacts}
            />
          </div>
          
          {/* 5. Tenant Information */}
          <div className="form-section tenant-section">
            <TenantManager
              tenants={state.customerInfo.tenants}
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateTenants}
            />
          </div>
          
          {/* 6. Onboarding Components (Collapsible) */}
          <div className="form-section onboarding-components-section">
            <h2>Onboarding Components</h2>
            <p className="section-description">
              Configure the detailed sections to include in your onboarding email
            </p>
            
            <CollapsibleSection title="GDAP Delegation">
              <div className="form-group">
                <label htmlFor="gdap-deadline">Implementation Deadline:</label>
                <input
                  id="gdap-deadline"
                  type="text"
                  placeholder="e.g., June 30, 2025"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gdap-link">GDAP Link:</label>
                <input
                  id="gdap-link"
                  type="text"
                  placeholder="GDAP approval link"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gdap-roles">Requested Roles:</label>
                <input
                  id="gdap-roles"
                  type="text"
                  placeholder="e.g., Service Support Administrator"
                />
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="RBAC Configuration">
              <div className="form-group">
                <label htmlFor="rbac-groups">Security Groups to Configure:</label>
                <input
                  id="rbac-groups"
                  type="text"
                  placeholder="e.g., IT Admins, Finance Team, HR"
                />
              </div>
              <div className="form-group">
                <label>Permission Level:</label>
                <div className="inline-checks">
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="rbacAzure" 
                      defaultChecked={true}
                    />
                    <label htmlFor="rbacAzure">Azure RBAC</label>
                  </div>
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="rbacM365" 
                      defaultChecked={true}
                    />
                    <label htmlFor="rbacM365">Microsoft 365 RBAC</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="checkbox-container">
                  <input 
                    type="checkbox" 
                    id="includeRbacScript" 
                    defaultChecked={true}
                  />
                  <label htmlFor="includeRbacScript">Include PowerShell Script</label>
                </div>
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Conditional Access">
              <div className="form-group">
                <label>Policies to Implement:</label>
                <div className="inline-checks">
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="caMfa" 
                      defaultChecked={true}
                    />
                    <label htmlFor="caMfa">MFA Requirements</label>
                  </div>
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="caLocation" 
                      defaultChecked={true}
                    />
                    <label htmlFor="caLocation">Location-Based Access</label>
                  </div>
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="caDevice" 
                      defaultChecked={true}
                    />
                    <label htmlFor="caDevice">Device Compliance</label>
                  </div>
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="caSignIn" 
                      defaultChecked={true}
                    />
                    <label htmlFor="caSignIn">Sign-in Risk Policies</label>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Additional Notes">
              <div className="form-group">
                <label htmlFor="additional-notes">Notes or Instructions:</label>
                <textarea
                  id="additional-notes"
                  placeholder="Any additional information for the client..."
                  rows={4}
                ></textarea>
              </div>
            </CollapsibleSection>
          </div>
          
          {/* 7. Email Builder with Preview Button */}
          <div className="form-section email-section">
            <h2>Email Preview & Generate</h2>
            <p className="section-description">
              Preview the email template and generate it for sending
            </p>
            
            <div className="form-group">
              <label htmlFor="sender-name">Your Name:</label>
              <input
                id="sender-name"
                type="text"
                placeholder="Your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sender-title">Your Title:</label>
              <input
                id="sender-title"
                type="text"
                placeholder="Your job title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sender-company">Your Company:</label>
              <input
                id="sender-company"
                type="text"
                placeholder="Your company name"
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-preview"
                onClick={handlePreviewEmail}
              >
                Preview Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;