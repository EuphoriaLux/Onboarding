import { ThemeSettings } from '../types';

/**
 * Applies the saved theme colors as CSS variables to the root element.
 * @param settings - The theme settings object containing color values.
 */
export const applyThemeColors = (settings: ThemeSettings | null): void => {
  const root = document.documentElement;
  if (!root) return;

  // Define default colors (should match CSS defaults)
  // Define default colors for light and dark mode
  const defaultLight: ThemeSettings = {
    primaryColor: '#CC0000',
    textColor: '#666666',
    backgroundColor: 'white',
  };

  const defaultDark: ThemeSettings = {
    primaryColor: '#CC0000',
    textColor: '#FFFFFF',
    backgroundColor: '#1e293b',
  };

  // Use saved settings or fall back to defaults
  const lightPrimary = settings?.primaryColor || defaultLight.primaryColor;
  const lightText = settings?.textColor || defaultLight.textColor;
  const lightBackground = settings?.backgroundColor || defaultLight.backgroundColor;

  const darkPrimary = settings?.darkPrimaryColor || defaultDark.primaryColor;
  const darkText = settings?.darkTextColor || defaultDark.textColor;
  const darkBackground = settings?.darkBackgroundColor || defaultDark.backgroundColor;

  // Set CSS variables for light mode
  root.style.setProperty('--primary-color-light', lightPrimary);
  root.style.setProperty('--text-color-light', lightText);
  root.style.setProperty('--background-light-light', lightBackground);

  // Set CSS variables for dark mode
  root.style.setProperty('--primary-color-dark', darkPrimary);
  root.style.setProperty('--text-color-dark', darkText);
  root.style.setProperty('--background-light-dark', darkBackground);

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
