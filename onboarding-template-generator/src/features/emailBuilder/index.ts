// src/features/emailBuilder/index.ts
/**
 * Email Builder Feature
 * Exports components, utilities, and templates for email generation
 */

// Components
export { default as EmailForm } from './components/EmailForm';
export { default as EmailPreview } from './components/EmailPreview';
export { default as OutlookInstructions } from './components/OutlookInstructions';

// Utilities
export { default as emailBuilder } from './utils/emailBuilder';

// Templates
export * from './templates';

// Types
export * from './utils/types';