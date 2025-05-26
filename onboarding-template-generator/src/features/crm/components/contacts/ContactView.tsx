import React from 'react';
import { AuthorizedContact } from '../../types';

interface ContactViewProps {
  contact: AuthorizedContact;
  onEdit: (contact: AuthorizedContact) => void;
}

const ContactView: React.FC<ContactViewProps> = ({ contact, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Contact View</h2>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Contact Information</h3>
          <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {contact.fullName}</p>
          {contact.email && <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {contact.email}</p>}
          {contact.businessPhone && <p className="text-gray-700 dark:text-gray-300"><strong>Business Phone:</strong> {contact.businessPhone || 'N/A'}</p>}
          {contact.mobileNumber && <p className="text-gray-700 dark:text-gray-300"><strong>Mobile Number:</strong> {contact.mobileNumber || 'N/A'}</p>}
          {contact.teamsAddress && <p className="text-gray-700 dark:text-gray-300"><strong>Teams Address:</strong> {contact.teamsAddress || 'N/A'}</p>}
          {contact.jobTitle && <p className="text-gray-700 dark:text-gray-300"><strong>Job Title:</strong> {contact.jobTitle}</p>}
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
