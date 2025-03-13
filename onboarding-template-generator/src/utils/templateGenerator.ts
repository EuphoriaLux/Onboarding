// utils/templateGenerator.ts
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
    
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <h2 style="color: ${tier.color};">Microsoft Support Onboarding - ${tier.name}</h2>
        
        <p>Dear ${info.contactName},</p>
        
        <p>Thank you for choosing Microsoft Premier Support. We would like to schedule an onboarding session to explain our support request process and modalities for your ${tier.name} plan.</p>
        
        <p>I propose we meet on <strong>${info.proposedDate.toLocaleDateString()}</strong> to discuss the following onboarding steps:</p>
        
        <h3>1. Support Tier Selection</h3>
        <p>You have selected the <strong>${tier.name}</strong> plan which includes:</p>
        <ul>
          <li>Support Hours: ${tier.supportHours}</li>
          <li>Authorized Contacts: ${tier.authorizedContacts}</li>
          <li>Tenants: ${tier.tenants}</li>
          <li>Support Requests: ${tier.supportRequestsIncluded}</li>
          ${tier.criticalSituation ? '<li>Critical Situation Support: Yes</li>' : '<li>Critical Situation Support: No</li>'}
        </ul>
        
        <h3>2. Authorized Customer Contacts</h3>
        <p>Please complete the following list with contacts authorized to open support requests:</p>
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
          ${info.authorizedContacts.map(contact => `
            <tr>
              <td>${contact.name}</td>
              <td>${contact.email}</td>
              <td>${contact.phone}</td>
            </tr>
          `).join('')}
        </table>
        
        <h3>3. Tenant Microsoft ID Definition</h3>
        <p>Your Microsoft Tenant ID: ${info.tenantId || '<span style="color: red;">[PLEASE PROVIDE]</span>'}</p>
        
        <h3>4. GDAP Link Acceptance</h3>
        <p>Please accept the GDAP (Granular Delegated Admin Privileges) link that will be sent to your admin email address.</p>
        
        <h3>5. RBAC Role Establishment</h3>
        <p>We will provide a script to establish the necessary RBAC (Role-Based Access Control) roles for your support plan.</p>
        <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
  # Example PowerShell script to be executed
  Connect-AzAccount -Tenant "${info.tenantId || 'YOUR_TENANT_ID'}"
  New-AzRoleAssignment -SignInName "support@microsoft.com" -RoleDefinitionName "Support Request Contributor"
        </pre>
        
        <h3>6. Service Provider Acceptance</h3>
        <p>Finally, please add Microsoft Support as a service provider in your conditional access policy.</p>
        
        <p>Looking forward to our meeting and to supporting your organization.</p>
        
        <p>Best regards,<br>[Your Support Representative]</p>
      </div>
    `;
  };