import React, { useState, useEffect } from 'react';
import { Tenant } from '../../types';
import FormField from '../../../../components/FormField'; // Import FormField
import { useAppState } from '../../../../contexts/AppStateContext'; // Import useAppState

interface TenantVerificationMenuProps {
  tenant: Tenant;
  onClose: () => void;
}

const TenantVerificationMenu: React.FC<TenantVerificationMenuProps> = ({ tenant, onClose }) => {
  const { updateTenant } = useAppState();
  const [gdap, setGdap] = useState(tenant.gdap || false);
  const [rbac, setRbac] = useState(tenant.rbac || false);

  // Update local state when tenant prop changes
  useEffect(() => {
    setGdap(tenant.gdap || false);
    setRbac(tenant.rbac || false);
  }, [tenant]);

  const handleGdapChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newGdap = (e.target as HTMLInputElement).checked;
    setGdap(newGdap);
    updateTenant({ ...tenant, gdap: newGdap }).catch(error => {
      console.error("Failed to update GDAP status:", error);
      setGdap(!newGdap); // Revert on error
    });
  };

  const handleRbacChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newRbac = (e.target as HTMLInputElement).checked;
    setRbac(newRbac);
    updateTenant({ ...tenant, rbac: newRbac }).catch(error => {
      console.error("Failed to update RBAC status:", error);
      setRbac(!newRbac); // Revert on error
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-4">
        Verification Links for {tenant.name}
      </h3>
      <div className="space-y-3">
        {tenant.microsoftTenantId && (
          <p className="text-sm text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80">
            MS Tenant ID: <a
              href={`https://partner.microsoft.com/dashboard/v2/customers/${tenant.microsoftTenantId}/account`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] hover:underline"
              title={`Open Microsoft Partner Dashboard for ${tenant.microsoftTenantId}`}
            >
              {tenant.microsoftTenantId}
            </a>
          </p>
        )}
        {tenant.microsoftTenantId && (
          <p className="text-sm">
            <a
              href={`https://partner.microsoft.com/dashboard/v2/customers/${tenant.microsoftTenantId}/adminrelationships`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              title={`Verify GDAP for ${tenant.microsoftTenantId}`}
            >
              Verify GDAP Relation
            </a>
          </p>
        )}
        {tenant.microsoftTenantId && (
          <p className="text-sm">
            <a
              href={`https://partner.microsoft.com/dashboard/v2/customers/${tenant.microsoftTenantId}/rbac`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              title={`Verify RBAC for ${tenant.microsoftTenantId}`}
            >
              Verify RBAC
            </a>
          </p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <h4 className="text-md font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">Tenant Status</h4>
        <FormField
          label="GDAP Enabled"
          id="gdap-verification"
          type="checkbox"
          checked={gdap}
          onChange={handleGdapChange}
        />
        <FormField
          label="RBAC Configured"
          id="rbac-verification"
          type="checkbox"
          checked={rbac}
          onChange={handleRbacChange}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] bg-[var(--background-light-light)] hover:bg-[color-mix(in srgb, var(--background-light-light) 90%, black)] dark:bg-[var(--background-light-dark)] dark:hover:bg-[color-mix(in srgb, var(--background-light-dark) 90%, black)] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color-light)] opacity-70 dark:focus:ring-[var(--text-color-dark)] opacity-70 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TenantVerificationMenu;
