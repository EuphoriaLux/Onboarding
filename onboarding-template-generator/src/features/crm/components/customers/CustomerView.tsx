import React, { useState, useCallback } from 'react';
import { Customer, AuthorizedContact } from '../../types'; // Changed Contact to AuthorizedContact
import ContactList from '../contacts/ContactList';
import ContactForm from '../contacts/ContactForm';
import ContactView from '../contacts/ContactView';

interface CustomerViewProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onUpdateContact: (contact: AuthorizedContact) => void; // Changed Contact to AuthorizedContact
  onDeleteContact: (contactId: string) => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ customer, onUpdate, onDelete, onUpdateContact, onDeleteContact }) => {
  const [editingContact, setEditingContact] = useState<AuthorizedContact | null>(null); // Changed Contact to AuthorizedContact
  const [selectedContact, setSelectedContact] = useState<AuthorizedContact | null>(null); // Changed Contact to AuthorizedContact

  const handleEditContact = (contact: AuthorizedContact) => { // Changed Contact to AuthorizedContact
    setSelectedContact(contact);
  };

  const handleSaveContact = useCallback((updatedContact: AuthorizedContact) => { // Changed Contact to AuthorizedContact
    console.log('handleSaveContact called with:', updatedContact);
    console.log('onUpdateContact:', onUpdateContact);
    if (typeof onUpdateContact === 'function') {
      onUpdateContact(updatedContact);
      setEditingContact(null);
      setSelectedContact(null);
    } else {
      console.error('onUpdateContact is not a function!');
    }
  }, [onUpdateContact]);

  const handleCancelEditContact = () => {
    setEditingContact(null);
    setSelectedContact(null);
  };

  const handleContactViewEdit = (contact: AuthorizedContact) => { // Changed Contact to AuthorizedContact
    setEditingContact(contact);
    setSelectedContact(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Customer Details</h2>
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Company Information</h3>
        <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {customer.name}</p>
        {customer.internalName && <p className="text-gray-700 dark:text-gray-300"><strong>Internal Name:</strong> {customer.internalName}</p>}
        {customer.company && <p className="text-gray-700 dark:text-gray-300"><strong>Company:</strong> {customer.company}</p>}
        {customer.email && <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {customer.email}</p>}
        {customer.phone && <p className="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> {customer.phone}</p>}
        {customer.status && <p className="text-gray-700 dark:text-gray-300"><strong>Status:</strong> {customer.status}</p>}
        {customer.onboardingStatus && <p className="text-gray-700 dark:text-gray-300"><strong>Onboarding Status:</strong> {customer.onboardingStatus}</p>}
        <p className="text-gray-700 dark:text-gray-300"><strong>Joined:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Last Updated:</strong> {new Date(customer.updatedAt).toLocaleDateString()}</p>
      </div>

      {editingContact && customer.id ? ( // Ensure customer.id is available
        <ContactForm
          initialContact={editingContact} // Renamed prop
          customerId={customer.id} // Pass customerId
          onSubmit={handleSaveContact}
          onCancel={handleCancelEditContact}
        />
      ) : selectedContact ? (
        <ContactView
          contact={selectedContact}
          onEdit={() => setEditingContact(selectedContact)}
        />
      ) : (
        <div className="mb-4">
          <ContactList
            contacts={customer.contacts || []}
            onEditContact={handleEditContact}
            onDeleteContact={onDeleteContact}
          />
        </div>
      )}

      <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Notes</h3>
        {customer.notes && customer.notes.length > 0 ? (
          <ul>
            {customer.notes.map((note, index) => (
              <li key={index}>{note.text}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No notes found.</p>
        )}
      </div>
      <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Activities</h3>
        {/* Add activities section here */}
      </div>
      <button
        type="button"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-red-600 dark:hover:bg-red-700"
        onClick={() => onDelete(customer.id)}
      >
        Delete Customer
      </button>
    </div>
  );
};

export default CustomerView;
