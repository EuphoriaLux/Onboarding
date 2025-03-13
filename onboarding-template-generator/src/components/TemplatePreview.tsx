// src/components/TemplatePreview.tsx
import React, { useState } from 'react';
import { generateTemplate } from '../utils/templateGenerator';
import { copyRichTextToClipboard } from '../utils/clipboardUtils';
import { supportTiers } from '../data/supportTiers';
import { CustomerInfo } from '../utils/templateGenerator';

interface TemplatePreviewProps {
  customerInfo: CustomerInfo;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ customerInfo }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const handleCopyToClipboard = () => {
    const template = generateTemplate(customerInfo);
    copyRichTextToClipboard(template)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(error => {
        console.error('Error copying to clipboard:', error);
      });
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
          className="copy-button"
          onClick={handleCopyToClipboard}
          disabled={!isFormValid()}
        >
          {copied ? '✓ Copied to Clipboard!' : 'Generate & Copy to Clipboard'}
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