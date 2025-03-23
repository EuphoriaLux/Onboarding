// src/components/OutlookInstructions.tsx
import React, { useState } from 'react';

interface OutlookInstructionsProps {
  onClose: () => void;
}

const OutlookInstructions: React.FC<OutlookInstructionsProps> = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowCopyInstructions', 'true');
    }
    onClose();
  };

  return (
    <div className="outlook-instructions-overlay">
      <div className="outlook-instructions-modal">
        <div className="instructions-header">
          <h3>Enhanced Email Formatting for Outlook</h3>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="instructions-content">
          <p>Your email has been copied with enhanced formatting for better compatibility with Outlook and other email clients. Follow these steps:</p>
          
          <ol>
            <li>
              <strong>The content has been copied to your clipboard</strong> with improved styling
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
                <p><strong>Important:</strong> If prompted with paste options in Outlook, choose &quot;Keep Source Formatting&quot; for best results.</p>
              </div>
            </li>
            
            <li>
              <strong>Review the formatting</strong> after pasting
              <div className="instruction-note">
                <p>The email has been optimized with explicit background colors and improved spacing for better appearance.</p>
              </div>
            </li>
          </ol>
          
          <div className="troubleshooting">
            <h4>Troubleshooting</h4>
            <p>If you notice any formatting issues:</p>
            <ul>
              <li>Try using <strong>&quot;Paste Special&quot;</strong> in Outlook and select <strong>HTML Format</strong></li>
              <li>Use the <strong>&quot;Download HTML&quot;</strong> button and attach the file to your email</li>
              <li>If images appear as placeholders, they will need to be replaced with actual images</li>
              <li>Some email clients may display slight variations in formatting</li>
            </ul>
          </div>
        </div>
        
        <div className="instructions-footer">
          <button className="got-it-button" onClick={handleClose}>Got it!</button>
          <label className="dont-show-again">
            <input 
              type="checkbox" 
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            /> 
            Don&apos;t show this again
          </label>
        </div>
      </div>
    </div>
  );
};

export default OutlookInstructions;