import React from 'react';
import { Contact } from '../types';

interface ContactViewProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
}

const ContactView: React.FC<ContactViewProps> = ({ contact, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Contact View</h2>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Contact Information</h3>
          <p>Name: {contact.name}</p>
          <p>Email: {contact.email}</p>
          <p>Phone: {contact.phone}</p>
          <p>Job Title: {contact.jobTitle}</p>
        </div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={() => onEdit(contact)}
        >
          Edit Contact
        </button>
      </div>
    </div>
  );
};

export default ContactView;
