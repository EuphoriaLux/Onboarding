import React, { useState, useCallback, useEffect } from 'react'; // Import useEffect
import { Customer, AuthorizedContact } from '../../types';
import ContactList from '../contacts/ContactList';
import ContactForm from '../contacts/ContactForm';
import ContactView from '../contacts/ContactView';

interface CustomerViewProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onUpdateContact: (contact: AuthorizedContact) => void;
  onDeleteContact: (contactId: string) => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ customer, onUpdate, onDelete, onUpdateContact, onDeleteContact }) => {
  const [editingContact, setEditingContact] = useState<AuthorizedContact | null>(null);
  const [selectedContact, setSelectedContact] = useState<AuthorizedContact | null>(null);

  // Effect to update selectedContact/editingContact if the underlying customer.contacts changes
  useEffect(() => {
    if (selectedContact) {
      const updatedSelectedContact = customer.contacts?.find(c => c.id === selectedContact.id);
      if (updatedSelectedContact && updatedSelectedContact !== selectedContact) {
        setSelectedContact(updatedSelectedContact);
      }
    }
    if (editingContact) {
      const updatedEditingContact = customer.contacts?.find(c => c.id === editingContact.id);
      if (updatedEditingContact && updatedEditingContact !== editingContact) {
        setEditingContact(updatedEditingContact);
      }
    }
  }, [customer.contacts, selectedContact, editingContact]);

  const handleEditContact = (contact: AuthorizedContact) => {
    setSelectedContact(contact);
  };

  const handleSaveContact = useCallback((updatedContact: AuthorizedContact) => {
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

  const handleContactViewEdit = (contact: AuthorizedContact) => {
    setEditingContact(contact);
    setSelectedContact(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Customer Details</h2>

      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Company Information</h3>
        <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {customer.name}</p>
        {customer.internalName && <p className="text-gray-700 dark:text-gray-300"><strong>Internal Name:</strong> {customer.internalName}</p>}
        {customer.company && <p className="text-gray-700 dark:text-gray-300"><strong>Company:</strong> {customer.company}</p>}
      </div>

      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Contact Information</h3>
        {customer.email && <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {customer.email}</p>}
        {customer.phone && <p className="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> {customer.phone}</p>}
        {customer.contractOwnerName && <p className="text-gray-700 dark:text-gray-300"><strong>Contract Owner Name:</strong> {customer.contractOwnerName}</p>}
        {customer.contractOwnerEmail && <p className="text-gray-700 dark:text-gray-300"><strong>Contract Owner Email:</strong> {customer.contractOwnerEmail}</p>}
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Administrative Information</h3>
        {customer.status && <p className="text-gray-700 dark:text-gray-300"><strong>Status:</strong> {customer.status}</p>}
        {customer.onboardingStatus && <p className="text-gray-700 dark:text-gray-300"><strong>Onboarding Status:</strong> {customer.onboardingStatus}</p>}
        {customer.accountManager && <p className="text-gray-700 dark:text-gray-300"><strong>Account Manager:</strong> {customer.accountManager}</p>}
        {customer.supportPlan && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Support Plan</h3>
            <p className="text-gray-700 dark:text-gray-300"><strong>Type:</strong> {customer.supportPlan.type}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Start Date:</strong> {new Date(customer.supportPlan.startDate).toLocaleDateString()}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>End Date:</strong> {new Date(customer.supportPlan.endDate).toLocaleDateString()}</p>
          </div>
        )}
        <p className="text-gray-700 dark:text-gray-300"><strong>Joined:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Last Updated:</strong> {new Date(customer.updatedAt).toLocaleDateString()}</p>
      </div> {/* Closing div for Administrative Information */}

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
