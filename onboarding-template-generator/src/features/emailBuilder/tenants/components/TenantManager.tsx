import React, { useEffect } from 'react'; // Import useEffect
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import { supportTiers } from '../../supportTiers/constants'; // Corrected relative path
import { TenantInfo } from '../types'; // Import updated TenantInfo type

interface TenantManagerProps {
  tenants: TenantInfo[]; // Use imported TenantInfo
  selectedTier: string;
  onChange: (tenants: TenantInfo[]) => void;
  calculatedDeadline: Date; // Add prop for calculated deadline
}

const TenantManager: React.FC<TenantManagerProps> = ({ tenants, selectedTier, onChange, calculatedDeadline }) => { // Destructure new prop
  const tier = supportTiers[selectedTier];

  // Effect to adjust tenants when tier changes
  useEffect(() => {
    const currentTier = supportTiers[selectedTier];
    const tenantLimit = currentTier.tenants;
    if (tenants.length > tenantLimit) {
      // If current tenants exceed the new limit, truncate the array
      const updatedTenants = tenants.slice(0, tenantLimit);
      onChange(updatedTenants);
    }
    // Dependencies: run when selectedTier changes or the onChange function reference changes
    // It's generally safe to include tenants array too, though it might cause extra runs if not memoized upstream
  }, [selectedTier, tenants, onChange]);

  // Handle tenant field changes, including Date and boolean types
  const handleTenantChange = (index: number, field: keyof TenantInfo, value: string | Date | boolean | null) => {
    const updatedTenants = tenants.map((tenant, i) => {
      if (i === index) {
        // Handle potential null value for DatePicker when cleared
        const newValue = field === 'implementationDeadline' && value === null ? null : value;
        return { ...tenant, [field]: newValue };
      }
      return tenant;
    });
    onChange(updatedTenants);
  };

  // Add a new tenant, initializing new flags
  const addTenant = () => {
    if (tenants.length < tier.tenants) {
      // Initialize tenantDomain, msDomain, deadline, hasAzure
      onChange([...tenants, { 
        id: '', 
        companyName: '', 
        tenantDomain: '', 
        microsoftTenantDomain: '', // Initialize MS Domain
        implementationDeadline: null, 
        hasAzure: false, // Default to false
        // Removed includeRbacScript initialization
        gdapLink: '' 
      }]);
    }
  };

  // Remove a tenant
  const removeTenant = (index: number) => {
    const updatedTenants = [...tenants];
    updatedTenants.splice(index, 1);
    onChange(updatedTenants);
  };

  // Base button style (can be moved to a shared location later)
  const buttonBaseStyle = "inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800";
  const primaryButtonBaseStyle = "inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800";

  return (
    // Container with spacing
    <div className="space-y-6">
      {/* Section title with tenant count */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        3. Tenant Information <span className="text-sm text-gray-500 dark:text-gray-400">({tenants.length}/{tier.tenants})</span>
      </h2>
      {/* Section description */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Your {tier.name} allows for up to {tier.tenants} tenant{tier.tenants !== 1 ? 's' : ''}.
        Please provide the information for each tenant you want to include.
      </p>

      {/* Tenant cards */}
      <div className="space-y-4">
        {tenants.map((tenant, index) => (
          // Tenant card styling
          <div key={index} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            {/* Tenant header with remove button */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Tenant #{index + 1}</h3>
              {tenants.length > 1 && (
                <button
                  type="button"
                  className={buttonBaseStyle}
                  onClick={() => removeTenant(index)}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Tenant fields */}
            <div className="space-y-3">
              {/* Form group: Company Name */}
              <div>
                <label htmlFor={`company-name-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                <input
                  id={`company-name-${index}`}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                  value={tenant.companyName}
                  onChange={(e) => handleTenantChange(index, 'companyName', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>

              {/* Form group: Tenant Domain */}
              <div>
                <label htmlFor={`tenant-domain-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tenant Domain</label>
                <input
                  id={`tenant-domain-${index}`}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                  value={tenant.tenantDomain}
                  onChange={(e) => handleTenantChange(index, 'tenantDomain', e.target.value)}
                  placeholder="contoso.onmicrosoft.com"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  The `.onmicrosoft.com` domain, needed for the RBAC script.
                </p>
              </div>

              {/* Form group: Tenant ID */}
              <div>
                <label htmlFor={`tenant-id-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Microsoft Tenant ID</label>
                <input
                  id={`tenant-id-${index}`}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                  value={tenant.id}
                  onChange={(e) => handleTenantChange(index, 'id', e.target.value)}
                  placeholder="00000000-0000-0000-0000-000000000000"
                  pattern="^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Format: 00000000-0000-0000-0000-000000000000
                </p>
              </div>

              {/* Form group: GDAP Link */}
              <div>
                <label htmlFor={`gdap-link-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tenant-Specific GDAP Link (Optional)</label>
                <input
                  id={`gdap-link-${index}`}
                  type="url"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                  value={tenant.gdapLink || ''}
                  onChange={(e) => handleTenantChange(index, 'gdapLink', e.target.value)}
                  placeholder="https://partner.microsoft.com/..."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  If provided, this link will be used for this tenant. Otherwise, a default link will be used.
                </p>
              </div>

              {/* Configuration Section Starts Here */}
              <hr className="border-gray-200 dark:border-gray-700" /> {/* Optional visual divider */}

              {/* Display Calculated Deadline */}
              <div>
                <label htmlFor={`calculated-deadline-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">GDAP Implementation Deadline (Auto-calculated)</label>
                <input
                  id={`calculated-deadline-${index}`} // Add ID
                  type="text"
                  value={calculatedDeadline.toLocaleDateString()} // Format the date
                  readOnly // Make it read-only
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600" // Optional styling
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This date (90 days from today) will be used in the email template.
                </p>
              </div>

              {/* Moved Microsoft Tenant Domain Input Down */}
              <div>
                <label htmlFor={`ms-tenant-domain-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Microsoft Tenant Domain</label>
                <input
                  id={`ms-tenant-domain-${index}`}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                  value={tenant.microsoftTenantDomain}
                  onChange={(e) => handleTenantChange(index, 'microsoftTenantDomain', e.target.value)}
                  placeholder="yourcompany.onmicrosoft.com"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  The `.onmicrosoft.com` domain, needed for the RBAC script.
                </p>
              </div>

              {/* Has Azure Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`has-azure-${index}`}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                  checked={tenant.hasAzure}
                  onChange={(e) => handleTenantChange(index, 'hasAzure', e.target.checked)}
                />
                <label htmlFor={`has-azure-${index}`} className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Azure RBAC Relevant?</label>
                <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">Check if Azure RBAC configuration is needed for this tenant.</p>
              </div>

              {/* Removed Include RBAC Script Checkbox */}
            </div>

            {/* Info box styling */}
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-3 text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold">
                Note: The tenant ID will be used in the GDAP link acceptance and RBAC role establishment steps.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add tenant button styling */}
      {tenants.length < tier.tenants && (
        <div className="mt-4">
          <button
            type="button"
            className={primaryButtonBaseStyle}
            onClick={addTenant}
          >
            Add Tenant
          </button>
        </div>
      )}
    </div>
  );
};

export default TenantManager;
