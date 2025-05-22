import React from 'react';
import { Tenant, SubscriptionStatus } from '../types/index'; // Updated import path
import { CloudIcon } from './icons'; // Updated import path

interface TenantListItemProps {
  tenant: Tenant;
}

const TenantListItem: React.FC<TenantListItemProps> = ({ tenant }) => {
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
            <p className="text-sm text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80 truncate">MS Tenant ID: {tenant.microsoftTenantId}</p>
          </div>
        </div>
        {tenant.subscriptionStatus && (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusPillClasses(tenant.subscriptionStatus)} flex-shrink-0 ml-2`}
          >
            {tenant.subscriptionStatus}
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--text-color-light)] opacity-60 dark:text-[var(--text-color-dark)] opacity-60 mt-2 text-right">
        Created: {new Date(tenant.createdAt).toLocaleDateString()}
      </p>
    </li>
  );
};

export default TenantListItem;
