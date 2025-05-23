export interface CustomerNote {
  timestamp: string; // ISO 8601 date string
  text: string;
  author?: string; // Optional: Track who added the note
}

export type SubscriptionStatus = 'Active' | 'Inactive' | 'Trial';

export interface Tenant {
  id: string;
  name: string;
  microsoftTenantId: string;
  customerId?: string; // Made optional
  subscriptionStatus?: SubscriptionStatus;
  gdap?: boolean; // New: GDAP checkbox
  rbac?: boolean; // New: RBAC checkbox
  createdAt: string;
}

export interface AuthorizedContact {
  id: string;
  customerId: string;
  fullName: string; // Renamed from 'name'
  firstName?: string; // New: First Name
  lastName?: string; // Renamed from 'familyName' to Last Name
  email: string;
  businessPhone?: string; // New: Business Phone
  mobileNumber?: string; // Renamed from 'phone' to Mobile Number
  teamsAddress?: string; // New: Teams Address
  createdAt: string;
  jobTitle?: string;
}

export interface Customer {
  id: string; // Unique identifier (e.g., UUID)
  name: string; // Primary/Official Customer Name
  internalName?: string; // Optional internal name/alias
  email?: string; // Optional
  phone?: string; // Optional
  company?: string; // Optional
  status?: string; // e.g., 'Lead', 'Active', 'Inactive', 'Prospect'
  parentId?: string; // Optional ID of the parent customer/company
  notes: CustomerNote[];
  contacts?: AuthorizedContact[]; // Updated to use AuthorizedContact
  // Removed tenants array from Customer, as they will be top-level
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  onboardingStatus?: OnboardingStatus;
  _etag?: string; // To store the ETag for concurrency control (internal use)
  accountManager?: string; // New: Account Manager field
  supportPlan?: { // New: Support Plan section
    type: SupportPlanType;
    startDate: string; // ISO 8601 date string
    endDate: string; // ISO 8601 date string
  };
}

import { SupportTierKey } from '../../emailBuilder/supportTiers/types'; // Import SupportTierKey

export type SupportPlanType = SupportTierKey; // Use SupportTierKey for consistency

export enum OnboardingStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
}

export enum CustomerStatus {
  LEAD = 'Lead',
  PROSPECT = 'Prospect',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_HOLD = 'On Hold',
}
