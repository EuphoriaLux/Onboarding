// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, I18nService } from '../services/i18n';
import { StorageService } from '../services/storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, replacements?: Record<string, string | number>) => string;
  getLanguageDisplay: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from storage on initial render
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await StorageService.get<Language>('language');
        if (savedLanguage) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language from storage:', error);
      }
    };
    
    loadLanguage();
  }, []);

  // Save language to storage when it changes
  useEffect(() => {
    StorageService.set('language', language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const translate = (key: string, replacements?: Record<string, string | number>): string => {
    return I18nService.translate(key, language, replacements);
  };

  const getLanguageDisplay = (): string => {
    return I18nService.getLanguageDisplay(language);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      translate,
      getLanguageDisplay
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};