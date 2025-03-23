// src/options.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './features/common';
import { AppStateProvider } from './contexts/AppStateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './styles/App.css';

// Create root element for React with context providers
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <LanguageProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </LanguageProvider>
  );
}