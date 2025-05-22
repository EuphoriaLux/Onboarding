
import React from 'react';
import { Tenant, SubscriptionStatus } from '../types';
import { CloudIcon } from './icons';

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
          <CloudIcon className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate text-lg">{tenant.name}</p>
            <p className="text-sm text-slate-500 truncate">MS Tenant ID: {tenant.microsoftTenantId}</p>
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
      <p className="text-xs text-slate-400 mt-2 text-right">
        Created: {new Date(tenant.createdAt).toLocaleDateString()}
      </p>
    </li>
  );
};

export default TenantListItem;
