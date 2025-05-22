import React from 'react';
import { Tenant } from '../types/index'; // Updated import path
import TenantListItem from './TenantListItem'; // Updated import path
import EmptyState from './EmptyState'; // Updated import path
import { CloudIcon, InformationCircleIcon } from './icons'; // Updated import path


interface TenantListProps {
  tenants: Tenant[];
  customerName: string;
  isLoading: boolean; // Can be used for tenant-specific loading if needed
  selectedCustomerId: string | null;
}

const TenantList: React.FC<TenantListProps> = ({ tenants, customerName, isLoading, selectedCustomerId }) => {
  if (isLoading) {
     return (
        <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color-light)] dark:border-[var(--primary-color-dark)]"></div>
        </div>
    );
  }
  
  if (!selectedCustomerId) {
    return (
      <EmptyState
        icon={<InformationCircleIcon className="w-16 h-16 text-[var(--text-color-light)] opacity-50 dark:text-[var(--text-color-dark)] opacity-50" />}
        title="No Customer Selected"
        message="Please select a customer from the list to view their tenants."
      />
    );
  }

  if (tenants.length === 0) {
    return (
      <EmptyState
        icon={<CloudIcon className="w-16 h-16 text-[var(--text-color-light)] opacity-50 dark:text-[var(--text-color-dark)] opacity-50" />}
        title={`No Tenants for ${customerName}`}
        message="This customer doesn't have any tenants yet. You can add one using the button above."
      />
    );
  }

  return (
    <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 -mr-2"> {/* pr-2 -mr-2 for scrollbar spacing */}
      {tenants.map((tenant) => (
        <TenantListItem key={tenant.id} tenant={tenant} />
      ))}
    </ul>
  );
};

export default TenantList;
