import { createContactsTable } from './formatters';
import { getTranslation } from '../utils/translationService';
import { Language } from '../utils/types';

// Mock the translation service
jest.mock('../utils/translationService', () => ({
  getTranslation: jest.fn((key: string, language: Language) => {
    // Provide simple mock translations for testing
    const translations: { [lang: string]: { [key: string]: string } } = {
      en: {
        numberHeader: '#',
        firstNameHeader: 'First Name',
        lastNameHeader: 'Last Name',
        officePhoneHeader: 'Office Phone',
        mobilePhoneHeader: 'Mobile Phone',
        emailHeader: 'Email',
        jobTitleHeader: 'Job Title',
      },
      fr: {
        numberHeader: 'N°',
        firstNameHeader: 'Prénom',
        lastNameHeader: 'Nom',
        officePhoneHeader: 'Téléphone Bureau',
        mobilePhoneHeader: 'Téléphone Mobile',
        emailHeader: 'Email',
        jobTitleHeader: 'Poste',
      }
    };
    return translations[language]?.[key] || `[${key}-${language}]`;
  }),
}));

describe('Email Template Formatters', () => {
  describe('createContactsTable', () => {
    beforeEach(() => {
      // Clear mock calls before each test
      (getTranslation as jest.Mock).mockClear();
    });

    it('should generate a table with the correct number of rows', () => {
      const rows = 3;
      const html = createContactsTable(rows, 'en');
      
      // Check for table structure
      expect(html).toContain('<table');
      expect(html).toContain('</table>');
      
      // Check for header row + data rows
      const rowMatches = html.match(/<tr/g);
      expect(rowMatches).toHaveLength(rows + 1); // Header row + data rows
    });

    it('should use correct English headers when language is "en"', () => {
      createContactsTable(1, 'en');
      
      // Check if getTranslation was called with correct keys for 'en'
      expect(getTranslation).toHaveBeenCalledWith('numberHeader', 'en');
      expect(getTranslation).toHaveBeenCalledWith('firstNameHeader', 'en');
      expect(getTranslation).toHaveBeenCalledWith('lastNameHeader', 'en');
      expect(getTranslation).toHaveBeenCalledWith('officePhoneHeader', 'en');
      expect(getTranslation).toHaveBeenCalledWith('mobilePhoneHeader', 'en');
      expect(getTranslation).toHaveBeenCalledWith('emailHeader', 'en');
      expect(getTranslation).toHaveBeenCalledWith('jobTitleHeader', 'en');

      // Check if the mocked English headers are in the output
      const html = createContactsTable(1, 'en');
      expect(html).toContain('>#<');
      expect(html).toContain('>First Name<');
      expect(html).toContain('>Last Name<');
      expect(html).toContain('>Office Phone<');
      expect(html).toContain('>Mobile Phone<');
      expect(html).toContain('>Email<');
      expect(html).toContain('>Job Title<');
    });

    it('should use correct French headers when language is "fr"', () => {
       createContactsTable(1, 'fr');

       // Check if getTranslation was called with correct keys for 'fr'
       expect(getTranslation).toHaveBeenCalledWith('numberHeader', 'fr');
       // ... (add checks for other headers if needed)

       // Check if the mocked French headers are in the output
       const html = createContactsTable(1, 'fr');
       expect(html).toContain('>N°<');
       expect(html).toContain('>Prénom<');
       // ... (add checks for other headers if needed)
    });

    it('should generate alternating row background colors', () => {
      const html = createContactsTable(2, 'en');
      expect(html).toContain('style="background-color: #ffffff;"'); // Row 1
      expect(html).toContain('style="background-color: #f9f9f9;"'); // Row 2
    });
  });
});
