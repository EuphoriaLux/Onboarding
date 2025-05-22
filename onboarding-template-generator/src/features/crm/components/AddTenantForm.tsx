import React, { useState } from 'react';
import { Tenant, SubscriptionStatus } from '../types/index'; // Updated import path
import { SUBSCRIPTION_STATUSES } from '../constants'; // Updated import path

interface AddTenantFormProps {
  onAddTenant: (tenantData: Omit<Tenant, 'id' | 'customerId' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddTenantForm: React.FC<AddTenantFormProps> = ({ onAddTenant, onCancel }) => {
  const [name, setName] = useState('');
  const [microsoftTenantId, setMicrosoftTenantId] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | undefined>(undefined);
  const [errors, setErrors] = useState<{ name?: string; tenantId?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; tenantId?: string } = {};
    if (!name.trim()) newErrors.name = 'Tenant name is required.';
    if (!microsoftTenantId.trim()) newErrors.tenantId = 'Microsoft Tenant ID is required.';
    else if (!/^[a-zA-Z0-9.-]+\.onmicrosoft\.com$/.test(microsoftTenantId.trim()) && !/^[a-zA-Z0-9-]+$/.test(microsoftTenantId.trim()) ) {
       // Basic validation for tenant ID format or a simple GUID-like string
       // A more robust regex might be needed for strict `*.onmicrosoft.com` or GUID.
       // This example allows `tenant.onmicrosoft.com` or simple names.
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    onAddTenant({ name, microsoftTenantId, subscriptionStatus });
    setName('');
    setMicrosoftTenantId('');
    setSubscriptionStatus(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tenantName" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Tenant Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="tenantName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-[var(--text-color-light)] opacity-30 dark:border-[var(--text-color-dark)] opacity-30'} rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm`}
          placeholder="e.g., Production Environment"
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="microsoftTenantId" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Microsoft Tenant ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="microsoftTenantId"
          value={microsoftTenantId}
          onChange={(e) => setMicrosoftTenantId(e.target.value)}
          className={`w-full px-3 py-2 border ${errors.tenantId ? 'border-red-500' : 'border-[var(--text-color-light)] opacity-30 dark:border-[var(--text-color-dark)] opacity-30'} rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm`}
          placeholder="e.g., contoso.onmicrosoft.com or a GUID"
        />
        {errors.tenantId && <p className="text-xs text-red-600 mt-1">{errors.tenantId}</p>}
      </div>
      <div>
        <label htmlFor="subscriptionStatus" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Subscription Status (Optional)
        </label>
        <select
          id="subscriptionStatus"
          value={subscriptionStatus || ''}
          onChange={(e) => setSubscriptionStatus(e.target.value as SubscriptionStatus || undefined)}
          className="w-full px-3 py-2 border border-[var(--text-color-light)] opacity-30 dark:border-[var(--text-color-dark)] opacity-30 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm bg-white dark:bg-slate-800"
        >
          <option value="">Select status</option>
          {SUBSCRIPTION_STATUSES.map((status: SubscriptionStatus) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] bg-[var(--background-light-light)] hover:bg-[color-mix(in srgb, var(--background-light-light) 90%, black)] dark:bg-[var(--background-light-dark)] dark:hover:bg-[color-mix(in srgb, var(--background-light-dark) 90%, black)] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color-light)] opacity-70 dark:focus:ring-[var(--text-color-dark)] opacity-70 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] transition-colors"
        >
          Add Tenant
        </button>
      </div>
    </form>
  );
};

export default AddTenantForm;
