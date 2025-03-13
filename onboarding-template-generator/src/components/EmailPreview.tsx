// src/components/EmailPreview.tsx
import React, { useState, useEffect } from 'react';
import { EmailFormData } from '../utils/emailBuilder';
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

  useEffect(() => {
    // Generate email content
    const html = emailBuilder.buildEmailHTML(emailData);
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
    element.download = `${emailData.companyName.replace(/\s+/g, '_')}_Onboarding_Email.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleOpenInOutlook = () => {
    // First copy the HTML content to clipboard with formatting preserved
    copyFormattedContent(htmlContent, plainText).then(() => {
      // Create a mailto URL
      const mailtoUrl = `mailto:${encodeURIComponent(emailData.to)}?subject=${encodeURIComponent(emailData.subject || '')}`;
      
      // Open the default email client
      window.open(mailtoUrl);
      
      // Show guidance message
      alert('Your default email client should open. The formatted email content has been copied to your clipboard - please paste (Ctrl+V) into the email body.');
    }).catch(err => {
      console.error('Failed to copy before opening email client', err);
      alert('There was an issue copying the email content. Please try copying it manually before opening your email client.');
    });
  };

  // Hide instructions modal
  const closeInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className="email-preview-container">
      {showInstructions && <OutlookInstructions onClose={closeInstructions} />}
      <h2>Email Preview</h2>
      
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
              <span className="tooltip-text">Preserves formatting for Outlook</span>
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
              style={{ width: '100%', height: '600px', border: '1px solid #ddd' }}
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