// src/types/index.ts
/**
 * Global type definitions used across features
 */

// Re-export types from feature modules that are used globally
export * from '../features/supportTiers/types';
export * from '../features/tenants/types';
export * from '../features/contacts/types';
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