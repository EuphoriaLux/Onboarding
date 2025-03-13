// src/components/EmailPreview.tsx
import React, { useState, useEffect } from 'react';
import { EmailFormData } from '../utils/emailBuilder';
import emailBuilder from '../utils/emailBuilder';

interface EmailPreviewProps {
  emailData: EmailFormData;
  onBackToEdit: () => void;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ emailData, onBackToEdit }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [plainText, setPlainText] = useState('');
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    // Generate email content
    const html = emailBuilder.buildEmailHTML(emailData);
    const text = emailBuilder.buildEmailBody(emailData);
    
    setHtmlContent(html);
    setPlainText(text);
  }, [emailData]);

  const handleCopyToClipboard = (contentType: 'html' | 'text') => {
    const content = contentType === 'html' ? htmlContent : plainText;
    
    navigator.clipboard.writeText(content).then(() => {
      setCopySuccess(`${contentType.toUpperCase()} copied to clipboard!`);
      setTimeout(() => setCopySuccess(''), 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      setCopySuccess('Failed to copy content. Please try again.');
    });
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
    // Create a mailto URL (this has size limitations, so we'll just open the destination)
    const mailtoUrl = `mailto:${encodeURIComponent(emailData.to)}?subject=${encodeURIComponent(emailData.subject || '')}`;
    
    window.open(mailtoUrl);
    
    // Show instruction since we can't attach the full content
    alert('Your default email client should open with the recipient and subject. Please paste the copied HTML or text content into the email body.');
  };

  return (
    <div className="email-preview-container">
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
          <button onClick={() => handleCopyToClipboard(viewMode)}>
            Copy {viewMode === 'html' ? 'HTML' : 'Text'} to Clipboard
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