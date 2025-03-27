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
import { supportTiers } from '../../supportTiers/data/supportTiers'; // Import supportTiers
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
    updateEmailData
  } = useAppState();

  const { language, setLanguage } = useLanguage();

  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [localEmailData, setLocalEmailData] = useState<any>(null); // Consider using a more specific type
  const [agentSettings, setAgentSettings] = useState<AgentSettings | null>(null); // State for agent settings
  const [emailRecipients, setEmailRecipients] = useState({
    to: state.customerInfo.contactEmail || '',
    cc: '',
    subject: ''
  });
  // State for conditional sections
  // Removed includeGdap state
  const [includeRbac, setIncludeRbac] = useState(true);
  const [includeConditionalAccess, setIncludeConditionalAccess] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true); // Assuming notes are optional too
  const [additionalNotes, setAdditionalNotes] = useState('');


  // Fetch agent settings on mount
  useEffect(() => {
    StorageService.get<AgentSettings>('agentSettings')
      .then(settings => {
        if (settings) {
          setAgentSettings(settings);
        } else {
          // Set default settings if none are found in storage
          setAgentSettings({ agentName: '', agentTitle: '', companyName: '', agentEmail: '' });
        }
      })
      .catch(error => {
        console.error("Error loading agent settings in App:", error);
        // Set default settings on error as well
        setAgentSettings({ agentName: '', agentTitle: '', companyName: '', agentEmail: '' });
      });
  }, []); // Empty dependency array ensures this runs only once on mount


  // Handle date change with proper type handling
  const handleDateChange = (date: string) => {
    try {
      // Create a Date object safely
      const newDate = new Date(date);

      // Verify it's a valid date before setting it
      if (!isNaN(newDate.getTime())) {
        updateCustomerInfo('proposedDate', newDate);
      } else {
        console.warn("Invalid date input: ", date);
      }
    } catch (err) {
      console.error("Error parsing date: ", err);
    }
  };

  // Handle email recipient changes
  const handleEmailRecipientsChange = (field: string, value: string) => {
    setEmailRecipients({
      ...emailRecipients,
      [field]: value
    });

    // If it's the 'to' field, also update the primary contact email
    if (field === 'to') {
      updateCustomerInfo('contactEmail', value);
    }
  };

  // Prepare data for Email Form
  const getEmailCustomerInfo = () => {
    // Use the first tenant's info for the email by default
    const primaryTenant = state.customerInfo.tenants[0] || { id: '', companyName: '' };

    return {
      companyName: primaryTenant.companyName,
      contactName: state.customerInfo.contactName,
      contactEmail: state.customerInfo.contactEmail,
      proposedDate: state.customerInfo.proposedDate,
      tenantId: primaryTenant.id,
      authorizedContacts: state.customerInfo.authorizedContacts,
      selectedTier: state.customerInfo.selectedTier
    };
  };

  // Generate email preview with all required properties
  const handlePreviewEmail = () => {
    // --- DEBUGGING START ---
    console.log("State before preview:", JSON.stringify(state.customerInfo, null, 2));
    console.log("Tenants:", JSON.stringify(state.customerInfo.tenants, null, 2));
    console.log("Contacts:", JSON.stringify(state.customerInfo.authorizedContacts, null, 2));
    // --- DEBUGGING END ---

    // Use fetched agent settings, provide defaults if not loaded yet or empty
    const currentAgentName = agentSettings?.agentName || 'Your Name';
    const currentAgentTitle = agentSettings?.agentTitle || 'Support Specialist';
    const currentCompanyName = agentSettings?.companyName || 'Microsoft Partner Support';
    const currentAgentEmail = agentSettings?.agentEmail || ''; // Get email, default to empty

    // --- Automatic Subject Line ---
    const customerInfo = getEmailCustomerInfo(); // Get customer info first
    // Ensure supportTiers is imported and used correctly
    const tierName = supportTiers[customerInfo.selectedTier as keyof typeof supportTiers]?.name || 'Support'; // Get tier name safely with type assertion
    const companyName = customerInfo.companyName || 'Customer'; // Get company name safely
    const autoSubject = `${companyName} - Microsoft - ${tierName} Support Plan Onboarding`;
    // --- End Automatic Subject ---

    // --- Determine GDAP Link ---
    // Use the first tenant by default for the email content
    const primaryTenant = state.customerInfo.tenants[0];
    const defaultGdapLink = "https://partner.microsoft.com/dashboard/commerce/granularadmin";
    const tenantSpecificGdapLink = primaryTenant?.gdapLink || defaultGdapLink;
    // --- End Determine GDAP Link ---

    // Create an EmailFormData object with all the collected data
    // Note: EmailFormData type in types.ts might need updating if it doesn't match this structure
    const emailData = {
      to: emailRecipients.to,
      cc: emailRecipients.cc,
      subject: autoSubject, // Use automatically generated subject
      // Add other fields from the form
      ...customerInfo, // Use the customerInfo object we already got
      // Include emailContacts required by EmailFormData type
      emailContacts: state.customerInfo.authorizedContacts,
      // Removed gdap property construction
      rbac: {
        checked: includeRbac, // Use state variable
        groups: 'appropriate security groups', // Keep defaults for now - TODO: Read from form input
        tenantId: state.customerInfo.tenants[0]?.id || '[your-tenant-id]',
        azure: true, // Keep defaults for now
        m365: true,
        includeScript: true // Keep defaults for now
      },
      conditionalAccess: {
        checked: includeConditionalAccess, // Use state variable
        mfa: true, // Keep defaults for now
        location: true,
        device: true,
        signIn: true
      },
      // This seems redundant if emailContacts holds the list? Check usage.
      // Keeping structure for now, but using includeContacts flag if needed later.
      authorizedContacts: {
         checked: true, // Maybe control this section too?
         roles: 'Technical and Administrative contacts' // Keep default for now
      },
      // Add additional notes from state
      additionalNotes: includeNotes ? additionalNotes : '', // Only include notes if flag is true
      // Use fetched agent settings here
      senderName: currentAgentName,
      senderTitle: currentAgentTitle,
      senderCompany: currentCompanyName,
      // Use the fetched agent email here
      senderContact: currentAgentEmail, // Renamed from senderContact to match template usage? Check templateGenerator.ts if needed. Assuming senderContact maps to agentEmail.
      currentDate: new Date().toLocaleDateString(),
      language: language
    };

    // Store complete email data in local state for immediate use
    // Pass agent settings separately to EmailPreview if needed there, or rely on them being in emailData
    const completeEmailData = {...emailData, language};
    setLocalEmailData(completeEmailData);

    // Also update the app state (for persistence) - ensure updateEmailData handles the full structure
    updateEmailData(emailData);

    // Show the preview
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
        // Pass the full tenants array to EmailPreview
        <EmailPreview
          emailData={localEmailData} // Contains subject, recipients, sender details etc.
          // customerInfo={getEmailCustomerInfo()} // No longer needed by EmailPreview directly for HTML generation
          tenants={state.customerInfo.tenants} // Pass the full tenants array
          // Pass agent details separately as expected by EmailPreview props
          agentName={agentSettings?.agentName}
          agentTitle={agentSettings?.agentTitle}
          companyName={agentSettings?.companyName} // Agent's company
          agentEmail={agentSettings?.agentEmail}
          // Pass conditional flags and notes to EmailPreview -> generateTemplate
          // Removed includeGdap from flags
          flags={{ includeRbac, includeConditionalAccess, includeNotes }}
          additionalNotes={includeNotes ? additionalNotes : undefined}
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
            </div>

            {/* Removed manual subject input field */}
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
                disabled={true} // Keep disabled as it syncs with 'To' field
              />
              <small className="form-text">This is synchronized with the email recipient above</small>
            </div>

            <div className="form-group">
              <label htmlFor="proposed-date">Proposed Meeting Date</label>
              <input
                id="proposed-date"
                type="date"
                value={state.customerInfo.proposedDate instanceof Date && !isNaN(state.customerInfo.proposedDate.getTime())
                  ? state.customerInfo.proposedDate.toISOString().split('T')[0]
                  : ''}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
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

            {/* Removed GDAP CollapsibleSection */}

            <CollapsibleSection title="RBAC Configuration">
               <div className="form-group checkbox-container inline-label">
                 <input type="checkbox" id="includeRbac" checked={includeRbac} onChange={(e) => setIncludeRbac(e.target.checked)} />
                 <label htmlFor="includeRbac">Include RBAC Section</label>
               </div>
              {/* Inputs for RBAC */}
               <div className="form-group">
                <label htmlFor="rbac-groups">Security Groups to Configure:</label>
                <input id="rbac-groups" type="text" placeholder="e.g., IT Admins, Finance Team, HR" />
              </div>
              <div className="form-group">
                <label>Permission Level:</label>
                <div className="inline-checks">
                  <div className="checkbox-container"><input type="checkbox" id="rbacAzure" defaultChecked={true} /><label htmlFor="rbacAzure">Azure RBAC</label></div>
                  <div className="checkbox-container"><input type="checkbox" id="rbacM365" defaultChecked={true} /><label htmlFor="rbacM365">Microsoft 365 RBAC</label></div>
                </div>
              </div>
              <div className="form-group">
                <div className="checkbox-container"><input type="checkbox" id="includeRbacScript" defaultChecked={true} /><label htmlFor="includeRbacScript">Include PowerShell Script</label></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Conditional Access">
               <div className="form-group checkbox-container inline-label">
                 <input type="checkbox" id="includeConditionalAccess" checked={includeConditionalAccess} onChange={(e) => setIncludeConditionalAccess(e.target.checked)} />
                 <label htmlFor="includeConditionalAccess">Include Conditional Access Section</label>
               </div>
              {/* Inputs for Conditional Access */}
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
              {/* Input for Additional Notes */}
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
          {/* Removed sender input fields as they now come from settings */}
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
                disabled={!agentSettings} // Disable button until settings are loaded
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
