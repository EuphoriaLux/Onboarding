// src/features/emailBuilder/templates/builders.ts
import { Language } from '../utils/types';
import { getTranslation } from '../utils/translationService';

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
 * Creates an info box with visual styling for instructions
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