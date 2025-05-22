import React from 'react';
import { Customer } from '../types';
import CustomerListItem from './CustomerListItem';
import EmptyState from './EmptyState';
import { UserGroupIcon } from './icons';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, selectedCustomerId, onSelectCustomer }) => {
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="w-16 h-16 text-slate-300" />}
        title="No Customers Yet"
        message="Start by adding your first customer to manage their tenants."
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-200 max-h-[60vh] overflow-y-auto rounded-md border border-slate-200">
      {customers.map((customer) => (
        <CustomerListItem
          key={customer.id}
          customer={customer}
          isSelected={customer.id === selectedCustomerId}
          onSelect={() => onSelectCustomer(customer.id)}
        />
      ))}
    </ul>
  );
};

export default CustomerList;
