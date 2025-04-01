// src/features/emailBuilder/utils/clipboardUtils.ts
/**
 * Utilities for clipboard operations with enhanced formatting support
 */

/**
 * Copy rich text (HTML) to clipboard with better email client compatibility
 * 
 * @param html - HTML content to copy
 * @returns Promise resolving when copy is complete
 */
export const copyFormattedContent = async (html: string, plainText: string): Promise<void> => {
    try {
      // First try the rich text copy with enhanced formatting, passing plainText as fallback
      await copyRichTextToClipboard(html, plainText);
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
  
  /**
   * Copy rich text (HTML) to clipboard
   * Uses a contentEditable div to preserve HTML formatting
   * 
   * @param html - HTML content to copy
   * @param plainText - Plain text version for clipboard fallback
   * @returns Promise resolving when copy is complete
   */
  export const copyRichTextToClipboard = async (html: string, plainText: string): Promise<void> => {
    // Use navigator.clipboard.write for modern browsers
    if (navigator.clipboard && navigator.clipboard.write) {
      try {
        // Preprocess HTML for better compatibility
        const enhancedHtml = preprocessHtml(html);

        // Generate plain text from the enhanced HTML using innerText
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = enhancedHtml;
        // Remove comments before getting innerText
        tempDiv.querySelectorAll('comment').forEach(comment => comment.remove());
        // Use the original plainText directly to preserve formatting, especially for code blocks
        const generatedPlainText = plainText; 

        const htmlBlob = new Blob([enhancedHtml], { type: 'text/html' });
        const textBlob = new Blob([generatedPlainText], { type: 'text/plain' });

        const clipboardItem = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        });

        await navigator.clipboard.write([clipboardItem]);
        // Resolve the promise if write is successful
        return Promise.resolve();
      } catch (err) {
        console.error('navigator.clipboard.write failed:', err);
        // Reject the promise to trigger fallback in copyFormattedContent
        return Promise.reject(err);
      }
    } else {
      // Fallback for older browsers using the contentEditable div method
      // Note: This fallback might still have the original formatting issues for plain text.
      console.warn('navigator.clipboard.write not available, using fallback copy method.');
      return new Promise((resolve, reject) => {
        try {
          // Create a temporary container
        const container = document.createElement('div');
        
        // Set contentEditable to make it selectable
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
            reject(new Error('Unable to copy HTML to clipboard using fallback method'));
          }
        } catch (err) {
          reject(err);
        }
      });
    }
  };

  /**
      }
    });
  };
  
  /**
   * Preprocesses HTML before copying to improve compatibility with email clients
   * 
   * @param html - Raw HTML to process
   * @returns Enhanced HTML for better email client compatibility
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
    
    return processedHtml;
  };
