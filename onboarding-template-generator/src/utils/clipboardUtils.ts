// src/utils/enhancedClipboardUtils.ts

/**
 * Enhanced utility for copying rich text (HTML) to clipboard with better email client compatibility
 * Specifically optimized for Outlook and other email clients
 */
export const copyRichTextToClipboard = (html: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary container
      const container = document.createElement('div');
      
      // Important: set contentEditable to make it selectable
      container.setAttribute('contenteditable', 'true');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.opacity = '0';
      
      // Add special attributes for Outlook
      container.setAttribute('data-outlook-preserve', 'true');
      
      // Apply preprocessing to fix common styling issues
      const enhancedHtml = preprocessHtml(html);
      
      container.innerHTML = enhancedHtml;
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
        reject(new Error('Unable to copy HTML to clipboard'));
      }
    } catch (err: unknown) {
      reject(err);
    }
  });
};

/**
 * Preprocesses HTML before copying to improve compatibility with email clients
 */
const preprocessHtml = (html: string): string => {
  // 1. Add Office/Outlook specific metadata
  const metaBlock = `
    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <style type="text/css">
      /* Outlook-specific styles */
      table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
      td, th { padding: 12px !important; }
      .mso-line-height-rule: exactly !important;
      body, div, p, table, td, th, span { background-color: #FFFFFF !important; }
      body { margin: 0 !important; padding: 0 !important; }
      
      /* Force white background */
      body, .email-body { background-color: #FFFFFF !important; }
      
      /* Improved spacing */
      p { margin-bottom: 16px !important; line-height: 1.6 !important; }
      h1, h2, h3 { margin-top: 24px !important; margin-bottom: 16px !important; }
      .section-space { margin-top: 30px !important; margin-bottom: 30px !important; }
      td { padding: 12px !important; }
    </style>
  `;
  
  // 2. Process the HTML to enhance it
  // Fix background color issues by adding explicit background-color to elements
  let processedHtml = html
    .replace(/<body/g, '<body bgcolor="#FFFFFF" style="background-color: #FFFFFF !important; margin: 0; padding: 0;"')
    .replace(/<div style="/g, '<div style="background-color: #FFFFFF !important; ')
    .replace(/<table/g, '<table bgcolor="#FFFFFF" cellspacing="0" cellpadding="12" border="0"')
    .replace(/<td style="/g, '<td style="background-color: #FFFFFF !important; padding: 12px !important; ')
    .replace(/<th style="/g, '<th style="background-color: #FFFFFF !important; padding: 12px !important; ')
    .replace(/<p style="/g, '<p style="margin-bottom: 16px !important; line-height: 1.6 !important; ')
    .replace(/<span style="/g, '<span style="background-color: transparent !important; ');
  
  // 3. Add meta block after the <head> tag
  processedHtml = processedHtml.replace(/<head>/, '<head>' + metaBlock);
  
  // 4. Fix spacing issues by adding more consistent spacing
  processedHtml = processedHtml
    .replace(/<div class="section/g, '<div class="section-space section')
    .replace(/margin: 0 0 15px 0/g, 'margin: 0 0 20px 0')
    .replace(/margin-bottom: 20px/g, 'margin-bottom: 30px')
    .replace(/padding: 16px/g, 'padding: 20px')
    .replace(/line-height: 1.5/g, 'line-height: 1.6');
  
  // 5. Process PowerShell scripts for better formatting
  processedHtml = processPowerShellScripts(processedHtml);
  
  return processedHtml;
};

/**
 * Process HTML to enhance PowerShell scripts for better copy-paste experience
 */
const processPowerShellScripts = (html: string): string => {
  // Look for PowerShell script sections and enhance them for better copying
  const scriptPattern = /<pre[^>]*>([\s\S]*?)<\/pre>/g;
  
  return html.replace(scriptPattern, (match: string, scriptContent: string) => {
    // Clean the script content
    const cleanScript = scriptContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (match: string, dec: string) => String.fromCharCode(parseInt(dec, 10)));
    
    // Create a better formatted script container with improved styling
    return `
      <div style="background-color: #f5f5f5 !important; border: 1px solid #ddd; border-radius: 4px; padding: 20px; margin: 24px 0; font-family: Consolas, Monaco, 'Courier New', monospace;">
        <div style="padding: 8px 12px; background-color: #2b579a; color: white; margin-bottom: 12px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: 600; border-radius: 3px;">
          PowerShell Script
        </div>
        <pre style="margin: 0; font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 13px; line-height: 1.5; white-space: pre-wrap; background-color: #f5f5f5 !important;">${cleanScript}</pre>
      </div>
    `;
  });
};

/**
 * Enhanced copy function for all content
 * Includes better email client compatibility
 */
export const copyFormattedContent = async (html: string, plainText: string): Promise<void> => {
  try {
    // First try the rich text copy with enhanced formatting
    await copyRichTextToClipboard(html);
  } catch (err: unknown) {
    console.error('Rich text copy failed, falling back to plain text', err);
    // Fall back to plain text copy
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(plainText);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = plainText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
};

export default {
  copyRichTextToClipboard,
  copyFormattedContent
};