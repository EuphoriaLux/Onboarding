// src/features/emailBuilder/templates/builders.ts
import { Language } from '../utils/types';
import { getTranslation } from '../utils/translationService';
import { ThemeSettings } from '../../../types'; // Import ThemeSettings

/**
 * Creates a section header with tier-specific styling
 * 
 * @param title - The section title to display
 * @param color - The tier-specific color to use
 * @param theme - The theme settings object
 * @returns HTML string for the section header
 */
export const createSectionHeader = (title: string, color: string, theme: ThemeSettings): string => {
  const headerBgColor = theme.backgroundColor ? `${theme.backgroundColor}1A` : '#f8f8f8'; // Use lightened theme bg or fallback grey
  const headerTextColor = theme.textColor || '#333333'; // Fallback
  const mainBgColor = theme.backgroundColor || '#FFFFFF'; // Fallback white

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 35px 0 20px 0;">
    <tr>
      <td style="padding: 0; background-color: ${mainBgColor};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: ${headerBgColor}; border-left: 4px solid ${color}; border-radius: 0 4px 4px 0;">
          <tr>
            <td style="padding: 16px;">
              <h3 style="color: ${headerTextColor}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0; padding: 0; font-weight: 600; background-color: ${headerBgColor};">${title}</h3>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
};

/**
 * Creates an HTML table for authorized contacts with theme support.
 *
 * @param contacts - Array of contact objects.
 * @param theme - The theme settings object.
 * @returns HTML string for the contacts table.
 */
export const createContactsTable = (contacts: Array<{name: string, email: string, phone: string}>, theme: ThemeSettings): string => {
  let tableRows = '';
  const textColor = theme.textColor || '#333';
  const headerBgColor = theme.backgroundColor ? `${theme.backgroundColor}1A` : '#f0f0f0';
  const rowBgColor1 = theme.backgroundColor || '#FFFFFF';
  const rowBgColor2 = theme.backgroundColor ? `${theme.backgroundColor}0D` : '#f9f9f9';
  const tableStyle = `border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: ${theme.backgroundColor || '#FFFFFF'};`; // Apply bg

  contacts.forEach((contact, index) => {
    const bgColor = index % 2 === 0 ? rowBgColor2 : rowBgColor1;
    tableRows += `
      <tr style="background-color: ${bgColor};">
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">${contact.name || ''}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">${contact.email || ''}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">${contact.phone || ''}</td>
      </tr>`;
  });

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin: 15px 0;">
      <tr style="background-color: ${headerBgColor};">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Name</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Email</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Phone</th>
      </tr>
      ${tableRows}
    </table>`;
};

/**
 * Formats a script block with theme support.
 *
 * @param scriptContent - The raw script content.
 * @param theme - The theme settings object.
 * @returns HTML string for the formatted script block using a <pre> tag.
 */
export const formatScriptBlock = (scriptContent: string, theme: ThemeSettings): string => {
  // Keep the cleaning part
  const cleanedScript = scriptContent.trim()
    .replace(/\t/g, '    ')
    .replace(/^\s*\n/gm, '');

  // Define styles based on theme
  const scriptBgColor = theme.backgroundColor ? `${theme.backgroundColor}0D` : '#f5f5f5';
  const scriptTextColor = theme.textColor || '#333';
  const borderColor = '#ddd'; // Use a consistent border color

  // Style for the <pre> tag - using inline styles for better email client compatibility
  const preStyle = `background-color: ${scriptBgColor}; border: 1px solid ${borderColor}; border-radius: 4px; padding: 15px; font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 13px; line-height: 1.45; color: ${scriptTextColor}; white-space: pre; word-wrap: normal; overflow-x: auto; margin: 15px 0;`;

  // Escape HTML entities within the script content
  const escapeHtml = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&amp;") // Ensure this is "&amp;"
         .replace(/</g, "&lt;")  // Ensure this is "&lt;"
         .replace(/>/g, "&gt;")  // Ensure this is "&gt;"
         .replace(/"/g, "&quot;") // Ensure this is "&quot;"
         .replace(/'/g, "&#039;"); 
  }

  // Return the <pre> tag with escaped script content and inline styles
  return `<pre style="${preStyle}">${escapeHtml(cleanedScript)}</pre>`;
};

/**
 * Creates an info box with visual styling for instructions
 * 
 * @param title - The title of the instruction box
 * @param content - The content for the instruction box
 * @param theme - The theme settings object
 * @returns HTML string for the instruction box
 */
export const createInstructionBox = (title: string, content: string, theme: ThemeSettings): string => {
  const boxBgColor = theme.primaryColor ? `${theme.primaryColor}1A` : '#f0f7ff'; // Lightened primary or fallback blueish
  const boxTextColor = theme.textColor || '#333'; // Fallback
  const primaryColor = theme.primaryColor || '#0078D4'; // Fallback
  const mainBgColor = theme.backgroundColor || '#FFFFFF'; // Fallback white

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 20px 0; background-color: ${mainBgColor};">
    <tr>
      <td style="padding: 0; background-color: ${mainBgColor};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: ${boxBgColor}; border: 1px solid ${primaryColor}33; border-radius: 4px;">
          <tr>
            <td style="padding: 16px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${boxTextColor}; background-color: ${boxBgColor};">
              <div style="font-weight: bold; color: ${primaryColor}; margin-bottom: 8px; font-size: 15px; background-color: ${boxBgColor};">${title}</div>
              <div style="color: ${boxTextColor}; background-color: ${boxBgColor};">${content}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
};

/**
 * Creates a step indicator for numbered instructions
 * 
 * @param number - The step number
 * @param title - The step title
 * @param theme - The theme settings object
 * @returns HTML string for the step indicator
 */
export const createStepIndicator = (number: number, title: string, theme: ThemeSettings): string => {
  const primaryColor = theme.primaryColor || '#0078D4'; // Fallback
  const stepTextColor = theme.textColor || '#333'; // Fallback
  const mainBgColor = theme.backgroundColor || '#FFFFFF'; // Fallback white

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 25px 0 15px 0; background-color: ${mainBgColor};">
    <tr>
      <td style="padding: 0; vertical-align: middle; background-color: ${mainBgColor};">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: ${mainBgColor};">
          <tr>
            <td style="width: 36px; height: 36px; background-color: ${primaryColor}; border-radius: 50%; text-align: center; vertical-align: middle;">
              <span style="color: white; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; font-weight: bold; background-color: ${primaryColor};">${number}</span>
            </td>
            <td style="padding-left: 12px; background-color: ${mainBgColor};">
              <span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; font-weight: 600; color: ${stepTextColor}; background-color: ${mainBgColor};">${title}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
};
