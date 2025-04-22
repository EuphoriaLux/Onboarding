import React from 'react';
// Import AzureLogin from its location within the supportRequests feature
import { AzureLogin } from '../features/supportRequests/components/AzureLogin';

const Navbar: React.FC = () => {
  return (
    // Navigation bar container
    <nav className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
      {/* Content container */}
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Brand/logo area (currently empty) */}
        <div className="font-bold text-gray-800 dark:text-gray-200">
          {/* Add logo or title here later */}
        </div>
        {/* Authentication area */}
        <div className="flex items-center">
          <AzureLogin />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
