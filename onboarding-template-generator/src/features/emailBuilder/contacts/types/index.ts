// src/features/contacts/types/index.ts
/**
 * Contact management related type definitions
 */

/**
 * Contact information interface
 */
export interface Contact {
    name: string;
    email: string;
    phone: string;
  }
  
  /**
   * Contacts form props interface
   */
  export interface ContactsFormProps {
    contacts: Contact[];
    selectedTier: string;
    onChange: (contacts: Contact[]) => void;
  }