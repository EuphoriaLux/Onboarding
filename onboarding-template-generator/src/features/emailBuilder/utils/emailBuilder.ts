// src/features/emailBuilder/utils/emailBuilder.ts
import { supportTiers } from '../supportTiers/constants'; // Adjusted path
import { CustomerInfo, EmailFormData, Language } from './types';
import { TenantInfo } from '../tenants/types'; // Adjusted path
import { ThemeSettings } from '../../../types';
import { StorageService } from '../../../services/storage'; // Import StorageService
import React from 'react'; // Single React import
import ReactDOMServer from 'react-dom/server'; // Single ReactDOMServer import
import { getTranslation } from './translationService';
// Import components from builders.tsx (no extension needed)
import {
  SectionHeader,
  StepIndicator,
  ContactsTable,
  ScriptBlock,
} from '../templates/builders'; // Should resolve to builders.tsx now
import { formatSlot } from './dateSlotGenerator'; // Import formatSlot

// --- Helper Functions ---

// Helper to group slots by day
const _groupSlotsByDay = (slots: Date[]): { [key: string]: Date[] } => {
  const grouped: { [key: string]: Date[] } = {};
  slots.forEach(slot => {
    const dayKey = slot.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }
    grouped[dayKey].push(slot);
  });
  // Sort slots within each day
  for (const dayKey in grouped) {
    grouped[dayKey].sort((a, b) => a.getTime() - b.getTime());
  }
  return grouped;
};


// --- Constants ---
const HELP_DESK_AGENTS_OBJECT_ID = "b6770181-d9f5-4818-b5b1-ea51cd9f66e5";
const ADMIN_AGENTS_OBJECT_ID = "9a838974-22d3-415b-8136-c790e285afeb";
const SUPPORT_REQUEST_CONTRIBUTOR_ROLE = "Support Request Contributor";
const OWNER_ROLE = "Owner";
const GDAP_ROLE = "Service Support Administrator"; // Specific role needed
// const DEFAULT_GDAP_LINK = "https://admin.microsoft.com/Adminportal/Home?ref=/GDAP"; // Removed Default GDAP link

// RBAC Script Template
const RBAC_POWERSHELL_SCRIPT_TEMPLATE = `
# Connect to the correct tenant
Connect-AzAccount -TenantID {TENANT_ID}
$subscriptions = Get-AzSubscription
foreach ($subscription in $subscriptions) {
    Set-AzContext -SubscriptionId $subscription.Id
    # Add the Support Request Contributor role to Foreign Principal HelpDeskAgents:
    New-AzRoleAssignment -ObjectID ${HELP_DESK_AGENTS_OBJECT_ID} -RoleDefinitionName "${SUPPORT_REQUEST_CONTRIBUTOR_ROLE}" -ObjectType "ForeignGroup" -ErrorAction SilentlyContinue
    # Test if the Support Request Contributor role is assigned to Foreign Principal HelpDeskAgents:
    $supportRole = Get-AzRoleAssignment -ObjectId ${HELP_DESK_AGENTS_OBJECT_ID} | Where-Object { $_.RoleDefinitionName -eq "${SUPPORT_REQUEST_CONTRIBUTOR_ROLE}" }
    if ($supportRole) {
        Write-Host "${SUPPORT_REQUEST_CONTRIBUTOR_ROLE} role is assigned to Foreign Principal HelpDeskAgents."
        # Test if the Owner role for the Foreign Principal AdminAgents exists:
        $ownerRole = Get-AzRoleAssignment -ObjectId ${ADMIN_AGENTS_OBJECT_ID} | Where-Object { $_.RoleDefinitionName -eq "${OWNER_ROLE}" }
        if ($ownerRole) {
            # If the Owner role for Foreign Principal AdminAgents exists, remove it:
            Remove-AzRoleAssignment -ObjectID ${ADMIN_AGENTS_OBJECT_ID} -RoleDefinitionName "${OWNER_ROLE}"
        } else {
            Write-Host "${OWNER_ROLE} role for Foreign Principal AdminAgents does not exist."
        }
    } else {
        Write-Host "Error: Could not assign ${SUPPORT_REQUEST_CONTRIBUTOR_ROLE} role for Foreign Principal HelpDeskAgents!"
    }
}`; // Removed trailing }

/**
 * Email Builder Module
 */
const emailBuilder = {
  translate: getTranslation,

  /**
   * Build Plain Text version of the email.
   * @param isHtmlContext - Optional flag, currently unused but could differentiate logic if needed.
   */
  buildEmailBody: function(formData: EmailFormData, tenants: TenantInfo[] = [], isHtmlContext: boolean = false): string { // Added optional flag
    const tier = supportTiers[formData.selectedTier];
    const language = (formData.language || 'en') as Language;

    // Use 'let' for body as it will be modified
    let body = this.translate('greeting', language, { name: formData.contactName }) + '\n\n';

    body += this.translate('intro1', language, {
      company: formData.senderCompany, // SCHNEIDER IT MANAGEMENT
    }) + '\n\n';

    body += this.translate('intro2', language, {
      tier: tier.name
    }) + '\n\n';

    // Proposed Meeting Slots Section (Plain Text) - Grouped by day, listed horizontally
    // Only include if the flag is set and slots exist
    if (formData.includeMeetingSlots && formData.proposedSlots && formData.proposedSlots.length > 0) {
      body += `**${this.translate('meetingSlotsTitle', language)}**\n\n`;
      body += this.translate('meetingSlotsIntro', language) + '\n\n';

      const groupedSlots = _groupSlotsByDay(formData.proposedSlots);
      const sortedDays = Object.keys(groupedSlots).sort();

      // Plain text table header
      const dateHeader = "Date"; // Keep 'Date' as it's often universal in tables, or add key 'dateHeader' if needed
      const morningHeader = this.translate('meetingSlotsMorningHeader', language);
      const afternoonHeader = this.translate('meetingSlotsAfternoonHeader', language);
      const colWidthDate = 20; // Adjust widths as needed
      const colWidthMorning = 20;
      const colWidthAfternoon = 20;

      body += `${dateHeader.padEnd(colWidthDate)} | ${morningHeader.padEnd(colWidthMorning)} | ${afternoonHeader.padEnd(colWidthAfternoon)}\n`;
      body += `${'-'.repeat(colWidthDate)}-|-${'-'.repeat(colWidthMorning)}-|-${'-'.repeat(colWidthAfternoon)}\n`;

      sortedDays.forEach(dayKey => {
        const dayDate = new Date(dayKey + 'T00:00:00Z'); // Parse as UTC
        const dayLabel = dayDate.toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric' });

        const morningSlots = groupedSlots[dayKey].filter(slot => slot.getHours() < 12);
        const afternoonSlots = groupedSlots[dayKey].filter(slot => slot.getHours() >= 12);

        const formatTime = (slot: Date) => {
            const startTime = slot.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false });
            const endTime = new Date(slot.getTime() + 30 * 60000).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false });
            return `${startTime} - ${endTime}`;
        };

        const morningTimes = morningSlots.map(formatTime);
        const afternoonTimes = afternoonSlots.map(formatTime);

        const maxRows = Math.max(morningTimes.length, afternoonTimes.length);

        for (let i = 0; i < maxRows; i++) {
            const datePart = (i === 0) ? dayLabel.padEnd(colWidthDate) : ''.padEnd(colWidthDate);
            const morningPart = (morningTimes[i] || '').padEnd(colWidthMorning);
            const afternoonPart = (afternoonTimes[i] || '').padEnd(colWidthAfternoon);
            body += `${datePart} | ${morningPart} | ${afternoonPart}\n`;
        }
         body += `${'-'.repeat(colWidthDate)}-|-${'-'.repeat(colWidthMorning)}-|-${'-'.repeat(colWidthAfternoon)}\n`; // Separator after each day
      });
      body += '\n'; // Add space after the table
    }

    // Support Plan Section
    body += `**${this.translate('supportPlanTitle', language, { tier: tier.name })}**\n\n`;
    body += this.translate('supportPlanIntro', language, { tier: tier.name }) + '\n\n';
    body += `\t${this.translate('supportProviderLabel', language)}: ${tier.supportProvider}\n`;
    body += `\t${this.translate('productsCoveredLabel', language)}: ${tier.products.join(', ')}\n`;
    body += `\t${this.translate('severityLevelsLabel', language)}: ${tier.severityLevels}\n`;
    body += `\t${this.translate('criticalLabel', language)}: ${tier.criticalSituation ? this.translate('yes', language) : this.translate('no', language)}\n`;
    body += `\t${this.translate('supportHoursLabel', language)}: ${tier.supportHours}\n`;
    body += `\t${this.translate('supportRequestSubmissionLabel', language)}: ${tier.supportRequestSubmission}\n`;
    body += `\t${this.translate('tenantsLabel', language)}: ${tier.tenants}\n`;
    body += `\t${this.translate('contactsLabel', language)}: ${tier.authorizedContacts}\n`;
    body += `\t${this.translate('requestsLabel', language)}: ${tier.supportRequestsIncluded}\n\n`;

    // Tenant Information Section (Plain Text) - Moved Up
    body += `**${this.translate('tenantInfoTitle', language)}**\n\n`;
    if (tenants.length > 0) {
        const introKey = tenants.length === 1 ? 'tenantInfoIntro_singular' : 'tenantInfoIntro';
        body += this.translate(introKey, language) + '\n\n'; // Use singular/plural key
        tenants.forEach((tenant, index) => {
            body += `Tenant ${index + 1}: ${tenant.companyName}\n`;
            body += `  Domain: ${tenant.tenantDomain || 'N/A'}\n`;
            body += `  MS Domain: ${tenant.microsoftTenantDomain || 'N/A'}\n`;
            body += `  Tenant ID: ${tenant.id || 'N/A'}\n`;
            const deadline = tenant.implementationDeadline ? tenant.implementationDeadline.toLocaleDateString() : 'N/A';
            body += `  Deadline: ${deadline}\n`;
            body += `  Azure RBAC Relevant: ${tenant.hasAzure ? this.translate('yes', language) : this.translate('no', language)}\n\n`;
        });
    } else {
        body += this.translate('noTenantInfo', language) + '\n\n';
    }

    // Authorized Contacts Section
    if (formData.authorizedContacts.checked) {
      body += `**${this.translate('authorizedContactsTitle', language)}**\n\n`;
      body += this.translate('contactsIntro', language, {
        tier: tier.name,
        count: tier.authorizedContacts
      }) + '\n\n';
      body += this.translate('contactsRolesIntro', language, {
        roles: formData.authorizedContacts.roles
      }) + '\n\n';
      body += this.translate('contactsInstruction', language) + '\n\n';
      body += `#\t| ${this.translate('firstNameHeader', language)}\t| ${this.translate('lastNameHeader', language)}\t| ${this.translate('officePhoneHeader', language)}\t| ${this.translate('mobilePhoneHeader', language)}\t| ${this.translate('emailHeader', language)}\t| ${this.translate('jobTitleHeader', language)}\n`;
      body += `---|------------|-----------|----------------|----------------|---------------|-----------\n`;
      for (let i = 1; i <= tier.authorizedContacts; i++) {
        body += `${i}\t|            |           |                |                |               |           \n`;
      }
      body += '\n';
    }

    // GDAP Section (Plain Text - Adjusted for multiple tenants, removed default link)
    if (tenants.length > 0) {
        const specificLinks = tenants.filter(t => t.gdapLink && t.gdapLink.trim() !== '');
        const deadline = tenants[0]?.implementationDeadline ? tenants[0].implementationDeadline.toLocaleDateString() : 'N/A'; // Use first tenant's deadline or N/A for general text
        body += `**${this.translate('gdapTitle', language)}**\n\n`;
        body += this.translate('gdapIntro', language, { deadline: deadline, roles: GDAP_ROLE }) + '\n\n';
        body += this.translate('gdapPermission', language) + '\n\n';
        body += this.translate('gdapInstruction', language) + '\n'; // General instruction to approve
        if (specificLinks.length > 0) {
            body += this.translate('gdapSpecificTenantDetailsHeader', language) + '\n'; // Use new header key
            specificLinks.forEach(tenant => {
                const domain = tenant.tenantDomain || 'N/A'; // Add domain info
                body += `  ${tenant.companyName} (Domain: ${domain}): ${tenant.gdapLink}\n`; // Updated format
            });
            if (specificLinks.length < tenants.length) {
                 // If some tenants have links but not all
                 body += this.translate('gdapDefaultLinkInfo', language) + '\n\n'; // "For other tenants, the link will be sent separately."
            } else {
                 body += '\n'; // Add newline if all have specific links
            }
        } else {
            // If no tenants have specific links
            body += this.translate('gdapLinksSentSeparately', language) + '\n\n'; // New translation key: "The necessary GDAP approval link(s) will be sent in a separate communication."
        }
    }

    // RBAC Section (Plain Text - Generates script per relevant tenant)
    const relevantRbacTenants = tenants.filter(t => t.hasAzure);
    if (relevantRbacTenants.length > 0) {
        body += `**${this.translate('rbacTitle', language)}**\n\n`;
        // Step 1: Install/Update Module (Common instruction)
        body += `1\t${this.translate('rbacStep1', language)}\n\n`;
        body += `Source: https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0\n`;
        body += `${this.translate('rbacScriptHeader', language)}\n`;
        body += `Install-Module -Name Az -Repository PSGallery -Force\n\n`;
        body += `${this.translate('rbacOrUpdateIt', language)}\n`;
        body += `${this.translate('rbacScriptHeader', language)}\n`;
        body += `Update-Module Az.Resources -Force\n\n`;

        // Step 2: Run script per tenant
        body += `2\t${this.translate('rbacStep2', language)}\n\n`;
        body += this.translate('rbacStep2InstructionMultiTenant', language) + '\n\n'; // Updated instruction: "Run the appropriate script below..."

        relevantRbacTenants.forEach(tenant => {
            const tenantDomain = tenant.microsoftTenantDomain || '[MS_TENANT_DOMAIN_MISSING]'; // Use MS Domain or placeholder
            const scriptForTenant = RBAC_POWERSHELL_SCRIPT_TEMPLATE.replace('{TENANT_ID}', tenantDomain);
            body += `--- ${this.translate('rbacScriptForTenantHeader', language, { companyName: tenant.companyName, tenantDomain: tenantDomain })} ---\n`; // Use translation key
            body += `${this.translate('rbacScriptHeader', language)}\n`;
            body += scriptForTenant + '\n\n';
        });

        body += this.translate('rbacScreenshot', language) + '\n\n';
    }

    // Conditional Access Section
    if (formData.conditionalAccess.checked) {
      body += `**${this.translate('conditionalAccessTitle', language)}**\n\n`;
      body += this.translate('conditionalAccessIntro', language) + '\n\n';
      if (formData.conditionalAccess.mfa) body += `• ${this.translate('mfaPolicy', language)}\n`;
      if (formData.conditionalAccess.location) body += `• ${this.translate('locationPolicy', language)}\n`;
      if (formData.conditionalAccess.device) body += `• ${this.translate('devicePolicy', language)}\n`;
      if (formData.conditionalAccess.signIn) body += `• ${this.translate('signInPolicy', language)}\n`;
      body += '\n';
    }

    // Additional Notes Section
    if (formData.additionalNotes) {
      body += `**${this.translate('additionalInfoTitle', language)}**\n\n`;
      body += `${formData.additionalNotes}\n\n`;
    }

    // Closing Section
    body += this.translate('closing', language) + '\n\n';
    body += this.translate('regards', language) + '\n\n';
    body += `${formData.senderName}\n`;
    body += `${formData.senderTitle}\n`;
    body += `${formData.senderCompany}\n`;
    if (formData.senderContact) {
      body += `${formData.senderContact}\n`;
    }
    body += '\n' + this.translate('footer', language);

    return body;
  },

  /**
   * Build HTML version of the email using JSX components rendered to string.
   */
  // Reverted to synchronous function
  buildEmailHTML: function(formData: EmailFormData, tenants: TenantInfo[] = [], theme: ThemeSettings | null = null): { html: string; plainText: string } {
    const tier = supportTiers[formData.selectedTier];
    const language = (formData.language || 'en') as Language;

    // Removed custom template fetching
    // const customTemplate = await StorageService.get<string>('customEmailTemplate');

    const effectiveTheme: ThemeSettings = {
      primaryColor: theme?.primaryColor || '#0078d4',
      textColor: theme?.textColor || '#333333',
      backgroundColor: theme?.backgroundColor || '#ffffff',
    };

    const primaryAccentColor = effectiveTheme.primaryColor;
    const textColor = effectiveTheme.textColor;
    // const bgColor = effectiveTheme.backgroundColor; // Unused directly
    const footerTextColor = textColor === '#333333' ? '#666666' : `${textColor}B3`;

    const subject = formData.subject || this.translate('subject', language, {
      tier: tier.name,
      clientCompany: formData.companyName
    });

    // Define styles with Calibri font (used by default template and potentially by placeholders)
    const bodyStyle = `margin: 0 auto; padding: 20px; width: 100%; max-width: 800px; font-family: Calibri, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${textColor}; background-color: #FFFFFF; box-sizing: border-box;`;
    const pStyle = `margin: 0 0 15px 0; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor}; background-color: transparent;`;
    // Final listItemStyle for custom bullets
    const listItemStyle = `padding: 0 0 0 20px; margin-bottom: 8px; font-family: Calibri, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${textColor}; background-color: transparent; list-style-type: none; position: relative;`; // Ensure list-style-type is none
    const bulletStyle = `position: absolute; left: 0; top: 0.6em; /* Adjust vertical alignment */ width: 6px; height: 6px; border-radius: 50%; background-color: ${primaryAccentColor};`; // Uses theme color
    const strongStyle = `font-weight: 600; color: ${textColor};`; // Keep strong style as is
    const linkButtonStyle = `display: inline-block; padding: 10px 24px; background-color: ${primaryAccentColor}; color: #FFFFFF !important; text-decoration: none !important; font-weight: 600; border-radius: 4px; margin-top: 5px; border: none; cursor: pointer;`;
    const tenantBlockStyle = `background-color: #FFFFFF; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px; padding: 20px;`;
    // Table styles for meeting slots
    const tableStyle = `width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};`;
    const thStyle = `border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f8f8f8; font-weight: 600; color: ${textColor};`;
    const tdStyle = `border: 1px solid #ddd; padding: 10px; vertical-align: top;`; // Keep vertical-align: top for consistency


    // Build plain text first (always uses the standard builder for now)
    const plainTextContent = this.buildEmailBody(formData, tenants);

    // --- Build HTML Body Content ---
    let htmlBodyContent = '';

    // --- Placeholder Generation ---
    // Generate content for all potential placeholders, regardless of whether custom template is used
    const placeholders: { [key: string]: string } = {};

    // Basic Info
    placeholders['{greeting}'] = `<p style="${pStyle}">${this.translate('greeting', language, { name: formData.contactName })}</p>`;
    placeholders['{intro1}'] = `<p style="${pStyle}">${this.translate('intro1', language, { company: formData.senderCompany })}</p>`;
    placeholders['{intro2}'] = `<p style="margin: 0 0 25px 0; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('intro2', language, { tier: tier.name })}</p>`;

    // Meeting Slots
    let meetingSlotsHtml = '';
    if (formData.includeMeetingSlots && formData.proposedSlots && formData.proposedSlots.length > 0) {
        meetingSlotsHtml += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        const meetingSlotsTitle = this.translate('meetingSlotsTitle', language);
        meetingSlotsHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: meetingSlotsTitle, color: primaryAccentColor, theme: effectiveTheme }));
        meetingSlotsHtml += `<p style="${pStyle}">${this.translate('meetingSlotsIntro', language)}</p>`;

        const groupedSlots = _groupSlotsByDay(formData.proposedSlots);
        const sortedDays = Object.keys(groupedSlots).sort();

        // Start table generation for the placeholder string
        meetingSlotsHtml += `<table style="${tableStyle}">`;
        // Table Header - Updated for three columns - Use translation keys
        meetingSlotsHtml += `<thead><tr><th style="${thStyle}">Date</th><th style="${thStyle}">${this.translate('meetingSlotsMorningHeader', language)}</th><th style="${thStyle}">${this.translate('meetingSlotsAfternoonHeader', language)}</th></tr></thead>`;
        // Table Body
        meetingSlotsHtml += `<tbody>`;
        sortedDays.forEach(dayKey => {
          const dayDate = new Date(dayKey + 'T00:00:00Z'); // Parse as UTC
          const dayLabel = dayDate.toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric' });

          // Filter slots into morning and afternoon
          const morningSlots = groupedSlots[dayKey].filter(slot => slot.getHours() < 12);
          const afternoonSlots = groupedSlots[dayKey].filter(slot => slot.getHours() >= 12);

          // Format morning slots vertically
          const morningTimeStrings = morningSlots.map(slot => {
              const startTime = slot.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false });
              const endTime = new Date(slot.getTime() + 30 * 60000).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false });
              return `<strong style="${strongStyle}">${startTime} - ${endTime}</strong>`;
          });
          const formattedMorningTimes = morningTimeStrings.join('<br>'); // Join with line breaks

          // Format afternoon slots vertically
          const afternoonTimeStrings = afternoonSlots.map(slot => {
              const startTime = slot.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false });
              const endTime = new Date(slot.getTime() + 30 * 60000).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', hour12: false });
              return `<strong style="${strongStyle}">${startTime} - ${endTime}</strong>`;
          });
          const formattedAfternoonTimes = afternoonTimeStrings.join('<br>'); // Join with line breaks

          // Add table row to the placeholder string
          meetingSlotsHtml += `<tr>`;
          meetingSlotsHtml += `<td style="${tdStyle}">${dayLabel}</td>`;
          meetingSlotsHtml += `<td style="${tdStyle}">${formattedMorningTimes || '&nbsp;'}</td>`; // Add morning slots or non-breaking space
          meetingSlotsHtml += `<td style="${tdStyle}">${formattedAfternoonTimes || '&nbsp;'}</td>`; // Add afternoon slots or non-breaking space
          meetingSlotsHtml += `</tr>`;
        });
        meetingSlotsHtml += `</tbody></table>`; // Close the table in the placeholder string
    }
    placeholders['{meetingSlots}'] = meetingSlotsHtml;

    // Support Plan
    let supportPlanHtml = '';
    const supportPlanTitle = this.translate('supportPlanTitle', language, { tier: tier.name });
    supportPlanHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: supportPlanTitle, color: primaryAccentColor, theme: effectiveTheme }));
    supportPlanHtml += `<p style="${pStyle}">${this.translate('supportPlanIntro', language, { tier: tier.name })}</p>`;
    supportPlanHtml += `<div style="border: 1px solid #eee; border-radius: 4px; padding: 18px 20px; margin: 15px 0 25px 0; background-color: #FFFFFF;">`;
    supportPlanHtml += `<ul style="margin: 0; padding: 0; list-style: none;">`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportProviderLabel', language)}:</strong> ${tier.supportProvider}</li>`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('productsCoveredLabel', language)}:</strong> ${tier.products.join(', ')}</li>`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('severityLevelsLabel', language)}:</strong> ${tier.severityLevels}</li>`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('criticalLabel', language)}:</strong> ${tier.criticalSituation ? '<span style="color: #107c10; font-weight: 600;">' + this.translate('yes', language) + '</span>' : '<span style="color: #d83b01; font-weight: 600;">' + this.translate('no', language) + '</span>'}</li>`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportHoursLabel', language)}:</strong> ${tier.supportHours}</li>`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportRequestSubmissionLabel', language)}:</strong> ${tier.supportRequestSubmission}</li>`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('tenantsLabel', language)}:</strong> ${tier.tenants}</li>`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('contactsLabel', language)}:</strong> ${tier.authorizedContacts}</li>`;
    supportPlanHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('requestsLabel', language)}:</strong> ${tier.supportRequestsIncluded}</li>`;
    supportPlanHtml += `</ul></div>`;
    placeholders['{supportPlanTitle}'] = ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: supportPlanTitle, color: primaryAccentColor, theme: effectiveTheme }));
    placeholders['{supportPlanDetails}'] = supportPlanHtml; // Includes title + details

    // Tenant Info
    let tenantInfoHtml = '';
    const tenantSectionTitle = this.translate('tenantInfoTitle', language);
    tenantInfoHtml += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
    tenantInfoHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: tenantSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
    if (tenants.length > 0) {
        const introKey = tenants.length === 1 ? 'tenantInfoIntro_singular' : 'tenantInfoIntro';
        tenantInfoHtml += `<p style="${pStyle}">${this.translate(introKey, language)}</p>`; // Use singular/plural key
        tenants.forEach((tenant, index) => {
            const deadline = tenant.implementationDeadline ? tenant.implementationDeadline.toLocaleDateString() : 'N/A';
            const azureStatus = tenant.hasAzure ? this.translate('yes', language) : this.translate('no', language);
            const azureColor = tenant.hasAzure ? '#107c10' : '#d83b01';
            tenantInfoHtml += `<div style="background-color: #FFFFFF; border: 1px solid #eee; border-radius: 4px; margin-bottom: 15px; padding: 15px 20px;">`;
            tenantInfoHtml += `<strong style="font-weight: 600; color: ${primaryAccentColor}; font-size: 16px; display: block; margin-bottom: 10px;">Tenant ${index + 1}: ${tenant.companyName}</strong>`;
            tenantInfoHtml += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">Domain:</strong> ${tenant.tenantDomain || 'N/A'}</p>`;
            tenantInfoHtml += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">MS Domain:</strong> ${tenant.microsoftTenantDomain || 'N/A'}</p>`;
            tenantInfoHtml += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">Tenant ID:</strong> ${tenant.id || 'N/A'}</p>`;
            tenantInfoHtml += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">Deadline:</strong> ${deadline}</p>`;
            tenantInfoHtml += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">Azure RBAC Relevant:</strong> <span style="color: ${azureColor}; font-weight: 600;">${azureStatus}</span></p>`;
            tenantInfoHtml += `</div>`;
        });
    } else {
        tenantInfoHtml += `<p style="${pStyle}">${this.translate('noTenantInfo', language)}</p>`;
    }
    placeholders['{tenantInfoTitle}'] = ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: tenantSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
    placeholders['{tenantInfo}'] = tenantInfoHtml; // Includes title + details

    // Authorized Contacts
    let contactsHtml = '';
    let contactsTableHtml = '';
    const contactsSectionTitle = this.translate('authorizedContactsTitle', language);
    if (formData.authorizedContacts.checked) {
         contactsHtml += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
         contactsHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: contactsSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
         contactsHtml += `<p style="${pStyle}">${this.translate('contactsIntro', language, { tier: tier.name, count: tier.authorizedContacts })}</p>`;
         contactsHtml += `<p style="${pStyle}">${this.translate('contactsRolesIntro', language, { roles: `<strong style="${strongStyle}">${formData.authorizedContacts.roles}</strong>` })}</p>`;
         contactsHtml += `<p style="${pStyle}">${this.translate('contactsInstruction', language)}</p>`;
         contactsTableHtml = ReactDOMServer.renderToStaticMarkup(React.createElement(ContactsTable, {
             contacts: formData.emailContacts,
             theme: effectiveTheme,
             tierContactLimit: tier.authorizedContacts,
             language: language // Pass the language prop
         }));
         contactsHtml += contactsTableHtml;
    }
    placeholders['{authorizedContactsTitle}'] = contactsSectionTitle; // Just the title text
    placeholders['{contactsIntro}'] = `<p style="${pStyle}">${this.translate('contactsIntro', language, { tier: tier.name, count: tier.authorizedContacts })}</p>`;
    placeholders['{contactsRolesIntro}'] = `<p style="${pStyle}">${this.translate('contactsRolesIntro', language, { roles: `<strong style="${strongStyle}">${formData.authorizedContacts.roles}</strong>` })}</p>`;
    placeholders['{contactsInstruction}'] = `<p style="${pStyle}">${this.translate('contactsInstruction', language)}</p>`;
    placeholders['{contactsTable}'] = contactsTableHtml;

    // GDAP
    let gdapHtml = '';
    const gdapSectionTitle = this.translate('gdapTitle', language);
    if (tenants.length > 0) {
        gdapHtml += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        let gdapInnerHtml = '';
        const specificLinks = tenants.filter(t => t.gdapLink && t.gdapLink.trim() !== '');
        const deadline = tenants[0]?.implementationDeadline ? tenants[0].implementationDeadline.toLocaleDateString() : 'N/A';
        gdapInnerHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: gdapSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
        gdapInnerHtml += `<p style="${pStyle}">${this.translate('gdapIntro', language, { deadline: deadline, roles: GDAP_ROLE })}</p>`;
        gdapInnerHtml += `<p style="${pStyle}">${this.translate('gdapPermission', language)}</p>`;
        gdapInnerHtml += `<p style="margin: 15px 0 10px 0; font-weight: 600; color: ${textColor};">${this.translate('gdapInstruction', language)}</p>`;
        if (specificLinks.length > 0) {
            gdapInnerHtml += `<p style="${pStyle}">${this.translate('gdapSpecificTenantDetailsHeader', language)}</p>`; // Use new header key
            gdapInnerHtml += `<ul style="padding-left: 20px; margin: 10px 0 15px 0;">`;
            specificLinks.forEach(tenant => {
                 const domain = tenant.tenantDomain || 'N/A'; // Add domain info
                 gdapInnerHtml += `<li style="${listItemStyle}"><strong style="${strongStyle}">${tenant.companyName}</strong> (Domain: ${domain}): <a href="${tenant.gdapLink}" target="_blank" style="color: ${primaryAccentColor}; text-decoration: underline;">${tenant.gdapLink}</a></li>`; // Updated format
            });
            gdapInnerHtml += `</ul>`;
            if (specificLinks.length < tenants.length) {
                 gdapInnerHtml += `<p style="${pStyle}">${this.translate('gdapDefaultLinkInfo', language)}</p>`;
            }
        } else {
            gdapInnerHtml += `<p style="${pStyle}">${this.translate('gdapLinksSentSeparately', language)}</p>`;
        }
        gdapHtml += `<div style="${tenantBlockStyle}">${gdapInnerHtml}</div>`;
    }
    placeholders['{gdapTitle}'] = gdapSectionTitle;
    placeholders['{gdapSection}'] = gdapHtml;

    // RBAC
    let rbacHtml = '';
    const rbacSectionTitle = this.translate('rbacTitle', language);
    const relevantRbacTenants = tenants.filter(t => t.hasAzure);
    if (relevantRbacTenants.length > 0) {
         rbacHtml += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
         let rbacInnerHtml = '';
         rbacInnerHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: rbacSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
         // Step 1
         rbacInnerHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(StepIndicator, { number: 1, title: this.translate('rbacStep1', language), theme: effectiveTheme }));
         rbacInnerHtml += `<p style="margin: 5px 0 15px 48px; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacStep1Source', language)} <a href="https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0" target="_blank" style="color: ${primaryAccentColor}; text-decoration: underline;">https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0</a></p>`;
         rbacInnerHtml += `<p style="margin: 5px 0 5px 48px; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScriptHeader', language)}</p>`;
         rbacInnerHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: 'Install-Module -Name Az -Repository PSGallery -Force', theme: effectiveTheme }))}</div>`;
         rbacInnerHtml += `<p style="margin: 15px 0 5px 48px; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacOrUpdateIt', language)}</p>`;
         rbacInnerHtml += `<p style="margin: 5px 0 5px 48px; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScriptHeader', language)}</p>`;
         rbacInnerHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: 'Update-Module Az.Resources -Force', theme: effectiveTheme }))}</div>`;
         // Step 2
         rbacInnerHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(StepIndicator, { number: 2, title: this.translate('rbacStep2', language), theme: effectiveTheme }));
         rbacInnerHtml += `<p style="margin: 5px 0 15px 48px; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacStep2InstructionMultiTenant', language)}</p>`;
         relevantRbacTenants.forEach(tenant => {
            const tenantDomain = tenant.microsoftTenantDomain || '[MS_TENANT_DOMAIN_MISSING]';
            const scriptForTenant = RBAC_POWERSHELL_SCRIPT_TEMPLATE.replace('{TENANT_ID}', tenantDomain);
            rbacInnerHtml += `<h4 style="margin: 20px 0 5px 48px; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor}; font-weight: 600;">${this.translate('rbacScriptForTenantHeader', language, { companyName: tenant.companyName, tenantDomain: tenantDomain })}</h4>`; // Use translation key
            rbacInnerHtml += `<p style="margin: 5px 0 5px 48px; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScriptHeader', language)}</p>`;
            rbacInnerHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: scriptForTenant, theme: effectiveTheme }))}</div>`;
         });
         rbacInnerHtml += `<p style="margin: 20px 0 15px 48px; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScreenshot', language)}</p>`;
         rbacHtml += `<div style="${tenantBlockStyle}">${rbacInnerHtml}</div>`;
    }
    placeholders['{rbacTitle}'] = rbacSectionTitle;
    placeholders['{rbacSection}'] = rbacHtml;

    // Conditional Access
    let caHtml = '';
    const caSectionTitle = this.translate('conditionalAccessTitle', language);
    if (formData.conditionalAccess.checked) {
        caHtml += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        caHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: caSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
        caHtml += `<p style="${pStyle}">${this.translate('conditionalAccessIntro', language)}</p>`;
        caHtml += `<div style="margin: 0 0 20px 0; background-color: #FFFFFF; border: 1px solid #eee; border-radius: 4px; padding: 16px 20px;">`;
        caHtml += `<ul style="margin: 0; padding: 0; list-style: none;">`;
        if (formData.conditionalAccess.mfa) { caHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('mfaPolicy', language)}</li>`; }
        if (formData.conditionalAccess.location) { caHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('locationPolicy', language)}</li>`; }
        if (formData.conditionalAccess.device) { caHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('devicePolicy', language)}</li>`; }
        if (formData.conditionalAccess.signIn) { caHtml += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('signInPolicy', language)}</li>`; }
        caHtml += `</ul></div>`;
    }
    placeholders['{conditionalAccessTitle}'] = caSectionTitle;
    placeholders['{conditionalAccessSection}'] = caHtml;

    // Additional Notes
    let notesHtml = '';
    const additionalInfoTitle = this.translate('additionalInfoTitle', language);
    if (formData.additionalNotes) {
        notesHtml += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        notesHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: additionalInfoTitle, color: primaryAccentColor, theme: effectiveTheme }));
        const formattedNotes = formData.additionalNotes.replace(/\n/g, '<br>');
        notesHtml += `<p style="margin: 0 0 20px 0; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${formattedNotes}</p>`;
    }
    placeholders['{additionalInfoTitle}'] = additionalInfoTitle;
    placeholders['{additionalNotes}'] = notesHtml; // Includes title + notes

    // Closing & Signature
    placeholders['{closing}'] = `<p style="margin: 30px 0 20px 0; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('closing', language)}</p>`;
    placeholders['{regards}'] = `<p style="margin: 0 0 10px 0; line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('regards', language)}</p>`;
    let signatureHtml = `<div style="line-height: 1.6; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor}; margin-bottom: 40px;">`;
    signatureHtml += `${formData.senderName}<br>`;
    signatureHtml += `${formData.senderTitle}<br>`;
    signatureHtml += `${formData.senderCompany}<br>`;
    signatureHtml += `<a href="mailto:${formData.senderContact || ''}" style="color: ${primaryAccentColor}; text-decoration: none;">${formData.senderContact || ''}</a>`;
    signatureHtml += `</div>`;
    placeholders['{senderSignature}'] = signatureHtml;

    // Footer
    placeholders['{footer}'] = `<div style="margin-top: 40px; border-top: 1px solid #eee; padding: 20px 0 0 0; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 12px; color: ${footerTextColor}; text-align: center; background-color: transparent;">
        <p style="margin: 0; line-height: 1.5;">${this.translate('footer', language)}</p>
    </div>`;
    // --- End Placeholder Generation ---


    // --- Assemble Final HTML ---
    // Removed custom template logic, always use default assembly
    // if (customTemplate && customTemplate.trim() !== '') { ... } else { ... }
    // Use Default Template (assemble from placeholders)
    htmlBodyContent += placeholders['{greeting}'];
    htmlBodyContent += placeholders['{intro1}'];
      htmlBodyContent += placeholders['{intro2}'];
      htmlBodyContent += placeholders['{meetingSlots}'];
      htmlBodyContent += placeholders['{supportPlanDetails}']; // Includes title
      htmlBodyContent += placeholders['{tenantInfo}']; // Includes title
      if (formData.authorizedContacts.checked) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: placeholders['{authorizedContactsTitle}'], color: primaryAccentColor, theme: effectiveTheme }));
        htmlBodyContent += placeholders['{contactsIntro}'];
        htmlBodyContent += placeholders['{contactsRolesIntro}'];
        htmlBodyContent += placeholders['{contactsInstruction}'];
        htmlBodyContent += placeholders['{contactsTable}'];
      }
      htmlBodyContent += placeholders['{gdapSection}']; // Includes title and hr
      htmlBodyContent += placeholders['{rbacSection}']; // Includes title and hr
      htmlBodyContent += placeholders['{conditionalAccessSection}']; // Includes title and hr
      htmlBodyContent += placeholders['{additionalNotes}']; // Includes title and hr
      htmlBodyContent += placeholders['{closing}'];
      htmlBodyContent += placeholders['{regards}'];
      htmlBodyContent += placeholders['{senderSignature}'];
      // Footer is added outside the body content in the final HTML shell
    // } // Removed closing brace for custom template else block


    // Construct the final HTML document shell
    const finalHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${subject}</title>
    <!--[if mso]>
    <style type="text/css">
      body, table, td, th, div, p, h1, h2, h3, h4, h5, h6 {font-family: Calibri, 'Segoe UI', Arial, sans-serif !important;} /* Add Calibri for MSO */
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    </style>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <style type="text/css">
      body { word-wrap: break-word; }
      pre { white-space: pre-wrap !important; word-wrap: break-word !important; word-break: break-all !important; }
      table { table-layout: fixed; width: 100% !important; }
      td, th { word-wrap: break-word; word-break: break-word; }
    </style>
</head>
<body style="${bodyStyle}">
    <!-- Main content -->
    ${htmlBodyContent}
    <!-- Footer Div -->
    <div style="margin-top: 40px; border-top: 1px solid #eee; padding: 20px 0 0 0; font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 12px; color: ${footerTextColor}; text-align: center; background-color: transparent;">
        <p style="margin: 0; line-height: 1.5;">${this.translate('footer', language)}</p>
    </div>
</body>
</html>`;

    return { html: finalHtml, plainText: plainTextContent };
  },

  // getSupportPlanTextHTML - Updated to reflect new structure
  // NOTE: This function might be unused or deprecated.
  getSupportPlanTextHTML: function(planType: string, language: Language = 'en'): string {
    const tierData = supportTiers[planType];
    if (!tierData) return '';

    const supportPlanIntro = this.translate('supportPlanIntro', language, { tier: tierData.name });

    let bulletItems = `<ul style="padding-left: 20px; margin: 0 0 15px 0;">`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('supportProviderLabel', language)}:</strong> ${tierData.supportProvider}</li>`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('productsCoveredLabel', language)}:</strong> ${tierData.products.join(', ')}</li>`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('severityLevelsLabel', language)}:</strong> ${tierData.severityLevels}</li>`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('criticalLabel', language)}:</strong> ${tierData.criticalSituation ? this.translate('yes', language) : this.translate('no', language)}</li>`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('supportHoursLabel', language)}:</strong> ${tierData.supportHours}</li>`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('supportRequestSubmissionLabel', language)}:</strong> ${tierData.supportRequestSubmission}</li>`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('tenantsLabel', language)}:</strong> ${tierData.tenants}</li>`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('contactsLabel', language)}:</strong> ${tierData.authorizedContacts}</li>`;
    bulletItems += `<li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;"><strong style="font-weight: 600;">${this.translate('requestsLabel', language)}:</strong> ${tierData.supportRequestsIncluded}</li>`;
    bulletItems += `</ul>`;

    return `${supportPlanIntro}<br><br>${bulletItems}`;
  },

  // processCustomerInfoToEmailData - Updated to use proposedSlots
  processCustomerInfoToEmailData: function(info: CustomerInfo, language: string = 'en'): EmailFormData {
    const tier = supportTiers[info.selectedTier];
    const today = new Date();
    const currentDate = today.toLocaleDateString();

    // Note: EmailFormData still expects a single tenantId. This function might need
    // further refactoring depending on how it's used, or EmailFormData needs updating.
    // For now, providing the first tenant's ID or an empty string if no tenants.
    const primaryTenantId = info.tenants && info.tenants.length > 0 ? info.tenants[0].id : '';

    const formData = {
      companyName: info.companyName, // This is the client company
      contactName: info.contactName,
      contactEmail: info.contactEmail,
      proposedSlots: info.proposedSlots || [], // Pass the array of Date objects, default to empty array
      tenantId: primaryTenantId,
      selectedTier: info.selectedTier,
      emailContacts: info.authorizedContacts, // This might be redundant if CustomerInfo.authorizedContacts is the source of truth
      to: info.contactEmail || '',
      cc: '',
      subject: this.translate('subject', language as Language, {
        tier: tier.name,
        clientCompany: info.companyName
      }),
      conditionalAccess: {
        checked: true, mfa: true, location: true, device: true, signIn: true
      },
      authorizedContacts: {
        checked: true,
        roles: `${this.translate('roleTechnical', language as Language)} ${this.translate('conjunctionAnd', language as Language)} ${this.translate('roleAdministrative', language as Language)} ${this.translate('contactsSuffix', language as Language)}`
      },
      additionalNotes: '',
      senderName: 'Your Name', // Default sender details
      senderTitle: 'Support Specialist',
      senderCompany: 'SCHNEIDER IT MANAGEMENT',
      senderContact: 'support@schneider.im',
      currentDate: currentDate,
      language: language
    };
    // Cast needed because EmailFormData might have optional fields not covered by Omit
    return formData as EmailFormData;
  },

  // buildEnhancedEmailHTML - Reverted to synchronous
  buildEnhancedEmailHTML: function(formData: EmailFormData, tenants: TenantInfo[] = [], theme: ThemeSettings | null = null): string {
    // Call the now-synchronous buildEmailHTML
    const { html } = this.buildEmailHTML(formData, tenants, theme);
    return html;
  },

  /**
   * Generates the content for an .eml file, potentially including a PDF attachment.
   */
  generateEmlContent: async function(formData: EmailFormData, htmlContent: string, plainTextContent: string): Promise<string> {
    // Fetch PDF details from storage
    const pdfFilename = await StorageService.get<string>('pdfAttachmentFilename');
    const pdfBase64 = await StorageService.get<string>('pdfAttachmentBase64');
    const hasAttachment = pdfFilename && pdfBase64;

    const boundaryAlternative = `----=_Part_Alternative_${Math.random().toString(36).substring(2)}`;
    const boundaryMixed = hasAttachment ? `----=_Part_Mixed_${Math.random().toString(36).substring(2)}` : '';

    const formatRecipients = (emails: string | undefined): string => {
      if (!emails) return '';
      return emails
        .split(/[,;]/)
        .map(email => email.trim())
        .filter(email => email)
        .join(', ');
    };

    const toRecipients = formatRecipients(formData.to);
    const ccRecipients = formatRecipients(formData.cc);
    const subject = formData.subject || '';
    const fromAddress = formData.senderContact ? `${formData.senderName} <${formData.senderContact}>` : formData.senderName;

    // Use btoa for browser environments. Ensure UTF-8 handling.
    const base64Html = btoa(unescape(encodeURIComponent(htmlContent)));

    let emlContent = `MIME-Version: 1.0\r\n`;
    emlContent += `Date: ${new Date().toUTCString()}\r\n`;
    emlContent += `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=\r\n`;
    if (fromAddress) {
      emlContent += `From: ${fromAddress}\r\n`;
    }
    if (toRecipients) {
      emlContent += `To: ${toRecipients}\r\n`;
    }
    if (ccRecipients) {
      emlContent += `Cc: ${ccRecipients}\r\n`;
    }
    emlContent += `X-Unsent: 1\r\n`;

    if (hasAttachment) {
      // --- Multipart/Mixed Structure (with Attachment) ---
      emlContent += `Content-Type: multipart/mixed; boundary="${boundaryMixed}"\r\n`;
      emlContent += `\r\n`;
      emlContent += `This is a multi-part message in MIME format.\r\n`; // Preamble

      // --- Part 1: Alternative Text/HTML ---
      emlContent += `--${boundaryMixed}\r\n`;
      emlContent += `Content-Type: multipart/alternative; boundary="${boundaryAlternative}"\r\n`;
      emlContent += `\r\n`;

      // Plain text part (within alternative)
      emlContent += `--${boundaryAlternative}\r\n`;
      emlContent += `Content-Type: text/plain; charset=utf-8\r\n`;
      emlContent += `Content-Transfer-Encoding: quoted-printable\r\n`;
      emlContent += `\r\n`;
      emlContent += `${plainTextContent.replace(/=/g, '=3D')}\r\n`; // Basic QP encoding
      emlContent += `\r\n`;

      // HTML part (within alternative)
      emlContent += `--${boundaryAlternative}\r\n`;
      emlContent += `Content-Type: text/html; charset=utf-8\r\n`;
      emlContent += `Content-Transfer-Encoding: base64\r\n`;
      emlContent += `\r\n`;
      emlContent += `${base64Html}\r\n`;
      emlContent += `\r\n`;

      // End alternative part
      emlContent += `--${boundaryAlternative}--\r\n`;
      emlContent += `\r\n`;

      // --- Part 2: PDF Attachment ---
      emlContent += `--${boundaryMixed}\r\n`;
      emlContent += `Content-Type: application/pdf; name="${pdfFilename}"\r\n`;
      emlContent += `Content-Transfer-Encoding: base64\r\n`;
      emlContent += `Content-Disposition: attachment; filename="${pdfFilename}"\r\n`;
      emlContent += `\r\n`;
      // Add Base64 content in chunks if necessary, but for typical PDFs, one block is fine.
      emlContent += `${pdfBase64}\r\n`;
      emlContent += `\r\n`;

      // End mixed part
      emlContent += `--${boundaryMixed}--\r\n`;

    } else {
      // --- Multipart/Alternative Structure (No Attachment - Original Logic) ---
      emlContent += `Content-Type: multipart/alternative; boundary="${boundaryAlternative}"\r\n`;
      emlContent += `\r\n`;

      // Plain text part
      emlContent += `--${boundaryAlternative}\r\n`;
      emlContent += `Content-Type: text/plain; charset=utf-8\r\n`;
      emlContent += `Content-Transfer-Encoding: quoted-printable\r\n`;
      emlContent += `\r\n`;
      emlContent += `${plainTextContent.replace(/=/g, '=3D')}\r\n`; // Basic QP encoding
      emlContent += `\r\n`;

      // HTML part
      emlContent += `--${boundaryAlternative}\r\n`;
      emlContent += `Content-Type: text/html; charset=utf-8\r\n`;
      emlContent += `Content-Transfer-Encoding: base64\r\n`;
      emlContent += `\r\n`;
      emlContent += `${base64Html}\r\n`;
      emlContent += `\r\n`;

      // End boundary
      emlContent += `--${boundaryAlternative}--\r\n`;
    }

    return emlContent;
  }
};

export default emailBuilder;
