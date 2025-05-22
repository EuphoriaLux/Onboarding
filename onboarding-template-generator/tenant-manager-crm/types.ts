export interface Customer {
  id: string;
  name: string;
  contactEmail?: string;
  createdAt: string;
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
}