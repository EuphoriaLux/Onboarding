import React from 'react';

interface CrmNavbarProps {
  onViewChange: (view: 'customers' | 'tenantMatching') => void;
  currentView: 'customers' | 'tenantMatching'; // Add currentView prop to highlight active button
}

const CrmNavbar: React.FC<CrmNavbarProps> = ({ onViewChange, currentView }) => {
  const getButtonClasses = (viewName: 'customers' | 'tenantMatching') =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
     ${currentView === viewName
        ? 'bg-[var(--primary-color-light)] text-white dark:bg-[var(--primary-color-dark)]'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
     }`;

  return (
    <nav className="bg-gray-200 dark:bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <span className="text-xl font-bold text-gray-800 dark:text-gray-200">CRM</span>
        <div className="flex space-x-2"> {/* Use flex and space-x for better control */}
          <button
            onClick={() => onViewChange('customers')}
            className={getButtonClasses('customers')}
          >
            Customers
          </button>
          <button
            onClick={() => onViewChange('tenantMatching')}
            className={getButtonClasses('tenantMatching')}
          >
            Tenant Matching
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CrmNavbar;
