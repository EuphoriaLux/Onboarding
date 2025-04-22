// src/popup.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppStateProvider } from './contexts/AppStateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './styles/tailwind.css';

const Popup: React.FC = () => {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="p-4 w-64 bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Microsoft Support Tools</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">Click below to open the tools dashboard</p>
      <button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        onClick={openOptions}
      >
        Open Dashboard
      </button>
    </div>
  );
};

// Create root element for React with context providers
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <LanguageProvider>
      <AppStateProvider>
        <Popup />
      </AppStateProvider>
    </LanguageProvider>
  );
}
