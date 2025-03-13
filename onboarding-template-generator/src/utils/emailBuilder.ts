// src/utils/emailBuilder.ts
import { supportTiers } from '../data/supportTiers';
import { CustomerInfo } from './templateGenerator';

/**
 * Email Builder Module
 * Handles the creation and formatting of email content
 */
export interface EmailFormData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  proposedDate: Date | string;
  tenantId: string;
  selectedTier: string;
  emailContacts: { name: string; email: string; phone: string }[];
  to: string;
  cc?: string;
  subject?: string;
  gdap: {
    checked: boolean;
    deadline: string;
    roles: string;
    link: string;
  };
  rbac: {
    checked: boolean;
    groups: string;
    tenantId: string;
    azure: boolean;
    m365: boolean;
    includeScript: boolean;
  };
  conditionalAccess: {
    checked: boolean;
    mfa: boolean;
    location: boolean;
    device: boolean;
    signIn: boolean;
  };
  authorizedContacts: {
    checked: boolean;
    roles: string;
  };
  meetingDate?: string;
  additionalNotes?: string;
  senderName: string;
  senderTitle: string;
  senderCompany: string;
  senderContact?: string;
  currentDate: string;
}

export const emailBuilder = {
  /**
   * Build the plain text version of the email body
   * @param {EmailFormData} formData - The form data from the UI
   * @returns {String} - Plain text email content
   */
  buildEmailBody: function(formData: EmailFormData): string {
    // Get the selected tier
    const tier = supportTiers[formData.selectedTier];
    
    let body = `Dear ${formData.contactName},\n\n`;
    body += `Thank you for choosing ${formData.senderCompany} as your Microsoft 365 administration partner. We are excited to begin the onboarding process for ${formData.companyName}.\n\n`;
    
    // Add introduction
    body += `Below is important information regarding your selected ${tier.name} Support Plan, administrative access, and security configurations we need to set up for your Microsoft 365 environment. Please review this information carefully and let us know if you have any questions.\n\n`;
    
    // Support Plan Section
    body += `**${tier.name.toUpperCase()} SUPPORT PLAN DETAILS**\n`;
    body += this.getSupportPlanText(formData.selectedTier);
    body += `\n\n`;
    
    // Authorized Contacts Section
    if (formData.authorizedContacts.checked) {
      body += `**AUTHORIZED CONTACTS**\n`;
      body += `Based on your ${tier.name} Support Plan, you can designate up to ${tier.authorizedContacts} authorized contacts for your organization. These contacts will be authorized to submit support requests and approve administrative changes to your Microsoft 365 environment.\n\n`;
      body += `We recommend designating individuals for the following roles: ${formData.authorizedContacts.roles}.\n\n`;
      body += `Please complete the following Authorized Contacts information:\n\n`;
      
      // Contact table in plain text
      body += `AUTHORIZED CONTACTS TABLE:\n`;
      body += `-----------------------------------------------------------------------------------\n`;
      body += `# | First Name | Last Name | Office Phone | Mobile Phone | Email | IM | Job Title\n`;
      body += `-----------------------------------------------------------------------------------\n`;
      
      // Add a limited number of rows to the plain text version
      const rows = Math.min(tier.authorizedContacts, 10);
      for (let i = 1; i <= rows; i++) {
        body += `${i} | | | | | | | \n`;
      }
      body += `-----------------------------------------------------------------------------------\n\n`;
      
      if (tier.authorizedContacts > 10) {
        body += `Note: Your plan includes ${tier.authorizedContacts} authorized contacts. Additional contacts can be added after initial setup.\n\n`;
      }
    }
    
    // Meeting Section
    if (formData.meetingDate) {
      body += `**ONBOARDING MEETING**\n`;
      body += `We have scheduled an onboarding meeting on ${formData.meetingDate} to discuss these items in detail and answer any questions you may have. Please ensure the appropriate team members can attend this meeting.\n\n`;
    }
    
    // GDAP Section
    if (formData.gdap.checked) {
      body += `**GRANULAR DELEGATION OF ADMINISTRATIVE PRIVILEGES (GDAP)**\n`;
      body += `Microsoft now requires partners to use GDAP for secure administrative access. We need to implement this by ${formData.gdap.deadline}. We will request the "${formData.gdap.roles}" role.\n`;
      body += `This permission will allow us to provide the support services outlined in our agreement while maintaining security best practices.\n\n`;
      body += `Please visit the following link to approve the GDAP relationship: ${formData.gdap.link}\n\n`;
    }
    
    // RBAC Section
    if (formData.rbac.checked) {
      body += `**ROLE-BASED ACCESS CONTROL (RBAC)**\n`;
      body += `We will configure ${formData.rbac.groups} to ensure users have the appropriate level of access to your environment based on their job functions. `;
      
      if (formData.rbac.azure && formData.rbac.m365) {
        body += `This includes both Azure and Microsoft 365 access permissions.`;
      } else if (formData.rbac.azure) {
        body += `This includes Azure resources access permissions.`;
      } else if (formData.rbac.m365) {
        body += `This includes Microsoft 365 service access permissions.`;
      }
      
      body += `\n\n`;
      
      if (formData.rbac.includeScript) {
        body += `Please run the following PowerShell script to configure RBAC permissions:\n\n`;
        body += `-------------------------------------------------------------\n`;
        body += `STEP 1: Install Azure PowerShell\n`;
        body += `Source: https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0\n\n`;
        body += `Install-Module -Name Az -Repository PSGallery -Force\n\n`;
        body += `or update it:\n\n`;
        body += `Update-Module Az.Resources -Force\n\n`;
        body += `STEP 2: Update the tenant and run the following script as one block:\n\n`;
        body += `# Connect to the correct tenant\n`;
        body += `Connect-AzAccount -TenantID ${formData.rbac.tenantId}\n\n`;
        body += `$subscriptions = Get-AzSubscription\n`;
        body += `foreach ($subscription in $subscriptions) {\n`;
        body += `    Set-AzContext -SubscriptionId $subscription.Id \n`;
        body += `    # Add the Support Request Contributor role to Foreign Principal HelpDeskAgents:\n`;
        body += `    New-AzRoleAssignment -ObjectID b6770181-d9f5-4818-b5b1-ea51cd9f66e5 -RoleDefinitionName "Support Request Contributor" -ObjectType "ForeignGroup" -ErrorAction SilentlyContinue \n`;
        body += `    # Test if the Support Request Contributor role is assigned to Foreign Principal HelpDeskAgents:\n`;
        body += `    $supportRole = Get-AzRoleAssignment -ObjectId b6770181-d9f5-4818-b5b1-ea51cd9f66e5 | Where-Object { $_.RoleDefinitionName -eq "Support Request Contributor" } \n`;
        body += `    if ($supportRole) {\n`;
        body += `        Write-Host "Support Request Contributor role is assigned to Foreign Principal HelpDeskAgents." \n`;
        body += `        # Test if the Owner role for the Foreign Principal AdminAgents exists:\n`;
        body += `        $ownerRole = Get-AzRoleAssignment -ObjectId 9a838974-22d3-415b-8136-c790e285afeb | Where-Object { $_.RoleDefinitionName -eq "Owner" } \n`;
        body += `        if ($ownerRole) {\n`;
        body += `            # If the Owner role for Foreign Principal AdminAgents exists, remove it:\n`;
        body += `            Remove-AzRoleAssignment -ObjectID 9a838974-22d3-415b-8136-c790e285afeb -RoleDefinitionName "Owner"\n`;
        body += `        } else {\n`;
        body += `            Write-Host "Owner role for Foreign Principal AdminAgents does not exist."\n`;
        body += `        }\n`;
        body += `    } else {\n`;
        body += `        Write-Host "Error: Could not assign Support Request Contributor role for Foreign Principal HelpDeskAgents!"\n`;
        body += `    }\n`;
        body += `}\n`;
        body += `-------------------------------------------------------------\n\n`;
        body += `Please send us a screenshot of the result of the above script or let us know if you prefer to schedule a Teams meeting to complete this configuration together.\n\n`;
      }
    }
    
    // Conditional Access Section
    if (formData.conditionalAccess.checked) {
      body += `**CONDITIONAL ACCESS POLICIES**\n`;
      body += `We recommend implementing the following security policies for your environment:\n`;
      
      if (formData.conditionalAccess.mfa) {
        body += `- Multi-Factor Authentication (MFA) requirements for all users\n`;
      }
      if (formData.conditionalAccess.location) {
        body += `- Location-based access restrictions\n`;
      }
      if (formData.conditionalAccess.device) {
        body += `- Device compliance policies to ensure only secure devices can access your data\n`;
      }
      if (formData.conditionalAccess.signIn) {
        body += `- Sign-in risk-based policies to prevent suspicious login attempts\n`;
      }
      
      body += `\n`;
    }
    
    // Additional Notes Section
    if (formData.additionalNotes) {
      body += `**ADDITIONAL INFORMATION**\n`;
      body += `${formData.additionalNotes}\n\n`;
    }
    
    // Closing
    body += `Please reply to this email to confirm receipt and let us know if you have any questions or concerns.\n\n`;
    body += `Best regards,\n\n`;
    body += `${formData.senderName}\n`;
    body += `${formData.senderTitle}\n`;
    body += `${formData.senderCompany}\n`;
    
    if (formData.senderContact) {
      body += `${formData.senderContact}\n`;
    }
    
    return body;
  },
  
  /**
   * Get text description for the selected support plan
   */
  getSupportPlanText: function(planType: string): string {
    switch(planType) {
      case 'bronze':
        return `The Bronze Support Plan provides basic support availability for non-urgent cases for cloud products, with no Critical Situation coverage. It includes:
- Microsoft Flexible Support
- 8×5 Support Hours
- Level B or C Severity
- 2 Customer Contacts
- 1 Tenant
- Pay As You Go support requests`;
          
      case 'silver':
        return `The Silver Support Plan provides full product coverage with Critical Situation Support, ideal for organizations with occasional support requests. It includes:
- Microsoft Premier Support
- 24×7×365 Support Hours
- Level A, B or C Severity
- 6 Customer Contacts
- 2 Tenants
- 12 Support Requests Included per trailing 12-month period`;
          
      case 'gold':
        return `The Gold Support Plan is our most popular option, providing three times the included cases and tenants compared to Silver, with double the customer contacts. It's well-suited for complex organizational structures. It includes:
- Microsoft Premier Support
- 24×7×365 Support Hours
- Level A, B or C Severity
- 12 Customer Contacts
- 6 Tenants
- 36 Support Requests Included per trailing 12-month period`;
          
      case 'platinum':
        return `The Platinum Support Plan is ideal for very complex organizational structures with the highest number of tenants, contacts, and support requests. It includes:
- Microsoft Premier Support
- 24×7×365 Support Hours
- Level A, B or C Severity
- 100 Customer Contacts
- 100 Tenants
- 100 Support Requests Included per trailing 12-month period`;
          
      default:
        return '';
    }
  },
  
  /**
   * Build HTML version of the email
   * @param {EmailFormData} formData - The form data from the UI
   * @returns {String} - HTML formatted email content
   */
  buildEmailHTML: function(formData: EmailFormData): string {
    // Get the selected tier
    const tier = supportTiers[formData.selectedTier];
    
    // Get tier color
    let tierColor = '';
    switch(formData.selectedTier) {
      case 'bronze': tierColor = '#cd7f32'; break;
      case 'silver': tierColor = '#C0C0C0'; break;
      case 'gold': tierColor = '#FFD700'; break;
      case 'platinum': tierColor = '#E5E4E2'; break;
    }

    // Generate subject if not provided
    const subject = formData.subject || `${tier.name} Support Plan Onboarding for ${formData.companyName} - Microsoft 365 Administration Setup`;
    
    let htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${subject}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 20px auto; padding: 20px; }
        .header { border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
        .footer { margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
        .bold { font-weight: bold; }
        h1 { color: #333; }
        h2 { color: #0078d4; margin-top: 25px; }
        .company { font-weight: bold; }
        .support-plans { color: #c00000; }
        table.contact-table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        table.contact-table th, table.contact-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        table.contact-table th { background-color: #f5f5f5; }
        .code-block { background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 15px; font-family: 'Courier New', monospace; white-space: pre-wrap; overflow-x: auto; font-size: 14px; line-height: 1.4; margin: 15px 0; }
        .plan-header { padding: 10px; color: white; text-align: center; }
        .bronze { background-color: #cd7f32; }
        .silver { background-color: #C0C0C0; }
        .gold { background-color: #FFD700; }
        .platinum { background-color: #E5E4E2; }
        .step-title { font-weight: bold; margin-top: 15px; margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="company">${formData.senderCompany.toUpperCase()}</span> <span class="support-plans">Support Plans</span></h1>
            <div><span class="bold">To:</span> ${formData.to}</div>
            ${formData.cc ? `<div><span class="bold">Cc:</span> ${formData.cc}</div>` : ''}
            <div><span class="bold">Subject:</span> ${subject}</div>
            <div><span class="bold">Date:</span> ${formData.currentDate}</div>
        </div>
        
        <div class="content">
            <p>Dear ${formData.contactName},</p>
            
            <p>Thank you for choosing ${formData.senderCompany} as your Microsoft 365 administration partner. We are excited to begin the onboarding process for ${formData.companyName}.</p>
            
            <p>Below is important information regarding your selected ${tier.name} Support Plan, administrative access, and security configurations we need to set up for your Microsoft 365 environment. Please review this information carefully and let us know if you have any questions.</p>`;
        
    // Support Plan Section
    htmlContent += `
        <div class="plan-header ${formData.selectedTier}">
            <h2>${tier.name.toUpperCase()} SUPPORT PLAN DETAILS</h2>
        </div>
        <p>${this.getSupportPlanTextHTML(formData.selectedTier)}</p>`;
    
    // Authorized Contacts Section
    if (formData.authorizedContacts.checked) {
        htmlContent += `
        <h2>AUTHORIZED CONTACTS</h2>
        <p>Based on your ${tier.name} Support Plan, you can designate up to ${tier.authorizedContacts} authorized contacts for your organization. These contacts will be authorized to submit support requests and approve administrative changes to your Microsoft 365 environment.</p>
        <p>We recommend designating individuals for the following roles: ${formData.authorizedContacts.roles}.</p>
        <p>Please complete the following table with the required information for each contact:</p>`;
        
        // Create contact tables based on plan type
        htmlContent += this.buildContactTableHTML(tier.authorizedContacts);
    }
    
    // Meeting Section
    if (formData.meetingDate) {
        htmlContent += `
        <h2>ONBOARDING MEETING</h2>
        <p>We have scheduled an onboarding meeting on ${formData.meetingDate} to discuss these items in detail and answer any questions you may have. Please ensure the appropriate team members can attend this meeting.</p>`;
    }
    
    // GDAP Section
    if (formData.gdap.checked) {
        htmlContent += `
        <h2>GRANULAR DELEGATION OF ADMINISTRATIVE PRIVILEGES (GDAP)</h2>
        <p>Microsoft now requires partners to use GDAP for secure administrative access. We need to implement this by ${formData.gdap.deadline}. We will request the "${formData.gdap.roles}" role.</p>
        <p>This permission will allow us to provide the support services outlined in our agreement while maintaining security best practices.</p>
        <p>Please visit the following link to approve the GDAP relationship: <a href="${formData.gdap.link}" target="_blank">${formData.gdap.link}</a></p>`;
    }
    
    // RBAC Section
    if (formData.rbac.checked) {
        let permissionText = '';
        if (formData.rbac.azure && formData.rbac.m365) {
            permissionText = 'This includes both Azure and Microsoft 365 access permissions.';
        } else if (formData.rbac.azure) {
            permissionText = 'This includes Azure resources access permissions.';
        } else if (formData.rbac.m365) {
            permissionText = 'This includes Microsoft 365 service access permissions.';
        }
        
        htmlContent += `
        <h2>ROLE-BASED ACCESS CONTROL (RBAC)</h2>
        <p>We will configure ${formData.rbac.groups} to ensure users have the appropriate level of access to your environment based on their job functions. ${permissionText}</p>`;
        
        if (formData.rbac.includeScript) {
            htmlContent += `
            <p>Please run the following PowerShell script to configure RBAC permissions:</p>
            
            <div class="step-title">STEP 1: Install Azure PowerShell</div>
            <p>Source: <a href="https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0" target="_blank">https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.6.0</a></p>
            <div class="code-block">Install-Module -Name Az -Repository PSGallery -Force</div>
            <p>or update it:</p>
            <div class="code-block">Update-Module Az.Resources -Force</div>
            
            <div class="step-title">STEP 2: Update the tenant and run the following script as one block:</div>
            <div class="code-block"># Connect to the correct tenant
Connect-AzAccount -TenantID ${formData.rbac.tenantId}

$subscriptions = Get-AzSubscription
foreach ($subscription in $subscriptions) {
    Set-AzContext -SubscriptionId $subscription.Id 
    # Add the Support Request Contributor role to Foreign Principal HelpDeskAgents:
    New-AzRoleAssignment -ObjectID b6770181-d9f5-4818-b5b1-ea51cd9f66e5 -RoleDefinitionName "Support Request Contributor" -ObjectType "ForeignGroup" -ErrorAction SilentlyContinue 
    # Test if the Support Request Contributor role is assigned to Foreign Principal HelpDeskAgents:
    $supportRole = Get-AzRoleAssignment -ObjectId b6770181-d9f5-4818-b5b1-ea51cd9f66e5 | Where-Object { $_.RoleDefinitionName -eq "Support Request Contributor" } 
    if ($supportRole) {
        Write-Host "Support Request Contributor role is assigned to Foreign Principal HelpDeskAgents." 
        # Test if the Owner role for the Foreign Principal AdminAgents exists:
        $ownerRole = Get-AzRoleAssignment -ObjectId 9a838974-22d3-415b-8136-c790e285afeb | Where-Object { $_.RoleDefinitionName -eq "Owner" } 
        if ($ownerRole) {
            # If the Owner role for Foreign Principal AdminAgents exists, remove it:
            Remove-AzRoleAssignment -ObjectID 9a838974-22d3-415b-8136-c790e285afeb -RoleDefinitionName "Owner"
        } else {
            Write-Host "Owner role for Foreign Principal AdminAgents does not exist."
        }
    } else {
        Write-Host "Error: Could not assign Support Request Contributor role for Foreign Principal HelpDeskAgents!"
    }
}</div>
            <p>Please send us a screenshot of the result of the above script or let us know if you prefer to schedule a Teams meeting to complete this configuration together.</p>`;
        }
    }
    
    // Conditional Access Section
    if (formData.conditionalAccess.checked) {
        htmlContent += `
        <h2>CONDITIONAL ACCESS POLICIES</h2>
        <p>We recommend implementing the following security policies for your environment:</p>
        <ul>`;
        
        if (formData.conditionalAccess.mfa) {
            htmlContent += `
            <li>Multi-Factor Authentication (MFA) requirements for all users</li>`;
        }
        if (formData.conditionalAccess.location) {
            htmlContent += `
            <li>Location-based access restrictions</li>`;
        }
        if (formData.conditionalAccess.device) {
            htmlContent += `
            <li>Device compliance policies to ensure only secure devices can access your data</li>`;
        }
        if (formData.conditionalAccess.signIn) {
            htmlContent += `
            <li>Sign-in risk-based policies to prevent suspicious login attempts</li>`;
        }
        
        htmlContent += `
        </ul>`;
    }
    
    // Additional Notes Section
    if (formData.additionalNotes) {
        htmlContent += `
        <h2>ADDITIONAL INFORMATION</h2>
        <p>${formData.additionalNotes.replace(/\n/g, '<br>')}</p>`;
    }
    
    // Closing
    htmlContent += `
        <p>Please reply to this email to confirm receipt and let us know if you have any questions or concerns.</p>
        
        <div class="footer">
            <p>Best regards,</p>
            <p>${formData.senderName}<br>
            ${formData.senderTitle}<br>
            ${formData.senderCompany}<br>
            ${formData.senderContact || ''}</p>
        </div>
    </div>
</div>
</body>
</html>`;
    
    return htmlContent;
  },
  
  /**
   * Get HTML formatted text description for the selected support plan
   */
  getSupportPlanTextHTML: function(planType: string): string {
    switch(planType) {
      case 'bronze':
        return `The Bronze Support Plan provides basic support availability for non-urgent cases for cloud products, with no Critical Situation coverage. It includes:<br><br>
<ul>
  <li>Microsoft Flexible Support</li>
  <li>8×5 Support Hours</li>
  <li>Level B or C Severity</li>
  <li>2 Customer Contacts</li>
  <li>1 Tenant</li>
  <li>Pay As You Go support requests</li>
</ul>`;
          
      case 'silver':
        return `The Silver Support Plan provides full product coverage with Critical Situation Support, ideal for organizations with occasional support requests. It includes:<br><br>
<ul>
  <li>Microsoft Premier Support</li>
  <li>24×7×365 Support Hours</li>
  <li>Level A, B or C Severity</li>
  <li>6 Customer Contacts</li>
  <li>2 Tenants</li>
  <li>12 Support Requests Included per trailing 12-month period</li>
</ul>`;
          
      case 'gold':
        return `The Gold Support Plan is our most popular option, providing three times the included cases and tenants compared to Silver, with double the customer contacts. It's well-suited for complex organizational structures. It includes:<br><br>
<ul>
  <li>Microsoft Premier Support</li>
  <li>24×7×365 Support Hours</li>
  <li>Level A, B or C Severity</li>
  <li>12 Customer Contacts</li>
  <li>6 Tenants</li>
  <li>36 Support Requests Included per trailing 12-month period</li>
</ul>`;
          
      case 'platinum':
        return `The Platinum Support Plan is ideal for very complex organizational structures with the highest number of tenants, contacts, and support requests. It includes:<br><br>
<ul>
  <li>Microsoft Premier Support</li>
  <li>24×7×365 Support Hours</li>
  <li>Level A, B or C Severity</li>
  <li>100 Customer Contacts</li>
  <li>100 Tenants</li>
  <li>100 Support Requests Included per trailing 12-month period</li>
</ul>`;
          
      default:
        return '';
    }
  },
  
  /**
   * Build HTML contact table for authorized contacts
   */
  buildContactTableHTML: function(numContacts: number): string {
    // Limit the number of rows to display in the HTML to a reasonable number
    const displayContacts = Math.min(numContacts, 20);
    
    let tableHTML = `
<table class="contact-table">
  <tr>
    <th>#</th>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Office Phone</th>
    <th>Mobile Phone</th>
    <th>Email Address</th>
    <th>IM Address (Teams)</th>
    <th>Job Title</th>
  </tr>`;
    
    for (let i = 1; i <= displayContacts; i++) {
      tableHTML += `
  <tr>
    <td>${i}</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>`;
    }
    
    tableHTML += `
</table>`;
    
    if (numContacts > displayContacts) {
      tableHTML += `<p><em>Note: Your ${numContacts} authorized contacts can be managed through our customer portal after onboarding.</em></p>`;
    }
    
    return tableHTML;
  },
  
  /**
   * Process form data into a structured email object
   */
  processCustomerInfoToEmailData: function(info: CustomerInfo): EmailFormData {
    const tier = supportTiers[info.selectedTier];
    
    // Handle date calculation safely
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);
    
    // Format today's date
    const currentDate = today.toLocaleDateString();
    
    // Format meeting date if it exists
    let meetingDateStr;
    if (info.proposedDate instanceof Date && !isNaN(info.proposedDate.getTime())) {
      meetingDateStr = info.proposedDate.toLocaleDateString();
    }
    
    const formData: EmailFormData = {
      companyName: info.companyName,
      contactName: info.contactName,
      contactEmail: info.contactEmail,
      proposedDate: info.proposedDate,
      tenantId: info.tenantId,
      selectedTier: info.selectedTier,
      emailContacts: info.authorizedContacts,
      to: info.contactEmail || '',
      cc: '',
      subject: `${tier.name} Support Plan Onboarding for ${info.companyName} - Microsoft 365 Administration Setup`,
      gdap: {
        checked: true,
        deadline: futureDate.toLocaleDateString(),
        roles: "Service Support Administrator",
        link: "https://partner.microsoft.com/dashboard/commerce/granularadmin"
      },
      rbac: {
        checked: true,
        groups: 'appropriate security groups',
        tenantId: info.tenantId || '[your-tenant-id]',
        azure: true,
        m365: true,
        includeScript: true
      },
      conditionalAccess: {
        checked: true,
        mfa: true,
        location: true,
        device: true,
        signIn: true
      },
      authorizedContacts: {
        checked: true,
        roles: 'Technical and Administrative contacts'
      },
      meetingDate: meetingDateStr,
      additionalNotes: '',
      senderName: 'Your Name',
      senderTitle: 'Support Specialist',
      senderCompany: 'Microsoft Partner Support',
      senderContact: 'support@microsoftpartner.com',
      currentDate: currentDate
    };
    
    return formData;
  }
};

export default emailBuilder;