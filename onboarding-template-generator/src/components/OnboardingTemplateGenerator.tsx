// src/components/OnboardingTemplateGenerator.tsx
import React from 'react';
import TierSelector from './TierSelector';
import ContactsForm from './ContactsForm';
import TenantForm from './TenantForm';
import TemplatePreview from './TemplatePreview';
import { CustomerInfo } from '../utils/templateGenerator';

interface OnboardingTemplateGeneratorProps {
  customerInfo: CustomerInfo;
  onChange: (info: CustomerInfo) => void;
}

const OnboardingTemplateGenerator: React.FC<OnboardingTemplateGeneratorProps> = ({ customerInfo, onChange }) => {
  // Update handler functions to use onChange prop
  const handleTierChange = (tier: string) => {
    onChange({
      ...customerInfo,
      selectedTier: tier
    });
  };

  const handleContactsChange = (contacts: Array<{name: string, email: string, phone: string}>) => {
    onChange({
      ...customerInfo,
      authorizedContacts: contacts
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    onChange({
      ...customerInfo,
      [field]: value
    });
  };

  const handleDateChange = (date: string) => {
    try {
      // Create a Date object safely
      const newDate = new Date(date);
      
      // Verify it's a valid date before setting it
      if (!isNaN(newDate.getTime())) {
        onChange({
          ...customerInfo,
          proposedDate: newDate
        });
      } else {
        console.warn("Invalid date input: ", date);
      }
    } catch (err) {
      console.error("Error parsing date: ", err);
    }
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
              value={customerInfo.proposedDate instanceof Date && !isNaN(customerInfo.proposedDate.getTime())
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