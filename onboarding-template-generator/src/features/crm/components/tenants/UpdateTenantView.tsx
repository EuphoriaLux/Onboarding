import React, { useEffect, useState } from 'react';
import { Tenant } from '../../types';
import { useAppState } from '../../../../contexts/AppStateContext';
import TenantForm from './TenantForm'; // Import the reusable TenantForm

interface UpdateTenantViewProps {
  selectedTenantId: string | null;
  onUpdateSuccess: () => void;
}

const UpdateTenantView: React.FC<UpdateTenantViewProps> = ({ selectedTenantId, onUpdateSuccess }) => {
  const { state, updateTenantInCustomer } = useAppState();
  const { crmData, selectedCustomerId } = state;
  const [initialTenant, setInitialTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTenantId && selectedCustomerId) {
      const customer = crmData.find(c => c.id === selectedCustomerId);
      const tenantToEdit = customer?.tenants?.find(t => t.id === selectedTenantId);
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
  }, [selectedTenantId, selectedCustomerId, crmData]);

  const handleSubmit = async (updatedTenant: Tenant) => {
    if (!selectedCustomerId) {
      setError("No customer selected for tenant update.");
      return;
    }
    try {
      // Ensure the customerId is correctly set for the updated tenant
      const tenantWithCustomerId = { ...updatedTenant, customerId: selectedCustomerId };
      await updateTenantInCustomer(selectedCustomerId, tenantWithCustomerId);
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
