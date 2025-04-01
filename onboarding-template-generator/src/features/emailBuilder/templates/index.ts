// src/features/emailBuilder/templates/index.ts
// Re-export the new React components from builders.tsx
export {
  SectionHeader,
  InstructionBox,
  StepIndicator,
  ContactsTable,
  ScriptBlock
} from './builders'; // This will now resolve to builders.tsx

// If functions from formatters.ts are still needed elsewhere,
// they would need to be imported and exported explicitly, possibly with aliases.
// For now, we assume only the themed versions from builders.tsx are required by emailBuilder.ts
// Note: formatters.ts might need separate handling if its functions are still used.
