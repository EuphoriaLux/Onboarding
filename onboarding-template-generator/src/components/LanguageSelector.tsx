// src/components/LanguageSelector.tsx
import React from 'react';

export type Language = 'en' | 'fr' | 'de';

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