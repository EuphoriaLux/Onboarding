// utils/clipboardUtils.ts
export const copyRichTextToClipboard = (html: string): Promise<void> => {
    // Create a temporary div with the HTML content
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    
    // Select the content
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    // Execute copy command
    document.execCommand('copy');
    
    // Clean up
    selection?.removeAllRanges();
    document.body.removeChild(container);
    
    return Promise.resolve();
  };