// src/features/emailBuilder/components/EmailPreview.tsx
import React, { useState, useEffect } from 'react';
import { EmailFormData, Language, CustomerInfo } from '../utils/types';
import { TenantInfo } from '../tenants/types'; // Corrected relative path
import { ThemeSettings } from '../../../types'; // Import ThemeSettings
// Remove generateTemplate import, use emailBuilder for HTML
import emailBuilder from '../utils/emailBuilder';
import { copyFormattedContent } from '../utils/clipboardUtils';
import OutlookInstructions from './OutlookInstructions';

interface EmailPreviewProps {
  emailData: EmailFormData; // Contains subject, recipients, sender details etc.
  // customerInfo: CustomerInfo; // No longer needed directly here
  tenants: TenantInfo[]; // Add tenants prop
  agentName?: string;
  agentTitle?: string;
  companyName?: string; // Agent's company
  agentEmail?: string;
  flags?: { // Add flags prop
    includeGdap?: boolean; // Note: These might be deprecated if logic moved elsewhere
    includeRbac?: boolean; // Note: These might be deprecated if logic moved elsewhere
    includeConditionalAccess?: boolean;
    includeNotes?: boolean;
    includeMeetingSlots?: boolean; // Add the new flag here
  };
  additionalNotes?: string; // Add notes prop
  themeSettings: ThemeSettings | null; // Add theme settings prop
  onBackToEdit: () => void;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({
  emailData,
  // customerInfo, // Remove from destructuring
  tenants, // Add tenants to destructuring
  agentName,
  agentTitle,
  companyName,
  agentEmail,
  flags, // Destructure flags
  additionalNotes, // Destructure notes
  themeSettings, // Destructure theme settings
  onBackToEdit
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [plainText, setPlainText] = useState(''); // Keep plain text generation for now
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [copySuccess, setCopySuccess] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [emlStatus, setEmlStatus] = useState(''); // State for EML generation feedback

  // Use the language from emailData, defaulting to English
  const language = (emailData.language || 'en') as Language;

  useEffect(() => {
    // Reverted to synchronous generation
    try {
      // Generate HTML and Plain Text using emailBuilder.buildEmailHTML (now synchronous)
      const { html, plainText: generatedPlainText } = emailBuilder.buildEmailHTML(emailData, tenants, themeSettings);

      setHtmlContent(html);
      setPlainText(generatedPlainText);
    } catch (error) {
        console.error("Error generating email preview content:", error);
        setHtmlContent('<p>Error generating preview.</p>');
        setPlainText('Error generating preview.');
    }
    // Depend on emailData, tenants, and themeSettings
  }, [emailData, tenants, themeSettings]);

  const handleCopyToClipboard = async (contentType: 'html' | 'text') => {
    try {
      if (contentType === 'html') {
        // Copy with HTML formatting preserved
        await copyFormattedContent(htmlContent, plainText);
        
        // Show instructions when copying HTML (first time only)
        const hasSeenInstructions = localStorage.getItem('hasSeenCopyInstructions');
        if (!hasSeenInstructions) {
          setShowInstructions(true);
          localStorage.setItem('hasSeenCopyInstructions', 'true');
        }
      } else {
        // Plain text copy
        await navigator.clipboard.writeText(plainText);
      }
      
      setCopySuccess(`${contentType.toUpperCase()} copied to clipboard!`);
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopySuccess('Failed to copy content. Please try again.');
    }
  };

  const handleDownloadHTML = () => {
    const element = document.createElement('a');
    const file = new Blob([htmlContent], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    
    // Use company name in filename if available
    const filename = emailData.companyName 
      ? `${emailData.companyName.replace(/\s+/g, '_')}_Onboarding_Email_${language}.html`
      : `Onboarding_Email_${language}.html`;
      
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleGenerateEml = async () => { // Make async
    setEmlStatus('Generating .eml file...'); // Provide feedback
    try {
      // Await the async function call
      const emlContent = await emailBuilder.generateEmlContent(emailData, htmlContent, plainText);
      const blob = new Blob([emlContent], { type: 'message/rfc822' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename
      const filenameBase = emailData.companyName
        ? `${emailData.companyName.replace(/\s+/g, '_')}_Onboarding`
        : 'Onboarding_Email';
      link.download = `${filenameBase}_Outlook_Draft_${language}.eml`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the object URL

      setEmlStatus('.eml file generated. Open it in Outlook to view the draft.');
      setTimeout(() => setEmlStatus(''), 5000); // Clear message after 5 seconds
    } catch (error) {
      console.error('Failed to generate .eml file:', error);
      setEmlStatus('Error generating .eml file. Please check console.');
      setTimeout(() => setEmlStatus(''), 5000);
    }
  };

   const handleOpenInOutlook = () => {
     // Don't copy to clipboard automatically when opening mail client
     // Process recipients for mailto link (replace semicolons with commas, trim whitespace)
     const formatRecipients = (emails: string | undefined): string => {
         if (!emails) return '';
         return emails
           .split(/[,;]/) // Split by comma or semicolon
           .map(email => email.trim()) // Trim whitespace
           .filter(email => email) // Remove empty entries
           .join(','); // Join with commas
       };
       
       const toRecipients = formatRecipients(emailData.to);
       const ccRecipients = formatRecipients(emailData.cc);
       
       // Create a mailto URL using encodeURIComponent for subject
       let mailtoUrl = `mailto:${encodeURIComponent(toRecipients)}`;
       const queryParams = [];
       if (emailData.subject) {
         // Encode subject specifically to handle spaces as %20
         queryParams.push(`subject=${encodeURIComponent(emailData.subject)}`);
       }
       if (ccRecipients) {
         // Encode CC recipients
         queryParams.push(`cc=${encodeURIComponent(ccRecipients)}`);
       }
       
       if (queryParams.length > 0) {
         mailtoUrl += `?${queryParams.join('&')}`;
       }
       
       // Open the default email client
      window.open(mailtoUrl);
       
       // Show guidance message (clipboard copy removed)
       alert('Your default email client should open.\n\nPlease copy the email content manually (using the "Copy HTML" button) and paste it into the email body (Ctrl+V or Cmd+V).');
     // Removed .catch related to clipboard copy failure
  };

  // Hide instructions modal
  const closeInstructions = () => {
    setShowInstructions(false);
  };

  // Display current language
  const languageDisplay = () => {
    switch (language) {
      case 'fr':
        return 'Français';
      case 'de':
        return 'Deutsch';
      default:
        return 'English';
    }
  };

  // Base button style
  const buttonBaseStyle = "inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800";
  const primaryButtonBaseStyle = "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800";


  return (
    // Container styling
    <div className="p-6 space-y-6 max-w-7xl mx-auto"> {/* Increased max-width */}
      {showInstructions && <OutlookInstructions onClose={closeInstructions} />}
      {/* Title with language badge */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
        Email Preview
        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full dark:bg-gray-700 dark:text-gray-300">{languageDisplay()}</span>
      </h2>

      {/* Actions section */}
      <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-800 space-y-4">
        {/* View toggle buttons */}
        <div className="flex space-x-2">
          <button
            className={`${buttonBaseStyle} ${viewMode === 'html' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : ''}`}
            onClick={() => setViewMode('html')}
          >
            HTML View
          </button>
          <button
            className={`${buttonBaseStyle} ${viewMode === 'text' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : ''}`}
            onClick={() => setViewMode('text')}
          >
            Plain Text View
          </button>
        </div>

        {/* Action buttons row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Tooltip styling might need JS or a library for complex behavior, basic hover shown */}
          <button
            onClick={() => handleCopyToClipboard(viewMode)}
            className={`${primaryButtonBaseStyle} relative group`} // Added relative group for tooltip
          >
            Copy {viewMode === 'html' ? 'HTML' : 'Text'}
            {viewMode === 'html' &&
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none dark:bg-gray-200 dark:text-gray-800">
                Enhanced formatting for Outlook
              </span>
            }
          </button>
          <button onClick={handleDownloadHTML} className={buttonBaseStyle}>Download HTML</button>
          <button onClick={handleGenerateEml} className={buttonBaseStyle}>Generate Outlook Draft (.eml)</button>
          <button onClick={handleOpenInOutlook} className={buttonBaseStyle}>Open in Email Client</button>
          <button onClick={onBackToEdit} className={`${buttonBaseStyle} bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-400`}>Back to Edit</button>
        </div>

        {/* Status messages */}
        {copySuccess && <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">{copySuccess}</div>}
        {emlStatus && <div className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">{emlStatus}</div>}
      </div>

      {/* Preview content area */}
      <div className="border border-gray-200 rounded-lg dark:border-gray-800 overflow-hidden">
        {/* Preview header */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <div>
            <strong className="font-semibold text-gray-900 dark:text-gray-100">To:</strong> {emailData.to}
            {emailData.cc && <><br /><strong className="font-semibold text-gray-900 dark:text-gray-100">Cc:</strong> {emailData.cc}</>}
          </div>
          <div>
            <strong className="font-semibold text-gray-900 dark:text-gray-100">Subject:</strong> {emailData.subject}
          </div>
          <div>
            <strong className="font-semibold text-gray-900 dark:text-gray-100">Date:</strong> {emailData.currentDate}
          </div>
       </div>

       {/* Preview body - replace inline styles with Tailwind */}
       <div className="w-full overflow-x-hidden bg-white">
         {viewMode === 'html' ? (
           <iframe
               srcDoc={htmlContent}
               title="Email Preview"
               className="w-full h-[600px] border-0 overflow-auto" // Use Tailwind classes
             />
           ) : (
             // Style plain text preview
            <pre className="p-4 text-sm text-gray-800 whitespace-pre-wrap break-words overflow-auto h-[600px]">{plainText}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
