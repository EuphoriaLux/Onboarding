// src/components/LanguageSelector.tsx - Moved from features/common/components
import React from 'react';
import { Language } from '../services/i18n'; // Adjusted path

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onChange
}) => {
  return (
    // Container with spacing
    <div className="space-y-2">
      {/* Label styling */}
      <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template Language:</label>
      {/* Select styling using @tailwindcss/forms */}
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value as Language)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
