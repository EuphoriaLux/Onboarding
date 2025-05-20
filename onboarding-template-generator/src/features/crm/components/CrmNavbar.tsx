import React from 'react';
import { Link } from 'react-router-dom';

const CrmNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-200 dark:bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">CRM</span>
        <div className="space-x-4">
          <Link to="/crm/customers" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Customers
          </Link>
          <Link to="/crm/contacts" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Contacts
          </Link>
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default CrmNavbar;
