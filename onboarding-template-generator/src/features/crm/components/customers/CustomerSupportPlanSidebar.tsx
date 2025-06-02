import React from 'react';
import { Customer } from '../../types';
import { supportTiers } from '../../../emailBuilder/supportTiers/data/supportTiers';

interface CustomerSupportPlanSidebarProps {
  customer: Customer | null;
}

const CustomerSupportPlanSidebar: React.FC<CustomerSupportPlanSidebarProps> = ({ customer }) => {
  if (!customer || !customer.supportPlan) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-4">Support Plan</h3>
        <p className="text-gray-600 dark:text-gray-400">No support plan information available.</p>
      </div>
    );
  }

  const { type, startDate, endDate } = customer.supportPlan;
  const supportPlanName = supportTiers[type]?.name || type;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col flex-grow">
      <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-4">Support Plan</h3>
      <div className="space-y-2 text-gray-700 dark:text-gray-300">
        <p><strong>Type:</strong> {supportPlanName}</p>
        <p><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default CustomerSupportPlanSidebar;
