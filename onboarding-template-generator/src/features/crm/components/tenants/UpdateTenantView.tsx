import React, { useEffect, useState } from 'react';
import { Tenant } from '../../types';
import { useAppState } from '../../../../contexts/AppStateContext';
import TenantForm from './TenantForm'; // Import the reusable TenantForm

interface UpdateTenantViewProps {
  selectedTenantId: string | null;
  onUpdateSuccess: () => void;
}

const UpdateTenantView: React.FC<UpdateTenantViewProps> = ({ selectedTenantId, onUpdateSuccess }) => {
  const { state, updateTenant } = useAppState(); // Removed updateTenantInCustomer, added updateTenant
  const { allTenants } = state; // Get allTenants from state
  const [initialTenant, setInitialTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTenantId) {
      const tenantToEdit = allTenants.find(t => t.id === selectedTenantId); // Find tenant directly from allTenants
      if (tenantToEdit) {
        setInitialTenant(tenantToEdit);
        setIsLoading(false);
      } else {
        setError("Tenant not found.");
        setIsLoading(false);
      }
    } else {
      setError("No tenant selected for update.");
      setIsLoading(false);
    }
  }, [selectedTenantId, allTenants]); // Depend on allTenants

  const handleSubmit = async (updatedTenant: Omit<Tenant, 'id' | 'createdAt'>) => { // Adjusted type for onSubmit
    if (!selectedTenantId) {
      setError("No tenant selected for update.");
      return;
    }
    try {
      // The updatedTenant from TenantForm will not have id/createdAt, so we need to add them back
      const fullUpdatedTenant: Tenant = {
        ...updatedTenant,
        id: selectedTenantId, // Use the ID of the tenant being edited
        createdAt: initialTenant?.createdAt || new Date().toISOString(), // Preserve original createdAt
        customerId: updatedTenant.customerId || initialTenant?.customerId || '', // Preserve or update customerId
      };
      await updateTenant(fullUpdatedTenant); // Use context action
      onUpdateSuccess();
    } catch (err) {
      console.error("Failed to update tenant:", err);
      setError("Failed to update tenant. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color-light)] dark:border-[var(--primary-color-dark)]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">{error}</div>;
  }

  if (!initialTenant) {
    return <div className="text-gray-600 dark:text-gray-400">No tenant data available for editing.</div>;
  }

  return (
    <TenantForm
      initialTenant={initialTenant}
      onSubmit={handleSubmit}
      onCancel={onUpdateSuccess} // Close modal on cancel
    />
  );
};

export default UpdateTenantView;
