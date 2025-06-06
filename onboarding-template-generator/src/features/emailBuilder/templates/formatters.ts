// src/features/emailBuilder/templates/formatters.ts
import { Language } from '../utils/types';
import { getTranslation } from '../utils/translationService';

/**
 * Format script blocks for better copy-paste compatibility with email clients
 * 
 * @param scriptContent - The PowerShell script content to format
 * @param language - The language to use for translations
 * @returns HTML string containing the formatted script block
 */
export const formatScriptBlock = (scriptContent: string, language: Language = 'en'): string => {
  // Clean up the script content
  const cleanedScript = scriptContent.trim()
    .replace(/\t/g, '    ') // Replace tabs with spaces for consistency
    .replace(/^\s*\n/gm, ''); // Remove empty lines
  
  // Get translation for script header
  const scriptHeader = getTranslation('rbacScriptHeader', language);
  
  // Plain pre-formatted text works better for copy-paste than styled HTML with syntax highlighting
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="powershell-script-container" style="border-collapse: collapse; margin: 25px 0; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; background-color: #2b579a; color: white; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: 600;">
                ${scriptHeader}
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8f8f8; padding: 16px;">
                <pre style="margin: 0; font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 13px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: break-word;">${cleanedScript}</pre>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
};

/**
 * Create a multi-column table for contacts, compatible with Outlook
 * 
 * @param rows - The number of rows to create in the table
 * @param language - The language to use for translations
 * @returns HTML string containing the contacts table
 */
export const createContactsTable = (rows: number, language: Language = 'en'): string => {
  // Get translated headers
  const numberHeader = getTranslation('numberHeader', language);
  const firstNameHeader = getTranslation('firstNameHeader', language);
  const lastNameHeader = getTranslation('lastNameHeader', language);
  const officePhoneHeader = getTranslation('officePhoneHeader', language);
  const mobilePhoneHeader = getTranslation('mobilePhoneHeader', language);
  const emailHeader = getTranslation('emailHeader', language);
  const jobTitleHeader = getTranslation('jobTitleHeader', language);
  
  // Create headers
  let tableHTML = `
  <table class="contacts-table" width="100%" cellpadding="0" cellspacing="0" border="1" style="border-collapse: collapse; margin: 25px 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    <tr style="background-color: #f0f0f0;">
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${numberHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${firstNameHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${lastNameHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${officePhoneHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${mobilePhoneHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${emailHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${jobTitleHeader}</th>
    </tr>`;
  
  // Create empty rows
  for (let i = 1; i <= rows; i++) {
    const bgColor = i % 2 === 0 ? '#f9f9f9' : '#ffffff';
    tableHTML += `
    <tr style="background-color: ${bgColor};">
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: normal;">${i}</td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: normal;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: normal;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: normal;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: normal;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: normal;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: normal;"></td>
    </tr>`;
  }
  
  tableHTML += `
  </table>`;
  
  return tableHTML;
};