// src/features/tenants/types/index.ts
/**
 * Tenant management related type definitions
 */

/**
 * Tenant information interface
 */
export interface TenantInfo {
    id: string;  // Microsoft Tenant ID
    companyName: string;
    tenantDomain: string; // Added tenant domain
    microsoftTenantDomain: string; // Added MS domain (.onmicrosoft.com)
    implementationDeadline: Date | null; // Added implementation deadline
    hasAzure: boolean; // Added flag for Azure relevance
    // Removed includeRbacScript flag
    gdapLink?: string; // Optional GDAP link specific to this tenant
  }
  
  /**
   * Tenant manager props interface
   */
  export interface TenantManagerProps {
    tenants: TenantInfo[];
    selectedTier: string;
    onChange: (tenants: TenantInfo[]) => void;
  }
  
  /**
   * Tenant form props interface
   */
  export interface TenantFormProps {
    tenantId: string;
    companyName: string;
    tenantDomain: string; // Added tenant domain
    microsoftTenantDomain: string; // Added MS domain (.onmicrosoft.com)
    implementationDeadline: Date | null; // Added implementation deadline
    hasAzure: boolean; // Added flag for Azure relevance
    // Removed includeRbacScript flag
    // Update onChange to handle Date and boolean types (keeping boolean for hasAzure)
    onChange: (field: keyof TenantInfo, value: string | Date | boolean | null) => void; 
  }
