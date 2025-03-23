// src/options.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppStateProvider } from './contexts/AppStateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Homepage } from './features/homepage';
import './styles/App.css';
import './styles/Homepage.css';

// Create root element for React with context providers
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <LanguageProvider>
      <AppStateProvider>
        <Homepage />
      </AppStateProvider>
    </LanguageProvider>
  );
}