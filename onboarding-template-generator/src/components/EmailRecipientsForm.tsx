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
    <div className="form-section email-recipients-section">
      <h2>Email Recipients</h2>
      <div className="form-group">
        <label htmlFor="to-field">To:</label>
        <input
          id="to-field"
          type="email"
          value={recipients.to}
          onChange={(e) => handleChange('to', e.target.value)}
          placeholder="recipient@example.com"
          required
        />
        <small className="form-text">Use semicolons (;) to separate multiple addresses.</small>
      </div>
      <div className="form-group">
        <label htmlFor="cc-field">Cc:</label>
        <input
          id="cc-field"
          type="email"
          value={recipients.cc}
          onChange={(e) => handleChange('cc', e.target.value)}
          placeholder="cc@example.com"
        />
        <small className="form-text">Use semicolons (;) to separate multiple addresses.</small>
      </div>
    </div>
  );
};

export default EmailRecipientsForm;
