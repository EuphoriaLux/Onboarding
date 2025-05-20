import React from 'react';
import { AzureLogin } from '../features/supportRequests/components/AzureLogin';
import { useAppState } from '../contexts/AppStateContext';
import { SunIcon, MoonIcon } from './Icons';

const Navbar: React.FC = () => {
  const { state, toggleDarkMode } = useAppState();

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-4">
          {/* Brand/logo area */}
          <a href="#" className="text-blue-500 hover:text-blue-700">CRM</a>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={state.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {state.darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <AzureLogin />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
