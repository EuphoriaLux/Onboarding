// src/features/emailBuilder/templates/index.ts
// Explicitly export only the themed functions needed from builders.ts
// This avoids naming conflicts with formatters.ts
export {
  createSectionHeader,
  createInstructionBox,
  createStepIndicator,
  createContactsTable,
  formatScriptBlock
} from './builders';

// If functions from formatters.ts are still needed elsewhere,
// they would need to be imported and exported explicitly, possibly with aliases.
// For now, we assume only the themed versions from builders.ts are required by emailBuilder.ts
