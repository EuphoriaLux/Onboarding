// src/components/TableCopyComponent.tsx - Moved from features/common/components
import React, { useState } from 'react';
import emailBuilder from '../features/emailBuilder/utils/emailBuilder'; // Adjusted path
import { CustomerInfo } from '../features/emailBuilder/utils/types'; // Adjusted path
import { supportTiers } from '../features/emailBuilder/supportTiers/data/supportTiers';
// Import table creation function
import { createImprovedContactsTable } from '../features/emailBuilder/utils/components';

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
      const tableHtml = createImprovedContactsTable(tier.authorizedContacts);
      
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
    // Container with spacing
    <div className="space-y-4">
      {/* Title with plan info */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Contacts Table for {tier.name} Support Plan</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Your plan allows for {tier.authorizedContacts} authorized contacts.</p>

      {/* Copy button styling */}
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800"
        onClick={handleCopyContactsTable}
      >
        Copy Contacts Table to Clipboard
      </button>

      {/* Copy status message */}
      {copyStatus && (
        <div className="text-sm text-green-600 dark:text-green-400">{copyStatus}</div>
      )}

      {/* Preview container styling */}
      <div className="border border-gray-200 rounded-lg dark:border-gray-700 p-4">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Preview:</h4>
        <div dangerouslySetInnerHTML={{
          __html: createImprovedContactsTable(tier.authorizedContacts)
        }} />
      </div>
    </div>
  );
};

export default TableCopyComponent;
