import React from 'react';
import { EmailRecipient } from '../types/AppTypes';

interface EmailRecipientsFormProps {
  recipients: EmailRecipient;
  onRecipientChange: (field: string, value: string) => void;
  onCustomerEmailChange: (email: string) => void;
}

const EmailRecipientsForm: React.FC<EmailRecipientsFormProps> = ({
  recipients,
  onRecipientChange,
  onCustomerEmailChange
}) => {
  const handleChange = (field: string, value: string) => {
    onRecipientChange(field, value);
    if (field === 'to') {
      onCustomerEmailChange(value);
    }
  };

  return (
    // Container with spacing
    <div className="space-y-4">
      {/* Section title */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Email Recipients</h2>

      {/* Form group: To */}
      <div className="mb-4">
        {/* Label styling */}
        <label htmlFor="to-field" className="block text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
        {/* Input styling */}
        <input
          id="to-field"
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          value={recipients.to}
          onChange={(e) => handleChange('to', e.target.value)}
          placeholder="recipient@example.com"
          required
        />
        {/* Small text styling */}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Use semicolons (;) to separate multiple addresses.</p>
      </div>

      {/* Form group: Cc */}
      <div className="mb-4">
        <label htmlFor="cc-field" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cc:</label>
        <input
          id="cc-field"
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          value={recipients.cc}
          onChange={(e) => handleChange('cc', e.target.value)}
          placeholder="cc@example.com"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Use semicolons (;) to separate multiple addresses.</p>
      </div>
    </div>
  );
};

export default EmailRecipientsForm;
