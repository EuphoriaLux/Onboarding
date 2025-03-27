// src/features/emailBuilder/utils/templateGenerator.ts
import { supportTiers } from '../../supportTiers/data/supportTiers'; // Updated import path
import { CustomerInfo } from './types';
import { SupportTier } from '../../supportTiers/types'; // Corrected import path for SupportTier

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

const _formatScriptBlock = (scriptContent: string): string => {
  const cleanedScript = scriptContent.trim()
    .replace(/\t/g, '    ')
    .replace(/^\s*\n/gm, '');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 15px 0;">
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #ddd; background-color: #f0f0f0;">
                <span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #555; font-weight: 600;">PowerShell Script</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 13px; line-height: 1.45; color: #333; white-space: pre-wrap; word-break: break-all;">
${cleanedScript}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
};

const _createContactsTable = (contacts: Array<{name: string, email: string, phone: string}>): string => {
  let tableRows = '';
  contacts.forEach((contact, index) => {
    const bgColor = index % 2 === 0 ? '#f9f9f9' : 'white';
    tableRows += `
      <tr style="background-color: ${bgColor};">
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif;">${contact.name || ''}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif;">${contact.email || ''}</td>
        <td style="border: 1px solid #ddd; padding: 8px; font-family: 'Segoe UI', Arial, sans-serif;">${contact.phone || ''}</td>
      </tr>`;
  });

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 15px 0;">
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif;">Name</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif;">Email</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif;">Phone</th>
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

const _generateHeader = (tier: SupportTier): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 0;">
        <h2 style="color: ${tier.color}; border-bottom: 1px solid ${tier.color}; padding-bottom: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 24px; margin: 0 0 15px 0;">Microsoft Support Onboarding - ${tier.name}</h2>
      </td>
    </tr>
  </table>`;

const _generateGreeting = (info: CustomerInfo): string => `
  <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Dear ${info.contactName},</p>`;

const _generateMeetingProposal = (info: CustomerInfo, tier: SupportTier): string => {
  const formattedDate = _formatDate(info.proposedDate);
  return `
    <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Thank you for choosing Microsoft Premier Support. We would like to schedule an onboarding session to explain our support request process and modalities for your <strong style="font-weight: 600;">${tier.name}</strong> plan.</p>
    <p style="margin: 0 0 20px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">I propose we meet on <strong style="font-weight: 600;">${formattedDate}</strong> to discuss the following onboarding steps:</p>`;
};

const _generateTierDetailsSection = (tier: SupportTier): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">1. Support Tier Selection</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">You have selected the <strong style="font-weight: 600;">${tier.name}</strong> plan which includes:</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 10px 0 15px 0;">
          <tr>
            <td style="padding: 0 0 0 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Support Hours: ${tier.supportHours}</td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Authorized Contacts: ${tier.authorizedContacts}</td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Tenants: ${tier.tenants}</td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Support Requests: ${tier.supportRequestsIncluded}</td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Critical Situation Support: ${tier.criticalSituation ? '<span style="color: #107c10; font-weight: 600;">Yes</span>' : '<span style="color: #d83b01; font-weight: 600;">No</span>'}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;

const _generateContactsSection = (info: CustomerInfo, tier: SupportTier): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">2. Authorized Customer Contacts</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Please confirm the following list of contacts authorized to open support requests:</p>
        ${_createContactsTable(info.authorizedContacts)}
      </td>
    </tr>
  </table>`;

const _generateTenantSection = (info: CustomerInfo, tier: SupportTier): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">3. Tenant Microsoft ID Definition</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Your Microsoft Tenant ID: <strong style="font-weight: 600;">${info.tenantId || '<span style="color: #d83b01; font-style: italic;">[PLEASE PROVIDE]</span>'}</strong></p>
      </td>
    </tr>
  </table>`;

const _generateGdapSection = (tier: SupportTier): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">4. GDAP Link Acceptance</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Please accept the GDAP (Granular Delegated Admin Privileges) link that will be sent to your admin email address. This step is required to enable our support team to access your environment when needed.</p>
      </td>
    </tr>
  </table>`;

const _generateRbacSection = (info: CustomerInfo, tier: SupportTier): string => {
  const tenantIdPlaceholder = info.tenantId || 'YOUR_TENANT_ID';
  const script = RBAC_POWERSHELL_SCRIPT_TEMPLATE.replace('{TENANT_ID}', tenantIdPlaceholder);
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 0;">
          <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">5. RBAC Role Establishment</h3>
          <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">We will provide a script to establish the necessary RBAC (Role-Based Access Control) roles for your support plan. Please execute the following PowerShell script in your environment:</p>
          ${_formatScriptBlock(script)}
        </td>
      </tr>
    </table>`;
};

const _generateServiceProviderSection = (tier: SupportTier): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">6. Service Provider Acceptance</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Finally, please add Microsoft Support as a service provider in your conditional access policy to ensure seamless integration with your security protocols.</p>
      </td>
    </tr>
  </table>`;

// Updated to accept agent details including email
const _generateClosing = (agentName?: string, agentTitle?: string, companyName?: string, agentEmail?: string): string => {
  const nameLine = agentName || 'Microsoft Support Team'; // Default if not provided
  const titleLine = agentTitle ? `<br>${agentTitle}` : '';
  const companyLine = companyName ? `<br>${companyName}` : '';
  // Use provided agent email or fallback
  const email = agentEmail || (agentName ? `${agentName.toLowerCase().replace(' ', '.')}@${companyName?.toLowerCase() || 'microsoft.com'}` : 'support@microsoft.com');
  const mailtoLink = `mailto:${email}`;

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 30px;">
    <tr>
      <td style="padding: 0;">
        <p style="margin: 0 0 10px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Looking forward to our meeting and to supporting your organization.</p>
        <p style="margin: 20px 0 5px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">
          Best regards,<br>
          ${nameLine}
          ${titleLine}
          ${companyLine}
          <br><a href="${mailtoLink}" style="color: #0078D4; text-decoration: none;">${email}</a>
        </p>
      </td>
    </tr>
  </table>`;
};

// --- Add new section generator for Additional Notes ---
const _generateAdditionalNotesSection = (notes: string, tier: SupportTier): string => {
    // Process line breaks
    const formattedNotes = notes.replace(/\n/g, '<br>');
    return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
    <tr>
      <td style="padding: 0;">
        <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Additional Notes</h3>
        <p style="margin: 0 0 15px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">
          ${formattedNotes}
        </p>
      </td>
    </tr>
  </table>`;
};

const _generateFooter = (): string => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 30px; border-top: 1px solid #ddd;">
    <tr>
      <td style="padding: 10px 0 0 0;">
        <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">This is an automated message generated by the Microsoft Onboarding Template Generator.</p>
      </td>
    </tr>
  </table>`;

// --- Main Template Generation Function ---

// Define interface for conditional flags (can be moved)
interface TemplateFlags {
  includeGdap?: boolean;
  includeRbac?: boolean;
  includeConditionalAccess?: boolean;
  includeNotes?: boolean;
}

// Updated signature to accept agent details and flags
export const generateTemplate = (
  info: CustomerInfo,
  agentName?: string,
  agentTitle?: string,
  companyName?: string,
  agentEmail?: string,
  flags?: TemplateFlags, // Add flags parameter
  additionalNotes?: string // Add notes parameter
): string => {
  // Ensure selectedTier is valid, default if not
  const validTierKey = info.selectedTier in supportTiers ? info.selectedTier : Object.keys(supportTiers)[0];
  const tier = supportTiers[validTierKey];

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
    .mso-button { padding: 12px 30px; background-color: ${tier.color}; color: white; text-decoration: none; font-weight: bold; display: inline-block; }
  </style>
  <![endif]-->
</head>
<body>
  <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
    ${_generateHeader(tier)}
    ${_generateGreeting(info)}
    ${_generateMeetingProposal(info, tier)}
    ${_generateTierDetailsSection(tier)}
    ${_generateContactsSection(info, tier)}
    ${_generateTenantSection(info, tier)}
    ${/* Conditionally render sections based on flags */''}
    ${flags?.includeGdap ? _generateGdapSection(tier) : ''}
    ${flags?.includeRbac ? _generateRbacSection(info, tier) : ''}
    ${flags?.includeConditionalAccess ? _generateServiceProviderSection(tier) : ''}
    ${/* Conditionally render notes */''}
    ${flags?.includeNotes && additionalNotes ? _generateAdditionalNotesSection(additionalNotes, tier) : ''}
    ${_generateClosing(agentName, agentTitle, companyName, agentEmail)}
    ${_generateFooter()}
  </div>
</body>
</html>`;
};

// Exporting the main function if needed elsewhere, otherwise internal helpers are sufficient
export default {
  generateTemplate
};
