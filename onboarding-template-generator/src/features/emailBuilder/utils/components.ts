// src/features/emailBuilder/utils/components.ts
import { Language } from '../utils/types';
import { getTranslation } from './translationService';

/**
 * Format script blocks for better copy-paste compatibility with email clients
 * 
 * @param scriptContent - The PowerShell script content to format
 * @param language - The language to use for translations
 * @returns HTML string containing the contacts table
 */
export const formatScriptBlock = (scriptContent: string, language: Language = 'en'): string => {
  // Clean up the script content
  const cleanedScript = scriptContent.trim()
    .replace(/\t/g, '    ') // Replace tabs with spaces for consistency
    .replace(/^\s*\n/gm, ''); // Remove empty lines
  
  // Get translation for script header
  const scriptHeader = getTranslation('rbacScriptHeader', language);
  
  return `
    <div class="my-8">
      <div class="bg-gray-100 dark:bg-gray-700 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-md">
        <h3 class="text-gray-800 dark:text-gray-200 font-semibold text-lg p-4">${scriptHeader}</h3>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4">
        <pre class="font-mono text-sm whitespace-pre-wrap break-words">${cleanedScript}</pre>
      </div>
    </div>`;
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
    <div class="my-8">
      <div class="bg-gray-100 dark:bg-gray-700 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-md">
        <h3 class="text-gray-800 dark:text-gray-200 font-semibold text-lg p-4">${scriptHeader}</h3>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-4">
        <pre class="font-mono text-sm whitespace-pre-wrap break-words">${cleanedScript}</pre>
      </div>
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
  <div class="my-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4">
    <div class="font-semibold text-blue-700 dark:text-blue-300 mb-2">${title}</div>
    <div class="text-gray-700 dark:text-gray-300">${content}</div>
  </div>`;
};

/**
 * Creates a step indicator for numbered instructions
 * 
 * @param number - The step number
 * @param title - The step title
 * @returns HTML string for the step indicator
 */
export const createStepIndicator = (number: number, title: string) => {
  return `
  <div class="my-6 flex items-center">
    <div class="w-9 h-9 bg-blue-500 rounded-full text-center flex items-center justify-center">
      <span class="text-white font-bold text-lg">${number}</span>
    </div>
    <div class="ml-3">
      <span class="font-semibold text-gray-800 dark:text-gray-200 text-lg">${title}</span>
    </div>
  </div>`;
};

/**
 * Create an improved contacts table with better formatting
 */
export const createImprovedContactsTable = (rows: number, language: Language = 'en'): string => {
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
  
  <table class="min-w-full border border-gray-300 dark:border-gray-700" style="border-collapse: collapse; margin: 1.5rem 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    <thead class="bg-gray-100 dark:bg-gray-700">
      <tr>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">${numberHeader}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">${firstNameHeader}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">${lastNameHeader}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">${officePhoneHeader}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">${mobilePhoneHeader}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">${emailHeader}</th>
        <th class="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">${jobTitleHeader}</th>
      </tr>
    </thead>
    <tbody>`;

  // Create empty rows with alternating colors
  for (let i = 1; i <= rows; i++) {
    const bgColorClass = i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700';
    tableHTML += `
    <tr class="${bgColorClass}">
      <td class="px-4 py-2 border border-gray-300 dark:border-gray-700">${i}</td>
      <td class="px-4 py-2 border border-gray-300 dark:border-gray-700"></td>
      <td class="px-4 py-2 border border-gray-300 dark:border-gray-700"></td>
      <td class="px-4 py-2 border border-gray-300 dark:border-gray-700"></td>
      <td class="px-4 py-2 border border-gray-300 dark:border-gray-700"></td>
      <td class="px-4 py-2 border border-gray-300 dark:border-gray-700"></td>
      <td class="px-4 py-2 border border-gray-300 dark:border-gray-700"></td>
    </tr>`;
  }

  tableHTML += `
    </tbody>
  </table>`;

  return tableHTML;
};

/**
 * Creates a section header with tier-specific styling
 */
export const createSectionHeader = (title: string, color: string) => {
  return `
  <div class="my-8">
    <div class="bg-gray-100 dark:bg-gray-700 border-l-4" style="border-left-color: ${color};">
      <h3 class="text-gray-800 dark:text-gray-200 font-semibold text-lg p-4">${title}</h3>
    </div>
  </div>`;
};

/**
 * Creates an improved section header with better Outlook compatibility
 */
export const createImprovedSectionHeader = (title: string, color: string) => {
  return `
  <div class="my-8">
    <div class="bg-gray-100 dark:bg-gray-700 border-l-4 rounded-r-md" style="border-left-color: ${color};">
      <h3 class="text-gray-800 dark:text-gray-200 font-semibold text-lg p-4">${title}</h3>
    </div>
  </div>`;
};
