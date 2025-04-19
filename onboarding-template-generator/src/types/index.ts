
// src/types/index.ts
/**
 * Global type definitions used across features
 */

// Re-export types from feature modules that are used globally
export * from '../features/emailBuilder/supportTiers/types'; // Adjusted path
export * from '../features/emailBuilder/tenants/types'; // Adjusted path
export * from '../features/emailBuilder/contacts/types'; // Adjusted path
export * from '../features/emailBuilder/utils/types';

/**
 * Base user interface
 */
export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Application configuration settings
 */
export interface AppConfig {
  version: string;
  environment: 'development' | 'production';
  defaultLanguage: string;
  features: {
    emailBuilder: boolean;
    tenantManager: boolean;
    multiLanguage: boolean;
  };
}

/**
 * Theme customization settings
 */
export interface ThemeSettings {
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
}

/**
 * Agent details used in email generation
 */
export interface AgentSettings {
  agentName: string;
  agentTitle: string;
  companyName: string;
  agentEmail: string;
}
