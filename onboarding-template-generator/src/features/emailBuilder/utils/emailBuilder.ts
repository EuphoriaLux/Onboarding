// src/features/emailBuilder/utils/emailBuilder.ts
import { supportTiers } from '../../supportTiers/constants';
import { CustomerInfo, EmailFormData, Language } from './types';
import { TenantInfo } from '../../tenants/types';
import { ThemeSettings } from '../../../types';
import React from 'react'; // Single React import
import ReactDOMServer from 'react-dom/server'; // Single ReactDOMServer import
import { getTranslation } from './translationService';
// Import components from builders.tsx (no extension needed)
import {
  SectionHeader,
  // InstructionBox, // Not used directly in buildEmailHTML
  StepIndicator,
  ContactsTable,
  ScriptBlock,
} from '../templates/builders'; // Should resolve to builders.tsx now

// --- Constants ---
const HELP_DESK_AGENTS_OBJECT_ID = "b6770181-d9f5-4818-b5b1-ea51cd9f66e5";
const ADMIN_AGENTS_OBJECT_ID = "9a838974-22d3-415b-8136-c790e285afeb";
const SUPPORT_REQUEST_CONTRIBUTOR_ROLE = "Support Request Contributor";
const OWNER_ROLE = "Owner";

// RBAC Script Template remains the same
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

/**
 * Email Builder Module
 */
const emailBuilder = {
  translate: getTranslation,

  // buildEmailBody remains the same as it generates plain text
  buildEmailBody: function(formData: EmailFormData, tenants: TenantInfo[] = []): string {
    const tier = supportTiers[formData.selectedTier];
    const language = (formData.language || 'en') as Language;
    const defaultGdapLink = "https://partner.microsoft.com/dashboard/commerce/granularadmin";

    let body = this.translate('greeting', language, { name: formData.contactName }) + '\n\n';

    body += this.translate('intro1', language, {
      company: formData.senderCompany,
      clientCompany: formData.companyName
    }) + '\n\n';

    body += this.translate('intro2', language, {
      tier: tier.name
    }) + '\n\n';

    // Support Plan Section
    body += `**${this.translate('supportPlanTitle', language, { tier: tier.name.toUpperCase() })}**\n\n`;
    const supportType = formData.selectedTier === 'bronze'
      ? this.translate('supportType.bronze', language)
      : this.translate('supportType.other', language);
    body += this.translate('supportPlanIntro', language, {
      tier: tier.name,
      supportType: supportType
    }) + '\n\n';
    body += `• ${this.translate('supportTypeLabel', language)}: ${formData.selectedTier === 'bronze' ? 'Microsoft Flexible Support' : 'Microsoft Premier Support'}\n`;
    body += `• ${this.translate('supportHoursLabel', language)}: ${tier.supportHours}\n`;
    body += `• ${this.translate('severityLevelsLabel', language)}: ${formData.selectedTier === 'bronze' ? 'Level B or C' : 'Level A, B or C'}\n`;
    body += `• ${this.translate('contactsLabel', language)}: ${tier.authorizedContacts}\n`;
    body += `• ${this.translate('tenantsLabel', language)}: ${tier.tenants}\n`;
    body += `• ${this.translate('requestsLabel', language)}: ${tier.supportRequestsIncluded}\n`;
    body += `• ${this.translate('criticalLabel', language)}: ${tier.criticalSituation ? this.translate('yes', language) : this.translate('no', language)}\n\n`;

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
      body += `#  | ${this.translate('firstNameHeader', language)} | ${this.translate('lastNameHeader', language)} | ${this.translate('officePhoneHeader', language)} | ${this.translate('mobilePhoneHeader', language)} | ${this.translate('emailHeader', language)} | ${this.translate('jobTitleHeader', language)}\n`;
      body += `---|--------------------|------------------|----------------------|----------------------|------------------|------------------\n`;
      const rows = Math.min(tier.authorizedContacts, 10);
      for (let i = 1; i <= rows; i++) {
        body += `${i}  |                    |                  |                      |                      |                  |                  \n`;
      }
      body += '\n';
      if (tier.authorizedContacts > 10) {
        body += this.translate('contactsNote', language, {
          tier: tier.name,
          count: tier.authorizedContacts
        }) + '\n\n';
      }
    }

    // Meeting Section
    if (formData.meetingDate) {
      body += `**${this.translate('meetingTitle', language)}**\n\n`;
      body += this.translate('meetingIntro', language) + '\n\n';
      body += this.translate('meetingDate', language, { date: formData.meetingDate }) + '\n';
      body += this.translate('meetingAttendees', language) + '\n\n';
    }

    // Tenant Specific Sections
    tenants.forEach((tenant, index) => {
      const tenantIdentifier = tenant.tenantDomain || `Tenant ${index + 1}`;
      let gdapSection = '';
      let rbacSection = '';

      // GDAP
      const tenantGdapLink = tenant.gdapLink || defaultGdapLink;
      gdapSection += `**${this.translate('gdapTitle', language)} - ${tenantIdentifier}**\n\n`;
      gdapSection += this.translate('gdapPermission', language) + '\n\n';
      gdapSection += this.translate('gdapInstruction', language) + '\n';
      gdapSection += tenantGdapLink + '\n';
      if (tenant.implementationDeadline) {
        gdapSection += `*Implementation Deadline: ${tenant.implementationDeadline.toLocaleDateString()}*\n`;
      }
      gdapSection += '\n';

      // RBAC
      if (tenant.hasAzure) {
        rbacSection += `**${this.translate('rbacTitle', language)} - ${tenantIdentifier}**\n\n`;
        rbacSection += this.translate('rbacIntro', language, { groups: 'relevant security groups' }) + ' ';
        rbacSection += this.translate('rbacPermissionAzure', language) + '\n\n';
        rbacSection += this.translate('rbacInstruction', language) + '\n\n';
        rbacSection += `1. ${this.translate('rbacStep1', language)}\n`;
        rbacSection += `   ${this.translate('rbacStep1Source', language)} https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0\n\n`;
        rbacSection += `   Install-Module -Name Az -Repository PSGallery -Force\n\n`;
        rbacSection += `   or update it:\n\n`;
        rbacSection += `   Update-Module Az.Resources -Force\n\n`;
        rbacSection += `2. ${this.translate('rbacStep2', language)}\n`;
        rbacSection += `   ${this.translate('rbacStep2Instruction', language)}\n\n`;
        const rawRbacScript = RBAC_POWERSHELL_SCRIPT_TEMPLATE.replace('{TENANT_ID}', tenant.microsoftTenantDomain || 'YOUR_TENANT_ID');
        rbacSection += rawRbacScript + '\n\n';
        rbacSection += this.translate('rbacScreenshot', language) + '\n\n';
      }

      if (gdapSection.trim() || rbacSection.trim()) {
        body += `\n---\n`;
        if (gdapSection.trim()) body += gdapSection;
        if (rbacSection.trim()) {
          if (gdapSection.trim()) body += '\n';
          body += rbacSection;
        }
        body += "---\n";
      }
    });

    // Conditional Access
    if (formData.conditionalAccess.checked) {
      body += `**${this.translate('conditionalAccessTitle', language)}**\n\n`;
      body += this.translate('conditionalAccessIntro', language) + '\n\n';
      if (formData.conditionalAccess.mfa) body += `• ${this.translate('mfaPolicy', language)}\n`;
      if (formData.conditionalAccess.location) body += `• ${this.translate('locationPolicy', language)}\n`;
      if (formData.conditionalAccess.device) body += `• ${this.translate('devicePolicy', language)}\n`;
      if (formData.conditionalAccess.signIn) body += `• ${this.translate('signInPolicy', language)}\n`;
      body += '\n';
    }

    // Additional Notes
    if (formData.additionalNotes) {
      body += `**${this.translate('additionalInfoTitle', language)}**\n\n`;
      body += `${formData.additionalNotes}\n\n`;
    }

    // Closing
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
  buildEmailHTML: function(formData: EmailFormData, tenants: TenantInfo[] = [], theme: ThemeSettings | null = null): { html: string; plainText: string } {
    const tier = supportTiers[formData.selectedTier];
    const language = (formData.language || 'en') as Language;
    const defaultGdapLink = "https://partner.microsoft.com/dashboard/commerce/granularadmin";

    const effectiveTheme: ThemeSettings = {
      primaryColor: theme?.primaryColor || '#0078d4',
      textColor: theme?.textColor || '#333333',
      backgroundColor: theme?.backgroundColor || '#ffffff',
    };

    const primaryAccentColor = effectiveTheme.primaryColor;
    const textColor = effectiveTheme.textColor;
    const bgColor = effectiveTheme.backgroundColor;
    const lightBgColor = bgColor === '#ffffff' ? '#f8f8f8' : `${bgColor}1A`;
    const footerTextColor = textColor === '#333333' ? '#666666' : `${textColor}B3`;

    const subject = formData.subject || this.translate('subject', language, {
      tier: tier.name,
      company: formData.companyName
    });

    // Define styles as strings for email compatibility
    // Apply container styles directly to body for simpler structure
    const bodyStyle = `margin: 0 auto; padding: 20px; width: 100%; max-width: 800px; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${textColor}; background-color: #FFFFFF; box-sizing: border-box;`; // Ensure white BG, add max-width etc.
    // const containerStyle = `width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; background-color: ${bgColor}; box-sizing: border-box;`; // Style moved to body
    const pStyle = `margin: 0 0 15px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor}; background-color: transparent;`; // Ensure transparent BG
    const tableStyle = `border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%; margin-bottom: 1em;`; // Ensure white BG, width, margin
    // Remove unused table-based layout styles
    // const sectionBoxStyle = `border-collapse: collapse; margin: 15px 0 25px 0; border: 1px solid #eee; border-radius: 4px; background-color: #FFFFFF;`;
    // const sectionBoxCellStyle = `padding: 18px 20px; color: ${textColor}; background-color: transparent;`;
    const listItemStyle = `padding: 0; margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${textColor}; background-color: transparent; list-style-position: outside; padding-left: 5px;`; // Use standard list styling, ensure transparent BG
    const bulletStyle = `display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${primaryAccentColor}; margin-right: 8px; vertical-align: middle;`; // Slightly smaller bullet
    const strongStyle = `font-weight: 600; color: ${textColor};`;
    // Updated linkButtonStyle for button appearance
    const linkButtonStyle = `display: inline-block; padding: 10px 24px; background-color: ${primaryAccentColor}; color: #FFFFFF !important; text-decoration: none !important; font-weight: 600; border-radius: 4px; margin-top: 5px; border: none; cursor: pointer;`;
    const deadlineHighlightStyle = `margin: 15px 0 0 0; text-align: center; font-size: 14px; background-color: #fff4ce; padding: 5px 10px; border-radius: 4px; display: inline-block;`;
    const deadlineStrongStyle = `font-weight: 600; color: #333;`;
    // Ensure tenant block uses white background
    const tenantBlockStyle = `background-color: #FFFFFF; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px;`;
    const tenantBlockCellStyle = `padding: 20px; color: ${textColor}; background-color: transparent;`; // Ensure transparent BG

    // Build plain text first (reuse existing logic)
    const plainTextContent = this.buildEmailBody(formData, tenants);

    // Build HTML body content using components and string concatenation
    let htmlBodyContent = '';

    htmlBodyContent += `<p style="${pStyle}">${this.translate('greeting', language, { name: formData.contactName })}</p>`;
    htmlBodyContent += `<p style="${pStyle}">${this.translate('intro1', language, { company: formData.senderCompany, clientCompany: formData.companyName })}</p>`;
    htmlBodyContent += `<p style="margin: 0 0 25px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('intro2', language, { tier: tier.name })}</p>`;

    // Support Plan Section - Use div and ul/li
    htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: this.translate('supportPlanTitle', language, { tier: tier.name.toUpperCase() }), color: primaryAccentColor, theme: effectiveTheme }));
    htmlBodyContent += `<p style="${pStyle}">${this.translate('supportPlanIntro', language, { tier: tier.name, supportType: formData.selectedTier === 'bronze' ? this.translate('supportType.bronze', language) : this.translate('supportType.other', language) })}</p>`;
    // Use a div with border and padding instead of table for the box
    htmlBodyContent += `<div style="border: 1px solid #eee; border-radius: 4px; padding: 18px 20px; margin: 15px 0 25px 0; background-color: #FFFFFF;">`;
    htmlBodyContent += `<ul style="margin: 0; padding: 0; list-style: none;">`; // Reset ul styles
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportTypeLabel', language)}:</strong> ${formData.selectedTier === 'bronze' ? 'Microsoft Flexible Support' : 'Microsoft Premier Support'}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportHoursLabel', language)}:</strong> ${tier.supportHours}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('severityLevelsLabel', language)}:</strong> ${formData.selectedTier === 'bronze' ? 'Level B or C' : 'Level A, B or C'}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('contactsLabel', language)}:</strong> ${tier.authorizedContacts}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('tenantsLabel', language)}:</strong> ${tier.tenants}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('requestsLabel', language)}:</strong> ${tier.supportRequestsIncluded}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('criticalLabel', language)}:</strong> ${tier.criticalSituation ? '<span style="color: #107c10; font-weight: 600;">' + this.translate('yes', language) + '</span>' : '<span style="color: #d83b01; font-weight: 600;">' + this.translate('no', language) + '</span>'}</li>`;
    htmlBodyContent += `</ul></div>`;

    // Authorized Contacts Section - Keep table for tabular data
    if (formData.authorizedContacts.checked) {
         htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`; // Add HR
         const contactsSectionTitle = this.translate('authorizedContactsTitle', language);
         htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: contactsSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
         htmlBodyContent += `<p style="${pStyle}">${this.translate('contactsIntro', language, { tier: tier.name, count: tier.authorizedContacts })}</p>`;
         htmlBodyContent += `<p style="${pStyle}">${this.translate('contactsRolesIntro', language, { roles: `<strong style="${strongStyle}">${formData.authorizedContacts.roles}</strong>` })}</p>`;
         htmlBodyContent += `<p style="${pStyle}">${this.translate('contactsInstruction', language)}</p>`;
         // Pass the tier's contact limit to the ContactsTable component
         htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(ContactsTable, {
             contacts: formData.emailContacts,
             theme: effectiveTheme,
             tierContactLimit: tier.authorizedContacts // Pass the limit here
         }));
    }

    // Meeting Section
    if (formData.meetingDate) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`; // Add HR
        const meetingSectionTitle = this.translate('meetingTitle', language);
        htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: meetingSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
        htmlBodyContent += `<p style="${pStyle}">${this.translate('meetingIntro', language)}</p>`;
        // Use a div for the meeting date box
        htmlBodyContent += `<div style="margin: 20px 0; background-color: #FFFFFF; border: 1px solid #eee; border-radius: 4px; padding: 16px 20px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">`;
        htmlBodyContent += `<strong style="${strongStyle}">${this.translate('meetingDate', language, { date: `<span style="color: ${primaryAccentColor};">${formData.meetingDate}</span>` })}</strong>`;
        htmlBodyContent += `</div>`;
        htmlBodyContent += `<p style="margin: 0 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('meetingAttendees', language)}</p>`;
    }

    // Tenant Specific Sections - Use divs for blocks
    if (tenants.length > 0) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`; // Add HR before tenant sections
        htmlBodyContent += `<!-- Tenant Sections Start -->`;
        tenants.forEach((tenant, index) => { // Add index for potential HR between tenants
            // Add HR between tenant blocks if more than one tenant
            if (index > 0) {
                htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
            }
            const tenantIdentifier = tenant.tenantDomain || `Tenant ${index + 1}`;
            let tenantHtml = '';
            // Add Tenant Identifier Sub-heading
            tenantHtml += `<h4 style="font-size: 16px; font-weight: 600; color: ${textColor}; margin: 0 0 15px 0; padding-bottom: 5px; border-bottom: 1px solid #eee;">Tenant: ${tenantIdentifier}</h4>`;

            // GDAP Section
            let gdapHtml = '';
            const tenantGdapLink = tenant.gdapLink || defaultGdapLink;
            const gdapSectionTitle = `${this.translate('gdapTitle', language)} - ${tenantIdentifier}`;
            gdapHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: gdapSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
            gdapHtml += `<p style="${pStyle}">${this.translate('gdapPermission', language)}</p>`;
            gdapHtml += `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin: 20px 0;"><tbody><tr><td style="padding: 16px 20px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; text-align: center; color: ${textColor};">`;
            gdapHtml += `<p style="margin: 0 0 10px 0; font-weight: 600; color: ${textColor};">${this.translate('gdapInstruction', language)}</p>`;
            gdapHtml += `<a href="${tenantGdapLink}" target="_blank" style="${linkButtonStyle}">${this.translate('gdapLink', language)}</a>`;
             if (tenant.implementationDeadline) {
                 gdapHtml += `<br/><span style="${deadlineHighlightStyle}"><strong style="${deadlineStrongStyle}">Implementation Deadline:</strong> ${tenant.implementationDeadline.toLocaleDateString()}</span>`;
             }
             gdapHtml += `</div>`; // Close the inner div for GDAP content
            // Use div for the tenant block
            tenantHtml += `<div style="background-color: #FFFFFF; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px; padding: 20px;">${gdapHtml}</div>`;

            // RBAC Section
            if (tenant.hasAzure) {
                 let rbacHtml = '';
                 const rbacSectionTitle = `${this.translate('rbacTitle', language)} - ${tenantIdentifier}`;
                 rbacHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: rbacSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
                 rbacHtml += `<p style="${pStyle}">${this.translate('rbacIntro', language, { groups: 'relevant security groups' })} ${this.translate('rbacPermissionAzure', language)}</p>`;
                 rbacHtml += `<p style="margin: 15px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; font-weight: 600; color: ${textColor};">${this.translate('rbacInstruction', language)}</p>`;
                 rbacHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(StepIndicator, { number: 1, title: this.translate('rbacStep1', language), theme: effectiveTheme }));
                 rbacHtml += `<p style="margin: 5px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacStep1Source', language)} <a href="https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0" target="_blank" style="color: ${primaryAccentColor}; text-decoration: underline;">https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0</a></p>`;
                 rbacHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: 'Install-Module -Name Az -Repository PSGallery -Force', theme: effectiveTheme }))}</div>`;
                 rbacHtml += `<p style="margin: 15px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">or update it:</p>`;
                 rbacHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: 'Update-Module Az.Resources -Force', theme: effectiveTheme }))}</div>`;
                 rbacHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(StepIndicator, { number: 2, title: this.translate('rbacStep2', language), theme: effectiveTheme }));
                 rbacHtml += `<p style="margin: 5px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacStep2Instruction', language)}</p>`;
                 const rbacScript = RBAC_POWERSHELL_SCRIPT_TEMPLATE.replace('{TENANT_ID}', tenant.microsoftTenantDomain || 'YOUR_TENANT_ID');
                 rbacHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: rbacScript, theme: effectiveTheme }))}</div>`;
                 rbacHtml += `<p style="margin: 20px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScreenshot', language)}</p>`;
                 // Use div for the tenant block
                 tenantHtml += `<div style="background-color: #FFFFFF; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px; padding: 20px;">${rbacHtml}</div>`;
            }
            htmlBodyContent += tenantHtml;
        });
        htmlBodyContent += `<!-- Tenant Sections End -->`;
    }

    // Conditional Access Section
    if (formData.conditionalAccess.checked) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`; // Add HR
        const caSectionTitle = this.translate('conditionalAccessTitle', language);
        htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: caSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
        htmlBodyContent += `<p style="${pStyle}">${this.translate('conditionalAccessIntro', language)}</p>`;
        // Use div and ul/li for conditional access box
        htmlBodyContent += `<div style="margin: 0 0 20px 0; background-color: #FFFFFF; border: 1px solid #eee; border-radius: 4px; padding: 16px 20px;">`;
        htmlBodyContent += `<ul style="margin: 0; padding: 0; list-style: none;">`; // Reset ul styles
        if (formData.conditionalAccess.mfa) { htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('mfaPolicy', language)}</li>`; }
        if (formData.conditionalAccess.location) { htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('locationPolicy', language)}</li>`; }
        if (formData.conditionalAccess.device) { htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('devicePolicy', language)}</li>`; }
        if (formData.conditionalAccess.signIn) { htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('signInPolicy', language)}</li>`; }
        htmlBodyContent += `</ul></div>`;
    }

    // Additional Notes Section - Use div
    if (formData.additionalNotes) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`; // Add HR
        const additionalInfoTitle = this.translate('additionalInfoTitle', language);
        htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: additionalInfoTitle, color: primaryAccentColor, theme: effectiveTheme }));
        const formattedNotes = formData.additionalNotes.replace(/\n/g, '<br>');
        htmlBodyContent += `<p style="margin: 0 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${formattedNotes}</p>`;
    }

    // Closing and Footer - Use divs/paragraphs
    htmlBodyContent += `<p style="margin: 30px 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('closing', language)}</p>`;
    htmlBodyContent += `<p style="margin: 0 0 10px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('regards', language)}</p>`;
    htmlBodyContent += `<div style="line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor}; margin-bottom: 40px;">`; // Margin added to div
    htmlBodyContent += `<strong style="${strongStyle}">${formData.senderName}</strong><br>`;
    htmlBodyContent += `${formData.senderTitle}<br>`;
    htmlBodyContent += `${formData.senderCompany}<br>`;
    htmlBodyContent += `<a href="mailto:${formData.senderContact || ''}" style="color: ${primaryAccentColor}; text-decoration: none;">${formData.senderContact || ''}</a>`;
    htmlBodyContent += `</div>`;

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
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; } /* Added MSO specific table reset */
    </style>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <style type="text/css">
      /* Styles for Preview Iframe Overflow */
      body { word-wrap: break-word; } /* Basic word wrap */
      pre { white-space: pre-wrap !important; word-wrap: break-word !important; word-break: break-all !important; } /* Force wrap/break in pre */
      table { table-layout: fixed; width: 100% !important; } /* Help tables respect width */
      td, th { word-wrap: break-word; word-break: break-word; } /* Wrap in table cells */
    </style>
</head>
<body style="${bodyStyle}">
    <!-- Removed outer table wrapper -->
    <!-- Main content -->
    ${htmlBodyContent}
    <!-- Footer Div -->
    <div style="margin-top: 40px; border-top: 1px solid #eee; padding: 20px 0 0 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: ${footerTextColor}; text-align: center; background-color: transparent;">
        <p style="margin: 0; line-height: 1.5;">${this.translate('footer', language)}</p>
    </div>
</body>
</html>`;

    return { html: finalHtml, plainText: plainTextContent };
  },

  // getSupportPlanTextHTML remains the same
  getSupportPlanTextHTML: function(planType: string, language: Language = 'en'): string {
    const supportPlanIntro = this.translate('supportPlanIntro', language, {
      tier: supportTiers[planType].name,
      supportType: planType === 'bronze'
        ? this.translate('supportType.bronze', language)
        : this.translate('supportType.other', language)
    });

    let bulletItems = '';
    switch(planType) {
      case 'bronze':
        bulletItems = `
<ul style="padding-left: 20px; margin: 0 0 15px 0;">
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Microsoft Flexible Support</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">8×5 Support Hours</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Level B or C Severity</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">2 Customer Contacts</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">1 Tenant</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Pay As You Go support requests</li>
</ul>`;
          break;
      case 'silver':
        bulletItems = `
<ul style="padding-left: 20px; margin: 0 0 15px 0;">
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Microsoft Premier Support</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">24×7×365 Support Hours</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Level A, B or C Severity</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">6 Customer Contacts</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">2 Tenants</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">12 Support Requests Included per trailing 12-month period</li>
</ul>`;
          break;
      case 'gold':
        bulletItems = `
<ul style="padding-left: 20px; margin: 0 0 15px 0;">
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Microsoft Premier Support</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">24×7×365 Support Hours</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Level A, B or C Severity</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">12 Customer Contacts</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">6 Tenants</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">36 Support Requests Included per trailing 12-month period</li>
</ul>`;
          break;
      case 'platinum':
        bulletItems = `
<ul style="padding-left: 20px; margin: 0 0 15px 0;">
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Microsoft Premier Support</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">24×7×365 Support Hours</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">Level A, B or C Severity</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">100 Customer Contacts</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">100 Tenants</li>
  <li style="margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif;">100 Support Requests Included per trailing 12-month period</li>
</ul>`;
          break;
      default:
        bulletItems = '';
    }
    return `${supportPlanIntro}<br><br>${bulletItems}`;
  },

  // processCustomerInfoToEmailData remains the same
  processCustomerInfoToEmailData: function(info: CustomerInfo, language: string = 'en'): EmailFormData {
    const tier = supportTiers[info.selectedTier];
    const today = new Date();
    const currentDate = today.toLocaleDateString();
    let meetingDateStr;
    if (info.proposedDate instanceof Date && !isNaN(info.proposedDate.getTime())) {
      meetingDateStr = info.proposedDate.toLocaleDateString();
    }
    const formData: Omit<EmailFormData, 'rbac'> = {
      companyName: info.companyName,
      contactName: info.contactName,
      contactEmail: info.contactEmail,
      proposedDate: info.proposedDate,
      tenantId: info.tenantId,
      selectedTier: info.selectedTier,
      emailContacts: info.authorizedContacts,
      to: info.contactEmail || '',
      cc: '',
      subject: this.translate('subject', language as Language, {
        tier: tier.name,
        company: info.companyName
      }),
      conditionalAccess: {
        checked: true, mfa: true, location: true, device: true, signIn: true
      },
      authorizedContacts: {
        checked: true, roles: 'Technical and Administrative contacts'
      },
      meetingDate: meetingDateStr,
      additionalNotes: '',
      senderName: 'Your Name',
      senderTitle: 'Support Specialist',
      senderCompany: 'Microsoft Partner Support',
      senderContact: 'support@microsoftpartner.com',
      currentDate: currentDate,
      language: language
    };
    return formData as EmailFormData;
  },

  // buildEnhancedEmailHTML remains the same
  buildEnhancedEmailHTML: function(formData: EmailFormData, tenants: TenantInfo[] = [], theme: ThemeSettings | null = null): string {
    const { html } = this.buildEmailHTML(formData, tenants, theme);
    return html;
  },

  /**
   * Generates the content for an .eml file.
   * @param formData The email form data.
   * @param htmlContent The pre-generated HTML content for the email body.
   * @param plainTextContent The pre-generated plain text content for the email body.
   * @returns A string containing the full .eml file content.
   */
  generateEmlContent: function(formData: EmailFormData, htmlContent: string, plainTextContent: string): string {
    const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;

    // Helper to format recipients (comma-separated, trim whitespace)
    const formatRecipients = (emails: string | undefined): string => {
      if (!emails) return '';
      return emails
        .split(/[,;]/) // Split by comma or semicolon
        .map(email => email.trim()) // Trim whitespace
        .filter(email => email) // Remove empty entries
        .join(', '); // Join with comma and space
    };

    const toRecipients = formatRecipients(formData.to);
    const ccRecipients = formatRecipients(formData.cc);
    const subject = formData.subject || '';
    const fromAddress = formData.senderContact ? `${formData.senderName} <${formData.senderContact}>` : formData.senderName; // Format From address if email is available

    // Base64 encode the HTML content
    // Use btoa for browser environments. Ensure UTF-8 handling.
    const base64Html = btoa(unescape(encodeURIComponent(htmlContent)));

    // Construct the EML content
    let emlContent = `MIME-Version: 1.0\r\n`;
    emlContent += `Date: ${new Date().toUTCString()}\r\n`; // Use standard Date format
    emlContent += `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=\r\n`; // Encode subject for UTF-8
    if (fromAddress) {
      emlContent += `From: ${fromAddress}\r\n`;
    }
    if (toRecipients) {
      emlContent += `To: ${toRecipients}\r\n`;
    }
    if (ccRecipients) {
      emlContent += `Cc: ${ccRecipients}\r\n`;
    }
    emlContent += `X-Unsent: 1\r\n`; // Add header to indicate it's a draft
    emlContent += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n`;
    emlContent += `\r\n`; // Header/Body separator

    // Plain text part
    emlContent += `--${boundary}\r\n`;
    emlContent += `Content-Type: text/plain; charset=utf-8\r\n`;
    emlContent += `Content-Transfer-Encoding: quoted-printable\r\n`; // Or 7bit if simple enough
    emlContent += `\r\n`;
    // Basic quoted-printable encoding (replace '=' with '=3D', handle long lines if necessary)
    // For simplicity, we'll just include the text. Full QP encoding is complex.
    emlContent += `${plainTextContent.replace(/=/g, '=3D')}\r\n`;
    emlContent += `\r\n`;

    // HTML part
    emlContent += `--${boundary}\r\n`;
    emlContent += `Content-Type: text/html; charset=utf-8\r\n`;
    emlContent += `Content-Transfer-Encoding: base64\r\n`;
    emlContent += `\r\n`;
    // Add base64 content in chunks if needed, but usually fine for emails
    emlContent += `${base64Html}\r\n`;
    emlContent += `\r\n`;

    // End boundary
    emlContent += `--${boundary}--\r\n`;

    return emlContent;
  }
};

export default emailBuilder;
