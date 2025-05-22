import React from 'react';
import { Customer } from '../types/index'; // Updated import path
import { UserCircleIcon, EnvelopeIcon, CalendarDaysIcon, InformationCircleIcon } from './icons'; // Updated import path
import EmptyState from './EmptyState'; // Updated import path

interface CustomerContactSidebarProps {
  customer: Customer | null | undefined;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | undefined | null;  valueClass?: string; placeholder?: string }> = ({ icon, label, value, valueClass = 'text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]', placeholder = "N/A" }) => (
  <div className="flex items-start space-x-3 py-2">
    <div className="flex-shrink-0 w-5 h-5 text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80">{label}</p>
      {value ? <p className={`text-sm ${valueClass} break-words`}>{value}</p> : <p className="text-sm text-[var(--text-color-light)] opacity-60 dark:text-[var(--text-color-dark)] opacity-60 italic">{placeholder}</p>}
    </div>
  </div>
);


const CustomerContactSidebar: React.FC<CustomerContactSidebarProps> = ({ customer }) => {
  if (!customer) {
    return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg h-full">
        <EmptyState
          icon={<InformationCircleIcon className="w-12 h-12 text-[var(--text-color-light)] opacity-50 dark:text-[var(--text-color-dark)] opacity-50" />}
          title="No Customer Selected"
          message="Select a customer from the list to view their details here."
        />
      </div>
    );
  }

  return (
    // Ensure sticky positioning works well when stacked in a flex container
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg lg:sticky lg:top-6 flex flex-col flex-grow">
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200">
        <UserCircleIcon className="w-12 h-12 text-[var(--primary-color-light)] opacity-80 dark:text-[var(--primary-color-dark)] opacity-80 flex-shrink-0" />
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] truncate" title={customer.name}>{customer.name}</h2>
          <p className="text-sm text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80">Customer Details</p>
        </div>
      </div>
      
      <div className="space-y-1 flex flex-col justify-around flex-grow">
        <DetailItem
          icon={<EnvelopeIcon />}
          label="Contact Email"
          value={customer.email}
          valueClass="text-[var(--primary-color-light)] hover:text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] dark:hover:text-[var(--primary-color-dark)]"
          placeholder="No email provided"
        />
        <DetailItem
          icon={<CalendarDaysIcon />}
          label="Joined Date"
          value={new Date(customer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          valueClass="text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]"
          placeholder="N/A"
        />
      </div>
    </div>
  );
};

export default CustomerContactSidebar;
