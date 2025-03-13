// src/utils/templateGenerator.ts
import { supportTiers } from '../data/supportTiers';

export interface CustomerInfo {
  companyName: string;
  contactName: string;
  contactEmail: string;
  proposedDate: Date;
  tenantId: string;
  authorizedContacts: Array<{name: string, email: string, phone: string}>;
  selectedTier: string;
}

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
  
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 800px;">
      <h2 style="color: ${tier.color}; border-bottom: 1px solid ${tier.color}; padding-bottom: 10px;">Microsoft Support Onboarding - ${tier.name}</h2>
      
      <p>Dear ${info.contactName},</p>
      
      <p>Thank you for choosing Microsoft Premier Support. We would like to schedule an onboarding session to explain our support request process and modalities for your <strong>${tier.name}</strong> plan.</p>
      
      <p>I propose we meet on <strong>${formattedDate}</strong> to discuss the following onboarding steps:</p>
      
      <h3 style="color: ${tier.color};">1. Support Tier Selection</h3>
      <p>You have selected the <strong>${tier.name}</strong> plan which includes:</p>
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Support Hours: ${tier.supportHours}</li>
        <li>Authorized Contacts: ${tier.authorizedContacts}</li>
        <li>Tenants: ${tier.tenants}</li>
        <li>Support Requests: ${tier.supportRequestsIncluded}</li>
        ${tier.criticalSituation 
          ? '<li>Critical Situation Support: <span style="color: green;">Yes</span></li>' 
          : '<li>Critical Situation Support: <span style="color: red;">No</span></li>'}
      </ul>
      
      <h3 style="color: ${tier.color};">2. Authorized Customer Contacts</h3>
      <p>Please confirm the following list of contacts authorized to open support requests:</p>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tr style="background-color: ${tier.color}30;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Phone</th>
        </tr>
        ${info.authorizedContacts.map((contact, index) => `
          <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'};">
            <td style="border: 1px solid #ddd; padding: 8px;">${contact.name || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${contact.email || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${contact.phone || ''}</td>
          </tr>
        `).join('')}
      </table>
      
      <h3 style="color: ${tier.color};">3. Tenant Microsoft ID Definition</h3>
      <p>Your Microsoft Tenant ID: <strong>${info.tenantId || '<span style="color: red; font-style: italic;">[PLEASE PROVIDE]</span>'}</strong></p>
      
      <h3 style="color: ${tier.color};">4. GDAP Link Acceptance</h3>
      <p>Please accept the GDAP (Granular Delegated Admin Privileges) link that will be sent to your admin email address. This step is required to enable our support team to access your environment when needed.</p>
      
      <h3 style="color: ${tier.color};">5. RBAC Role Establishment</h3>
      <p>We will provide a script to establish the necessary RBAC (Role-Based Access Control) roles for your support plan. Please execute the following PowerShell script in your environment:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-family: Consolas, Monaco, 'Courier New', monospace; margin-bottom: 20px; white-space: pre-wrap; font-size: 14px;">
# Example PowerShell script to be executed
Connect-AzAccount -Tenant "${info.tenantId || 'YOUR_TENANT_ID'}"
New-AzRoleAssignment -SignInName "support@microsoft.com" -RoleDefinitionName "Support Request Contributor"
      </div>
      
      <h3 style="color: ${tier.color};">6. Service Provider Acceptance</h3>
      <p>Finally, please add Microsoft Support as a service provider in your conditional access policy to ensure seamless integration with your security protocols.</p>
      
      <p style="margin-top: 30px;">Looking forward to our meeting and to supporting your organization.</p>
      
      <p style="margin-top: 20px;">
        Best regards,<br>
        <em>Microsoft Support Team</em><br>
        <a href="mailto:support@microsoft.com" style="color: #0078D4; text-decoration: none;">support@microsoft.com</a>
      </p>
      
      <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 12px; color: #666;">
        <p>This is an automated message generated by the Microsoft Onboarding Template Generator.</p>
      </div>
    </div>
  `;
};