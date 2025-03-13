// src/components/OutlookInstructions.tsx
import React, { useState } from 'react';

interface OutlookInstructionsProps {
  onClose: () => void;
}

const OutlookInstructions: React.FC<OutlookInstructionsProps> = ({ onClose }) => {
  return (
    <div className="outlook-instructions-overlay">
      <div className="outlook-instructions-modal">
        <div className="instructions-header">
          <h3>Pasting Formatted Content in Outlook</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="instructions-content">
          <p>Follow these steps to paste your formatted template into Outlook:</p>
          
          <ol>
            <li>
              <strong>Copy the content</strong> using the &quot;Copy HTML to Clipboard&quot; button
              <div className="instruction-image">
                <img src="/api/placeholder/200/100" alt="Copy button illustration" />
              </div>
            </li>
            
            <li>
              <strong>Open a new email in Outlook</strong> (or use the &quot;Open in Email Client&quot; button)
            </li>
            
            <li>
              <strong>Paste using Ctrl+V</strong> (or right-click and select &quot;Paste&quot;)
              <div className="instruction-note">
                <p>Note: For best results in Outlook, use the &quot;Keep Source Formatting&quot; option if prompted</p>
              </div>
            </li>
            
            <li>
              <strong>Verify the formatting</strong> appears correctly before sending
            </li>
          </ol>
          
          <div className="troubleshooting">
            <h4>Troubleshooting</h4>
            <p>If the formatting doesn&apos;t appear correctly:</p>
            <ul>
              <li>Try using the &quot;Paste Special&quot; option in Outlook (Right-click &rarr; Paste Special &rarr; HTML)</li>
              <li>Use the &quot;Download HTML&quot; button and attach the file to your email</li>
              <li>Switch to Plain Text view if HTML formatting is not needed</li>
            </ul>
          </div>
        </div>
        
        <div className="instructions-footer">
          <button className="got-it-button" onClick={onClose}>Got it!</button>
          <label className="dont-show-again">
            <input type="checkbox" /> Don&apos;t show this again
          </label>
        </div>
      </div>
    </div>
  );
};

export default OutlookInstructions;