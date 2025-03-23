// src/features/emailBuilder/utils/templateGenerator.ts
import { supportTiers } from '../../supportTiers/constants';
import { CustomerInfo } from '../types';

// Helper functions for email formatting
const formatScriptBlock = (scriptContent: string): string => {
  // Clean up the script content
  const cleanedScript = scriptContent.trim()
    .replace(/\t/g, '    ') // Replace tabs with spaces for consistency
    .replace(/^\s*\n/gm, ''); // Remove empty lines
  
  // Create a table-based code block that works better in email clients
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

const createContactsTable = (contacts: Array<{name: string, email: string, phone: string}>): string => {
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

export const generateTemplate = (info: CustomerInfo): string => {
  const tier = supportTiers[info.selectedTier];
  
  // Format date if valid
  const formattedDate = info.proposedDate instanceof Date && !isNaN(info.proposedDate.getTime()) 
    ? info.proposedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '[DATE TO BE CONFIRMED]';
  
  // Create Outlook-optimized template
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
    <!-- Header -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 0;">
          <h2 style="color: ${tier.color}; border-bottom: 1px solid ${tier.color}; padding-bottom: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 24px; margin: 0 0 15px 0;">Microsoft Support Onboarding - ${tier.name}</h2>
        </td>
      </tr>
    </table>
    
    <!-- Greeting -->
    <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Dear ${info.contactName},</p>
    
    <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Thank you for choosing Microsoft Premier Support. We would like to schedule an onboarding session to explain our support request process and modalities for your <strong style="font-weight: 600;">${tier.name}</strong> plan.</p>
    
    <p style="margin: 0 0 20px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">I propose we meet on <strong style="font-weight: 600;">${formattedDate}</strong> to discuss the following onboarding steps:</p>
    
    <!-- Support Tier Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 0;">
          <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">1. Support Tier Selection</h3>
          <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">You have selected the <strong style="font-weight: 600;">${tier.name}</strong> plan which includes:</p>
          
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin: 10px 0 15px 0;">
            <tr>
              <td style="padding: 0 0 0 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Support Hours: ${tier.supportHours}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Authorized Contacts: ${tier.authorizedContacts}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Tenants: ${tier.tenants}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Support Requests: ${tier.supportRequestsIncluded}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-family: 'Segoe UI', Arial, sans-serif;">• Critical Situation Support: 
                      ${tier.criticalSituation 
                        ? '<span style="color: #107c10; font-weight: 600;">Yes</span>' 
                        : '<span style="color: #d83b01; font-weight: 600;">No</span>'}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Authorized Contacts Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 0;">
          <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">2. Authorized Customer Contacts</h3>
          <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Please confirm the following list of contacts authorized to open support requests:</p>
          
          ${createContactsTable(info.authorizedContacts)}
        </td>
      </tr>
    </table>
    
    <!-- Tenant ID Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 0;">
          <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">3. Tenant Microsoft ID Definition</h3>
          <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Your Microsoft Tenant ID: <strong style="font-weight: 600;">${info.tenantId || '<span style="color: #d83b01; font-style: italic;">[PLEASE PROVIDE]</span>'}</strong></p>
        </td>
      </tr>
    </table>
    
    <!-- GDAP Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 0;">
          <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">4. GDAP Link Acceptance</h3>
          <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Please accept the GDAP (Granular Delegated Admin Privileges) link that will be sent to your admin email address. This step is required to enable our support team to access your environment when needed.</p>
        </td>
      </tr>
    </table>
    
    <!-- RBAC Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 0;">
          <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">5. RBAC Role Establishment</h3>
          <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">We will provide a script to establish the necessary RBAC (Role-Based Access Control) roles for your support plan. Please execute the following PowerShell script in your environment:</p>
          
          ${formatScriptBlock(`# Connect to Azure with your tenant ID
Connect-AzAccount -Tenant "${info.tenantId || 'YOUR_TENANT_ID'}"

# Get all available subscriptions
$subscriptions = Get-AzSubscription

# Loop through each subscription
foreach ($subscription in $subscriptions) {
    # Set the current context to this subscription
    Set-AzContext -SubscriptionId $subscription.Id 
    
    # Add the Support Request Contributor role to Foreign Principal HelpDeskAgents
    New-AzRoleAssignment -ObjectID "b6770181-d9f5-4818-b5b1-ea51cd9f66e5" -RoleDefinitionName "Support Request Contributor" -ObjectType "ForeignGroup" -ErrorAction SilentlyContinue 
    
    # Test if the Support Request Contributor role is assigned to Foreign Principal HelpDeskAgents
    $supportRole = Get-AzRoleAssignment -ObjectId "b6770181-d9f5-4818-b5b1-ea51cd9f66e5" | Where-Object { $_.RoleDefinitionName -eq "Support Request Contributor" } 
    
    if ($supportRole) {
        Write-Host "Support Request Contributor role is assigned to Foreign Principal HelpDeskAgents." 
        
        # Test if the Owner role for the Foreign Principal AdminAgents exists
        $ownerRole = Get-AzRoleAssignment -ObjectId "9a838974-22d3-415b-8136-c790e285afeb" | Where-Object { $_.RoleDefinitionName -eq "Owner" } 
        
        if ($ownerRole) {
            # If the Owner role for Foreign Principal AdminAgents exists, remove it
            Remove-AzRoleAssignment -ObjectID "9a838974-22d3-415b-8136-c790e285afeb" -RoleDefinitionName "Owner"
        } else {
            Write-Host "Owner role for Foreign Principal AdminAgents does not exist."
        }
    } else {
        Write-Host "Error: Could not assign Support Request Contributor role for Foreign Principal HelpDeskAgents!"
    }
}`)}
        </td>
      </tr>
    </table>
    
    <!-- Service Provider Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px;">
      <tr>
        <td style="padding: 0;">
          <h3 style="color: ${tier.color}; font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">6. Service Provider Acceptance</h3>
          <p style="margin: 0 0 15px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Finally, please add Microsoft Support as a service provider in your conditional access policy to ensure seamless integration with your security protocols.</p>
        </td>
      </tr>
    </table>
    
    <!-- Closing -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 30px;">
      <tr>
        <td style="padding: 0;">
          <p style="margin: 0 0 10px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">Looking forward to our meeting and to supporting your organization.</p>
          
          <p style="margin: 20px 0 5px 0; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">
            Best regards,<br>
            <em style="font-style: italic;">Microsoft Support Team</em><br>
            <a href="mailto:support@microsoft.com" style="color: #0078D4; text-decoration: none;">support@microsoft.com</a>
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Footer -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-top: 30px; border-top: 1px solid #ddd;">
      <tr>
        <td style="padding: 10px 0 0 0;">
          <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.5; font-family: 'Segoe UI', Arial, sans-serif;">This is an automated message generated by the Microsoft Onboarding Template Generator.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
};

export default {
  generateTemplate
};