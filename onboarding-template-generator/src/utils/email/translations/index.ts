// src/utils/email/translations/index.ts
import { AllTranslations } from '../types';
import en from './en';
import de from './de';
import fr from './fr';

/**
 * Object containing translations for all supported languages
 */
const translations: AllTranslations = {
  en,
  de,
  fr
};

export default translations;