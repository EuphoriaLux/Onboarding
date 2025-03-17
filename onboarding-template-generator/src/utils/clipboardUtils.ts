// src/utils/clipboardUtils.ts

/**
 * Utility to copy rich text (HTML) to clipboard with enhanced formatting preservation
 */
export const copyRichTextToClipboard = (html: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary div with the HTML content
      const container = document.createElement('div');
      
      // Important: set contentEditable to make it selectable
      container.setAttribute('contenteditable', 'true');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.opacity = '0';
      
      // Add special attributes for Outlook
      container.setAttribute('data-outlook-preserve', 'true');
      
      // Process the HTML to enhance PowerShell script formatting for copy-paste
      const processedHtml = processPowerShellScripts(html);
      
      container.innerHTML = processedHtml;
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
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Process HTML to enhance PowerShell scripts for better copy-paste experience
 */
const processPowerShellScripts = (html: string): string => {
  // Look for PowerShell script sections and replace them with plaintext versions
  // that will copy-paste better while preserving the visual styling
  
  const scriptPattern = /<table[^>]*class="powershell-script-container"[^>]*>[\s\S]*?<\/table>/g;
  
  return html.replace(scriptPattern, (match) => {
    // Extract the actual script content
    const contentMatch = match.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
    if (!contentMatch || !contentMatch[1]) return match;
    
    // Get the plain script content (removing HTML tags but keeping whitespace)
    const scriptContent = contentMatch[1]
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    
    // Create a new div that will render nicely but copy as plain text
    return `
      <div class="powershell-script-container" style="margin: 15px 0; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="padding: 12px 16px; background-color: #2b579a; color: white; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold;">
          PowerShell Script
        </div>
        <div style="background-color: #f8f8f8; padding: 16px;">
          <pre style="margin: 0; white-space: pre-wrap; font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 13px; line-height: 1.5;">${scriptContent}</pre>
        </div>
      </div>
    `;
  });
};

/**
 * Enhanced copy function for all content
 */
export const copyFormattedContent = async (html: string, plainText: string): Promise<void> => {
  try {
    // First try the rich text copy with enhanced PowerShell formatting
    await copyRichTextToClipboard(html);
  } catch (err) {
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