import React from 'react';
import { AuthorizedContact } from '../../types';

interface ContactListProps {
  contacts: AuthorizedContact[];
  onEditContact?: (contact: AuthorizedContact) => void;
  onDeleteContact?: (contactId: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onEditContact, onDeleteContact }) => {
  return (
    <div>
      <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Contacts</h3>
      {contacts && contacts.length > 0 ? (
        <ul>
          {contacts.map(contact => (
            <li key={contact.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <div>
                {contact.fullName} ({contact.email})
              </div>
              <div>
                {onEditContact && (
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700 ml-2"
                    onClick={() => onEditContact(contact)}
                  >
                    View
                  </button>
                )}
                {onDeleteContact && (
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-red-600 dark:hover:bg-red-700 ml-2"
                    onClick={() => onDeleteContact(contact.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No contacts found.</p>
      )}
    </div>
  );
};

export default ContactList;
