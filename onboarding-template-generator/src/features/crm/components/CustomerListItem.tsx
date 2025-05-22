import React from 'react';
import { Customer } from '../types/index'; // Updated import path
import { UserGroupIcon, ChevronRightIcon } from './icons'; // Updated import path

interface CustomerListItemProps {
  customer: Customer;
  isSelected: boolean;
  onSelect: () => void;
}

const CustomerListItem: React.FC<CustomerListItemProps> = ({ customer, isSelected, onSelect }) => {
  return (
    <li
      onClick={onSelect}
      className={`p-3 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all duration-150 ease-in-out flex justify-between items-center
        ${isSelected ? 'bg-[color-mix(in srgb, var(--primary-color-light) 10%, white)] dark:bg-[color-mix(in srgb, var(--primary-color-dark) 10%, black)] border-l-4 border-[var(--primary-color-light)] dark:border-[var(--primary-color-dark)]' : 'border-l-4 border-transparent'}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      aria-selected={isSelected}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <UserGroupIcon className={`w-6 h-6 flex-shrink-0 ${isSelected ? 'text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)]' : 'text-[var(--text-color-light)] opacity-70 dark:text-[var(--text-color-dark)] opacity-70'}`} />
        <div className="min-w-0">
          <p className={`font-medium truncate ${isSelected ? 'text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] font-semibold' : 'text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]'}`}>{customer.name}</p>
          {customer.email && <p className="text-sm text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80 truncate">{customer.email}</p>}
          <p className="text-xs text-[var(--text-color-light)] opacity-60 dark:text-[var(--text-color-dark)] opacity-60 mt-0.5">Joined: {new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      {isSelected && <ChevronRightIcon className="w-5 h-5 text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] flex-shrink-0 ml-2" />}
    </li>
  );
};

export default CustomerListItem;
