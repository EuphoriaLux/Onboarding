// src/features/supportTiers/types/index.ts
/**
 * Support tier related type definitions
 */

/**
 * Support tier interface defining tier properties and capabilities
 */
export interface SupportTier {
    name: string;
    color: string;
    description: string;
    criticalSituation: boolean;
    supportHours: string;
    supportRequestSubmission: string;
    tenants: number;
    authorizedContacts: number;
    supportRequestsIncluded: string | number;
    products: string[];
    severityLevels: string;
  }
  
  /**
   * Record of support tiers indexed by their key
   */
  export type SupportTierRecord = Record<string, SupportTier>;
  
  /**
   * Support tier key type (for type safety)
   */
  export type SupportTierKey = 'bronze' | 'silver' | 'gold' | 'platinum';