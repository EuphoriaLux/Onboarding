// src/features/emailBuilder/utils/types.ts
import { TenantInfo } from '../../tenants/types'; // Import TenantInfo

/**
 * Email form data interface defining the structure for email templates
 */
export interface EmailFormData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  // proposedDate: Date | string; // Replaced by proposedSlots
  tenantId: string; // Note: This might be redundant if using CustomerInfo.tenants
  selectedTier: string;
  emailContacts: { name: string; email: string; phone: string }[];
  to: string;
  cc?: string;
  subject?: string;
  // gdap property removed
  // rbac property removed
  conditionalAccess: {
    checked: boolean;
    mfa: boolean;
    location: boolean;
    device: boolean;
    signIn: boolean;
  };
  authorizedContacts: {
    checked: boolean;
    roles: string;
  };
  // meetingDate?: string; // Replaced by proposedSlots
  proposedSlots: Date[]; // Array of selected slot start times
  includeMeetingSlots?: boolean; // Flag to include the meeting section
  additionalNotes?: string;
  senderName: string;
  senderTitle: string;
  senderCompany: string;
  senderContact?: string;
  currentDate: string;
  language?: string;
}

/**
 * Interface for customer information
 */
export interface CustomerInfo {
  companyName: string;
  contactName: string;
  contactEmail: string;
  // proposedDate: Date; // Replaced by proposedSlots
  proposedSlots: Date[]; // Array of selected slot start times
  // tenantId: string; // Removed single tenant ID
  tenants: TenantInfo[]; // Added array of tenants
  authorizedContacts: Array<{name: string, email: string, phone: string}>;
  selectedTier: string;
}

/**
 * Type definition for supported languages
 */
export type Language = 'en' | 'de' | 'fr';

/**
 * Interface for translations
 */
export interface Translations {
  [key: string]: string;
}

/**
 * Interface for all translations organized by language
 */
export interface AllTranslations {
  en: Translations;
  de: Translations;
  fr: Translations;
}
