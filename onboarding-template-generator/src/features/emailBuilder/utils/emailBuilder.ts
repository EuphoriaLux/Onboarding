// src/features/emailBuilder/utils/emailBuilder.ts - Fix import
import { supportTiers } from '../../supportTiers/constants';
import { CustomerInfo, EmailFormData, Language } from './types';
import { TenantInfo } from '../../tenants/types'; // Import TenantInfo
import { getTranslation } from './translationService';
import {
  createSectionHeader,
  createInstructionBox,
  createStepIndicator,
  createContactsTable,
  formatScriptBlock,
  formatImprovedScriptBlock,
  createImprovedSectionHeader,
  createImprovedContactsTable
} from './components';

/**
 * Email Builder Module
 * Handles the creation and formatting of email content with multilingual support
 */
const emailBuilder = {
  // Expose the component functions to make them available
  components: {
    createContactsTable,
    createImprovedContactsTable,
    formatScriptBlock,
    formatImprovedScriptBlock,
    createSectionHeader,
    createImprovedSectionHeader,
    createInstructionBox,
    createStepIndicator
  },

  /**
   * Convenience method to access translations
   */
  translate: getTranslation,

  /**
   * Build the plain text version of the email body
   *
   * @param formData - The form data from the UI
   * @param tenants - Array of tenant information
   * @returns Plain text email content
   */
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
    body += `• ${this.translate('supportTypeLabel', language)} ${formData.selectedTier === 'bronze' ? 'Microsoft Flexible Support' : 'Microsoft Premier Support'}\n`;
    body += `• ${this.translate('supportHoursLabel', language)} ${tier.supportHours}\n`;
    body += `• ${this.translate('severityLevelsLabel', language)} ${formData.selectedTier === 'bronze' ? 'Level B or C' : 'Level A, B or C'}\n`;
    body += `• ${this.translate('contactsLabel', language)} ${tier.authorizedContacts}\n`;
    body += `• ${this.translate('tenantsLabel', language)} ${tier.tenants}\n`;
    body += `• ${this.translate('requestsLabel', language)} ${tier.supportRequestsIncluded}\n`;
    body += `• ${this.translate('criticalLabel', language)} ${tier.criticalSituation ? this.translate('yes', language) : this.translate('no', language)}\n\n`;

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

    // --- Tenant Specific Sections ---
    tenants.forEach((tenant, index) => {
      const tenantIdentifier = tenant.tenantDomain || `Tenant ${index + 1}`;
      let gdapSection = '';
      let rbacSection = '';

      // GDAP Link & Deadline Section (Per Tenant)
      const tenantGdapLink = tenant.gdapLink || defaultGdapLink;
      const gdapSectionTitle = `${this.translate('gdapTitle', language)} - ${tenantIdentifier}`;
      gdapSection += `**${gdapSectionTitle}**\n\n`;
      gdapSection += this.translate('gdapPermission', language) + '\n\n';
      gdapSection += this.translate('gdapInstruction', language) + '\n';
      gdapSection += tenantGdapLink + '\n\n';
      if (tenant.implementationDeadline) {
        gdapSection += `*${this.translate('implementationDeadlineLabel', language, { defaultValue: 'Implementation Deadline' })}: ${tenant.implementationDeadline.toLocaleDateString()}*\n\n`;
      }

      // RBAC Section (Per Tenant, if hasAzure is true)
      if (tenant.hasAzure) {
        const rbacSectionTitle = `${this.translate('rbacTitle', language)} - ${tenantIdentifier}`;
        rbacSection += `**${rbacSectionTitle}**\n\n`;
        rbacSection += this.translate('rbacIntro', language, { groups: 'relevant security groups' }) + ' ';
        rbacSection += this.translate('rbacPermissionAzure', language) + '\n\n';

        if (tenant.includeRbacScript) {
          rbacSection += this.translate('rbacInstruction', language) + '\n\n';
          rbacSection += `1. ${this.translate('rbacStep1', language)}\n`;
          rbacSection += `   ${this.translate('rbacStep1Source', language)} https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0\n\n`;
          rbacSection += `   Install-Module -Name Az -Repository PSGallery -Force\n\n`;
          rbacSection += `   or update it:\n\n`;
          rbacSection += `   Update-Module Az.Resources -Force\n\n`;
          rbacSection += `2. ${this.translate('rbacStep2', language)}\n`;
          rbacSection += `   ${this.translate('rbacStep2Instruction', language)}\n\n`;

          // Use tenant.microsoftTenantDomain for -Tenant parameter
          const rbacScript = `# Connect to the correct tenant using the Microsoft domain
Connect-AzAccount -Tenant "${tenant.microsoftTenantDomain}" # Using tenant-specific MS Domain

Write-Host "Operating on Tenant: ${tenant.microsoftTenantDomain}" # Removed ID display

$subscriptions = Get-AzSubscription
if ($subscriptions.Count -eq 0) {
    Write-Warning "No subscriptions found for tenant ${tenant.microsoftTenantDomain}. Skipping RBAC assignments."
} else {
    foreach ($subscription in $subscriptions) {
        Write-Host "Processing Subscription: $($subscription.Name) ($($subscription.Id))"
        Set-AzContext -SubscriptionId $subscription.Id -ErrorAction SilentlyContinue
        if (!$?) { Write-Warning "Could not set context for subscription $($subscription.Id). Skipping."; continue }

        # Add the Support Request Contributor role to Foreign Principal HelpDeskAgents:
        Write-Host "Assigning 'Support Request Contributor' role..."
        New-AzRoleAssignment -ObjectID b6770181-d9f5-4818-b5b1-ea51cd9f66e5 -RoleDefinitionName "Support Request Contributor" -ObjectType "ForeignGroup" -Scope "/subscriptions/$($subscription.Id)" -ErrorAction SilentlyContinue 
        
        # Test if the Support Request Contributor role is assigned
        $supportRole = Get-AzRoleAssignment -ObjectId b6770181-d9f5-4818-b5b1-ea51cd9f66e5 -Scope "/subscriptions/$($subscription.Id)" | Where-Object { $_.RoleDefinitionName -eq "Support Request Contributor" } 
        if ($supportRole) {
            Write-Host "Successfully assigned 'Support Request Contributor' role." 
            
            # Test if the Owner role for the Foreign Principal AdminAgents exists:
            Write-Host "Checking for 'Owner' role for AdminAgents..."
            $ownerRole = Get-AzRoleAssignment -ObjectId 9a838974-22d3-415b-8136-c790e285afeb -Scope "/subscriptions/$($subscription.Id)" | Where-Object { $_.RoleDefinitionName -eq "Owner" } 
            if ($ownerRole) {
                # If the Owner role exists, remove it:
                Write-Host "Removing 'Owner' role for AdminAgents..."
                Remove-AzRoleAssignment -ObjectID 9a838974-22d3-415b-8136-c790e285afeb -RoleDefinitionName "Owner" -Scope "/subscriptions/$($subscription.Id)" -ErrorAction SilentlyContinue -Force
                if ($?) { Write-Host "Successfully removed 'Owner' role." } else { Write-Warning "Failed to remove 'Owner' role." }
            } else {
                Write-Host "'Owner' role for AdminAgents does not exist."
            }
        } else {
            Write-Warning "Error: Could not assign 'Support Request Contributor' role!"
        }
        Write-Host "---"
    }
}`;
          rbacSection += rbacScript + '\n\n';
          rbacSection += this.translate('rbacScreenshot', language) + '\n\n';
        }
      }

      // Add sections to body if they have content, separated by divider
      if (gdapSection.trim() || rbacSection.trim()) {
          body += `\n---\n`; // Separator before tenant block
          if (gdapSection.trim()) {
              body += gdapSection;
          }
          if (rbacSection.trim()) {
              // Add extra newline if both sections are present
              if (gdapSection.trim()) { body += '\n'; } 
              body += rbacSection;
          }
          body += "---\n"; // Separator after tenant block
      }
    });
    // --- End Tenant Specific Sections ---

    // Conditional Access Section (Remains Global for now)
    if (formData.conditionalAccess.checked) {
      body += `**${this.translate('conditionalAccessTitle', language)}**\n\n`;
      body += this.translate('conditionalAccessIntro', language) + '\n\n';
      if (formData.conditionalAccess.mfa) { body += `• ${this.translate('mfaPolicy', language)}\n`; }
      if (formData.conditionalAccess.location) { body += `• ${this.translate('locationPolicy', language)}\n`; }
      if (formData.conditionalAccess.device) { body += `• ${this.translate('devicePolicy', language)}\n`; }
      if (formData.conditionalAccess.signIn) { body += `• ${this.translate('signInPolicy', language)}\n`; }
      body += '\n';
    }

    // Additional Notes Section
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

    return body;
  },

  /**
   * Build HTML version of the email with improved clarity and instructions
   *
   * @param formData - The form data from the UI
   * @param tenants - Array of tenant information
   * @returns HTML formatted email content
   */
  buildEmailHTML: function(formData: EmailFormData, tenants: TenantInfo[] = []): string {
    const tier = supportTiers[formData.selectedTier];
    const language = (formData.language || 'en') as Language;
    const defaultGdapLink = "https://partner.microsoft.com/dashboard/commerce/granularadmin";

    let tierColor = '';
    switch(formData.selectedTier) {
      case 'bronze': tierColor = '#cd7f32'; break;
      case 'silver': tierColor = '#C0C0C0'; break;
      case 'gold': tierColor = '#FFD700'; break;
      case 'platinum': tierColor = '#E5E4E2'; break;
    }

    const subject = formData.subject || this.translate('subject', language, {
      tier: tier.name,
      company: formData.companyName
    });

    // Define common styles for Outlook compatibility
    const bodyStyle = "margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;";
    const containerStyle = "max-width: 800px; margin: 0 auto; padding: 20px;";
    const pStyle = "margin: 0 0 15px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;";
    const tableStyle = "border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"; // For Outlook
    const sectionHeaderStyle = `padding: 14px 18px; text-align: center; font-family: 'Segoe UI', Arial, sans-serif; color: white; font-size: 18px; font-weight: 600;`;
    const sectionBoxStyle = `border-collapse: collapse; margin: 15px 0 25px 0; border: 1px solid #eee; border-radius: 4px;`;
    const sectionBoxCellStyle = `padding: 18px 20px;`;
    const listItemStyle = `padding: 8px 0; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6;`;
    const bulletStyle = `display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${tierColor}; margin-right: 10px; vertical-align: middle;`; // Added vertical-align
    const strongStyle = `font-weight: 600; color: #333;`;
    const linkButtonStyle = `display: inline-block; padding: 10px 24px; background-color: #0078D4; color: white; text-decoration: none; font-weight: 600; border-radius: 4px; margin-top: 5px;`;
    const deadlineHighlightStyle = `margin: 15px 0 0 0; text-align: center; font-size: 14px; background-color: #fff4ce; padding: 5px 10px; border-radius: 4px; display: inline-block;`; // Yellow background
    const deadlineStrongStyle = `font-weight: 600; color: #333;`; // Changed deadline text color for better contrast on yellow
    const tenantBlockStyle = `background-color: #f8f8f8; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px;`; // Style for tenant blocks
    const tenantBlockCellStyle = `padding: 20px;`;

    let htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${subject}</title>
    <!--[if mso]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <style type="text/css">
      table {${tableStyle}}
      h1, h2, h3, h4, h5, h6, p, div, span {font-family: 'Segoe UI', Arial, sans-serif;}
      .mso-text-raise-4 {mso-text-raise: 4pt;}
      .mso-text-raise-7 {mso-text-raise: 7pt;}
      /* Add specific Outlook fixes if needed */
    </style>
    <![endif]-->
</head>
<body style="${bodyStyle}">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} background-color: #ffffff;"><tr><td> <!-- Email Wrapper Table -->
    <div style="${containerStyle}">
        <!-- Email Header -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin-bottom: 30px; border-bottom: 1px solid #eee;">
            <tr>
                <td style="padding: 0 0 20px 0;">
                    <h1 style="margin: 0; padding: 0; font-size: 24px; font-weight: 700; color: #333; font-family: 'Segoe UI', Arial, sans-serif;">
                        <span style="font-weight: bold; color: #0078D4;">${formData.senderCompany.toUpperCase()}</span>
                        <span style="color: #333;">| ${tier.name} ${this.translate('supportPlanTitle', language, { tier: '' }).trim()}</span>
                    </h1>
                </td>
            </tr>
            <tr><td style="padding: 0 0 5px 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;"><strong style="${strongStyle}">To:</strong> ${formData.to}</td></tr>
            ${formData.cc ? `<tr><td style="padding: 0 0 5px 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;"><strong style="${strongStyle}">Cc:</strong> ${formData.cc}</td></tr>` : ''}
            <tr><td style="padding: 0 0 5px 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;"><strong style="${strongStyle}">Subject:</strong> ${subject}</td></tr>
            <tr><td style="padding: 0 0 5px 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;"><strong style="${strongStyle}">Date:</strong> ${formData.currentDate}</td></tr>
        </table>

        <!-- Email Body -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle}">
            <tr>
                <td style="padding: 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px;">
                    <p style="${pStyle}">${this.translate('greeting', language, { name: formData.contactName })}</p>
                    <p style="${pStyle}">${this.translate('intro1', language, { company: formData.senderCompany, clientCompany: formData.companyName })}</p>
                    <p style="margin: 0 0 25px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('intro2', language, { tier: tier.name })}</p>`;

    // Support Plan Section
    htmlContent += `<!-- Support Plan Section -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin-bottom: 5px; background-color: ${tierColor}; border-radius: 4px;"><tr><td style="${sectionHeaderStyle}">${this.translate('supportPlanTitle', language, { tier: tier.name.toUpperCase() })}</h2></td></tr></table>
                    <p style="margin: 25px 0 15px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('supportPlanIntro', language, { tier: tier.name, supportType: formData.selectedTier === 'bronze' ? this.translate('supportType.bronze', language) : this.translate('supportType.other', language) })}</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${sectionBoxStyle}"><tr><td style="${sectionBoxCellStyle}"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle}">
                    <tr><td style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportTypeLabel', language)}</strong> ${formData.selectedTier === 'bronze' ? 'Microsoft Flexible Support' : 'Microsoft Premier Support'}</td></tr>
                    <tr><td style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('supportHoursLabel', language)}</strong> ${tier.supportHours}</td></tr>
                    <tr><td style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('severityLevelsLabel', language)}</strong> ${formData.selectedTier === 'bronze' ? 'Level B or C' : 'Level A, B or C'}</td></tr>
                    <tr><td style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('contactsLabel', language)}</strong> ${tier.authorizedContacts}</td></tr>
                    <tr><td style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('tenantsLabel', language)}</strong> ${tier.tenants}</td></tr>
                    <tr><td style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('requestsLabel', language)}</strong> ${tier.supportRequestsIncluded}</td></tr>
                    <tr><td style="${listItemStyle}"><span style="${bulletStyle}"></span><strong style="${strongStyle}">${this.translate('criticalLabel', language)}</strong> ${tier.criticalSituation ? '<span style="color: #107c10; font-weight: 600;">' + this.translate('yes', language) + '</span>' : '<span style="color: #d83b01; font-weight: 600;">' + this.translate('no', language) + '</span>'}</td></tr>
                    </table></td></tr></table>`;

    // Authorized Contacts Section
    if (formData.authorizedContacts.checked) {
        const contactsSectionTitle = this.translate('authorizedContactsTitle', language);
        htmlContent += createSectionHeader(contactsSectionTitle, tierColor);
        htmlContent += `<p style="${pStyle}">${this.translate('contactsIntro', language, { tier: tier.name, count: tier.authorizedContacts })}</p>
                       <p style="${pStyle}">${this.translate('contactsRolesIntro', language, { roles: `<strong style="${strongStyle}">${formData.authorizedContacts.roles}</strong>` })}</p>
                       <p style="${pStyle}">${this.translate('contactsInstruction', language)}</p>
                       ${createContactsTable(tier.authorizedContacts, language)}`;
    }

    // Meeting Section
    if (formData.meetingDate) {
        const meetingSectionTitle = this.translate('meetingTitle', language);
        htmlContent += createSectionHeader(meetingSectionTitle, tierColor);
        htmlContent += `<p style="${pStyle}">${this.translate('meetingIntro', language)}</p>
                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin: 20px 0; background-color: #f8f8f8; border: 1px solid #eee; border-radius: 4px;"><tr><td style="padding: 16px 20px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;"><strong style="${strongStyle}">${this.translate('meetingDate', language, { date: `<span style="color: #0078D4;">${formData.meetingDate}</span>` })}</strong></td></tr></table>
                       <p style="margin: 0 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('meetingAttendees', language)}</p>`;
    }

    // --- Tenant Specific Sections ---
    if (tenants.length > 0) {
        htmlContent += `<tr><td style="padding-top: 15px;"><!-- Tenant Sections Start -->`;
        tenants.forEach((tenant, index) => {
            const tenantIdentifier = tenant.tenantDomain || `Tenant ${index + 1}`;

            // --- GDAP Section Block ---
            let gdapHtml = '';
            const tenantGdapLink = tenant.gdapLink || defaultGdapLink;
            const gdapSectionTitle = `${this.translate('gdapTitle', language)} - ${tenantIdentifier}`;
            gdapHtml += createSectionHeader(gdapSectionTitle, tierColor);
            gdapHtml += `<p style="${pStyle}">${this.translate('gdapPermission', language)}</p>
                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin: 20px 0;"><tr><td style="padding: 16px 20px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; text-align: center;">
                         <p style="margin: 0 0 10px 0; font-weight: 600; color: #333;">${this.translate('gdapInstruction', language)}</p>
                         <a href="${tenantGdapLink}" target="_blank" style="${linkButtonStyle}">${this.translate('gdapLink', language)}</a>`;
            if (tenant.implementationDeadline) {
                gdapHtml += `<br/><span style="${deadlineHighlightStyle}"><strong style="${deadlineStrongStyle}">${this.translate('implementationDeadlineLabel', language, { defaultValue: 'Implementation Deadline' })}:</strong> ${tenant.implementationDeadline.toLocaleDateString()}</span>`;
            }
            gdapHtml += `</td></tr></table>`;
            // Wrap GDAP in its grey block
            htmlContent += `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} ${tenantBlockStyle}"><tr><td style="${tenantBlockCellStyle}">${gdapHtml}</td></tr></table>`;


            // --- RBAC Section Block (if applicable) ---
            if (tenant.hasAzure) {
                let rbacHtml = '';
                const rbacSectionTitle = `${this.translate('rbacTitle', language)} - ${tenantIdentifier}`;
                rbacHtml += createSectionHeader(rbacSectionTitle, tierColor);
                rbacHtml += `<p style="${pStyle}">${this.translate('rbacIntro', language, { groups: 'relevant security groups' })} ${this.translate('rbacPermissionAzure', language)}</p>`;

                if (tenant.includeRbacScript) {
                    rbacHtml += `<p style="margin: 15px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; font-weight: 600; color: #333;">${this.translate('rbacInstruction', language)}</p>`;
                    rbacHtml += createStepIndicator(1, this.translate('rbacStep1', language));
                    rbacHtml += `<p style="margin: 5px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('rbacStep1Source', language)} <a href="https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0" target="_blank" style="color: #0078D4; text-decoration: underline;">https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0</a></p>`;
                    rbacHtml += `<div style="margin-left: 48px;">${formatScriptBlock('Install-Module -Name Az -Repository PSGallery -Force', language)}</div>`;
                    rbacHtml += `<p style="margin: 15px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">or update it:</p>`;
                    rbacHtml += `<div style="margin-left: 48px;">${formatScriptBlock('Update-Module Az.Resources -Force', language)}</div>`;
                    rbacHtml += createStepIndicator(2, this.translate('rbacStep2', language));
                    rbacHtml += `<p style="margin: 5px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('rbacStep2Instruction', language)}</p>`;

                    // Use tenant.microsoftTenantDomain for -Tenant parameter
                    const rbacScript = `# Connect to the correct tenant using the Microsoft domain
Connect-AzAccount -Tenant "${tenant.microsoftTenantDomain}" # Using tenant-specific MS Domain

Write-Host "Operating on Tenant: ${tenant.microsoftTenantDomain}"

$subscriptions = Get-AzSubscription
if ($subscriptions.Count -eq 0) {
    Write-Warning "No subscriptions found for tenant ${tenant.microsoftTenantDomain}. Skipping RBAC assignments."
} else {
    foreach ($subscription in $subscriptions) {
        Write-Host "Processing Subscription: $($subscription.Name) ($($subscription.Id))"
        Set-AzContext -SubscriptionId $subscription.Id -ErrorAction SilentlyContinue
        if (!$?) { Write-Warning "Could not set context for subscription $($subscription.Id). Skipping."; continue }

        # Add the Support Request Contributor role to Foreign Principal HelpDeskAgents:
        Write-Host "Assigning 'Support Request Contributor' role..."
        New-AzRoleAssignment -ObjectID b6770181-d9f5-4818-b5b1-ea51cd9f66e5 -RoleDefinitionName "Support Request Contributor" -ObjectType "ForeignGroup" -Scope "/subscriptions/$($subscription.Id)" -ErrorAction SilentlyContinue 
        
        # Test if the Support Request Contributor role is assigned
        $supportRole = Get-AzRoleAssignment -ObjectId b6770181-d9f5-4818-b5b1-ea51cd9f66e5 -Scope "/subscriptions/$($subscription.Id)" | Where-Object { $_.RoleDefinitionName -eq "Support Request Contributor" } 
        if ($supportRole) {
            Write-Host "Successfully assigned 'Support Request Contributor' role." 
            
            # Test if the Owner role for the Foreign Principal AdminAgents exists:
            Write-Host "Checking for 'Owner' role for AdminAgents..."
            $ownerRole = Get-AzRoleAssignment -ObjectId 9a838974-22d3-415b-8136-c790e285afeb -Scope "/subscriptions/$($subscription.Id)" | Where-Object { $_.RoleDefinitionName -eq "Owner" } 
            if ($ownerRole) {
                # If the Owner role exists, remove it:
                Write-Host "Removing 'Owner' role for AdminAgents..."
                Remove-AzRoleAssignment -ObjectID 9a838974-22d3-415b-8136-c790e285afeb -RoleDefinitionName "Owner" -Scope "/subscriptions/$($subscription.Id)" -ErrorAction SilentlyContinue -Force
                if ($?) { Write-Host "Successfully removed 'Owner' role." } else { Write-Warning "Failed to remove 'Owner' role." }
            } else {
                Write-Host "'Owner' role for AdminAgents does not exist."
            }
        } else {
            Write-Warning "Error: Could not assign 'Support Request Contributor' role!"
        }
        Write-Host "---"
    }
}`;
                    rbacHtml += `<div style="margin-left: 48px;">${formatScriptBlock(rbacScript, language)}</div>`;
                    rbacHtml += `<p style="margin: 20px 0 15px 48px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: #333;">${this.translate('rbacScreenshot', language)}</p>`;
                }
                 // Wrap RBAC in its grey block
                htmlContent += `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} ${tenantBlockStyle}"><tr><td style="${tenantBlockCellStyle}">${rbacHtml}</td></tr></table>`;
            }
        });
        htmlContent += `</td></tr><!-- Tenant Sections End -->`;
    }
    // --- End Tenant Specific Sections ---

    // Conditional Access Section (Remains Global)
    if (formData.conditionalAccess.checked) {
        const caSectionTitle = this.translate('conditionalAccessTitle', language);
        htmlContent += createSectionHeader(caSectionTitle, tierColor);
        htmlContent += `<p style="${pStyle}">${this.translate('conditionalAccessIntro', language)}</p>
                       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin: 0 0 20px 0; background-color: #f8f8f8; border: 1px solid #eee; border-radius: 4px;"><tr><td style="padding: 16px 20px;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle}">`;
        if (formData.conditionalAccess.mfa) { htmlContent += `<tr><td style="${listItemStyle} display: flex; align-items: flex-start;"><span style="display: inline-block; min-width: 8px; height: 8px; border-radius: 50%; background-color: #0078D4; margin-right: 10px; margin-top: 7px;"></span><span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('mfaPolicy', language)}</span></td></tr>`; }
        if (formData.conditionalAccess.location) { htmlContent += `<tr><td style="${listItemStyle} display: flex; align-items: flex-start;"><span style="display: inline-block; min-width: 8px; height: 8px; border-radius: 50%; background-color: #0078D4; margin-right: 10px; margin-top: 7px;"></span><span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('locationPolicy', language)}</span></td></tr>`; }
        if (formData.conditionalAccess.device) { htmlContent += `<tr><td style="${listItemStyle} display: flex; align-items: flex-start;"><span style="display: inline-block; min-width: 8px; height: 8px; border-radius: 50%; background-color: #0078D4; margin-right: 10px; margin-top: 7px;"></span><span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('devicePolicy', language)}</span></td></tr>`; }
        if (formData.conditionalAccess.signIn) { htmlContent += `<tr><td style="${listItemStyle} display: flex; align-items: flex-start;"><span style="display: inline-block; min-width: 8px; height: 8px; border-radius: 50%; background-color: #0078D4; margin-right: 10px; margin-top: 7px;"></span><span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('signInPolicy', language)}</span></td></tr>`; }
        htmlContent += `</table></td></tr></table>`;
    }

    // Additional Notes Section
    if (formData.additionalNotes) {
        const additionalInfoTitle = this.translate('additionalInfoTitle', language);
        htmlContent += createSectionHeader(additionalInfoTitle, tierColor);
        const formattedNotes = formData.additionalNotes.replace(/\n/g, '<br>');
        htmlContent += `<p style="margin: 0 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${formattedNotes}</p>`;
    }

    // Closing and Footer
    htmlContent += `<p style="margin: 30px 0 20px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('closing', language)}</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin-top: 40px;"><tr><td style="padding: 0;"><p style="margin: 0 0 10px 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;">${this.translate('regards', language)}</p><p style="margin: 0; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px;"><strong style="${strongStyle}">${formData.senderName}</strong><br>${formData.senderTitle}<br>${formData.senderCompany}<br>${formData.senderContact || ''}</p></td></tr></table>
                </td>
            </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${tableStyle} margin-top: 40px; border-top: 1px solid #eee;"><tr><td style="padding: 20px 0 0 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #666; text-align: center;"><p style="margin: 0; line-height: 1.5;">${this.translate('footer', language)}</p></td></tr></table>
    </div>
    </td></tr></table> <!-- Email Wrapper Table End -->
</body>
</html>`;

    return htmlContent;
  },

  /**
   * Get HTML formatted text description for the selected support plan
   */
  getSupportPlanTextHTML: function(planType: string, language: Language = 'en'): string {
    // ... (Implementation remains the same) ...
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

  /**
   * Process form data into a structured email object
   */
  processCustomerInfoToEmailData: function(info: CustomerInfo, language: string = 'en'): EmailFormData {
    const tier = supportTiers[info.selectedTier];

    const today = new Date();
    const currentDate = today.toLocaleDateString();

    let meetingDateStr;
    if (info.proposedDate instanceof Date && !isNaN(info.proposedDate.getTime())) {
      meetingDateStr = info.proposedDate.toLocaleDateString();
    }

    // Construct the base formData without GDAP and RBAC
    const formData: Omit<EmailFormData, 'rbac'> = { // Use Omit to reflect removed properties
      companyName: info.companyName,
      contactName: info.contactName,
      contactEmail: info.contactEmail,
      proposedDate: info.proposedDate,
      tenantId: info.tenantId, // This might be less relevant now if RBAC is per-tenant
      selectedTier: info.selectedTier,
      emailContacts: info.authorizedContacts,
      to: info.contactEmail || '',
      cc: '',
      subject: this.translate('subject', language as Language, {
        tier: tier.name,
        company: info.companyName
      }),
      // Removed gdap property
      // Removed rbac property
      conditionalAccess: { // Keep conditional access as global for now
        checked: true,
        mfa: true,
        location: true,
        device: true,
        signIn: true
      },
      authorizedContacts: { // Keep authorized contacts as global for now
        checked: true,
        roles: 'Technical and Administrative contacts'
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

    // Cast back to EmailFormData if necessary, although it's now missing properties
    // It might be better to adjust the EmailFormData type further if RBAC is truly gone
    return formData as EmailFormData;
  },

  // The enhanced email version - needs to accept tenants too
  buildEnhancedEmailHTML: function(formData: EmailFormData, tenants: TenantInfo[] = []): string {
    // ... (Implementation remains the same) ...
    return this.buildEmailHTML(formData, tenants); // Temporarily return standard HTML version
  }
};

export default emailBuilder;