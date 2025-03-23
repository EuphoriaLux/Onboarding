// src/components/TableCopyComponent.tsx
import React, { useState } from 'react';
import emailBuilder from '../../emailBuilder/utils/emailBuilder';
import { CustomerInfo } from '../../emailBuilder/types';
import { supportTiers } from '../../supportTiers/data/supportTiers';
// Import createContactsTable directly
import { createContactsTable } from '../../emailBuilder/utils/components';

interface TableCopyComponentProps {
  customerInfo: CustomerInfo;
}

const TableCopyComponent: React.FC<TableCopyComponentProps> = ({ customerInfo }) => {
  const [copyStatus, setCopyStatus] = useState('');
  
  // Generate and copy just the contacts table
  const handleCopyContactsTable = async () => {
    try {
      // Get the tier information to determine number of rows
      const tier = supportTiers[customerInfo.selectedTier];
      
      // Generate the contacts table HTML using the imported function directly
      const tableHtml = createContactsTable(tier.authorizedContacts);
      
      // Copy to clipboard
      // Note: We're using the browser's built-in clipboard API here
      // In a real implementation, you might want to use a more sophisticated approach
      // like the tableCopyUtil shown earlier
      
      // Create a temporary div to hold the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tableHtml;
      document.body.appendChild(tempDiv);
      
      // Select the content
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // Copy to clipboard
      document.execCommand('copy');
      
      // Clean up
      selection?.removeAllRanges();
      document.body.removeChild(tempDiv);
      
      setCopyStatus('Contacts table copied to clipboard!');
      setTimeout(() => setCopyStatus(''), 3000);
    } catch (error) {
      console.error('Error copying contacts table:', error);
      setCopyStatus('Failed to copy. Please try again.');
      setTimeout(() => setCopyStatus(''), 3000);
    }
  };
  
  // Get tier information
  const tier = supportTiers[customerInfo.selectedTier];
  
  return (
    <div className="contacts-table-container">
      <h3>Contacts Table for {tier.name} Support Plan</h3>
      <p>Your plan allows for {tier.authorizedContacts} authorized contacts.</p>
      
      <button 
        className="copy-button"
        onClick={handleCopyContactsTable}
      >
        Copy Contacts Table to Clipboard
      </button>
      
      {copyStatus && (
        <div className="copy-status">{copyStatus}</div>
      )}
      
      <div className="preview-container">
        <h4>Preview:</h4>
        <div dangerouslySetInnerHTML={{ 
          __html: createContactsTable(tier.authorizedContacts) 
        }} />
      </div>
    </div>
  );
};

export default TableCopyComponent;