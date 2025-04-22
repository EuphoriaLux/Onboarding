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

  // Base button style (can be moved to a shared location later)
  const buttonBaseStyle = "inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800";
  const primaryButtonBaseStyle = "inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800";
  const dangerButtonBaseStyle = "inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-offset-gray-800";


  return (
    // Container styling with spacing
    <div className="space-y-6">
      {/* Section title */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        2. Authorized Customer Contacts ({contacts.length}/{tier.authorizedContacts})
      </h2>

      {/* Grid layout for contact cards */}
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          // Contact card styling
          <div key={index} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            {/* Card header */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Contact #{index + 1}</h3>
              {/* Show remove button only if more than one contact */}
              {contacts.length > 1 && (
                <button
                  type="button"
                  className={dangerButtonBaseStyle} // Use danger style
                  onClick={() => removeContact(index)}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Contact fields layout (e.g., grid for responsiveness) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Form group styling */}
              <div className="mb-2 md:mb-0">
                {/* Label styling */}
                <label htmlFor={`contact-name-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                {/* Input styling */}
                <input
                  id={`contact-name-${index}`}
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="mb-2 md:mb-0">
                <label htmlFor={`contact-email-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  id={`contact-email-${index}`}
                  type="email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                  placeholder="email@company.com"
                  required
                />
              </div>

              <div className="mb-2 md:mb-0">
                <label htmlFor={`contact-phone-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  id={`contact-phone-${index}`}
                  type="tel"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add contact button styling */}
      {contacts.length < tier.authorizedContacts && (
        <div className="mt-4">
          <button
            type="button"
            className={primaryButtonBaseStyle} // Use primary style
            onClick={addContact}
          >
            Add Contact
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactsForm;
