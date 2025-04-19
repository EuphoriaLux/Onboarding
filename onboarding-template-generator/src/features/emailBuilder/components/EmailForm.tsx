// src/components/EmailForm.tsx - Update imports and fix implicit any errors
import React, { useState, useEffect } from 'react';
import { supportTiers } from '../supportTiers/constants';
import { CustomerInfo, EmailFormData } from '../utils/types';
import { Language } from '../../../services/i18n';
import emailBuilder from '../utils/emailBuilder';
import { useAppState } from '../../../contexts/AppStateContext'; // Import useAppState

interface EmailFormProps {
  customerInfo: CustomerInfo;
  onSaveEmailData: (emailData: EmailFormData) => void;
  onPreviewEmail: (emailData: EmailFormData) => void;
  language?: Language; // Make language optional
}

const EmailForm: React.FC<EmailFormProps> = ({
  customerInfo,
  onSaveEmailData,
  onPreviewEmail,
  language = 'en' // Default to English if not provided
}) => {
  const { updateCustomerInfo } = useAppState(); // Get updateCustomerInfo from context
  const [emailData, setEmailData] = useState<EmailFormData>(
    emailBuilder.processCustomerInfoToEmailData(customerInfo, language)
  );

  useEffect(() => {
    // Update email data when customer info or language changes
    // This will now correctly format the proposedDate from context into YYYY-MM-DD for the input
    setEmailData(emailBuilder.processCustomerInfoToEmailData(customerInfo, language));
  }, [customerInfo, language]);

  const handleInputChange = (field: string, value: any) => {
    if (field === 'meetingDate') {
      // Handle date input specifically
      if (value) {
        const dateParts = value.split('-'); // YYYY-MM-DD
        // Create date in UTC to avoid timezone issues with Date constructor
        const parsedDate = new Date(Date.UTC(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])));
        if (!isNaN(parsedDate.getTime())) {
          updateCustomerInfo('proposedDate', parsedDate); // Update central state with Date object
        } else {
          updateCustomerInfo('proposedDate', null); // Handle invalid date string
        }
      } else {
        updateCustomerInfo('proposedDate', null); // Handle empty input
      }
      // Update local form state as well (though it's derived from context now)
      setEmailData((prev: EmailFormData) => ({ ...prev, [field]: value }));
    } else {
      // Handle other inputs normally
      setEmailData((prev: EmailFormData) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setEmailData((prev: EmailFormData) => { // Fix implicit any
      // Ensure section exists before trying to access it
      const currentSection = prev[section as keyof EmailFormData] as Record<string, any> || {};
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Include language in the form data
    const dataWithLanguage = {
      ...emailData,
      language
    };

    onSaveEmailData(dataWithLanguage);
    onPreviewEmail(dataWithLanguage);
  };

  const handleCheckboxToggle = (section: string, field: string) => {
    setEmailData((prev: EmailFormData) => { // Fix implicit any
      // Ensure section exists before trying to access it
      const currentSection = prev[section as keyof EmailFormData] as Record<string, any> || {};
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: !currentSection[field]
        }
      };
    });
  };

  // Display current language info
  const languageDisplay = () => {
    switch (language) {
      case 'fr':
        return 'Français';
      case 'de':
        return 'Deutsch';
      default:
        return 'English';
    }
  };

  return (
    <div className="email-form-container">
      <h2>Email Template Generator</h2>
      <p className="info-text">
        Customize this email template to send to your client as part of the onboarding process.
        <span className="language-indicator"> Current language: <strong>{languageDisplay()}</strong></span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="section">
          <h3>Email Recipients</h3>
          <div className="form-group">
            <label htmlFor="to">To:</label>
            <input
              type="email"
              id="to"
              value={emailData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              placeholder="recipient@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cc">Cc:</label>
            <input
              type="email"
              id="cc"
              value={emailData.cc || ''}
              onChange={(e) => handleInputChange('cc', e.target.value)}
              placeholder="cc@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              value={emailData.subject || ''}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Email subject"
            />
          </div>
        </div>

        {/* Rest of the component remains the same */}
        {/* ... */}

        <div className="section">
          <h3>Onboarding Components</h3>
          <p>Select the components to include in your onboarding email:</p>

          {/* GDAP Section Removed */}
          {/* RBAC Section Removed */}

          <div className="checkbox-group">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="conditionalAccess"
                checked={emailData.conditionalAccess.checked}
                onChange={() => handleCheckboxToggle('conditionalAccess', 'checked')}
              />
              <label htmlFor="conditionalAccess">Conditional Access</label>
            </div>
            {emailData.conditionalAccess.checked && (
              <div className="nested-options">
                <div className="form-group">
                  <label>Policies to Implement:</label>
                  <div className="inline-checks">
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="caMfa"
                        checked={emailData.conditionalAccess.mfa}
                        onChange={() => handleCheckboxToggle('conditionalAccess', 'mfa')}
                      />
                      <label htmlFor="caMfa">MFA Requirements</label>
                    </div>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="caLocation"
                        checked={emailData.conditionalAccess.location}
                        onChange={() => handleCheckboxToggle('conditionalAccess', 'location')}
                      />
                      <label htmlFor="caLocation">Location-Based Access</label>
                    </div>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="caDevice"
                        checked={emailData.conditionalAccess.device}
                        onChange={() => handleCheckboxToggle('conditionalAccess', 'device')}
                      />
                      <label htmlFor="caDevice">Device Compliance</label>
                    </div>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="caSignIn"
                        checked={emailData.conditionalAccess.signIn}
                        onChange={() => handleCheckboxToggle('conditionalAccess', 'signIn')}
                      />
                      <label htmlFor="caSignIn">Sign-in Risk Policies</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="checkbox-group">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="authorizedContacts"
                checked={emailData.authorizedContacts.checked}
                onChange={() => handleCheckboxToggle('authorizedContacts', 'checked')}
              />
              <label htmlFor="authorizedContacts">Authorized Contacts Table</label>
            </div>
            {emailData.authorizedContacts.checked && (
              <div className="nested-options">
                <div className="form-group">
                  <label htmlFor="contactsRoles">Recommended Contact Roles:</label>
                  <input
                    type="text"
                    id="contactsRoles"
                    value={emailData.authorizedContacts.roles}
                    onChange={(e) => handleNestedChange('authorizedContacts', 'roles', e.target.value)}
                    placeholder="e.g., Technical Contact, Billing Contact"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="section">
          <h3>Additional Information</h3>
          {/* Removed single date input - replaced by slot selection in App.tsx */}

          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes or Instructions:</label>
            <textarea
              id="additionalNotes"
              value={emailData.additionalNotes || ''}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Any additional information for the client..."
              rows={4}
            ></textarea>
          </div>
        </div>

        <div className="section">
          <h3>Sender Information</h3>
          <div className="form-group">
            <label htmlFor="senderName">Your Name:</label>
            <input
              type="text"
              id="senderName"
              value={emailData.senderName}
              onChange={(e) => handleInputChange('senderName', e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senderTitle">Your Title:</label>
            <input
              type="text"
              id="senderTitle"
              value={emailData.senderTitle}
              onChange={(e) => handleInputChange('senderTitle', e.target.value)}
              placeholder="Your job title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senderCompany">Your Company:</label>
            <input
              type="text"
              id="senderCompany"
              value={emailData.senderCompany}
              onChange={(e) => handleInputChange('senderCompany', e.target.value)}
              placeholder="Your company name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senderContact">Your Contact Info:</label>
            <input
              type="text"
              id="senderContact"
              value={emailData.senderContact || ''}
              onChange={(e) => handleInputChange('senderContact', e.target.value)}
              placeholder="Phone number or additional contact info"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-preview">Preview Email</button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
