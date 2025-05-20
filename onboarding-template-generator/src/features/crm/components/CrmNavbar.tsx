import React from 'react';

interface CrmNavbarProps {
  onViewChange: (view: 'customers' | 'contacts' | 'create' | 'update' | 'delete') => void;
}

const CrmNavbar: React.FC<CrmNavbarProps> = ({ onViewChange }) => {
  return (
    <nav className="bg-gray-200 dark:bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">CRM</span>
        <div className="space-x-4">
          <button onClick={() => onViewChange('customers')} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Customers
          </button>
          <button onClick={() => onViewChange('contacts')} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Contacts
          </button>
          <button onClick={() => onViewChange('create')} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Create Customer
          </button>
          <button onClick={() => onViewChange('update')} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Update Customer
          </button>
           <button onClick={() => onViewChange('delete')} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Delete Customer
          </button>
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default CrmNavbar;
