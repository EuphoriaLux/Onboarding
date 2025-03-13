// src/utils/clipboardUtils.ts

/**
 * Utility to copy rich text (HTML) to clipboard
 * This implementation uses document.execCommand('copy') with HTML content
 * to preserve formatting when pasting into applications like Outlook
 */
export const copyRichTextToClipboard = (html: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary div with the HTML content
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'fixed';
      container.style.pointerEvents = 'none';
      container.style.opacity = '0';
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
 * Alternative implementation using Clipboard API for modern browsers
 * Note: This may not preserve HTML formatting in all applications
 */
export const copyToClipboardModern = async (text: string, html?: string): Promise<void> => {
  if (!navigator.clipboard) {
    return copyRichTextToClipboard(html || text);
  }

  try {
    if (html && navigator.clipboard.write) {
      // Use ClipboardItem API if available for HTML content
      const type = 'text/html';
      const blob = new Blob([html], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
    } else {
      // Fallback to text-only copy
      await navigator.clipboard.writeText(text);
    }
  } catch (err) {
    console.error('Clipboard API failed, falling back to execCommand', err);
    return copyRichTextToClipboard(html || text);
  }
};

/**
 * Enhanced copy function that tries multiple approaches to ensure
 * HTML formatting is preserved when possible
 */
export const copyFormattedContent = async (html: string, plainText: string): Promise<void> => {
  try {
    // First try the modern Clipboard API with HTML support
    if (navigator.clipboard && 'write' in navigator.clipboard) {
      await copyToClipboardModern(plainText, html);
      return;
    }
    
    // Fall back to execCommand approach for better compatibility
    await copyRichTextToClipboard(html);
  } catch (err) {
    console.error('Rich text copy failed, falling back to plain text', err);
    // Last resort - plain text copy
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