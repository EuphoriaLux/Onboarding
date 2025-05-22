
import React from 'react';
import { Customer } from '../types';
import { UserCircleIcon, EnvelopeIcon, CalendarDaysIcon, InformationCircleIcon } from './icons';
import EmptyState from './EmptyState';

interface CustomerContactSidebarProps {
  customer: Customer | null | undefined;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | undefined | null;  valueClass?: string; placeholder?: string }> = ({ icon, label, value, valueClass = 'text-slate-700', placeholder = "N/A" }) => (
  <div className="flex items-start space-x-3 py-2">
    <div className="flex-shrink-0 w-5 h-5 text-primary mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {value ? <p className={`text-sm ${valueClass} break-words`}>{value}</p> : <p className="text-sm text-slate-400 italic">{placeholder}</p>}
    </div>
  </div>
);


const CustomerContactSidebar: React.FC<CustomerContactSidebarProps> = ({ customer }) => {
  if (!customer) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg h-full">
        <EmptyState
          icon={<InformationCircleIcon className="w-12 h-12 text-slate-300" />}
          title="No Customer Selected"
          message="Select a customer from the list to view their details here."
        />
      </div>
    );
  }

  return (
    // Ensure sticky positioning works well when stacked in a flex container
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg lg:sticky lg:top-6">
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200">
        <UserCircleIcon className="w-12 h-12 text-primary-light flex-shrink-0" />
        <div>
          <h2 className="text-xl font-semibold text-slate-800 truncate" title={customer.name}>{customer.name}</h2>
          <p className="text-sm text-slate-500">Customer Details</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <DetailItem
          icon={<EnvelopeIcon />}
          label="Contact Email"
          value={customer.contactEmail}
          valueClass="text-primary-dark hover:text-primary"
          placeholder="No email provided"
        />
        <DetailItem
          icon={<CalendarDaysIcon />}
          label="Joined Date"
          value={new Date(customer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        />
      </div>
    </div>
  );
};

export default CustomerContactSidebar;
