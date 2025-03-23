// src/services/i18n/index.ts
/**
 * Internationalization (i18n) Service
 * Manages translations and language support
 */

import { Translations } from '../../features/emailBuilder/types'; 
import translations from '../../features/emailBuilder/translations';

// Supported languages
export type Language = 'en' | 'de' | 'fr';

// All translations
export interface AllTranslations {
  en: Translations;
  de: Translations;
  fr: Translations;
}

export class I18nService {
  /**
   * Get translation for a key in the specified language
   * 
   * @param key - The translation key
   * @param language - The language code (en, de, fr)
   * @param replacements - Optional replacements for placeholders
   * @returns The translated string
   */
  static translate(
    key: string, 
    language: Language = 'en', 
    replacements?: Record<string, string | number>
  ): string {
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
  }

  /**
   * Get the display name for a language code
   * 
   * @param language - Language code
   * @returns Display name of the language
   */
  static getLanguageDisplay(language: Language): string {
    switch (language) {
      case 'en': return 'English';
      case 'de': return 'Deutsch';
      case 'fr': return 'Français';
      default: return 'English';
    }
  }

  /**
   * Get all supported languages
   * 
   * @returns Array of language objects with code and display name
   */
  static getSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' },
      { code: 'fr', name: 'Français' }
    ];
  }
}