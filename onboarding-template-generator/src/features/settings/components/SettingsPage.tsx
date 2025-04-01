import React, { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../../../services/storage';
import { ThemeSettings } from '../../../types'; // Import ThemeSettings
import './SettingsPage.css'; // We'll create this CSS file later for styling

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

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load settings on component mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      StorageService.get<AgentSettings>('agentSettings'),
      StorageService.get<ThemeSettings>('themeSettings')
    ])
    .then(([agentSettings, themeSettings]) => {
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
        setBackgroundColor(DEFAULT_THEME.backgroundColor);
      }
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
      // Save both settings objects
      await Promise.all([
        StorageService.set('agentSettings', agentSettingsToSave),
        StorageService.set('themeSettings', themeSettingsToSave)
      ]);

      // Optionally apply theme immediately after saving
      // applyThemeColors(themeSettingsToSave); // Need to define and import this function

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
  ]);

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
