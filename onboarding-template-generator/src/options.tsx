// src/options.tsx
import React, { useEffect } from 'react'; // Import useEffect
import { createRoot } from 'react-dom/client';
import { AppStateProvider } from './contexts/AppStateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Homepage } from './features/homepage';
import { StorageService } from './services/storage'; // Import StorageService
import { ThemeSettings } from './types'; // Import ThemeSettings
import { applyThemeColors } from './utils/themeUtils'; // Import applyThemeColors
import './styles/tailwind.css';

// Component to handle theme loading
const OptionsApp: React.FC = () => {
  useEffect(() => {
    // Load theme settings on initial mount and apply them
    StorageService.get<ThemeSettings>('themeSettings')
      .then(settings => {
        // Convert undefined to null for applyThemeColors
        applyThemeColors(settings ?? null);
      })
      .catch(error => {
        console.error("Error loading theme settings:", error);
        applyThemeColors(null); // Apply default theme on error
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <LanguageProvider>
      <AppStateProvider>
        <Homepage />
      </AppStateProvider>
    </LanguageProvider>
  );
};


// Create root element for React with context providers
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<OptionsApp />); // Render the new wrapper component
}
