import React from 'react';
import { Tenant, SubscriptionStatus } from '../../types/index'; // Updated import path
import { CloudIcon, EditIcon } from '../common/icons'; // Updated import path

interface TenantListItemProps {
  tenant: Tenant;
  onEditTenant: (tenantId: string) => void; // New prop for editing tenant
}

const TenantListItem: React.FC<TenantListItemProps> = ({ tenant, onEditTenant }) => {
  const getStatusPillClasses = (status?: SubscriptionStatus): string => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Inactive':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Trial':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  return (
    <li className="p-4 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-150">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <CloudIcon className="w-7 h-7 text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] flex-shrink-0 mt-1" />
          <div className="min-w-0">
            <p className="font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] truncate text-lg">{tenant.name}</p>
            <p className="text-sm text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80 truncate">
              MS Tenant ID: <a 
                href={`https://partner.microsoft.com/dashboard/v2/customers/${tenant.microsoftTenantId}/account`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] hover:underline"
              >
                {tenant.microsoftTenantId}
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
          {tenant.subscriptionStatus && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusPillClasses(tenant.subscriptionStatus)}`}
            >
              {tenant.subscriptionStatus}
            </span>
          )}
          {tenant.gdap && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-700 border-blue-300">GDAP</span>
          )}
          {tenant.rbac && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-purple-100 text-purple-700 border-purple-300">RBAC</span>
          )}
          <button
            onClick={() => onEditTenant(tenant.id)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-150"
            title="Edit Tenant"
          >
            <EditIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-xs text-[var(--text-color-light)] opacity-60 dark:text-[var(--text-color-dark)] opacity-60 mt-2 text-right">
        Created: {new Date(tenant.createdAt).toLocaleDateString()}
      </p>
    </li>
  );
};

export default TenantListItem;
