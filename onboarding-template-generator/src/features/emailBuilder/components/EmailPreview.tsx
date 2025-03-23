// src/features/emailBuilder/components/EmailPreview.tsx
import React, { useState, useEffect } from 'react';
import { EmailFormData, Language } from '../utils/types'; // Fixed import path
import emailBuilder from '../utils/emailBuilder';
import { copyFormattedContent } from '../utils/clipboardUtils';
import OutlookInstructions from './OutlookInstructions';

interface EmailPreviewProps {
  emailData: EmailFormData;
  onBackToEdit: () => void;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ emailData, onBackToEdit }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [plainText, setPlainText] = useState('');
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [copySuccess, setCopySuccess] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Use the language from emailData, defaulting to English
  const language = (emailData.language || 'en') as Language;

  useEffect(() => {
    // Generate email content with the selected language
    // Use the enhanced HTML method if available, otherwise use standard
    const html = emailBuilder.buildEnhancedEmailHTML 
      ? emailBuilder.buildEnhancedEmailHTML(emailData) 
      : emailBuilder.buildEmailHTML(emailData);
    
    const text = emailBuilder.buildEmailBody(emailData);
    
    setHtmlContent(html);
    setPlainText(text);
  }, [emailData]);

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
    // First copy the HTML content to clipboard with enhanced formatting preserved
    copyFormattedContent(htmlContent, plainText).then(() => {
      // Create a mailto URL
      const mailtoUrl = `mailto:${encodeURIComponent(emailData.to)}?subject=${encodeURIComponent(emailData.subject || '')}`;
      
      // Open the default email client
      window.open(mailtoUrl);
      
      // Show improved guidance message
      alert('Your default email client should open.\n\nThe formatted email content has been copied to your clipboard with improved styling for Outlook compatibility.\n\nPress Ctrl+V (or Cmd+V on Mac) to paste the content into the email body.');
    }).catch((err) => {
      console.error('Failed to copy before opening email client', err);
      alert('There was an issue copying the email content. Please try copying it manually before opening your email client.');
    });
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