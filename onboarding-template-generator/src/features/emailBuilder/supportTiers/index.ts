// src/features/supportTiers/index.ts
/**
 * Support Tiers Feature
 * Exports components, constants, and utilities for managing support tiers
 */

// Re-export components
export { default as TierSelector } from './components/TierSelector';

// Re-export constants
export { supportTiers } from './constants';

// Re-export types
export * from './types';

// Add any feature-specific hooks here
// Example: export { useTierSelector } from './hooks/useTierSelector';