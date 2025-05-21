import React from 'react';
import { Customer } from '../types';
import { useAppState } from '../../../contexts/AppStateContext';

interface CustomerListProps {
  customers: Customer[];
  // Removed onSelectCustomer prop
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => { // Removed onSelectCustomer from props
  const { deleteCustomer, setSelectedCustomerId } = useAppState(); // Get setSelectedCustomerId from context

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {customers.map(customer => (
            <tr key={customer.id} onClick={() => setSelectedCustomerId(customer.id)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"> {/* Use context setter */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-300">{customer.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-300">{customer.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
