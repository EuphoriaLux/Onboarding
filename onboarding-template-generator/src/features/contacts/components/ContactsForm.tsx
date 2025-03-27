// src/components/ContactsForm.tsx
import React from 'react';
import { supportTiers } from '../data/supportTiers';

interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface ContactsFormProps {
  contacts: Contact[];
  selectedTier: string;
  onChange: (contacts: Contact[]) => void;
}

const ContactsForm: React.FC<ContactsFormProps> = ({ contacts, selectedTier, onChange }) => {
  const tier = supportTiers[selectedTier];
  
  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    // --- DEBUGGING START ---
    console.log(`ContactsForm: Updating index ${index}, field ${field} to "${value}". New contacts array:`, JSON.stringify(updatedContacts));
    // --- DEBUGGING END ---
    onChange(updatedContacts);
  };

  const addContact = () => {
    if (contacts.length < tier.authorizedContacts) {
      onChange([...contacts, { name: '', email: '', phone: '' }]);
    }
  };

  const removeContact = (index: number) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    onChange(updatedContacts);
  };

  return (
    <div className="contacts-form">
      <h2>2. Authorized Customer Contacts ({contacts.length}/{tier.authorizedContacts})</h2>
      
      {contacts.map((contact, index) => (
        <div key={index} className="contact-card">
          <div className="contact-header">
            <h3>Contact #{index + 1}</h3>
            {contacts.length > 1 && (
              <button 
                type="button" 
                className="remove-button"
                onClick={() => removeContact(index)}
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="contact-fields">
            <div className="form-group">
              <label htmlFor={`contact-name-${index}`}>Name</label>
              <input
                id={`contact-name-${index}`}
                type="text"
                value={contact.name}
                onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`contact-email-${index}`}>Email</label>
              <input
                id={`contact-email-${index}`}
                type="email"
                value={contact.email}
                onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                placeholder="email@company.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`contact-phone-${index}`}>Phone</label>
              <input
                id={`contact-phone-${index}`}
                type="tel"
                value={contact.phone}
                onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                placeholder="+1 (123) 456-7890"
              />
            </div>
          </div>
        </div>
      ))}
      
      {contacts.length < tier.authorizedContacts && (
        <button 
          type="button" 
          className="add-button"
          onClick={addContact}
        >
          Add Contact
        </button>
      )}
    </div>
  );
};

export default ContactsForm;
