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
    <div className="language-selector">
      <label htmlFor="language-select">Template Language:</label>
      <select 
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value as Language)}
        className="language-select"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
