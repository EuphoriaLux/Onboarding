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
  customerId: string;
  subscriptionStatus?: SubscriptionStatus;
  createdAt: string;
}

export interface AuthorizedContact {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  jobTitle?: string; // Added from existing Contact if needed
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
  tenants?: Tenant[]; // New: array of Tenant objects
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  onboardingStatus?: OnboardingStatus;
  _etag?: string; // To store the ETag for concurrency control (internal use)
}

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
