import React, { useState, useEffect } from 'react';
import { AuthorizedContact } from '../../types';

interface ContactManagerProps {
  contacts: AuthorizedContact[];
  customerId: string;
  onChange: (contacts: AuthorizedContact[]) => void;
}

const ContactManager: React.FC<ContactManagerProps> = ({ contacts, customerId, onChange }) => {
  const [nextId, setNextId] = useState(contacts.length > 0 ? Math.max(...contacts.map(c => parseInt(c.id))) + 1 : 1);

  useEffect(() => {
    if (contacts.length > 0) {
      setNextId(Math.max(...contacts.map(c => parseInt(c.id))) + 1);
    } else {
      setNextId(1);
    }
  }, [contacts]);

  const handleContactChange = (index: number, field: keyof AuthorizedContact, value: string) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    onChange(updatedContacts);
  };

  const addContact = () => {
    const newContact: AuthorizedContact = {
      id: nextId.toString(),
      fullName: '', // Use fullName
      firstName: '', // Initialize firstName
      lastName: '', // Initialize lastName
      email: '',
      businessPhone: '', // Use businessPhone
      mobileNumber: '', // Initialize mobileNumber
      teamsAddress: '', // Initialize teamsAddress
      jobTitle: '',
      customerId: customerId,
      createdAt: new Date().toISOString(), // Add createdAt
    };
    onChange([...contacts, newContact]);
    setNextId(nextId + 1);
  };

  const removeContact = (index: number) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    onChange(updatedContacts);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Contacts</h3>
      {contacts.map((contact, index) => (
        <div key={contact.id} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Contact #{index + 1}</h4>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              onClick={() => removeContact(index)}
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            <div>
              <label htmlFor={`contact-fullName-${contact.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                id={`contact-fullName-${contact.id}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                value={contact.fullName}
                onChange={(e) => handleContactChange(index, 'fullName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`contact-email-${contact.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                id={`contact-email-${contact.id}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                value={contact.email}
                onChange={(e) => handleContactChange(index, 'email', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`contact-businessPhone-${contact.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Phone</label>
              <input
                type="tel"
                id={`contact-businessPhone-${contact.id}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                value={contact.businessPhone || ''}
                onChange={(e) => handleContactChange(index, 'businessPhone', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`contact-mobileNumber-${contact.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
              <input
                type="tel"
                id={`contact-mobileNumber-${contact.id}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                value={contact.mobileNumber || ''}
                onChange={(e) => handleContactChange(index, 'mobileNumber', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`contact-teamsAddress-${contact.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teams Address</label>
              <input
                type="text"
                id={`contact-teamsAddress-${contact.id}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                value={contact.teamsAddress || ''}
                onChange={(e) => handleContactChange(index, 'teamsAddress', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`contact-jobTitle-${contact.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
              <input
                type="text"
                id={`contact-jobTitle-${contact.id}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                value={contact.jobTitle || ''}
                onChange={(e) => handleContactChange(index, 'jobTitle', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        onClick={addContact}
      >
        Add Contact
      </button>
    </div>
  );
};

export default ContactManager;
