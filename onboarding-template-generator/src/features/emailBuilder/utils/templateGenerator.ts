// src/features/emailBuilder/utils/templateGenerator.ts
import { supportTiers } from '../../supportTiers/data/supportTiers'; // Updated import path
import { CustomerInfo } from './types';
import { SupportTier } from '../../supportTiers/types'; // Corrected import path for SupportTier
import { ThemeSettings } from '../../../types'; // Import ThemeSettings

// --- Constants ---

// Constants for RBAC Script
const HELP_DESK_AGENTS_OBJECT_ID = "b6770181-d9f5-4818-b5b1-ea51cd9f66e5";
const ADMIN_AGENTS_OBJECT_ID = "9a838974-22d3-415b-8136-c790e285afeb";
const SUPPORT_REQUEST_CONTRIBUTOR_ROLE = "Support Request Contributor";
const OWNER_ROLE = "Owner";

const RBAC_POWERSHELL_SCRIPT_TEMPLATE = `
# Connect to Azure with your tenant ID
Connect-AzAccount -Tenant "{TENANT_ID}"

# Get all available subscriptions
$subscriptions = Get-AzSubscription

# Loop through each subscription
foreach ($subscription in $subscriptions) {
    # Set the current context to this subscription
    Set-AzContext -SubscriptionId $subscription.Id

    # Add the ${SUPPORT_REQUEST_CONTRIBUTOR_ROLE} role to Foreign Principal HelpDeskAgents
    New-AzRoleAssignment -ObjectID "${HELP_DESK_AGENTS_OBJECT_ID}" -RoleDefinitionName "${SUPPORT_REQUEST_CONTRIBUTOR_ROLE}" -ObjectType "ForeignGroup" -ErrorAction SilentlyContinue

    # Test if the ${SUPPORT_REQUEST_CONTRIBUTOR_ROLE} role is assigned
    $supportRole = Get-AzRoleAssignment -ObjectId "${HELP_DESK_AGENTS_OBJECT_ID}" | Where-Object { $_.RoleDefinitionName -eq "${SUPPORT_REQUEST_CONTRIBUTOR_ROLE}" }

    if ($supportRole) {
        Write-Host "${SUPPORT_REQUEST_CONTRIBUTOR_ROLE} role is assigned to Foreign Principal HelpDeskAgents."

        # Test if the ${OWNER_ROLE} role for the Foreign Principal AdminAgents exists
        $ownerRole = Get-AzRoleAssignment -ObjectId "${ADMIN_AGENTS_OBJECT_ID}" | Where-Object { $_.RoleDefinitionName -eq "${OWNER_ROLE}" }

        if ($ownerRole) {
            # If the ${OWNER_ROLE} role exists, remove it
            Remove-AzRoleAssignment -ObjectID "${ADMIN_AGENTS_OBJECT_ID}" -RoleDefinitionName "${OWNER_ROLE}"
        } else {
            Write-Host "${OWNER_ROLE} role for Foreign Principal AdminAgents does not exist."
        }
    } else {
        Write-Host "Error: Could not assign ${SUPPORT_REQUEST_CONTRIBUTOR_ROLE} role for Foreign Principal HelpDeskAgents!"
    }
}`;

// --- Helper Functions for Email Formatting ---

const _formatScriptBlock = (scriptContent: string, theme: ThemeSettings): string => {
  const cleanedScript = scriptContent.trim()
    .replace(/\t/g, '    ')
    .replace(/^\s*\n/gm, '');
  const scriptBgColor = theme.backgroundColor ? `${theme.backgroundColor}0D` : '#f5f5f5'; // Lighter theme bg or fallback grey
  const scriptHeaderBgColor = theme.backgroundColor ? `${theme.backgroundColor}1A` : '#f0f0f0'; // Lightened theme bg or fallback grey
  const scriptTextColor = theme.textColor || '#333'; // Fallback text color
  const scriptHeaderTextColor = theme.textColor || '#555'; // Fallback text color

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 15px 0;">
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: ${scriptBgColor}; border: 1px solid #ddd; border-radius: 4px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; background-color: ${scriptHeaderBgColor};">
                <span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: ${scriptHeaderTextColor}; font-weight: 600;">PowerShell Script</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 13px; line-height: 1.45; color: ${scriptTextColor}; white-space: pre-wrap; word-break: break-all;">
${cleanedScript}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
};

const _createContactsTable = (contacts: Array<{name: string, email: string, phone: string}>, theme: ThemeSettings): string => {
  let tableRows = '';
  const textColor = theme.textColor || '#333'; // Fallback text color
  const headerBgColor = theme.backgroundColor ? `${theme.backgroundColor}1A` : '#f0f0f0'; // Lightened theme bg or fallback grey
  const rowBgColor1 = theme.backgroundColor || '#FFFFFF'; // Theme background or white
  const rowBgColor2 = theme.backgroundColor ? `${theme.backgroundColor}0D` : '#f9f9f9'; // Lighter theme bg or light grey

  contacts.forEach((contact, index) => {
    const bgColor = index % 2 === 0 ? rowBgColor2 : rowBgColor1;
    tableRows += `
      <tr style="background-color: ${bgColor};">
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">${contact.name || ''}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">${contact.email || ''}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">${contact.phone || ''}</td>
      </tr>`;
  });

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 15px 0;">
      <tr style="background-color: ${headerBgColor};">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Name</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Email</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Phone</th>
      </tr>
      ${tableRows}
    </table>`;
};

const _formatDate = (date: Date | null | undefined): string => {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return '[DATE TO BE CONFIRMED]';
};

// --- Email Section Generators ---

const _generateHeader = (tier: SupportTier, theme: ThemeSettings): string => {
  const headerColor = theme.primaryColor || tier.color; // Use theme primary or tier color
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 0;">
        <h2 style="color: ${headerColor}; border-bottom: 1px solid ${headerColor}; padding-bottom: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 24px; margin: 0 0 15px 0;">Microsoft Support Onboarding - ${tier.name}</h2>
      </td>
    </tr>
  </table>`;
};

const _generateGreeting = (info: CustomerInfo, theme: ThemeSettings): string => {
  const textColor = theme.textColor || '#333'; // Fallback text color
  return `
  <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Dear ${info.contactName},</p>`;
};

const _generateMeetingProposal = (info: CustomerInfo, tier: SupportTier, theme: ThemeSettings): string => {
  const formattedDate = _formatDate(info.proposedDate);
  const textColor = theme.textColor || '#333'; // Fallback text color
  return `
    <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Thank you for choosing Microsoft Premier Support. We would like to schedule an onboarding session to explain our support request process and modalities for your <strong style="font-weight: 600;">${tier.name}</strong> plan.</p>
    <p style="margin: 0 0 20px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">I propose we meet on <strong style="font-weight: 600;">${formattedDate}</strong> to discuss the following onboarding steps:</p>`;
};

const _generateTierDetailsSection = (tier: SupportTier, theme: ThemeSettings): string => {
  const headerColor = theme.primaryColor || tier.color; // Use theme primary or tier color
  const textColor = theme.textColor || '#333'; // Fallback text color
  const listTextColor = theme.textColor || '#333'; // Can be same or different
  const successColor = '#107c10'; // Keep standard success/error colors for clarity? Or use theme?
  const errorColor = '#d83b01';

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${headerColor}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">1. Support Tier Selection</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">You have selected the <strong style="font-weight: 600;">${tier.name}</strong> plan which includes:</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 10px 0 15px 0;">
          <tr>
            <td style="padding: 0 0 0 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif; color: ${listTextColor};">• Support Hours: ${tier.supportHours}</td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif; color: ${listTextColor};">• Authorized Contacts: ${tier.authorizedContacts}</td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif; color: ${listTextColor};">• Tenants: ${tier.tenants}</td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif; color: ${listTextColor};">• Support Requests: ${tier.supportRequestsIncluded}</td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif; color: ${listTextColor};">• Critical Situation Support: ${tier.criticalSituation ? `<span style="color: ${successColor}; font-weight: 600;">Yes</span>` : `<span style="color: ${errorColor}; font-weight: 600;">No</span>`}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
};

const _generateContactsSection = (info: CustomerInfo, tier: SupportTier, theme: ThemeSettings): string => {
  const headerColor = theme.primaryColor || tier.color; // Use theme primary or tier color
  const textColor = theme.textColor || '#333'; // Fallback text color
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${headerColor}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">2. Authorized Customer Contacts</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Please confirm the following list of contacts authorized to open support requests:</p>
        ${_createContactsTable(info.authorizedContacts, theme)}
      </td>
    </tr>
  </table>`;
};

const _generateTenantSection = (info: CustomerInfo, tier: SupportTier, theme: ThemeSettings): string => {
  const headerColor = theme.primaryColor || tier.color; // Use theme primary or tier color
  const textColor = theme.textColor || '#333'; // Fallback text color
  const errorColor = '#d83b01'; // Keep standard error color?
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${headerColor}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">3. Tenant Microsoft ID Definition</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Your Microsoft Tenant ID: <strong style="font-weight: 600;">${info.tenantId || `<span style="color: ${errorColor}; font-style: italic;">[PLEASE PROVIDE]</span>`}</strong></p>
      </td>
    </tr>
  </table>`;
};

const _generateGdapSection = (tier: SupportTier, theme: ThemeSettings): string => {
  const headerColor = theme.primaryColor || tier.color; // Use theme primary or tier color
  const textColor = theme.textColor || '#333'; // Fallback text color
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${headerColor}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">4. GDAP Link Acceptance</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Please accept the GDAP (Granular Delegated Admin Privileges) link that will be sent to your admin email address. This step is required to enable our support team to access your environment when needed.</p>
      </td>
    </tr>
  </table>`;
};

const _generateRbacSection = (info: CustomerInfo, tier: SupportTier, theme: ThemeSettings): string => {
  const headerColor = theme.primaryColor || tier.color; // Use theme primary or tier color
  const textColor = theme.textColor || '#333'; // Fallback text color
  const tenantIdPlaceholder = info.tenantId || 'YOUR_TENANT_ID';
  const script = RBAC_POWERSHELL_SCRIPT_TEMPLATE.replace('{TENANT_ID}', tenantIdPlaceholder);
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 0;">
          <h3 style="color: ${headerColor}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">5. RBAC Role Establishment</h3>
          <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">We will provide a script to establish the necessary RBAC (Role-Based Access Control) roles for your support plan. Please execute the following PowerShell script in your environment:</p>
          ${_formatScriptBlock(script, theme)}
        </td>
      </tr>
    </table>`;
};

const _generateServiceProviderSection = (tier: SupportTier, theme: ThemeSettings): string => {
  const headerColor = theme.primaryColor || tier.color; // Use theme primary or tier color
  const textColor = theme.textColor || '#333'; // Fallback text color
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${headerColor}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">6. Service Provider Acceptance</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Finally, please add Microsoft Support as a service provider in your conditional access policy to ensure seamless integration with your security protocols.</p>
      </td>
    </tr>
  </table>`;
};

// Updated to accept agent details including email and theme
const _generateClosing = (agentName: string | undefined, agentTitle: string | undefined, companyName: string | undefined, agentEmail: string | undefined, theme: ThemeSettings): string => {
  const nameLine = agentName || 'Microsoft Support Team'; // Default if not provided
  const titleLine = agentTitle ? `<br>${agentTitle}` : '';
  const companyLine = companyName ? `<br>${companyName}` : '';
  // Use provided agent email or fallback
  const email = agentEmail || (agentName ? `${agentName.toLowerCase().replace(' ', '.')}@${companyName?.toLowerCase() || 'microsoft.com'}` : 'support@microsoft.com');
  const mailtoLink = `mailto:${email}`;

  const textColor = theme.textColor || '#333'; // Fallback text color
  const primaryColor = theme.primaryColor || '#0078D4'; // Fallback link color

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 30px;">
    <tr>
      <td style="padding: 0;">
        <p style="margin: 0 0 10px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">Looking forward to our meeting and to supporting your organization.</p>
        <p style="margin: 20px 0 5px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif; color: ${textColor};">
          Best regards,<br>
          ${nameLine}
          ${titleLine}
          ${companyLine}
          <br><a href="${mailtoLink}" style="color: ${primaryColor}; text-decoration: none;">${email}</a>
        </p>
      </td>
    </tr>
  </table>`;
};

// --- Add new section generator for Additional Notes ---
const _generateAdditionalNotesSection = (notes: string, tier: SupportTier, theme: ThemeSettings): string => {
    // Process line breaks
    const formattedNotes = notes.replace(/\n/g, '<br>');
    const headerColor = theme.primaryColor || tier.color; // Use theme primary or tier color
    const textColor = theme.textColor || '#333'; // Fallback text color
    return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${headerColor}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Additional Notes</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">
          ${formattedNotes}
        </p>
      </td>
    </tr>
  </table>`;
};

const _generateFooter = (theme: ThemeSettings): string => {
  const footerTextColor = theme.textColor ? `${theme.textColor}B3` : '#666'; // Lighter text color or fallback grey
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 30px; border-top: 1px solid #ddd;">
    <tr>
      <td style="padding: 10px 0 0 0;">
        <p style="margin: 0; font-size: 12px; color: ${footerTextColor}; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">This is an automated message generated by the Microsoft Onboarding Template Generator.</p>
      </td>
    </tr>
  </table>`;
};

// --- Main Template Generation Function ---

// Define interface for conditional flags (can be moved)
interface TemplateFlags {
  includeGdap?: boolean;
  includeRbac?: boolean;
  includeConditionalAccess?: boolean;
  includeNotes?: boolean;
}

// Default theme settings to use if none are provided
const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  primaryColor: '#0078d4',
  textColor: '#323130',
  backgroundColor: '#ffffff', // Default to white for email body
};


// Updated signature to accept agent details, flags, notes, and theme
export const generateTemplate = (
  info: CustomerInfo,
  agentName?: string,
  agentTitle?: string,
  companyName?: string,
  agentEmail?: string,
  flags?: TemplateFlags, // Add flags parameter
  additionalNotes?: string, // Add notes parameter
  theme: ThemeSettings = DEFAULT_THEME_SETTINGS // Add theme parameter with default
): string => {
  // Ensure selectedTier is valid, default if not
  const validTierKey = info.selectedTier in supportTiers ? info.selectedTier : Object.keys(supportTiers)[0];
  const tier = supportTiers[validTierKey];
  const effectiveTheme = { ...DEFAULT_THEME_SETTINGS, ...theme }; // Merge provided theme with defaults

  // Use theme colors for main body styles
  const bodyBgColor = effectiveTheme.backgroundColor;
  const bodyTextColor = effectiveTheme.textColor;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!-- Outlook specific styles -->
  <!--[if mso]>
  <style type="text/css">
    body, table, td, th, div, p, h1, h2, h3, h4, h5, h6 {font-family: 'Segoe UI', Arial, sans-serif !important;}
    table {border-collapse: collapse;}
    .mso-button { padding: 12px 30px; background-color: ${effectiveTheme.primaryColor}; color: white; text-decoration: none; font-weight: bold; display: inline-block; } /* Use theme primary */
  </style>
  <![endif]-->
</head>
<body style="background-color: ${bodyBgColor};"> {/* Apply theme background to body */}
  <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; color: ${bodyTextColor}; background-color: ${bodyBgColor};"> {/* Apply theme colors to main container */}
    ${_generateHeader(tier, effectiveTheme)}
    ${_generateGreeting(info, effectiveTheme)}
    ${_generateMeetingProposal(info, tier, effectiveTheme)}
    ${_generateTierDetailsSection(tier, effectiveTheme)}
    ${_generateContactsSection(info, tier, effectiveTheme)}
    ${_generateTenantSection(info, tier, effectiveTheme)}
    ${/* Conditionally render sections based on flags */''}
    ${flags?.includeGdap ? _generateGdapSection(tier, effectiveTheme) : ''}
    ${flags?.includeRbac ? _generateRbacSection(info, tier, effectiveTheme) : ''}
    ${flags?.includeConditionalAccess ? _generateServiceProviderSection(tier, effectiveTheme) : ''}
    ${/* Conditionally render notes */''}
    ${flags?.includeNotes && additionalNotes ? _generateAdditionalNotesSection(additionalNotes, tier, effectiveTheme) : ''}
    ${_generateClosing(agentName, agentTitle, companyName, agentEmail, effectiveTheme)}
    ${_generateFooter(effectiveTheme)}
  </div>
</body>
</html>`;
}; // Ensure this closing brace is present

// Correct export is handled by the 'export const generateTemplate = ...' line above
// Remove duplicate export statement:
// export { generateTemplate };
