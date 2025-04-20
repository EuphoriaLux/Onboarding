// src/App.tsx - Moved from features/common/components
import React, { useState, useEffect } from 'react';
import { TierSelector } from './features/emailBuilder/supportTiers';
import EmailRecipientsForm from './components/EmailRecipientsForm';
import { EmailRecipient } from './types/AppTypes';
import { ContactsForm } from './features/emailBuilder/contacts'; // Adjusted path
import { TenantManager } from './features/emailBuilder/tenants'; // Adjusted path
import { EmailForm, EmailPreview } from './features/emailBuilder'; // Adjusted path
import LanguageSelector from './components/LanguageSelector'; // Adjusted path
import { useAppState } from './contexts/AppStateContext'; // Adjusted path
import { useLanguage } from './contexts/LanguageContext'; // Adjusted path
import { StorageService } from './services/storage'; // Adjusted path
import { ThemeSettings, AgentSettings } from './types'; // Adjusted path, added AgentSettings
import { supportTiers } from './features/emailBuilder/supportTiers/data/supportTiers'; // Adjusted path
import { generateMeetingSlots } from './utils/slotUtils';
import MeetingSlotSelector from './components/MeetingSlotSelector';
import emailBuilder from './features/emailBuilder/utils/emailBuilder'; // Import emailBuilder to use translate
import CollapsibleSection from './components/CollapsibleSection'; // Import moved component
import { applyThemeColors } from './utils/themeUtils'; // Import theme utility
import './styles/App.css'; // Adjusted path

// AgentSettings interface moved to src/types/index.ts

/**
 * Main App Component for the Onboarding Template Generator
 * Uses contexts for state management and i18n
 */
const App: React.FC = () => {
  const {
    state,
    updateCustomerInfo,
    updateContacts,
    updateTenants,
    updateTier,
    updateEmailData,
    updateProposedSlots // Get the new handler
  } = useAppState();

  const { language, setLanguage } = useLanguage();

  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [localEmailData, setLocalEmailData] = useState<any>(null); // Consider using a more specific type
  const [agentSettings, setAgentSettings] = useState<AgentSettings | null>(null); // State for agent settings
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null); // State for theme settings
  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient>({
    to: state.customerInfo.contactEmail || '',
    cc: '',
    subject: ''
  });
  // State for conditional sections
  const [includeConditionalAccess, setIncludeConditionalAccess] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true); // Assuming notes are optional too
  const [additionalNotes, setAdditionalNotes] = useState('');
  // const [selectedSlotDay, setSelectedSlotDay] = useState<string | null>(null); // No longer needed for block selection
  const [includeMeetingSlots, setIncludeMeetingSlots] = useState(false); // State for the master toggle

  // Calculate the 90-day deadline once
  const deadlineDate = React.useMemo(() => {
    const today = new Date();
    return new Date(today.setDate(today.getDate() + 90));
  }, []);

  // Fetch agent and theme settings on mount
  useEffect(() => {
    Promise.all([
      StorageService.get<AgentSettings>('agentSettings'),
      StorageService.get<ThemeSettings>('themeSettings')
    ])
    .then(([agentData, themeData]) => {
      setAgentSettings(agentData || { agentName: '', agentTitle: '', companyName: '', agentEmail: '' });
      setThemeSettings(themeData || null);
      applyThemeColors(themeData || null); // Apply theme colors on load
    })
    .catch(error => {
      console.error("Error loading settings in App:", error);
      setAgentSettings({ agentName: '', agentTitle: '', companyName: '', agentEmail: '' });
      setThemeSettings(null);
    });
  }, []);

  // Generate available slots (memoize to avoid regeneration on every render)
  const availableSlots = React.useMemo(() => generateMeetingSlots(2), []);


  // Handler for the master meeting slots toggle
  const handleIncludeMeetingSlotsToggle = (isChecked: boolean) => {
    setIncludeMeetingSlots(isChecked);
    if (isChecked) {
      // Select all available slots
      updateProposedSlots(availableSlots);
    } else {
      // Clear selected slots
      updateProposedSlots([]);
    }
  };

  // Effect to set default meeting slot state based on tier
  useEffect(() => {
    const isBronze = state.customerInfo.selectedTier === 'bronze';
    handleIncludeMeetingSlotsToggle(!isBronze);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.customerInfo.selectedTier, availableSlots]);


  // Handle email recipient changes
  const handleEmailRecipientsChange = (field: string, value: string) => {
    setEmailRecipients({
      ...emailRecipients,
      [field]: value
    });
    if (field === 'to') {
      updateCustomerInfo('contactEmail', value);
    }
  };

  // Prepare data for Email Form (No longer needed by EmailForm component itself)
  // const getEmailCustomerInfo = () => { ... };

  // Generate email preview with all required properties
  const handlePreviewEmail = () => {
    // Use fetched agent settings, provide defaults if not loaded yet or empty
    const currentAgentName = agentSettings?.agentName || 'Your Name';
    const currentAgentTitle = agentSettings?.agentTitle || 'Support Specialist';
    const currentCompanyName = agentSettings?.companyName || 'Microsoft Partner Support';
    const currentAgentEmail = agentSettings?.agentEmail || '';

    // --- Automatic Subject Line ---
    const tierName = supportTiers[state.customerInfo.selectedTier as keyof typeof supportTiers]?.name || 'Support';
    const companyName = state.customerInfo.tenants[0]?.companyName || 'Customer';
    const autoSubject = `${companyName} - Microsoft - ${tierName} Support Plan Onboarding`;
    // --- End Automatic Subject ---

    // --- Calculate Deadline ---
    const today = new Date();
    const deadlineDate = new Date(today.setDate(today.getDate() + 90));
    // --- End Calculate Deadline ---

    // --- Create temporary tenant list with calculated deadline ---
    const tenantsWithDeadline = state.customerInfo.tenants.map(tenant => ({
      ...tenant,
      implementationDeadline: deadlineDate
    }));
    // --- End temporary tenant list ---

    // --- Build translated roles string (adjectives only) ---
    const translatedRoles = `${emailBuilder.translate('roleTechnical', language)} ${emailBuilder.translate('conjunctionAnd', language)} ${emailBuilder.translate('roleAdministrative', language)}`;
    // --- End translated roles string ---

    // Create an EmailFormData object with all the collected data
    const emailData = {
      companyName: companyName,
      contactName: state.customerInfo.contactName,
      contactEmail: state.customerInfo.contactEmail,
      proposedSlots: state.customerInfo.proposedSlots, // Pass the array
      tenantId: state.customerInfo.tenants[0]?.id || '', // Use primary tenant ID
      selectedTier: state.customerInfo.selectedTier,
      emailContacts: state.customerInfo.authorizedContacts, // Pass contacts
      to: emailRecipients.to,
      cc: emailRecipients.cc,
      subject: autoSubject,
      includeMeetingSlots: includeMeetingSlots, // Pass the flag
      conditionalAccess: {
        checked: includeConditionalAccess,
        mfa: true, location: true, device: true, signIn: true // Assuming these are fixed for now
      },
      authorizedContacts: {
         checked: true, // Assuming this section is always included if contacts exist
         roles: translatedRoles // Use the translated string
      },
      additionalNotes: includeNotes ? additionalNotes : '',
      senderName: currentAgentName,
      senderTitle: currentAgentTitle,
      senderCompany: currentCompanyName,
      senderContact: currentAgentEmail,
      currentDate: new Date().toLocaleDateString(),
      language: language
    };

    // Prepare data for preview, including the modified tenants list
    const previewData = {
      ...emailData,
      tenants: tenantsWithDeadline // Use the list with calculated deadlines for preview
    };

    setLocalEmailData(previewData); // Pass data with calculated deadlines to preview state
    // Note: We might not need to update the central emailData state here unless
    // we want the calculated deadline persisted somewhere, which seems unlikely.
    // updateEmailData(emailData);
    setShowEmailPreview(true);
  };

  // Return to form editing
  const handleBackToEdit = () => {
    setShowEmailPreview(false);
  };

  return (
    <div className="app-container onboarding-container">
      {!showEmailPreview && (
        <div className="language-option">
          <LanguageSelector
            selectedLanguage={language}
            onChange={setLanguage}
          />
        </div>
      )}

      {showEmailPreview && localEmailData ? (
        <EmailPreview
          emailData={localEmailData} // This now contains the calculated deadline via the tenants array within it
          tenants={localEmailData.tenants} // Pass the modified tenants list from localEmailData
          agentName={agentSettings?.agentName}
          agentTitle={agentSettings?.agentTitle}
          companyName={agentSettings?.companyName}
          agentEmail={agentSettings?.agentEmail}
          // Correctly pass flags including includeMeetingSlots
          flags={{ includeConditionalAccess, includeNotes, includeMeetingSlots }}
          additionalNotes={includeNotes ? additionalNotes : undefined}
          themeSettings={themeSettings}
          onBackToEdit={handleBackToEdit}
        />
      ) : (
        <div className="comprehensive-form">
          <div className="generator-header">
            <h1>Microsoft Support Onboarding Template Generator</h1>
            <p>Create customized onboarding emails for new support customers</p>
          </div>

          {/* 1. Email Recipients & Subject */}
          <EmailRecipientsForm
            recipients={emailRecipients}
            onRecipientChange={handleEmailRecipientsChange}
            onCustomerEmailChange={(email) => updateCustomerInfo('contactEmail', email)}
          />

          {/* 2. Support Tier Selection */}
          <div className="form-section tier-section">
            <TierSelector
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateTier}
            />
          </div>

          {/* 3. Customer Contact Information */}
          <div className="form-section customer-info-section">
            <h2>Customer Contact Information</h2>
            <div className="form-group">
              <label htmlFor="contact-name">Primary Contact Name</label>
              <input
                id="contact-name"
                type="text"
                value={state.customerInfo.contactName}
                onChange={(e) => updateCustomerInfo('contactName', e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Primary Contact Email</label>
              <input
                id="contact-email"
                type="email"
                value={state.customerInfo.contactEmail}
                onChange={(e) => updateCustomerInfo('contactEmail', e.target.value)}
                placeholder="email@company.com"
                required
                disabled={true}
              />
              <small className="form-text">This is synchronized with the email recipient above</small>
            </div>
          </div>

          {/* UPDATED: Proposed Meeting Slots Section */}
          <MeetingSlotSelector
            availableSlots={availableSlots}
            selectedSlots={state.customerInfo.proposedSlots || []}
            includeMeetingSlots={includeMeetingSlots}
            language={language}
            onIncludeToggle={handleIncludeMeetingSlotsToggle}
            onSlotsChange={updateProposedSlots}
          />


          {/* 4. Authorized Contacts */}
          <div className="form-section contacts-section">
            <ContactsForm
              contacts={state.customerInfo.authorizedContacts}
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateContacts}
            />
          </div>

          {/* 5. Tenant Information */}
          <div className="form-section tenant-section">
            <TenantManager
              tenants={state.customerInfo.tenants}
              selectedTier={state.customerInfo.selectedTier}
              onChange={updateTenants}
              calculatedDeadline={deadlineDate} // Pass calculated deadline
            />
          </div>

          {/* 6. Onboarding Components (Collapsible) */}
          <div className="form-section onboarding-components-section">
            <h2>Onboarding Components</h2>
            <p className="section-description">
              Configure the detailed sections to include in your onboarding email
            </p>
            <CollapsibleSection title="Conditional Access">
               <div className="form-group checkbox-container inline-label">
                 <input type="checkbox" id="includeConditionalAccess" checked={includeConditionalAccess} onChange={(e) => setIncludeConditionalAccess(e.target.checked)} />
                 <label htmlFor="includeConditionalAccess">Include Conditional Access Section</label>
               </div>
              <div className="form-group">
                <label>Policies to Implement:</label>
                <div className="inline-checks">
                  <div className="checkbox-container"><input type="checkbox" id="caMfa" defaultChecked={true} /><label htmlFor="caMfa">MFA Requirements</label></div>
                  <div className="checkbox-container"><input type="checkbox" id="caLocation" defaultChecked={true} /><label htmlFor="caLocation">Location-Based Access</label></div>
                  <div className="checkbox-container"><input type="checkbox" id="caDevice" defaultChecked={true} /><label htmlFor="caDevice">Device Compliance</label></div>
                  <div className="checkbox-container"><input type="checkbox" id="caSignIn" defaultChecked={true} /><label htmlFor="caSignIn">Sign-in Risk Policies</label></div>
                </div>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Additional Notes">
               <div className="form-group checkbox-container inline-label">
                 <input type="checkbox" id="includeNotes" checked={includeNotes} onChange={(e) => setIncludeNotes(e.target.checked)} />
                 <label htmlFor="includeNotes">Include Additional Notes Section</label>
               </div>
              <div className="form-group">
                <label htmlFor="additional-notes">Notes or Instructions:</label>
                <textarea
                  id="additional-notes"
                  placeholder="Any additional information for the client..."
                  rows={4}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                ></textarea>
              </div>
            </CollapsibleSection>
          </div>

          {/* 7. Email Builder with Preview Button */}
          <div className="form-section email-section">
            <h2>Email Preview & Generate</h2>
            <p className="section-description">
              Preview the email template and generate it for sending. Agent details are configured in Extension Settings.
            </p>
            <div className="form-actions">
              <button
                type="button"
                className="btn-preview"
                onClick={handlePreviewEmail}
                disabled={!agentSettings}
              >
                {agentSettings ? 'Preview Email' : 'Loading Settings...'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
