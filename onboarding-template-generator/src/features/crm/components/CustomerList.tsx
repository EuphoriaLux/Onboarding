import React from 'react';
import { Customer } from '../types';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onSelectCustomer }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Customer List</h2>
      {customers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No customers found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {customers.map(customer => (
            <li key={customer.id} className="text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded" onClick={() => onSelectCustomer(customer)}>{customer.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerList;
