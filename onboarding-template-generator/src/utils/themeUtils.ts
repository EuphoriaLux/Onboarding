import { ThemeSettings } from '../types';

/**
 * Applies the saved theme colors as CSS variables to the root element.
 * @param settings - The theme settings object containing color values.
 */
export const applyThemeColors = (settings: ThemeSettings | null): void => {
  const root = document.documentElement;
  if (!root) return;

  // Define default colors (should match CSS defaults)
  const defaults: ThemeSettings = {
    primaryColor: '#0078d4',
    textColor: '#323130',
    backgroundColor: '#f5f5f5',
  };

  // Use saved settings or fall back to defaults
  const primary = settings?.primaryColor || defaults.primaryColor;
  const text = settings?.textColor || defaults.textColor;
  const background = settings?.backgroundColor || defaults.backgroundColor;

  // Set CSS variables
  root.style.setProperty('--primary-color', primary);
  root.style.setProperty('--text-color', text);
  root.style.setProperty('--background-light', background); // Assuming this is the main background variable

  // Optional: You might need to update related variables too (e.g., hover states)
  // Example: Calculate a hover color based on the primary color
  // root.style.setProperty('--primary-hover', calculateHoverColor(primary));
};

// Example helper function (optional) - implement actual logic if needed
// const calculateHoverColor = (baseColor: string): string => {
//   // Basic example: darken the color slightly
//   // Implement a more robust color manipulation library for production
//   // For now, just return a slightly darker hardcoded value or the base color
//   if (baseColor === '#0078d4') return '#106ebe';
//   return baseColor;
// };
