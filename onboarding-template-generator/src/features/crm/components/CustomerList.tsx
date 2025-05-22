import React from 'react';
import { Customer } from '../types/index';
import CustomerListItem from './CustomerListItem';
import EmptyState from './EmptyState';
import { UserGroupIcon } from './icons';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string) => void;
  onEditCustomer: (customerId: string) => void; // New prop for edit action
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, selectedCustomerId, onSelectCustomer, onEditCustomer }) => {
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="w-16 h-16 text-[var(--text-color-light)] opacity-50 dark:text-[var(--text-color-dark)] opacity-50" />}
        title="No Customers Yet"
        message="Start by adding your first customer to manage their tenants."
        className="flex flex-col justify-center items-center flex-grow"
      />
    );
  }

  return (
    <ul className="divide-y divide-[var(--text-color-light)] dark:divide-[var(--text-color-dark)] max-h-[60vh] overflow-y-auto rounded-md border border-[var(--text-color-light)] dark:border-[var(--text-color-dark)] flex-grow">
      {customers.map((customer) => (
        <CustomerListItem
          key={customer.id}
          customer={customer}
          isSelected={customer.id === selectedCustomerId}
          onSelect={() => onSelectCustomer(customer.id)}
          onEdit={onEditCustomer} // Pass the new onEditCustomer prop
        />
      ))}
    </ul>
  );
};

export default CustomerList;
