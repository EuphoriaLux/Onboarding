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
   * Preprocesses HTML before copying to improve compatibility with email clients,
   * using DOM manipulation for robustness.
   *
   * @param html - Raw HTML to process
   * @returns Enhanced HTML for better email client compatibility
   */
  const preprocessHtml = (html: string): string => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Ensure head exists
      let head = doc.head;
      if (!head) {
        head = doc.createElement('head');
        doc.documentElement.insertBefore(head, doc.body);
      }

      // 1. Add Office/Outlook specific metadata and base styles to head
      const metaAndStyleContent = `
        <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style type="text/css">
          /* Final Styles v6 - Prioritize Inline, Refine Spacing */
          body { margin: 0 auto !important; padding: 20px !important; max-width: 800px; background-color: #FFFFFF !important; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333333; box-sizing: border-box; }
          /* Allow inline colors, ensure transparent BG */
          div, p, li, span, strong, h1, h2, h3, h4, h5, h6, pre, ul, ol { background-color: transparent !important; color: inherit; }

          /* Headings - Inherit color, adjust spacing */
          h3 { font-size: 18px; font-weight: 600; margin: 28px 0 15px 0; padding: 0; line-height: 1.4; color: inherit; }
          h4 { font-size: 16px; font-weight: 600; margin: 25px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #eeeeee; color: inherit; }

          /* Paragraphs - Inherit color, consistent spacing */
          p { margin: 0 0 16px 0 !important; line-height: 1.6 !important; font-size: 15px !important; color: inherit; }

          /* Lists - Inherit color, adjust spacing */
          ul, ol { margin: 0 0 16px 25px !important; padding: 0 !important; }
          ul { list-style-type: disc !important; }
          ol { list-style-type: decimal !important; }
          li { margin-bottom: 8px !important; line-height: 1.6 !important; padding-left: 5px !important; color: inherit; }

          /* Links - Inherit color (inline style sets theme color), force underline */
          a { color: inherit; text-decoration: underline !important; }
          a:hover { text-decoration: none !important; }

          /* Button Style Link (GDAP) - Force white text, allow inline BG color */
          a[style*="background-color"] {
             display: inline-block !important; padding: 10px 24px !important; text-decoration: none !important; font-weight: 600 !important; border-radius: 4px !important; margin-top: 5px !important; border: none !important; cursor: pointer !important; color: #FFFFFF !important;
          }

          /* Tables (ContactsTable) - Lighter borders, better spacing */
          table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; border: 1px solid #dddddd !important; background-color: #FFFFFF !important; margin: 1em 0 2em 0 !important; width: 100% !important; }
          td, th { padding: 10px 12px !important; border: 1px solid #dddddd !important; vertical-align: top; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px !important; background-color: #FFFFFF !important; color: #333333; line-height: 1.5 !important; }
          th { background-color: #f8f8f8 !important; font-weight: 600 !important; text-align: left !important; color: #111111 !important; }

          /* Div-based Containers - Inherit color, adjust spacing */
          div[style*="border-left: 4px solid"] { /* SectionHeader */
             margin: 30px 0 15px 0 !important; padding: 16px !important; background-color: #FFFFFF !important; border-radius: 0 4px 4px 0; border-top: 1px solid #eeeeee !important; border-bottom: 1px solid #eeeeee !important; border-right: 1px solid #eeeeee !important; color: inherit;
          }
          div[style*="border: 1px solid #eee"] { /* Support Plan Box, Meeting Date Box, Conditional Access Box */
             margin: 1em 0 2em 0 !important; padding: 18px 20px !important; background-color: #FFFFFF !important; border-radius: 4px !important; border: 1px solid #eeeeee !important; color: inherit;
          }
           div[style*="border: 1px solid #ddd"] { /* Tenant Block Box */
             margin: 1em 0 2em 0 !important; padding: 18px 20px !important; background-color: #FFFFFF !important; border-radius: 4px !important; border: 1px solid #dddddd !important; color: inherit;
          }
          div[style*="display: flex"] { /* StepIndicator */
             margin: 25px 0 10px 0 !important; background-color: #FFFFFF !important; color: inherit;
          }
          /* Keep specific background colors for highlights/instructions */
          div[style*="background-color: #fff4ce"] { /* Deadline Highlight */
             background-color: #fff4ce !important; padding: 6px 12px !important; border-radius: 4px !important; display: inline-block !important; margin-top: 12px !important; font-size: 14px !important; color: #333333 !important;
          }
          div[style*="background-color: #f0f7ff"] { /* InstructionBox */
             margin: 1.5em 0 !important; padding: 16px !important; background-color: #f0f7ff !important; border-radius: 4px !important; border: 1px solid #b3d7ff !important; font-size: 14px !important; line-height: 1.5 !important; color: #333333 !important;
          }

          /* Horizontal Rule - Adjust margin */
          hr { border: none !important; border-top: 1px solid #dddddd !important; margin: 35px 0 !important; height: 1px !important; background-color: transparent !important; }

          /* Script Block - Adjust margin, ensure text color */
          pre {
            background-color: #f5f5f5 !important; border: 1px solid #ddd !important; border-radius: 4px !important; padding: 15px !important; font-family: Consolas, Monaco, 'Courier New', monospace !important; font-size: 13px !important; line-height: 1.45 !important; color: #333333 !important; white-space: pre !important; word-wrap: normal !important; overflow-x: auto !important; margin: 1em 0 1.5em 0 !important;
          }

          /* Footer - Adjust top margin, inherit color */
          div[style*="border-top: 1px solid #eee"] { /* Footer Div */
             margin-top: 35px !important; padding-top: 20px !important; background-color: #FFFFFF !important; border-top: 1px solid #eeeeee !important; text-align: center !important; font-size: 12px !important; color: #666666;
          }
          div[style*="border-top: 1px solid #eee"] p {
             margin: 0 !important; line-height: 1.5 !important; font-size: 12px !important; color: #666666;
          }

          /* Utilities */
          img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
          a img { border: none; }

          /* Word wrapping and breaking */
          p, li, div, td, th { word-wrap: break-word; word-break: break-word; } /* Allow wrapping in standard elements */
          pre { white-space: pre-wrap !important; word-wrap: break-word !important; word-break: break-all !important; } /* Force wrap and break in pre tags */
          table { table-layout: fixed; } /* Help table respect width */

          /* Ensure essential backgrounds are white */
          body, table, tr, td, th { background-color: #FFFFFF !important; }
        </style>
      `;
      // Use a temporary element to parse the meta/style string
      const temp = doc.createElement('div');
      temp.innerHTML = metaAndStyleContent;
      // Append nodes from temp to head to avoid innerHTML issues on <head>
      Array.from(temp.childNodes).forEach(node => {
        head.appendChild(node.cloneNode(true));
      });


      // 2. Apply necessary attributes/styles directly to elements
      if (doc.body) {
        doc.body.style.margin = '0';
        doc.body.style.padding = '0';
        doc.body.style.backgroundColor = '#FFFFFF'; // Ensure white background
        doc.body.setAttribute('bgcolor', '#FFFFFF');
      }

      doc.querySelectorAll('table').forEach((table) => {
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '0'); // Often set to 0, rely on td/th padding
         table.setAttribute('border', '0');
         table.style.borderCollapse = 'collapse';
         // Cast style to any for MSO specific properties
         (table.style as any).msoTableLspace = '0pt';
         (table.style as any).msoTableRspace = '0pt';
         // Avoid forcing background color here unless absolutely necessary
       });
 
       doc.querySelectorAll('td, th').forEach((cellNode) => {
         // Assert type to HTMLElement to access style
         const cell = cellNode as HTMLElement;
         if (!cell.style.padding) { // Apply default padding if not set
            cell.style.padding = '8px';
         }
         // Avoid forcing background color here
       });
 
       doc.querySelectorAll('p').forEach((pNode) => {
          // Assert type to HTMLElement to access style
          const p = pNode as HTMLElement;
          // Ensure basic margin and line-height if not already styled extensively
          if (!p.style.margin && !p.style.marginBottom) {
             p.style.margin = '0 0 1em 0';
          }
          if (!p.style.lineHeight) {
             p.style.lineHeight = '1.5';
          }
       });

      // Add more specific DOM manipulations as needed based on testing in Outlook/email clients

      // 3. Serialize the document back to string
      const serializer = new XMLSerializer();
      // Serialize the whole documentElement to include doctype, html, head, body
      let processedHtml = serializer.serializeToString(doc);

      // Ensure DOCTYPE is present if missing (serializer might omit it)
      if (!processedHtml.toLowerCase().startsWith('<!doctype')) {
         processedHtml = '<!DOCTYPE html>\n' + processedHtml;
      }

      return processedHtml;

    } catch (error) {
      console.error("Error preprocessing HTML with DOMParser:", error);
      // Fallback to original HTML if parsing/processing fails
      return html;
    }
  };
