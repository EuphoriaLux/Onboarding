// src/components/EmailForm.tsx - Update imports and fix implicit any errors
import React, { useState, useEffect } from 'react';
import { supportTiers } from '../../supportTiers/constants';
import { CustomerInfo, EmailFormData } from '../types';
import { Language } from '../../../services/i18n';
import emailBuilder from '../utils/emailBuilder';

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
  const [emailData, setEmailData] = useState<EmailFormData>(
    emailBuilder.processCustomerInfoToEmailData(customerInfo, language)
  );

  useEffect(() => {
    // Update email data when customer info or language changes
    setEmailData(emailBuilder.processCustomerInfoToEmailData(customerInfo, language));
  }, [customerInfo, language]);

  const handleInputChange = (field: string, value: any) => {
    setEmailData((prev: EmailFormData) => ({ // Fix implicit any
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setEmailData((prev: EmailFormData) => { // Fix implicit any
      const currentSection = prev[section as keyof EmailFormData] as Record<string, any>;
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
      const currentSection = prev[section as keyof EmailFormData] as Record<string, any>;
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
          
          <div className="checkbox-group">
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                id="gdap" 
                checked={emailData.gdap.checked}
                onChange={() => handleCheckboxToggle('gdap', 'checked')} 
              />
              <label htmlFor="gdap">GDAP (Granular Delegation of Administrative Privileges)</label>
            </div>
            {emailData.gdap.checked && (
              <div className="nested-options">
                <div className="form-group">
                  <label htmlFor="gdapDeadline">Implementation Deadline:</label>
                  <input
                    type="text"
                    id="gdapDeadline"
                    value={emailData.gdap.deadline}
                    onChange={(e) => handleNestedChange('gdap', 'deadline', e.target.value)}
                    placeholder="e.g., June 30, 2025"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gdapLink">GDAP Link:</label>
                  <input
                    type="text"
                    id="gdapLink"
                    value={emailData.gdap.link}
                    onChange={(e) => handleNestedChange('gdap', 'link', e.target.value)}
                    placeholder="GDAP approval link"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="checkbox-group">
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                id="rbac" 
                checked={emailData.rbac.checked}
                onChange={() => handleCheckboxToggle('rbac', 'checked')} 
              />
              <label htmlFor="rbac">RBAC (Role-Based Access Control)</label>
            </div>
            {emailData.rbac.checked && (
              <div className="nested-options">
                <div className="form-group">
                  <label htmlFor="rbacGroups">Security Groups to Configure:</label>
                  <input
                    type="text"
                    id="rbacGroups"
                    value={emailData.rbac.groups}
                    onChange={(e) => handleNestedChange('rbac', 'groups', e.target.value)}
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
                        checked={emailData.rbac.azure}
                        onChange={() => handleCheckboxToggle('rbac', 'azure')} 
                      />
                      <label htmlFor="rbacAzure">Azure RBAC</label>
                    </div>
                    <div className="checkbox-container">
                      <input 
                        type="checkbox" 
                        id="rbacM365" 
                        checked={emailData.rbac.m365}
                        onChange={() => handleCheckboxToggle('rbac', 'm365')} 
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
                      checked={emailData.rbac.includeScript}
                      onChange={() => handleCheckboxToggle('rbac', 'includeScript')} 
                    />
                    <label htmlFor="includeRbacScript">Include PowerShell Script</label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
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
          <div className="form-group">
            <label htmlFor="meetingDate">Onboarding Meeting Date (if applicable):</label>
            <input
              type="text"
              id="meetingDate"
              value={emailData.meetingDate || ''}
              onChange={(e) => handleInputChange('meetingDate', e.target.value)}
              placeholder="e.g., March 20, 2025 at 2:00 PM EST"
            />
          </div>
          
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