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
    onChange: (field: string, value: string) => void;
  }