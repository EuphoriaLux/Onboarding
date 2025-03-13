// src/components/OnboardingTemplateGenerator.tsx
import React, { useState, useEffect } from 'react';
import TierSelector from './TierSelector';
import ContactsForm from './ContactsForm';
import TenantForm from './TenantForm';
import TemplatePreview from './TemplatePreview';
import { supportTiers } from '../data/supportTiers';
import { CustomerInfo } from '../utils/templateGenerator';

const OnboardingTemplateGenerator: React.FC = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    proposedDate: new Date(),
    tenantId: '',
    authorizedContacts: [{ name: '', email: '', phone: '' }],
    selectedTier: 'silver' // Default tier
  });

  // Load data from storage when component mounts
  useEffect(() => {
    chrome.storage.sync.get('customerInfo', (data) => {
      if (data.customerInfo) {
        // Convert date string back to Date object
        const storedInfo = data.customerInfo;
        if (storedInfo.proposedDate) {
          storedInfo.proposedDate = new Date(storedInfo.proposedDate);
        }
        setCustomerInfo(storedInfo);
      }
    });
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    chrome.storage.sync.set({ customerInfo });
  }, [customerInfo]);

  const handleTierChange = (tier: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      selectedTier: tier
    }));
  };

  const handleContactsChange = (contacts: Array<{name: string, email: string, phone: string}>) => {
    setCustomerInfo(prev => ({
      ...prev,
      authorizedContacts: contacts
    }));
  };

  const handleFieldChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (date: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      proposedDate: new Date(date)
    }));
  };

  return (
    <div className="onboarding-generator">
      <header className="generator-header">
        <h1>Microsoft Support Onboarding Template Generator</h1>
        <p>Generate rich text templates for customer onboarding</p>
      </header>

      <div className="generator-content">
        <TierSelector 
          selectedTier={customerInfo.selectedTier}
          onChange={handleTierChange}
        />

        <div className="customer-info-section">
          <h2>Customer Contact Information</h2>
          
          <div className="form-group">
            <label htmlFor="contact-name">Primary Contact Name</label>
            <input
              id="contact-name"
              type="text"
              value={customerInfo.contactName}
              onChange={(e) => handleFieldChange('contactName', e.target.value)}
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
              onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
              placeholder="email@company.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="proposed-date">Proposed Meeting Date</label>
            <input
              id="proposed-date"
              type="date"
              value={customerInfo.proposedDate instanceof Date 
                ? customerInfo.proposedDate.toISOString().split('T')[0]
                : ''}
              onChange={(e) => handleDateChange(e.target.value)}
              required
            />
          </div>
        </div>

        <TenantForm
          tenantId={customerInfo.tenantId}
          companyName={customerInfo.companyName}
          onChange={handleFieldChange}
        />

        <ContactsForm
          contacts={customerInfo.authorizedContacts}
          selectedTier={customerInfo.selectedTier}
          onChange={handleContactsChange}
        />

        <TemplatePreview customerInfo={customerInfo} />
      </div>
    </div>
  );
};

export default OnboardingTemplateGenerator;