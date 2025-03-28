// src/features/emailBuilder/components/EmailPreview.tsx
import React, { useState, useEffect } from 'react';
import { EmailFormData, Language, CustomerInfo } from '../utils/types';
import { TenantInfo } from '../../tenants/types'; // Import TenantInfo
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
    includeGdap?: boolean;
    includeRbac?: boolean;
    includeConditionalAccess?: boolean;
    includeNotes?: boolean;
  };
  additionalNotes?: string; // Add notes prop
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
  onBackToEdit
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [plainText, setPlainText] = useState(''); // Keep plain text generation for now
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [copySuccess, setCopySuccess] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Use the language from emailData, defaulting to English
  const language = (emailData.language || 'en') as Language;

  useEffect(() => {
    // Generate HTML using emailBuilder.buildEmailHTML, passing tenants
    const html = emailBuilder.buildEmailHTML(emailData, tenants);

    // Generate plain text using emailBuilder.buildEmailBody, passing tenants
    const text = emailBuilder.buildEmailBody(emailData, tenants);

    setHtmlContent(html);
    setPlainText(text);
    // Depend on emailData and tenants
  }, [emailData, tenants]);

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

  return (
    <div className="email-preview-container">
      {showInstructions && <OutlookInstructions onClose={closeInstructions} />}
      <h2>Email Preview <span className="language-badge">{languageDisplay()}</span></h2>
      
      <div className="preview-actions">
        <div className="view-toggle">
          <button 
            className={viewMode === 'html' ? 'active' : ''} 
            onClick={() => setViewMode('html')}
          >
            HTML View
          </button>
          <button 
            className={viewMode === 'text' ? 'active' : ''} 
            onClick={() => setViewMode('text')}
          >
            Plain Text View
          </button>
        </div>
        
        <div className="action-buttons">
          <button 
            onClick={() => handleCopyToClipboard(viewMode)}
            className="tooltip"
          >
            Copy {viewMode === 'html' ? 'HTML' : 'Text'} to Clipboard
            {viewMode === 'html' && 
              <span className="tooltip-text">Enhanced formatting for Outlook</span>
            }
          </button>
          <button onClick={handleDownloadHTML}>Download HTML</button>
          <button onClick={handleOpenInOutlook}>Open in Email Client</button>
          <button onClick={onBackToEdit}>Back to Edit</button>
        </div>
        
        {copySuccess && <div className="copy-success">{copySuccess}</div>}
      </div>
      
      <div className="preview-content">
        <div className="preview-header">
          <div className="preview-recipient">
            <strong>To:</strong> {emailData.to}
            {emailData.cc && <>, <strong>Cc:</strong> {emailData.cc}</>}
          </div>
          <div className="preview-subject">
            <strong>Subject:</strong> {emailData.subject}
          </div>
          <div className="preview-date">
            <strong>Date:</strong> {emailData.currentDate}
          </div>
        </div>
        
        <div className="preview-body">
          {viewMode === 'html' ? (
            <iframe 
              srcDoc={htmlContent}
              title="Email Preview"
              style={{ width: '100%', height: '600px', border: '1px solid #ddd', backgroundColor: '#FFFFFF' }}
            />
          ) : (
            <pre className="text-preview">{plainText}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
