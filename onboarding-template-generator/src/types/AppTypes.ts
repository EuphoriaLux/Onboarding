// Types for App component state and props
interface EmailRecipient {
  to: string;
  cc: string;
  subject: string;
}

interface AgentSettings {
  agentName: string;
  agentTitle: string;
  companyName: string;
  agentEmail: string;
}

interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

interface EmailData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  proposedSlots: Date[];
  tenantId: string;
  selectedTier: string;
  emailContacts: any[]; // TODO: Replace with proper contact type
  to: string;
  cc: string;
  subject: string;
  includeMeetingSlots: boolean;
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
  additionalNotes: string;
  senderName: string;
  senderTitle: string;
  senderCompany: string;
  senderContact: string;
  currentDate: string;
  language: string;
}

interface CustomerInfo {
  contactName: string;
  contactEmail: string;
  selectedTier: string;
  authorizedContacts: any[]; // TODO: Replace with proper contact type
  tenants: any[]; // TODO: Replace with proper tenant type
  proposedSlots: Date[];
}

export type { EmailRecipient, AgentSettings, ThemeSettings, EmailData, CustomerInfo };
