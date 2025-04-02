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
  StepIndicator,
  ContactsTable,
  ScriptBlock,
} from '../templates/builders'; // Should resolve to builders.tsx now

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
   */
  buildEmailBody: function(formData: EmailFormData, tenants: TenantInfo[] = []): string {
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
        body += this.translate('tenantInfoIntro', language) + '\n\n'; // Added intro text
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

    // Meeting Section (Kept for potential future use)
    if (formData.meetingDate) {
      body += `**${this.translate('meetingTitle', language)}**\n\n`;
      body += this.translate('meetingIntro', language) + '\n\n';
      body += this.translate('meetingDate', language, { date: formData.meetingDate }) + '\n';
      body += this.translate('meetingAttendees', language) + '\n\n';
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
            body += this.translate('gdapSpecificLinkInfo', language) + '\n'; // "Use the specific links provided below:"
            specificLinks.forEach(tenant => {
                body += `  ${tenant.companyName}: ${tenant.gdapLink}\n`;
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
        body += `or update it:\n`;
        body += `${this.translate('rbacScriptHeader', language)}\n`;
        body += `Update-Module Az.Resources -Force\n\n`;

        // Step 2: Run script per tenant
        body += `2\t${this.translate('rbacStep2', language)}\n\n`;
        body += this.translate('rbacStep2InstructionMultiTenant', language) + '\n\n'; // Updated instruction: "Run the appropriate script below..."

        relevantRbacTenants.forEach(tenant => {
            const tenantDomain = tenant.microsoftTenantDomain || '[MS_TENANT_DOMAIN_MISSING]'; // Use MS Domain or placeholder
            const scriptForTenant = RBAC_POWERSHELL_SCRIPT_TEMPLATE.replace('{TENANT_ID}', tenantDomain);
            body += `--- Script for Tenant: ${tenant.companyName} (Domain: ${tenantDomain}) ---\n`; // Show domain in header
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
  buildEmailHTML: function(formData: EmailFormData, tenants: TenantInfo[] = [], theme: ThemeSettings | null = null): { html: string; plainText: string } {
    const tier = supportTiers[formData.selectedTier];
    const language = (formData.language || 'en') as Language;

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

    // Define styles
    const bodyStyle = `margin: 0 auto; padding: 20px; width: 100%; max-width: 800px; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${textColor}; background-color: #FFFFFF; box-sizing: border-box;`;
    const pStyle = `margin: 0 0 15px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor}; background-color: transparent;`;
    const listItemStyle = `padding: 0; margin-bottom: 8px; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: ${textColor}; background-color: transparent; list-style-position: outside; padding-left: 5px;`;
    const bulletStyle = `display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${primaryAccentColor}; margin-right: 8px; vertical-align: middle;`;
    const strongStyle = `font-weight: 600; color: ${textColor};`;
    const linkButtonStyle = `display: inline-block; padding: 10px 24px; background-color: ${primaryAccentColor}; color: #FFFFFF !important; text-decoration: none !important; font-weight: 600; border-radius: 4px; margin-top: 5px; border: none; cursor: pointer;`;
    const tenantBlockStyle = `background-color: #FFFFFF; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px; padding: 20px;`;

    // Build plain text first
    const plainTextContent = this.buildEmailBody(formData, tenants);

    // Build HTML body content
    let htmlBodyContent = '';

    // Intro
    htmlBodyContent += `<p style="${pStyle}">${this.translate('greeting', language, { name: formData.contactName })}</p>`;
    htmlBodyContent += `<p style="${pStyle}">${this.translate('intro1', language, { company: formData.senderCompany })}</p>`;
    htmlBodyContent += `<p style="margin: 0 0 25px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('intro2', language, { tier: tier.name })}</p>`;

    // Support Plan Section
    htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: this.translate('supportPlanTitle', language, { tier: tier.name }), color: primaryAccentColor, theme: effectiveTheme }));
    htmlBodyContent += `<p style="${pStyle}">${this.translate('supportPlanIntro', language, { tier: tier.name })}</p>`;
    htmlBodyContent += `<div style="border: 1px solid #eee; border-radius: 4px; padding: 18px 20px; margin: 15px 0 25px 0; background-color: #FFFFFF;">`;
    htmlBodyContent += `<ul style="margin: 0; padding: 0; list-style: none;">`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportProviderLabel', language)}:</strong> ${tier.supportProvider}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('productsCoveredLabel', language)}:</strong> ${tier.products.join(', ')}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('severityLevelsLabel', language)}:</strong> ${tier.severityLevels}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('criticalLabel', language)}:</strong> ${tier.criticalSituation ? '<span style="color: #107c10; font-weight: 600;">' + this.translate('yes', language) + '</span>' : '<span style="color: #d83b01; font-weight: 600;">' + this.translate('no', language) + '</span>'}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportHoursLabel', language)}:</strong> ${tier.supportHours}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportRequestSubmissionLabel', language)}:</strong> ${tier.supportRequestSubmission}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('tenantsLabel', language)}:</strong> ${tier.tenants}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('contactsLabel', language)}:</strong> ${tier.authorizedContacts}</li>`;
    htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('requestsLabel', language)}:</strong> ${tier.supportRequestsIncluded}</li>`;
    htmlBodyContent += `</ul></div>`;

    // Tenant Information Section (HTML) - Moved Up
    htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
    const tenantSectionTitle = this.translate('tenantInfoTitle', language);
    htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: tenantSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
    if (tenants.length > 0) {
        htmlBodyContent += `<p style="${pStyle}">${this.translate('tenantInfoIntro', language)}</p>`; // Added intro text
        tenants.forEach((tenant, index) => {
            const deadline = tenant.implementationDeadline ? tenant.implementationDeadline.toLocaleDateString() : 'N/A';
            const azureStatus = tenant.hasAzure ? this.translate('yes', language) : this.translate('no', language);
            const azureColor = tenant.hasAzure ? '#107c10' : '#d83b01';
            htmlBodyContent += `<div style="background-color: #FFFFFF; border: 1px solid #eee; border-radius: 4px; margin-bottom: 15px; padding: 15px 20px;">`;
            htmlBodyContent += `<strong style="font-weight: 600; color: ${primaryAccentColor}; font-size: 16px; display: block; margin-bottom: 10px;">Tenant ${index + 1}: ${tenant.companyName}</strong>`;
            htmlBodyContent += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">Domain:</strong> ${tenant.tenantDomain || 'N/A'}</p>`;
            htmlBodyContent += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">MS Domain:</strong> ${tenant.microsoftTenantDomain || 'N/A'}</p>`;
            htmlBodyContent += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">Tenant ID:</strong> ${tenant.id || 'N/A'}</p>`;
            htmlBodyContent += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">Deadline:</strong> ${deadline}</p>`;
            htmlBodyContent += `<p style="margin: 5px 0; font-size: 14px; color: ${textColor};"><strong style="font-weight: 600;">Azure RBAC Relevant:</strong> <span style="color: ${azureColor}; font-weight: 600;">${azureStatus}</span></p>`;
            htmlBodyContent += `</div>`;
        });
    } else {
        htmlBodyContent += `<p style="${pStyle}">${this.translate('noTenantInfo', language)}</p>`;
    }

    // Authorized Contacts Section
    if (formData.authorizedContacts.checked) {
         htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
         const contactsSectionTitle = this.translate('authorizedContactsTitle', language);
         htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: contactsSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
         htmlBodyContent += `<p style="${pStyle}">${this.translate('contactsIntro', language, { tier: tier.name, count: tier.authorizedContacts })}</p>`;
         htmlBodyContent += `<p style="${pStyle}">${this.translate('contactsRolesIntro', language, { roles: `<strong style="${strongStyle}">${formData.authorizedContacts.roles}</strong>` })}</p>`;
         htmlBodyContent += `<p style="${pStyle}">${this.translate('contactsInstruction', language)}</p>`;
         htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(ContactsTable, {
             contacts: formData.emailContacts,
             theme: effectiveTheme,
             tierContactLimit: tier.authorizedContacts
         }));
    }

    // Meeting Section (HTML - No changes needed)
    if (formData.meetingDate) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        const meetingSectionTitle = this.translate('meetingTitle', language);
        htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: meetingSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
        htmlBodyContent += `<p style="${pStyle}">${this.translate('meetingIntro', language)}</p>`;
        htmlBodyContent += `<div style="margin: 20px 0; background-color: #FFFFFF; border: 1px solid #eee; border-radius: 4px; padding: 16px 20px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">`;
        htmlBodyContent += `<strong style="${strongStyle}">${this.translate('meetingDate', language, { date: `<span style="color: ${primaryAccentColor};">${formData.meetingDate}</span>` })}</strong>`;
        htmlBodyContent += `</div>`;
        htmlBodyContent += `<p style="margin: 0 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('meetingAttendees', language)}</p>`;
    }

    // GDAP Section (HTML - Adjusted for multiple tenants, removed default link)
    if (tenants.length > 0) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        let gdapHtml = '';
        const specificLinks = tenants.filter(t => t.gdapLink && t.gdapLink.trim() !== '');
        const deadline = tenants[0]?.implementationDeadline ? tenants[0].implementationDeadline.toLocaleDateString() : 'N/A'; // Use first tenant's deadline or N/A
        const gdapSectionTitle = this.translate('gdapTitle', language);

        gdapHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: gdapSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
        gdapHtml += `<p style="${pStyle}">${this.translate('gdapIntro', language, { deadline: deadline, roles: GDAP_ROLE })}</p>`;
        gdapHtml += `<p style="${pStyle}">${this.translate('gdapPermission', language)}</p>`;
        gdapHtml += `<p style="margin: 15px 0 10px 0; font-weight: 600; color: ${textColor};">${this.translate('gdapInstruction', language)}</p>`; // General instruction

        if (specificLinks.length > 0) {
            gdapHtml += `<p style="${pStyle}">${this.translate('gdapSpecificLinkInfo', language)}</p>`; // "Use the specific links provided below:"
            gdapHtml += `<ul style="padding-left: 20px; margin: 10px 0 15px 0;">`;
            specificLinks.forEach(tenant => {
                 gdapHtml += `<li style="${listItemStyle}"><strong style="${strongStyle}">${tenant.companyName}:</strong> <a href="${tenant.gdapLink}" target="_blank" style="color: ${primaryAccentColor}; text-decoration: underline;">${tenant.gdapLink}</a></li>`;
            });
            gdapHtml += `</ul>`;
            if (specificLinks.length < tenants.length) {
                 // If some tenants have links but not all
                 gdapHtml += `<p style="${pStyle}">${this.translate('gdapDefaultLinkInfo', language)}</p>`; // "For other tenants, the link will be sent separately."
            }
        } else {
            // If no tenants have specific links
            gdapHtml += `<p style="${pStyle}">${this.translate('gdapLinksSentSeparately', language)}</p>`; // New translation key: "The necessary GDAP approval link(s) will be sent in a separate communication."
        }
        htmlBodyContent += `<div style="${tenantBlockStyle}">${gdapHtml}</div>`;
    }

    // RBAC Section (HTML - Generates script per relevant tenant)
    const relevantRbacTenants = tenants.filter(t => t.hasAzure);
    if (relevantRbacTenants.length > 0) {
         htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
         let rbacHtml = '';
         const rbacSectionTitle = this.translate('rbacTitle', language);
         rbacHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: rbacSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));

         // Step 1: Install/Update Module (Common instruction)
         rbacHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(StepIndicator, { number: 1, title: this.translate('rbacStep1', language), theme: effectiveTheme }));
         rbacHtml += `<p style="margin: 5px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacStep1Source', language)} <a href="https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0" target="_blank" style="color: ${primaryAccentColor}; text-decoration: underline;">https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0</a></p>`;
         rbacHtml += `<p style="margin: 5px 0 5px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScriptHeader', language)}</p>`;
         rbacHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: 'Install-Module -Name Az -Repository PSGallery -Force', theme: effectiveTheme }))}</div>`;
         rbacHtml += `<p style="margin: 15px 0 5px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">or update it:</p>`;
         rbacHtml += `<p style="margin: 5px 0 5px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScriptHeader', language)}</p>`;
         rbacHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: 'Update-Module Az.Resources -Force', theme: effectiveTheme }))}</div>`;

         // Step 2: Run script per tenant
         rbacHtml += ReactDOMServer.renderToStaticMarkup(React.createElement(StepIndicator, { number: 2, title: this.translate('rbacStep2', language), theme: effectiveTheme }));
         rbacHtml += `<p style="margin: 5px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacStep2InstructionMultiTenant', language)}</p>`; // Instruction updated via translations

         relevantRbacTenants.forEach(tenant => {
            const tenantDomain = tenant.microsoftTenantDomain || '[MS_TENANT_DOMAIN_MISSING]'; // Use MS Domain or placeholder
            const scriptForTenant = RBAC_POWERSHELL_SCRIPT_TEMPLATE.replace('{TENANT_ID}', tenantDomain);
            // Add a sub-header for each script block showing the domain
            rbacHtml += `<h4 style="margin: 20px 0 5px 48px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor}; font-weight: 600;">Script for Tenant: ${tenant.companyName} (Domain: ${tenantDomain})</h4>`;
            rbacHtml += `<p style="margin: 5px 0 5px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScriptHeader', language)}</p>`;
            rbacHtml += `<div style="margin-left: 48px;">${ReactDOMServer.renderToStaticMarkup(React.createElement(ScriptBlock, { scriptContent: scriptForTenant, theme: effectiveTheme }))}</div>`;
         });

         rbacHtml += `<p style="margin: 20px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('rbacScreenshot', language)}</p>`;
         htmlBodyContent += `<div style="${tenantBlockStyle}">${rbacHtml}</div>`;
    }

    // Conditional Access Section
    if (formData.conditionalAccess.checked) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        const caSectionTitle = this.translate('conditionalAccessTitle', language);
        htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: caSectionTitle, color: primaryAccentColor, theme: effectiveTheme }));
        htmlBodyContent += `<p style="${pStyle}">${this.translate('conditionalAccessIntro', language)}</p>`;
        htmlBodyContent += `<div style="margin: 0 0 20px 0; background-color: #FFFFFF; border: 1px solid #eee; border-radius: 4px; padding: 16px 20px;">`;
        htmlBodyContent += `<ul style="margin: 0; padding: 0; list-style: none;">`;
        if (formData.conditionalAccess.mfa) { htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('mfaPolicy', language)}</li>`; }
        if (formData.conditionalAccess.location) { htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('locationPolicy', language)}</li>`; }
        if (formData.conditionalAccess.device) { htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('devicePolicy', language)}</li>`; }
        if (formData.conditionalAccess.signIn) { htmlBodyContent += `<li style="${listItemStyle}"><span style="${bulletStyle}"></span>${this.translate('signInPolicy', language)}</li>`; }
        htmlBodyContent += `</ul></div>`;
    }

    // Additional Notes Section
    if (formData.additionalNotes) {
        htmlBodyContent += `<hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />`;
        const additionalInfoTitle = this.translate('additionalInfoTitle', language);
        htmlBodyContent += ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeader, { title: additionalInfoTitle, color: primaryAccentColor, theme: effectiveTheme }));
        const formattedNotes = formData.additionalNotes.replace(/\n/g, '<br>');
        htmlBodyContent += `<p style="margin: 0 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${formattedNotes}</p>`;
    }

    // Closing and Footer
    htmlBodyContent += `<p style="margin: 30px 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('closing', language)}</p>`;
    htmlBodyContent += `<p style="margin: 0 0 10px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor};">${this.translate('regards', language)}</p>`;
    htmlBodyContent += `<div style="line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: ${textColor}; margin-bottom: 40px;">`;
    htmlBodyContent += `${formData.senderName}<br>`;
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
    <div style="margin-top: 40px; border-top: 1px solid #eee; padding: 20px 0 0 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: ${footerTextColor}; text-align: center; background-color: transparent;">
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

  // processCustomerInfoToEmailData - Updated default subject and sender details
  processCustomerInfoToEmailData: function(info: CustomerInfo, language: string = 'en'): EmailFormData {
    const tier = supportTiers[info.selectedTier];
    const today = new Date();
    const currentDate = today.toLocaleDateString();
    let meetingDateStr;
    if (info.proposedDate instanceof Date && !isNaN(info.proposedDate.getTime())) {
      meetingDateStr = info.proposedDate.toLocaleDateString();
    }
    const formData: Omit<EmailFormData, 'rbac'> = {
      companyName: info.companyName, // This is the client company
      contactName: info.contactName,
      contactEmail: info.contactEmail,
      proposedDate: info.proposedDate,
      // tenantId: info.tenantId, // Removed - tenants are now in CustomerInfo.tenants
      selectedTier: info.selectedTier,
      emailContacts: info.authorizedContacts,
      // Note: EmailFormData still expects a single tenantId. This function might need
      // further refactoring depending on how it's used, or EmailFormData needs updating.
      // For now, providing the first tenant's ID or an empty string if no tenants.
      tenantId: info.tenants && info.tenants.length > 0 ? info.tenants[0].id : '',
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
        checked: true, roles: 'Technical and Administrative contacts' // Default roles
      },
      meetingDate: meetingDateStr,
      additionalNotes: '',
      senderName: 'Your Name', // Default sender details
      senderTitle: 'Support Specialist',
      senderCompany: 'SCHNEIDER IT MANAGEMENT',
      senderContact: 'support@schneider.im',
      currentDate: currentDate,
      language: language
    };
    // Cast needed because Omit doesn't fully satisfy EmailFormData structure if rbac was optional
    return formData as EmailFormData;
  },

  // buildEnhancedEmailHTML - No changes needed, relies on buildEmailHTML
  buildEnhancedEmailHTML: function(formData: EmailFormData, tenants: TenantInfo[] = [], theme: ThemeSettings | null = null): string {
    const { html } = this.buildEmailHTML(formData, tenants, theme);
    return html;
  },

  /**
   * Generates the content for an .eml file.
   */
  generateEmlContent: function(formData: EmailFormData, htmlContent: string, plainTextContent: string): string {
    const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;

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
    emlContent += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n`;
    emlContent += `\r\n`;

    // Plain text part
    emlContent += `--${boundary}\r\n`;
    emlContent += `Content-Type: text/plain; charset=utf-8\r\n`;
    emlContent += `Content-Transfer-Encoding: quoted-printable\r\n`;
    emlContent += `\r\n`;
    emlContent += `${plainTextContent.replace(/=/g, '=3D')}\r\n`; // Basic QP encoding
    emlContent += `\r\n`;

    // HTML part
    emlContent += `--${boundary}\r\n`;
    emlContent += `Content-Type: text/html; charset=utf-8\r\n`;
    emlContent += `Content-Transfer-Encoding: base64\r\n`;
    emlContent += `\r\n`;
    emlContent += `${base64Html}\r\n`;
    emlContent += `\r\n`;

    // End boundary
    emlContent += `--${boundary}--\r\n`;

    return emlContent;
  }
};

export default emailBuilder;
