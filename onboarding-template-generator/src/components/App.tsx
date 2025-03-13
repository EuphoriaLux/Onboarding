// src/components/App.tsx
import React, { useState, useEffect } from 'react';
import OnboardingTemplateGenerator from './OnboardingTemplateGenerator';
import EmailForm from './EmailForm';
import EmailPreview from './EmailPreview';
import Tabs from './Tabs';
import { CustomerInfo } from '../utils/templateGenerator';
import { EmailFormData } from '../utils/emailBuilder';
import '../styles/App.css';

const App: React.FC = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    proposedDate: new Date(),
    tenantId: '',
    authorizedContacts: [{ name: '', email: '', phone: '' }],
    selectedTier: 'silver' // Default tier
  });

  const [emailData, setEmailData] = useState<EmailFormData | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get('customerInfo', (data) => {
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
              console.warn("Invalid date in storage, using current date instead");
            }
          } else {
            // If no date, use current date
            storedInfo.proposedDate = new Date();
          }
          setCustomerInfo(storedInfo);
        } catch (err) {
          console.error("Error parsing stored date:", err);
          // Use default values if there's an error
          setCustomerInfo({
            ...storedInfo,
            proposedDate: new Date()
          });
        }
      }
    });
  }, []);

  // Save customer data when it changes
  useEffect(() => {
    chrome.storage.sync.set({ customerInfo });
  }, [customerInfo]);

  // Handle customer info updates from template generator
  const handleCustomerInfoUpdate = (info: CustomerInfo) => {
    setCustomerInfo(info);
  };

  // Handle email data updates from email form
  const handleEmailDataSave = (data: EmailFormData) => {
    setEmailData(data);
    chrome.storage.sync.set({ emailData: data });
  };

  // Generate email preview
  const handleEmailPreview = (data: EmailFormData) => {
    setEmailData(data);
    setShowEmailPreview(true);
  };

  // Return to email form
  const handleBackToEdit = () => {
    setShowEmailPreview(false);
  };

  // Define tab content
  const templateTab = {
    id: 'template',
    title: 'Template Generator',
    content: (
      <OnboardingTemplateGenerator 
        customerInfo={customerInfo}
        onChange={handleCustomerInfoUpdate}
      />
    )
  };

  const emailTab = {
    id: 'email',
    title: 'Email Builder',
    content: showEmailPreview && emailData ? (
      <EmailPreview 
        emailData={emailData}
        onBackToEdit={handleBackToEdit}
      />
    ) : (
      <EmailForm
        customerInfo={customerInfo}
        onSaveEmailData={handleEmailDataSave}
        onPreviewEmail={handleEmailPreview}
      />
    )
  };

  return (
    <div className="app-container options-page">
      <header className="generator-header">
        <h1>Microsoft Support Onboarding Tools</h1>
        <p>Generate rich text templates and emails for customer onboarding</p>
      </header>

      <Tabs tabs={[templateTab, emailTab]} defaultTab="template" />

      <footer className="app-footer">
        <p>Microsoft Support Onboarding Template Generator - v1.0.1</p>
      </footer>
    </div>
  );
};

export default App;