import React from 'react';
import { Customer } from '../../types';
import { supportTiers } from '../../../emailBuilder/supportTiers/data/supportTiers';

interface CustomerSupportPlanTopbarProps {
  customer: Customer | null;
}

const CustomerSupportPlanTopbar: React.FC<CustomerSupportPlanTopbarProps> = ({ customer }) => {
  if (!customer) {
    return null; // Don't render if no customer is selected
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-xl shadow-xl ${customer.supportPlan ? 'border border-green-200 dark:border-green-800' : 'border border-red-200 dark:border-red-800'}`}>
      <h3 className={`text-xl font-semibold mb-4 ${customer.supportPlan ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
        Support Status for {customer.name}
      </h3>
      {customer.supportPlan ? (
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>Plan Type:</strong> {supportTiers[customer.supportPlan.type]?.name || customer.supportPlan.type}</p>
          <p><strong>Start Date:</strong> {new Date(customer.supportPlan.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(customer.supportPlan.endDate).toLocaleDateString()}</p>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">This customer currently has no active support plan.</p>
      )}
    </div>
  );
};

export default CustomerSupportPlanTopbar;
