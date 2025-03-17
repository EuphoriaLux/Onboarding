// src/utils/email/translationService.ts
import { Language } from './types';
import translations from './translations';

/**
 * Get translation for a key in the specified language
 * 
 * @param key - The translation key
 * @param language - The language code (en, de, fr)
 * @param replacements - Optional replacements for placeholders
 * @returns The translated string
 */
export const getTranslation = (
  key: string, 
  language: Language = 'en', 
  replacements?: Record<string, string | number>
): string => {
  const langTranslations = translations[language] || translations.en;
  let result = langTranslations[key] || translations.en[key] || key;
  
  // Special handling for support type based on tier
  if (key === 'supportType' && replacements?.tier) {
    const tierKey = `supportType.${replacements.tier}`;
    if (langTranslations[tierKey]) {
      result = langTranslations[tierKey];
    } else if (langTranslations['supportType.other']) {
      result = langTranslations['supportType.other'];
    }
  }
  
  // Replace placeholders
  if (replacements) {
    Object.keys(replacements).forEach(placeholder => {
      const value = replacements[placeholder];
      result = result.replace(new RegExp(`{${placeholder}}`, 'g'), String(value));
    });
  }
  
  return result;
};