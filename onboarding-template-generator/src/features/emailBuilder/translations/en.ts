// src/features/emailBuilder/translations/en.ts
import { Translations } from '../utils/types';

/**
 * English translations for the email template
 */
const translations: Translations = {
  // Email general
  'subject': '{clientCompany} - Microsoft - Support Services - {tier} Support Plan - Onboarding', // Updated Subject
  'greeting': 'Hello {name},', // Updated Greeting
  'intro1': 'Thank you for choosing {company} Microsoft Support Services.', // Updated Intro 1
  'intro2': 'Please find below the steps of the onboarding process of the {tier} Support Plan. Please review each section carefully and follow the instructions to set up the access configurations.', // Updated Intro 2
  'closing': 'Please reply to this email to confirm receipt and let us know if you have any questions or concerns.', // Kept closing
  'regards': 'Best regards,', // Kept regards
  'footer': 'SCHNEIDER IT MANAGEMENT | support@schneider.im', // Updated Footer

  // Section titles
  'supportPlanTitle': '{tier} Support Plan', // Updated Support Plan Title
  'authorizedContactsTitle': 'ACTION REQUIRED: AUTHORIZED CONTACTS', // Kept Contacts Title
  'tenantTitle': 'ACTION REQUIRED: TENANT INFORMATION', // Kept Tenant Title (though not used in new template)
  'gdapTitle': 'ACTION REQUIRED: Granular Delegated Admin Privileges (GDAP)', // Updated GDAP Title
  'rbacTitle': 'ACTION REQUIRED: Role-Based Access Control (RBAC)', // Updated RBAC Title
  'conditionalAccessTitle': 'RECOMMENDED: CONDITIONAL ACCESS POLICIES', // Kept Conditional Access Title
  'meetingTitle': 'SCHEDULED: ONBOARDING MEETING', // Kept Meeting Title (though not used in new template)
  'additionalInfoTitle': 'ADDITIONAL INFORMATION', // Kept Additional Info Title (though not used in new template)

  // Support plan section
  'supportPlanIntro': 'The {tier} Support Plan provides comprehensive support with the following features:', // Updated Support Plan Intro
  // Removed 'supportType.bronze', 'supportType.other', 'supportTypeLabel'
  'supportProviderLabel': 'Support provided by', // Added
  'productsCoveredLabel': 'Products covered', // Added
  'supportHoursLabel': 'Support Hours', // Kept (text only)
  'severityLevelsLabel': 'Microsoft Severity Levels', // Updated Severity Label
  'criticalLabel': 'Critical Situation (Crit Sit) Management', // Updated Critical Label
  'supportRequestSubmissionLabel': 'Support Request Submission', // Added
  'contactsLabel': 'Authorized Customer Contacts', // Updated Contacts Label
  'tenantsLabel': 'Tenants', // Kept (text only)
  'requestsLabel': 'Support Requests Included per trailing 12-month period', // Updated Requests Label
  'yes': 'Yes', // Kept
  'no': 'No', // Kept

  // Contacts section
  'contactsIntro': 'Based on your {tier} Support Plan, you can designate up to {count} authorized contacts for your organization. These contacts will be authorized to submit support requests and approve administrative changes to your Microsoft environment.', // Updated Contacts Intro
  'contactsRolesIntro': 'We recommend designating individuals for the following roles: {roles}.', // Kept Contacts Roles Intro
  'contactsInstruction': 'Please complete the following table with the required information for each contact:', // Kept Contacts Instruction
  // Removed 'contactsNote'

  // Table headers
  'numberHeader': '#', // Kept
  'firstNameHeader': 'First Name',
  'lastNameHeader': 'Last Name', // Kept
  'officePhoneHeader': 'Office Phone', // Kept
  'mobilePhoneHeader': 'Mobile Phone', // Kept
  'emailHeader': 'Email Address', // Kept
  'jobTitleHeader': 'Job Title', // Kept

  // Meeting section (Kept for potential future use, though not in new template)
  'meetingIntro': 'We have scheduled an onboarding meeting to discuss these items in detail and answer any questions you may have:',
  'meetingDate': 'Date: {date}',
  'meetingAttendees': 'Please ensure the appropriate team members can attend this meeting.',

  // GDAP section
  'gdapIntro': 'Microsoft recommends to use Granular Delegated Admin Privileges (GDAP) for secure administrative access. We need to implement this by {deadline}. We require the "{roles}" role.', // Updated GDAP Intro, incorporated roles
  // Removed 'gdapRoles'
  'gdapPermission': 'This permission will allow us to provide the support services outlined in our agreement while maintaining security best practices based on the Principle Of Least Privilege (POLP).', // Updated GDAP Permission text
  'gdapInstruction': 'Please visit the following link to approve the GDAP relationship:', // Kept GDAP Instruction
  'gdapLink': 'GDAP Approval Link', // Kept GDAP Link text

  // RBAC section
  // Removed 'rbacIntro', 'rbacPermissionBoth', 'rbacPermissionAzure', 'rbacPermission365'
  'rbacInstruction': 'Please complete the following steps to configure RBAC permissions:', // Kept RBAC Instruction
  'rbacStep1': 'STEP 1: Install Azure PowerShell', // Kept Step 1 Title
  'rbacStep1Source': 'Source:', // Kept Step 1 Source Label
  'rbacStep2': 'STEP 2: Update the tenant and run the following script', // Kept Step 2 Title
  'rbacStep2Instruction': 'Copy and paste this complete script into your PowerShell console', // Kept Step 2 Instruction
  'rbacScriptHeader': 'PowerShell Script (Copy and paste into PowerShell console)', // Kept Script Header
  'rbacScreenshot': 'Please send us a screenshot of the result of the above script or let us know if you prefer to schedule a Teams meeting to complete this configuration together.', // Kept Screenshot text

  // Conditional Access section
  'conditionalAccessIntro': 'We recommend implementing the following security policies for your environment:', // Kept CA Intro
  'mfaPolicy': 'Multi-Factor Authentication (MFA) requirements for all users',
  'locationPolicy': 'Location-based access restrictions',
  'devicePolicy': 'Device compliance policies to ensure only secure devices can access your data',
  'signInPolicy': 'Sign-in risk-based policies to prevent suspicious login attempts',

  // Added for multi-tenant support
  'tenantInfoTitle': 'TENANT INFORMATION',
  'tenantInfoIntro': 'Please review the details for the tenant(s) included in this onboarding:',
  'noTenantInfo': '[NO TENANT INFORMATION PROVIDED]',
  'gdapSpecificLinkInfo': 'For tenants where a specific GDAP link was provided, please use that link. The links are listed below:',
  'gdapDefaultLinkInfo': 'For other tenants without a specific link listed, the necessary GDAP approval link will be sent separately.', // Updated text
  'rbacInstructionMultiTenant': 'For tenants where Azure RBAC configuration is relevant (indicated in the Tenant Information section), please complete the following steps.', // Simplified instruction
  'rbacRelevantTenantsList': 'Relevant Tenants requiring RBAC configuration:', // Kept as is, list is still relevant
  'rbacStep2InstructionMultiTenant': 'Run the appropriate pre-filled PowerShell script provided below for each relevant tenant listed in the Tenant Information section.', // Updated instruction reflecting pre-filled scripts
  'gdapLinksSentSeparately': 'The necessary GDAP approval link(s) will be sent in a separate communication.'
};

export default translations;
