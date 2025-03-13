// src/components/TemplatePreview.tsx
import React, { useState } from 'react';
import { generateTemplate } from '../utils/templateGenerator';
import { copyFormattedContent } from '../utils/clipboardUtils';
import { supportTiers } from '../data/supportTiers';
import { CustomerInfo } from '../utils/templateGenerator';

interface TemplatePreviewProps {
  customerInfo: CustomerInfo;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ customerInfo }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copyMessage, setCopyMessage] = useState('Generate & Copy to Clipboard');
  
  const handleCopyToClipboard = async () => {
    try {
      const template = generateTemplate(customerInfo);
      
      // Create a plain text version of the template for fallback
      const plainText = convertHtmlToPlainText(template);
      
      // Use the enhanced copyFormattedContent function
      await copyFormattedContent(template, plainText);
      
      setCopied(true);
      setCopyMessage('✓ Copied to Clipboard!');
      
      // Reset the button text after 3 seconds
      setTimeout(() => {
        setCopied(false);
        setCopyMessage('Generate & Copy to Clipboard');
      }, 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setCopyMessage('Copy failed. Try again.');
      
      // Reset on error after 3 seconds
      setTimeout(() => {
        setCopyMessage('Generate & Copy to Clipboard');
      }, 3000);
    }
  };
  
  // Helper function to convert HTML to plain text
  const convertHtmlToPlainText = (html: string): string => {
    // Create a temporary element to parse the HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Get text content and normalize whitespace
    let text = temp.textContent || temp.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  };
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  const tier = supportTiers[customerInfo.selectedTier];
  const template = generateTemplate(customerInfo);
  
  const isFormValid = () => {
    return (
      customerInfo.companyName.trim() !== '' &&
      customerInfo.contactName.trim() !== '' &&
      customerInfo.contactEmail.trim() !== '' &&
      customerInfo.proposedDate instanceof Date && !isNaN(customerInfo.proposedDate.getTime()) &&
      customerInfo.authorizedContacts.length > 0 &&
      customerInfo.authorizedContacts.every(contact => 
        contact.name.trim() !== '' && 
        contact.email.trim() !== ''
      )
    );
  };
  
  return (
    <div className="template-preview">
      <h2>Template Preview & Generation</h2>
      
      <div className="preview-actions">
        <button 
          type="button" 
          className="preview-button"
          onClick={togglePreview}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        
        <button 
          type="button" 
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopyToClipboard}
          disabled={!isFormValid()}
        >
          {copyMessage}
        </button>
      </div>
      
      {!isFormValid() && (
        <div className="validation-message">
          Please fill in all required fields before generating the template.
        </div>
      )}
      
      {showPreview && (
        <div className="preview-container">
          <div className="preview-header">
            <h3>Template Preview</h3>
            <span style={{ color: tier.color }}>{tier.name}</span>
          </div>
          
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: template }} />
        </div>
      )}
    </div>
  );
};

export default TemplatePreview;