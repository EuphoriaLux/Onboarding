export interface CustomerNote {
  timestamp: string; // ISO 8601 date string
  text: string;
  author?: string; // Optional: Track who added the note
}

export interface Customer {
  id: string; // Unique identifier (e.g., UUID)
  name: string; // Primary/Official Customer Name
  internalName?: string; // Optional internal name/alias
  email?: string; // Optional
  phone?: string; // Optional
  company?: string; // Optional
  status?: string; // e.g., 'Lead', 'Active', 'Inactive', 'Prospect'
  tenantIds?: string[]; // Optional array of Microsoft Tenant IDs
  parentId?: string; // Optional ID of the parent customer/company
  notes: CustomerNote[];
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  _etag?: string; // To store the ETag for concurrency control (internal use)
}

// Optional: Define possible statuses
export enum CustomerStatus {
  LEAD = 'Lead',
  PROSPECT = 'Prospect',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_HOLD = 'On Hold',
}
