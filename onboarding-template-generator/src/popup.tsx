// src/popup.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppStateProvider } from './contexts/AppStateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './styles/App.css';

const Popup: React.FC = () => {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="popup-container">
      <h2>Microsoft Support Tools</h2>
      <p>Click below to open the tools dashboard</p>
      <button className="primary-button" onClick={openOptions}>
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