import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { StorageService } from '../../../services/storage';
import { ThemeSettings } from '../../../types';
import { useAppState } from '../../../contexts/AppStateContext'; // Import useAppState
import { applyThemeColors } from '../../../utils/themeUtils'; // Import theme utility
import './SettingsPage.css';

// Default theme colors (consider extracting from CSS or defining centrally)
const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#0078d4',
  textColor: '#323130',
  backgroundColor: '#f5f5f5',
};

interface AgentSettings {
  agentName: string; // Corresponds to agentFirstName + agentLastName
  agentTitle: string;
  companyName: string;
  agentEmail: string;
  onCallRecipients: string; // Comma-separated emails
  vacationRecipients: string; // Comma-separated emails
  supportRecipients: string; // Comma-separated emails
}

const SettingsPage: React.FC = () => {
  const [agentName, setAgentName] = useState('');
  const [agentTitle, setAgentTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [onCallRecipients, setOnCallRecipients] = useState('');
  const [vacationRecipients, setVacationRecipients] = useState('');
  const [supportRecipients, setSupportRecipients] = useState('');
  // Theme color states
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_THEME.primaryColor);
  const [textColor, setTextColor] = useState(DEFAULT_THEME.textColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_THEME.backgroundColor);
  // State for PDF attachment
  const [pdfFilename, setPdfFilename] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  // Remove local state for toggle, use context instead
  // const [showAlphaBeta, setShowAlphaBeta] = useState(false);

  // Get state and update function from context
  const { state: appState, updateShowAlphaBetaFeatures } = useAppState();

  const [isLoading, setIsLoading] = useState(true); // Keep local loading state for settings page
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load settings on component mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      StorageService.get<AgentSettings>('agentSettings'),
      StorageService.get<ThemeSettings>('themeSettings'),
      // Load PDF settings
      StorageService.get<string>('pdfAttachmentFilename'),
      StorageService.get<string>('pdfAttachmentBase64'),
      // No need to load showAlphaBetaFeatures here, context handles it
    ])
    .then(([agentSettings, themeSettings, loadedPdfFilename, loadedPdfBase64]) => {
      // Load Agent Settings
      if (agentSettings) {
        setAgentName(agentSettings.agentName || '');
        setAgentTitle(agentSettings.agentTitle || '');
        setCompanyName(agentSettings.companyName || '');
        setAgentEmail(agentSettings.agentEmail || '');
        setOnCallRecipients(agentSettings.onCallRecipients || '');
        setVacationRecipients(agentSettings.vacationRecipients || '');
        setSupportRecipients(agentSettings.supportRecipients || '');
      }

      // Load Theme Settings
      if (themeSettings) {
        setPrimaryColor(themeSettings.primaryColor || DEFAULT_THEME.primaryColor);
        setTextColor(themeSettings.textColor || DEFAULT_THEME.textColor);
        setBackgroundColor(themeSettings.backgroundColor || DEFAULT_THEME.backgroundColor);
      } else {
        // Fallback to defaults if no theme settings saved
        setPrimaryColor(DEFAULT_THEME.primaryColor);
        setTextColor(DEFAULT_THEME.textColor);
        // Correctly use default background color in the else block
        setBackgroundColor(DEFAULT_THEME.backgroundColor);
      }
      // Removed the redundant second 'else' block

      // Load PDF settings only
      // setCustomEmailTemplate(loadedTemplate || ''); // Removed template state update
      setPdfFilename(loadedPdfFilename || null);
      setPdfBase64(loadedPdfBase64 || null);

      // Context handles loading showAlphaBetaFeatures
    })
    .catch(error => {
      console.error("Error loading settings:", error);
      // Optionally set an error state to show in the UI
      // Still set default theme colors on error
      setPrimaryColor(DEFAULT_THEME.primaryColor);
      setTextColor(DEFAULT_THEME.textColor);
      setBackgroundColor(DEFAULT_THEME.backgroundColor);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  // Save settings handler
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    const agentSettingsToSave: AgentSettings = {
      agentName,
      agentTitle,
      companyName,
      agentEmail,
      onCallRecipients,
      vacationRecipients,
      supportRecipients,
    };

    const themeSettingsToSave: ThemeSettings = {
      primaryColor,
      textColor,
      backgroundColor,
    };

    try {
      // Save agent and theme settings
      // Toggle state is saved immediately via context function, remove from here
      await Promise.all([
        StorageService.set('agentSettings', agentSettingsToSave),
        StorageService.set('themeSettings', themeSettingsToSave),
        // StorageService.set('showAlphaBetaFeatures', showAlphaBeta), // Removed
      ]);

      // Save PDF settings separately
      await StorageService.set('pdfAttachmentFilename', pdfFilename || '');
      // Only save base64 if filename exists to avoid storing large empty strings unnecessarily
      await StorageService.set('pdfAttachmentBase64', pdfFilename ? (pdfBase64 || '') : '');

      // Apply theme immediately after saving
      applyThemeColors(themeSettingsToSave);

      setSaveStatus('success');
      // Hide success message after a delay
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [
    agentName,
    agentTitle,
    companyName,
    agentEmail,
    onCallRecipients,
    vacationRecipients,
    supportRecipients,
    // Add theme colors to dependency array
    primaryColor,
    textColor,
    backgroundColor,
    pdfFilename,
    pdfBase64,
    // showAlphaBeta, // Removed toggle state from dependencies
  ]);

  // --- PDF File Handling ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64String = loadEvent.target?.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];
        if (base64Content) {
          setPdfFilename(file.name);
          setPdfBase64(base64Content);
          setSaveStatus('idle'); // Reset save status if file changes
        } else {
          console.error("Error reading PDF file content.");
          setPdfFilename(null);
          setPdfBase64(null);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setPdfFilename(null);
        setPdfBase64(null);
      };
      reader.readAsDataURL(file); // Read as Data URL to get Base64
    } else if (file) {
      alert('Please select a valid PDF file.');
      event.target.value = ''; // Clear the input
      setPdfFilename(null);
      setPdfBase64(null);
    } else {
        // No file selected or selection cancelled
        // Optionally clear state if needed, or leave as is
    }
  };

  const handleClearPdf = () => {
    setPdfFilename(null);
    setPdfBase64(null);
    // Optionally clear the file input visually, though this is tricky
    const fileInput = document.getElementById('pdfAttachment') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
    setSaveStatus('idle'); // Reset save status
  };
  // --- End PDF File Handling ---


  if (isLoading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="settings-page">
      <h2>Agent Configuration</h2>
      <p>Configure the details used in the email signature.</p>

      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="agentName">Agent Name:</label>
          <input
            type="text"
            id="agentName"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="e.g., Jane Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="agentTitle">Agent Title:</label>
          <input
            type="text"
            id="agentTitle"
            value={agentTitle}
            onChange={(e) => setAgentTitle(e.target.value)}
            placeholder="e.g., Support Engineer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g., Microsoft"
          />
        </div>

        <div className="form-group">
          <label htmlFor="agentEmail">Agent Email:</label>
          <input
            type="email"
            id="agentEmail"
            value={agentEmail}
            onChange={(e) => setAgentEmail(e.target.value)}
            placeholder="e.g., jane.doe@microsoft.com"
          />
        </div>

        {/* --- Recipient Settings --- */}
        <h3 className="settings-subtitle">ICS Recipient Emails</h3>
        <p>Configure the default recipients for generated .ics files (comma-separated).</p>

        <div className="form-group">
          <label htmlFor="onCallRecipients">On-Call Duty Recipients:</label>
          <textarea
            id="onCallRecipients"
            value={onCallRecipients}
            onChange={(e) => setOnCallRecipients(e.target.value)}
            placeholder="e.g., team1@example.com, manager@example.com"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="vacationRecipients">Vacation Request Recipients:</label>
          <textarea
            id="vacationRecipients"
            value={vacationRecipients}
            onChange={(e) => setVacationRecipients(e.target.value)}
            placeholder="e.g., hr@example.com, team-calendar@example.com"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="supportRecipients">Support Request Recipients:</label>
          <textarea
            id="supportRecipients"
            value={supportRecipients}
            onChange={(e) => setSupportRecipients(e.target.value)}
            placeholder="e.g., support-leads@example.com"
            rows={3}
          />
        </div>

        {/* --- Theme Customization --- */}
        <h3 className="settings-subtitle">Theme Customization</h3>
        <p>Customize the main colors of the extension.</p>

        <div className="form-group color-picker-group">
          <label htmlFor="primaryColor">Primary Color:</label>
          <input
            type="color"
            id="primaryColor"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
          <span className="color-value">{primaryColor}</span>
        </div>

        <div className="form-group color-picker-group">
          <label htmlFor="textColor">Text Color:</label>
          <input
            type="color"
            id="textColor"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
          <span className="color-value">{textColor}</span>
        </div>

        <div className="form-group color-picker-group">
          <label htmlFor="backgroundColor">Background Color:</label>
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
          <span className="color-value">{backgroundColor}</span>
        </div>

        {/* --- Default PDF Attachment --- */}
        <h3 className="settings-subtitle">Default PDF Attachment</h3>
        <p>Add a default PDF attachment to the generated email drafts.</p>

        <div className="form-group">
            <label htmlFor="pdfAttachment">PDF File:</label>
            <input
                type="file"
                id="pdfAttachment"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'block', marginBottom: '10px' }}
            />
            {pdfFilename && (
                <div className="pdf-info">
                    <span>Current file: {pdfFilename}</span>
                    <button onClick={handleClearPdf} className="clear-pdf-button">
                        Clear PDF
                    </button>
                </div>
            )}
            {!pdfFilename && <span>No PDF attached.</span>}
        </div>

        {/* --- Experimental Features Toggle --- */}
        <h3 className="settings-subtitle">Experimental Features</h3>
        <p>Enable access to Alpha/Beta features currently under development.</p>
        <div className="form-group toggle-group">
          <label htmlFor="alphaBetaToggle" className="toggle-label">
            Show Alpha/Beta Features:
          </label>
          <label className="switch">
            <input
              type="checkbox"
              id="alphaBetaToggle"
              checked={appState.showAlphaBetaFeatures} // Read from context state
              onChange={(e) => updateShowAlphaBetaFeatures(e.target.checked)} // Call context update function
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-status">{appState.showAlphaBetaFeatures ? 'Enabled' : 'Disabled'}</span>
        </div>


        <div className="form-actions">
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
          {saveStatus === 'success' && <span className="save-status success">Settings saved!</span>}
          {saveStatus === 'error' && <span className="save-status error">Error saving settings.</span>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
