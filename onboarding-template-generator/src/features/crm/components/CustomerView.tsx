import React from 'react';
import { Customer, Contact } from '../types';
import ContactManager from './ContactManager';

interface CustomerViewProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onAddContact: () => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ customer, onUpdate, onDelete, onAddContact }) => {

  const handleContactChange = (updatedContacts: Contact[]) => {
    const updatedCustomer: Customer = {
      ...customer,
      contacts: updatedContacts,
    };
    onUpdate(updatedCustomer);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Customer View</h2>
      <div>
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Company Information</h3>
        <p>Name: {customer.name}</p>
        {customer.internalName && <p>Internal Name: {customer.internalName}</p>}
        {customer.company && <p>Company: {customer.company}</p>}
      </div>
      <div className="mb-4">
        <ContactManager
          contacts={customer.contacts}
          customerId={customer.id}
          onChange={handleContactChange}
        />
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700 mt-2"
          onClick={() => onAddContact()}
        >
          Add Contact
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">Notes</h3>
        {/* Add notes section here */}
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
