// src/features/tenants/index.ts
/**
 * Tenant Management Feature
 * Exports components, hooks, and utilities for managing tenant information
 */

// Re-export components
export { default as TenantForm } from './components/TenantForm';
export { default as TenantManager } from './components/TenantManager';

// Re-export types
export * from './types';

// Add any feature-specific hooks here
// Example: export { useTenants } from './hooks/useTenants';