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
    // Replace custom container class with Tailwind padding and max-width
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Title styling */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Email Template Generator</h2>
      {/* Info text styling */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Customize this email template to send to your client as part of the onboarding process.
        {/* Language indicator styling */}
        <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-300"> Current language: <strong>{languageDisplay()}</strong></span>
      </p>

      {/* Add spacing between form elements */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section styling: border, padding, rounded corners */}
        <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-800 space-y-4">
          {/* Section title styling */}
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Email Recipients</h3>
          {/* Form group styling: margin-bottom */}
          <div className="mb-4">
            {/* Label styling */}
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To:</label>
            {/* Input styling using @tailwindcss/forms plugin defaults + custom focus */}
            <input
              type="email"
              id="to"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              value={emailData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              placeholder="recipient@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cc:</label>
            <input
              type="email"
              id="cc"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              value={emailData.cc || ''}
              onChange={(e) => handleInputChange('cc', e.target.value)}
              placeholder="cc@example.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject:</label>
            <input
              type="text"
              id="subject"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              value={emailData.subject || ''}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Email subject"
            />
          </div>
        </div>

        {/* Section styling */}
        <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-800 space-y-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Onboarding Components</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Select the components to include in your onboarding email:</p>

          {/* Checkbox group styling */}
          <div className="space-y-4">
            {/* Checkbox container styling */}
            <div className="flex items-center">
              {/* Checkbox styling using @tailwindcss/forms */}
              <input
                type="checkbox"
                id="conditionalAccess"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                checked={emailData.conditionalAccess.checked}
                onChange={() => handleCheckboxToggle('conditionalAccess', 'checked')}
              />
              {/* Label styling */}
              <label htmlFor="conditionalAccess" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Conditional Access</label>
            </div>
            {emailData.conditionalAccess.checked && (
              // Nested options styling: padding, margin, border
              <div className="ml-6 pl-4 border-l border-gray-200 dark:border-gray-600 space-y-3">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Policies to Implement:</label>
                  {/* Inline checks container */}
                  <div className="space-y-2">
                    {/* Checkbox container styling */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="caMfa"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                        checked={emailData.conditionalAccess.mfa}
                        onChange={() => handleCheckboxToggle('conditionalAccess', 'mfa')}
                      />
                      <label htmlFor="caMfa" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">MFA Requirements</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="caLocation"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                        checked={emailData.conditionalAccess.location}
                        onChange={() => handleCheckboxToggle('conditionalAccess', 'location')}
                      />
                      <label htmlFor="caLocation" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Location-Based Access</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="caDevice"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                        checked={emailData.conditionalAccess.device}
                        onChange={() => handleCheckboxToggle('conditionalAccess', 'device')}
                      />
                      <label htmlFor="caDevice" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Device Compliance</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="caSignIn"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                        checked={emailData.conditionalAccess.signIn}
                        onChange={() => handleCheckboxToggle('conditionalAccess', 'signIn')}
                      />
                      <label htmlFor="caSignIn" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Sign-in Risk Policies</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checkbox group styling */}
          <div className="space-y-4">
             {/* Checkbox container styling */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="authorizedContacts"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                checked={emailData.authorizedContacts.checked}
                onChange={() => handleCheckboxToggle('authorizedContacts', 'checked')}
              />
              <label htmlFor="authorizedContacts" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Authorized Contacts Table</label>
            </div>
            {emailData.authorizedContacts.checked && (
              <div className="ml-6 pl-4 border-l border-gray-200 dark:border-gray-600 space-y-3">
                <div className="mb-4">
                  <label htmlFor="contactsRoles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommended Contact Roles:</label>
                  <input
                    type="text"
                    id="contactsRoles"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                    value={emailData.authorizedContacts.roles}
                    onChange={(e) => handleNestedChange('authorizedContacts', 'roles', e.target.value)}
                    placeholder="e.g., Technical Contact, Billing Contact"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section styling */}
        <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-800 space-y-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Additional Information</h3>

          <div className="mb-4">
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes or Instructions:</label>
            {/* Textarea styling */}
            <textarea
              id="additionalNotes"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              value={emailData.additionalNotes || ''}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Any additional information for the client..."
              rows={4}
            ></textarea>
          </div>
        </div>

        {/* Section styling */}
        <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-800 space-y-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Sender Information</h3>
          <div className="mb-4">
            <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name:</label>
            <input
              type="text"
              id="senderName"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              value={emailData.senderName}
              onChange={(e) => handleInputChange('senderName', e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="senderTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Title:</label>
            <input
              type="text"
              id="senderTitle"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              value={emailData.senderTitle}
              onChange={(e) => handleInputChange('senderTitle', e.target.value)}
              placeholder="Your job title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="senderCompany" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Company:</label>
            <input
              type="text"
              id="senderCompany"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              value={emailData.senderCompany}
              onChange={(e) => handleInputChange('senderCompany', e.target.value)}
              placeholder="Your company name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="senderContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Contact Info:</label>
            <input
              type="text"
              id="senderContact"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              value={emailData.senderContact || ''}
              onChange={(e) => handleInputChange('senderContact', e.target.value)}
              placeholder="Phone number or additional contact info"
            />
          </div>
        </div>

        {/* Form actions styling */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
          {/* Button styling */}
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800"
          >
            Preview Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
