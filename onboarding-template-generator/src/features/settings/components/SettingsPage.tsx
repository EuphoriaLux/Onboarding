import React, { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../../../services/storage';
import './SettingsPage.css'; // We'll create this CSS file later for styling

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load settings on component mount
  useEffect(() => {
    setIsLoading(true);
    StorageService.get<AgentSettings>('agentSettings')
      .then(settings => {
        if (settings) {
          setAgentName(settings.agentName || '');
          setAgentTitle(settings.agentTitle || '');
          setCompanyName(settings.companyName || '');
          setAgentEmail(settings.agentEmail || '');
          // Load recipient emails
          setOnCallRecipients(settings.onCallRecipients || '');
          setVacationRecipients(settings.vacationRecipients || '');
          setSupportRecipients(settings.supportRecipients || '');
        }
      })
      .catch(error => {
        console.error("Error loading settings:", error);
        // Optionally set an error state to show in the UI
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Save settings handler
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    const settingsToSave: AgentSettings = {
      agentName,
      agentTitle,
      companyName,
      agentEmail,
      // Include recipient emails in saved data
      onCallRecipients,
      vacationRecipients,
      supportRecipients,
    };
    try {
      await StorageService.set('agentSettings', settingsToSave);
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
  ]); // Add recipients to dependency array

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
