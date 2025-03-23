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
      <h2>Microsoft Support Onboarding</h2>
      <p>Click below to open the email builder</p>
      <button className="primary-button" onClick={openOptions}>
        Open Email Builder
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