// src/components/TenantForm.tsx
import React from 'react';

interface TenantFormProps {
  tenantId: string;
  companyName: string;
  gdapLink?: string; // Add optional gdapLink prop
  onChange: (field: string, value: string) => void;
}

const TenantForm: React.FC<TenantFormProps> = ({ tenantId, companyName, gdapLink, onChange }) => {
  return (
    // Container with spacing
    <div className="space-y-4">
      {/* Section title (conditionally rendered) */}
      {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">3. Tenant Information</h2> */}

      {/* Form group styling */}
      <div className="mb-4">
        {/* Label styling */}
        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
        {/* Input styling */}
        <input
          id="company-name"
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          value={companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
          placeholder="Company Name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tenant-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Microsoft Tenant ID</label>
        <input
          id="tenant-id"
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          value={tenantId}
          onChange={(e) => onChange('tenantId', e.target.value)}
          placeholder="00000000-0000-0000-0000-000000000000"
          pattern="^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
        />
        <small className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Format: 00000000-0000-0000-0000-000000000000
        </small>
      </div>

      {/* Add GDAP Link Input */}
      <div className="mb-4">
        <label htmlFor="gdap-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tenant-Specific GDAP Link (Optional)</label>
        <input
          id="gdap-link"
          type="url" // Use URL type for better validation
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
          value={gdapLink || ''}
          onChange={(e) => onChange('gdapLink', e.target.value)}
          placeholder="https://partner.microsoft.com/..."
        />
         <small className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          If provided, this link will be used for this tenant. Otherwise, a default link will be used.
        </small>
      </div>

      {/* Info box styling */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-3 text-sm text-blue-700 dark:text-blue-300">
        <p>
          <strong className="font-semibold">Note:</strong> The tenant ID will be used in the GDAP link acceptance and RBAC role establishment steps.
        </p>
      </div>
    </div>
  );
};

export default TenantForm;
