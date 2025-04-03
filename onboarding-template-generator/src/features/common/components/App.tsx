// src/features/common/components/App.tsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { TierSelector } from '../../supportTiers';
import { ContactsForm } from '../../contacts';
import { TenantManager } from '../../tenants';
import { EmailForm, EmailPreview } from '../../emailBuilder';
import LanguageSelector from './LanguageSelector';
import { useAppState } from '../../../contexts/AppStateContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { StorageService } from '../../../services/storage'; // Import StorageService
import { ThemeSettings } from '../../../types'; // Import ThemeSettings
import { supportTiers } from '../../supportTiers/data/supportTiers'; // Import supportTiers
import { generateMeetingSlots, formatSlot } from '../../emailBuilder/utils/dateSlotGenerator'; // Import slot utilities
import '../../../styles/App.css';

// Define AgentSettings interface (can be moved to a shared types file later)
interface AgentSettings {
  agentName: string;
  agentTitle: string;
  companyName: string;
  agentEmail: string; // Add agentEmail
}

// Collapsible Section component for onboarding components
const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}> = ({ title, children, initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div className="form-section collapsible-section">
      <div
        className={`collapsible-header ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{title}</h3>
        <span className="toggle-icon">{isExpanded ? '−' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
};

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
  const [emailRecipients, setEmailRecipients] = useState({
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


  // Fetch agent and theme settings on mount
  useEffect(() => {
    Promise.all([
      StorageService.get<AgentSettings>('agentSettings'),
      StorageService.get<ThemeSettings>('themeSettings')
    ])
    .then(([agentData, themeData]) => {
      setAgentSettings(agentData || { agentName: '', agentTitle: '', companyName: '', agentEmail: '' });
      setThemeSettings(themeData || null);
    })
    .catch(error => {
      console.error("Error loading settings in App:", error);
      setAgentSettings({ agentName: '', agentTitle: '', companyName: '', agentEmail: '' });
      setThemeSettings(null);
    });
  }, []);

  // Generate available slots (memoize to avoid regeneration on every render)
  const availableSlots = React.useMemo(() => generateMeetingSlots(2), []);

  // Handle meeting slot selection change (for individual slots - needed by block change handler)
  const handleSlotChange = (slot: Date, isChecked: boolean) => {
    const currentSlots = state.customerInfo.proposedSlots || [];
    let updatedSlots: Date[];

    if (isChecked) {
      if (!currentSlots.some(s => s.getTime() === slot.getTime())) {
        updatedSlots = [...currentSlots, slot];
      } else {
        updatedSlots = currentSlots;
      }
    } else {
      updatedSlots = currentSlots.filter(s => s.getTime() !== slot.getTime());
    }
    updatedSlots.sort((a, b) => a.getTime() - b.getTime());
    updateProposedSlots(updatedSlots);
  };

  // Handler for selecting/deselecting morning/afternoon blocks by toggling individual slots
  const handleTimeBlockChange = (dayKey: string, block: 'morning' | 'afternoon', isSelected: boolean) => {
    const slotsForDay = slotsByDay[dayKey] || [];
    let blockSlots: Date[] = [];

    if (block === 'morning') {
      blockSlots = slotsForDay.filter(slot => slot.getHours() >= 10 && slot.getHours() < 12);
    } else { // afternoon
      blockSlots = slotsForDay.filter(slot => slot.getHours() >= 14 && slot.getHours() < 16);
    }

    // Update the state based on the block selection
    const currentSlots = state.customerInfo.proposedSlots || [];
    let updatedSlots: Date[];

    if (isSelected) {
      // Add block slots, avoiding duplicates
      const slotsToAdd = blockSlots.filter(bs => !currentSlots.some(cs => cs.getTime() === bs.getTime()));
      updatedSlots = [...currentSlots, ...slotsToAdd];
    } else {
      // Remove block slots
      const blockSlotTimes = blockSlots.map(s => s.getTime());
      updatedSlots = currentSlots.filter(cs => !blockSlotTimes.includes(cs.getTime()));
    }

    updatedSlots.sort((a, b) => a.getTime() - b.getTime());
    updateProposedSlots(updatedSlots);
  };


  // Group available slots by day (YYYY-MM-DD)
  const slotsByDay = React.useMemo(() => {
    const grouped: { [key: string]: Date[] } = {};
    availableSlots.forEach(slot => {
      const dayKey = slot.toISOString().split('T')[0];
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(slot);
    });
    return grouped;
  }, [availableSlots]);

  // Get unique days for day selection
  const availableDays = React.useMemo(() => Object.keys(slotsByDay).sort(), [slotsByDay]);

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
         roles: 'Technical and Administrative contacts' // Example default
      },
      additionalNotes: includeNotes ? additionalNotes : '',
      senderName: currentAgentName,
      senderTitle: currentAgentTitle,
      senderCompany: currentCompanyName,
      senderContact: currentAgentEmail,
      currentDate: new Date().toLocaleDateString(),
      language: language
    };

    const completeEmailData = {...emailData, language};
    setLocalEmailData(completeEmailData);
    updateEmailData(emailData); // Update central state for persistence if needed
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
          emailData={localEmailData}
          tenants={state.customerInfo.tenants}
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
          <div className="form-section email-recipients-section">
            <h2>Email Recipients</h2>
            <div className="form-group">
              <label htmlFor="to-field">To:</label>
              <input
                id="to-field"
                type="email"
                value={emailRecipients.to}
                onChange={(e) => handleEmailRecipientsChange('to', e.target.value)}
                placeholder="recipient@example.com"
                required
              />
              <small className="form-text">Use semicolons (;) to separate multiple addresses.</small>
            </div>
            <div className="form-group">
              <label htmlFor="cc-field">Cc:</label>
              <input
                id="cc-field"
                type="email"
                value={emailRecipients.cc}
                onChange={(e) => handleEmailRecipientsChange('cc', e.target.value)}
                placeholder="cc@example.com"
              />
              <small className="form-text">Use semicolons (;) to separate multiple addresses.</small>
            </div>
          </div>

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

          {/* UPDATED: Proposed Meeting Slots Section - Block + Individual */}
          <div className="form-section meeting-slots-section">
            <div className="section-header-with-toggle">
              <h2>Propose Meeting Slots</h2>
              <div className="checkbox-container inline-label master-toggle">
                <input
                  type="checkbox"
                  id="includeMeetingSlots"
                  checked={includeMeetingSlots}
                  onChange={(e) => handleIncludeMeetingSlotsToggle(e.target.checked)}
                />
                <label htmlFor="includeMeetingSlots">Include Meeting Proposal</label>
              </div>
            </div>
            <p className="section-description">Select potential 30-minute slots for the onboarding call (Tuesdays/Thursdays, 10-12 & 14-16). Use the toggle above to include/exclude this section in the email and select/deselect all slots.</p>

            <div className="slot-day-columns-container"> {/* Container for horizontal columns */}
              {availableDays.length > 0 ? (
                availableDays.map((dayKey) => {
                    const dayDate = new Date(dayKey + 'T00:00:00Z'); // Parse YYYY-MM-DD as UTC
                    const dayLabel = dayDate.toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric' });
                    const morningSlots = slotsByDay[dayKey]?.filter(s => s.getHours() >= 10 && s.getHours() < 12) || [];
                    const afternoonSlots = slotsByDay[dayKey]?.filter(s => s.getHours() >= 14 && s.getHours() < 16) || [];

                    // Determine if morning/afternoon blocks are fully selected
                    const isMorningSelected = morningSlots.length > 0 && morningSlots.every(ms => state.customerInfo.proposedSlots?.some(ps => ps.getTime() === ms.getTime()));
                    const isAfternoonSelected = afternoonSlots.length > 0 && afternoonSlots.every(as => state.customerInfo.proposedSlots?.some(ps => ps.getTime() === as.getTime()));

                    return (
                      <div key={dayKey} className="slot-day-column"> {/* Column for each day */}
                        <h4 className="slot-day-header">{dayLabel}</h4>
                        {/* Block Selectors */}
                        <div className="slot-block-group">
                          {morningSlots.length > 0 && (
                            <div className="checkbox-container slot-block-checkbox">
                              <input
                                type="checkbox"
                                id={`morning-${dayKey}`}
                                checked={isMorningSelected}
                                onChange={(e) => handleTimeBlockChange(dayKey, 'morning', e.target.checked)}
                                disabled={!includeMeetingSlots}
                              />
                              <label htmlFor={`morning-${dayKey}`}>Morning (10:00-12:00)</label>
                            </div>
                          )}
                          {afternoonSlots.length > 0 && (
                            <div className="checkbox-container slot-block-checkbox">
                              <input
                                type="checkbox"
                                id={`afternoon-${dayKey}`}
                                checked={isAfternoonSelected}
                                onChange={(e) => handleTimeBlockChange(dayKey, 'afternoon', e.target.checked)}
                                disabled={!includeMeetingSlots}
                              />
                              <label htmlFor={`afternoon-${dayKey}`}>Afternoon (14:00-16:00)</label>
                            </div>
                          )}
                        </div>
                        {/* Divider */}
                        {(morningSlots.length > 0 || afternoonSlots.length > 0) && <hr className="slot-divider" />}
                        {/* Individual Slots */}
                        <div className="slot-checkbox-group vertical">
                          {slotsByDay[dayKey].map((slot) => {
                            const slotId = `slot-${slot.toISOString()}`;
                            const isChecked = state.customerInfo.proposedSlots?.some(s => s.getTime() === slot.getTime()) || false;
                            const timeLabel = slot.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false }) + ' - ' + new Date(slot.getTime() + 30 * 60000).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false });
                            return (
                              <div key={slotId} className="checkbox-container slot-checkbox">
                                <input
                                  type="checkbox"
                                  id={slotId}
                                  checked={isChecked}
                                  onChange={(e) => handleSlotChange(slot, e.target.checked)}
                                  disabled={!includeMeetingSlots}
                                />
                                <label htmlFor={slotId}>{timeLabel}</label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No available slots found in the coming weeks.</p>
                )}
              </div>
          </div>


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
