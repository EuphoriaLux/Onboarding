import React, { useState, useCallback } from 'react';
import { Customer, Contact } from '../types';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import ContactView from './ContactView';

interface CustomerViewProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ customer, onUpdate, onDelete, onUpdateContact, onDeleteContact }) => {
  const [name, setName] = useState(customer.name);
  const [company, setCompany] = useState(customer.company || '');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleSubmit = () => {
    const updatedCustomer = { ...customer, name, company };
    onUpdate(updatedCustomer);
    setEditingCustomer(false);
  };

  const handleEditContact = (contact: Contact) => {
    //setEditingContact(contact);
    setSelectedContact(contact);
  };

  const handleSaveContact = useCallback((updatedContact: Contact) => {
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

  const handleEditCustomer = () => {
    setEditingCustomer(true);
  };

  const handleCancelEditCustomer = () => {
    setEditingCustomer(false);
  };

const handleContactViewEdit = (contact: Contact) => {
    setEditingContact(contact);
    setSelectedContact(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Customer View</h2>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Company Information</h3>
          <p>Name: {customer.name}</p>
          {customer.internalName && <p>Internal Name: {customer.internalName}</p>}
          {customer.company && <p>Company: {customer.company}</p>}
        </div>
      </div>

      {editingCustomer ? (
        <div>
          <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Edit Customer</h3>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="name">
                Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="company">
                Company:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                id="company"
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Update Customer
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:hover:bg-gray-700 ml-2"
              onClick={handleCancelEditCustomer}
            >
              Cancel
            </button>
          </form>
        </div>
      ) : null}

      {/* Removed Add Contact button from here */}

      {editingContact ? (
        <ContactForm
          contact={editingContact}
          onSave={handleSaveContact}
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

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Notes</h3>
        {customer.notes && customer.notes.length > 0 ? (
          <ul>
            {customer.notes.map((note, index) => (
              <li key={index}>{note.text}</li>
            ))}
          </ul>
        ) : (
          <p>No notes found.</p>
        )}
      </div>
      <div className="mb-4">
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
