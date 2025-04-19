// src/features/supportTiers/hooks/useTierSelector.ts
/**
 * Custom hook for support tier selection logic
 */
import { useState, useEffect } from 'react';
import { supportTiers } from '../constants';
import { SupportTierKey } from '../types';
import { Contact } from '../../contacts/types'; // Corrected relative path
import { TenantInfo } from '../../tenants/types'; // Corrected relative path

interface UseTierSelectorProps {
  initialTier?: SupportTierKey;
  tenants: TenantInfo[];
  contacts: Contact[];
  onTenantsChange: (tenants: TenantInfo[]) => void;
  onContactsChange: (contacts: Contact[]) => void;
}

interface UseTierSelectorResult {
  selectedTier: SupportTierKey;
  changeTier: (tier: SupportTierKey) => void;
  maxTenants: number;
  maxContacts: number;
  isTierEnabled: boolean;
}

export const useTierSelector = ({
  initialTier = 'silver',
  tenants,
  contacts,
  onTenantsChange,
  onContactsChange
}: UseTierSelectorProps): UseTierSelectorResult => {
  const [selectedTier, setSelectedTier] = useState<SupportTierKey>(initialTier);
  const [isTierEnabled, setIsTierEnabled] = useState<boolean>(true);

  const maxTenants = supportTiers[selectedTier].tenants;
  const maxContacts = supportTiers[selectedTier].authorizedContacts;

  // Effect to adjust tenants and contacts when tier changes
  useEffect(() => {
    // Limit tenants to the new tier's maximum
    if (tenants.length > maxTenants) {
      onTenantsChange(tenants.slice(0, maxTenants));
    }
    
    // Limit contacts to the new tier's maximum
    if (contacts.length > maxContacts) {
      onContactsChange(contacts.slice(0, maxContacts));
    }
  }, [selectedTier, maxTenants, maxContacts, tenants, contacts, onTenantsChange, onContactsChange]);

  // Change tier handler with validation
  const changeTier = (tier: SupportTierKey) => {
    // Make sure it's a valid tier
    if (supportTiers[tier]) {
      setSelectedTier(tier);
    } else {
      console.error(`Invalid tier: ${tier}`);
    }
  };

  return {
    selectedTier,
    changeTier,
    maxTenants,
    maxContacts,
    isTierEnabled
  };
};
