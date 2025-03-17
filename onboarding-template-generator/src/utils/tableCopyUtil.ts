// src/utils/tableCopyUtil.ts

/**
 * Special utility for copying tables with proper formatting
 * This is specifically designed to work better with email clients
 */

export const copyTableToClipboard = (tableHtml: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Create a temporary container
        const container = document.createElement('div');
        
        // Add special attributes for better clipboard handling
        container.setAttribute('contenteditable', 'true');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.opacity = '0';
        
        // Include Microsoft Office specific code to help with table formatting
        const officeTable = prepareTableForOutlook(tableHtml);
        
        container.innerHTML = officeTable;
        document.body.appendChild(container);
        
        // Select the content
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(container);
        selection?.removeAllRanges();
        selection?.addRange(range);
        
        // Execute copy command
        const successful = document.execCommand('copy');
        
        // Clean up
        selection?.removeAllRanges();
        document.body.removeChild(container);
        
        if (successful) {
          resolve();
        } else {
          reject(new Error('Unable to copy table to clipboard'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };
  
  /**
   * Prepare table HTML for better Outlook compatibility
   */
  const prepareTableForOutlook = (tableHtml: string): string => {
    // Add Outlook-specific table formatting and mso properties
    return `
      <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      
      <!--[if gte mso 9]>
      <style>
        table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; border:1px solid #dddddd; }
        td, th { border:1px solid #dddddd; padding:8px; }
      </style>
      <![endif]-->
      
      ${tableHtml}
    `;
  };
  
  /**
   * Extract just the contacts table HTML from a complete email HTML
   */
  export const extractContactsTable = (emailHtml: string): string => {
    // Find the contacts table in the email HTML
    const tableMatch = emailHtml.match(/<table[^>]*class="contacts-table"[^>]*>[\s\S]*?<\/table>/);
    if (tableMatch && tableMatch[0]) {
      return tableMatch[0];
    }
    return '';
  };
  
  export default {
    copyTableToClipboard,
    extractContactsTable
  };