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
    implementationDeadline: Date | null; // Added implementation deadline
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
    implementationDeadline: Date | null; // Added implementation deadline
    // Update onChange to handle Date type for deadline
    onChange: (field: keyof TenantInfo, value: string | Date | null) => void; 
  }
