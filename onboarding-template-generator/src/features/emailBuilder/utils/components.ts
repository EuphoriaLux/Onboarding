// src/features/emailBuilder/utils/components.ts
import { Language } from '../utils/types';
import { getTranslation } from './translationService';

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
 * Format script blocks with improved styling for better copy-paste compatibility
 */
export const formatImprovedScriptBlock = (scriptContent: string, language: Language = 'en'): string => {
  // Enhanced version with better styling for Outlook
  const cleanedScript = scriptContent.trim()
    .replace(/\t/g, '    ')
    .replace(/^\s*\n/gm, '');
  
  const scriptHeader = getTranslation('rbacScriptHeader', language);
  
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 25px 0; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; background-color: #2b579a; color: white; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: 600;">
                ${scriptHeader}
              </td>
            </tr>
            <tr>
              <td style="background-color: #f5f5f5; padding: 16px; font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 13px; line-height: 1.5;">
                <pre style="margin: 0; white-space: pre-wrap; overflow-wrap: break-word; background-color: #f5f5f5; font-family: Consolas, Monaco, 'Courier New', monospace;">${cleanedScript}</pre>
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

/**
 * Create an improved contacts table with better formatting
 */
export const createImprovedContactsTable = (rows: number, language: Language = 'en'): string => {
  // Enhanced version with better styling for Outlook
  // Get translated headers
  const numberHeader = getTranslation('numberHeader', language);
  const firstNameHeader = getTranslation('firstNameHeader', language);
  const lastNameHeader = getTranslation('lastNameHeader', language);
  const officePhoneHeader = getTranslation('officePhoneHeader', language);
  const mobilePhoneHeader = getTranslation('mobilePhoneHeader', language);
  const emailHeader = getTranslation('emailHeader', language);
  const jobTitleHeader = getTranslation('jobTitleHeader', language);
  
  // Create headers with improved styling
  let tableHTML = `
  <!--[if mso]>
  <style>
    table.contacts-table {
      border-collapse: collapse;
      width: 100%;
      border: 1px solid #dddddd;
    }
    table.contacts-table th, table.contacts-table td {
      border: 1px solid #dddddd;
      padding: 10px;
      text-align: left;
    }
    table.contacts-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
  </style>
  <![endif]-->
  
  <table class="contacts-table" width="100%" cellpadding="10" cellspacing="0" border="1" style="border-collapse: collapse; margin: 25px 0; border: 1px solid #dddddd; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    <tr style="background-color: #f0f0f0;">
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${numberHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${firstNameHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${lastNameHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${officePhoneHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${mobilePhoneHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${emailHeader}</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; background-color: #f0f0f0;">${jobTitleHeader}</th>
    </tr>`;
  
  // Create empty rows with alternating colors
  for (let i = 1; i <= rows; i++) {
    const bgColor = i % 2 === 0 ? '#f9f9f9' : '#ffffff';
    tableHTML += `
    <tr style="background-color: ${bgColor};">
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif;">${i}</td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif;"></td>
      <td style="border: 1px solid #ddd; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif;"></td>
    </tr>`;
  }
  
  tableHTML += `
  </table>`;
  
  return tableHTML;
};

/**
 * Creates a section header with tier-specific styling
 * 
 * @param title - The section title to display
 * @param color - The tier-specific color to use
 * @returns HTML string for the section header
 */
export const createSectionHeader = (title: string, color: string): string => {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 35px 0 20px 0;">
    <tr>
      <td style="padding: 0; background-color: #FFFFFF;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: #f8f8f8; border-left: 4px solid ${color}; border-radius: 0 4px 4px 0;">
          <tr>
            <td style="padding: 16px;">
              <h3 style="color: #333333; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0; padding: 0; font-weight: 600; background-color: #f8f8f8;">${title}</h3>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
};

/**
 * Creates an improved section header with better Outlook compatibility
 */
export const createImprovedSectionHeader = (title: string, color: string): string => {
  return `
  <!--[if mso]>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="mso-cellspacing: 0; mso-padding-alt: 0px 0px 0px 0px;">
    <tr>
      <td style="background-color: ${color}; width: 4px; padding: 0;">&nbsp;</td>
      <td style="padding: 16px; background-color: #f8f8f8;">
        <h3 style="color: #333333; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0; font-weight: 600;">${title}</h3>
      </td>
    </tr>
  </table>
  <![endif]-->
  
  <!-- Non-Outlook version -->
  <div style="border-left: 4px solid ${color}; padding-left: 15px; margin: 30px 0 20px 0; background-color: #f8f8f8; border-radius: 0 4px 4px 0;">
    <h3 style="color: #333333; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0; padding: 16px; font-weight: 600;">${title}</h3>
  </div>`;
};

/**
 * Creates an instruction box with visual styling
 * 
 * @param title - The title of the instruction box
 * @param content - The content for the instruction box
 * @returns HTML string for the instruction box
 */
export const createInstructionBox = (title: string, content: string): string => {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 20px 0; background-color: #FFFFFF;">
    <tr>
      <td style="padding: 0; background-color: #FFFFFF;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: #f0f7ff; border: 1px solid #cfe5ff; border-radius: 4px;">
          <tr>
            <td style="padding: 16px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333; background-color: #f0f7ff;">
              <div style="font-weight: bold; color: #0078D4; margin-bottom: 8px; font-size: 15px; background-color: #f0f7ff;">${title}</div>
              <div style="color: #333; background-color: #f0f7ff;">${content}</div>
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
 * @returns HTML string for the step indicator
 */
export const createStepIndicator = (number: number, title: string): string => {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 25px 0 15px 0; background-color: #FFFFFF;">
    <tr>
      <td style="padding: 0; vertical-align: middle; background-color: #FFFFFF;">
        <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: #FFFFFF;">
          <tr>
            <td style="width: 36px; height: 36px; background-color: #0078D4; border-radius: 50%; text-align: center; vertical-align: middle;">
              <span style="color: white; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; font-weight: bold; background-color: #0078D4;">${number}</span>
            </td>
            <td style="padding-left: 12px; background-color: #FFFFFF;">
              <span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; font-weight: 600; color: #333; background-color: #FFFFFF;">${title}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
};