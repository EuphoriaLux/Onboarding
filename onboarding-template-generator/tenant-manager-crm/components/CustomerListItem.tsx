
import React from 'react';
import { Customer } from '../types';
import { UserGroupIcon, ChevronRightIcon } from './icons';

interface CustomerListItemProps {
  customer: Customer;
  isSelected: boolean;
  onSelect: () => void;
}

const CustomerListItem: React.FC<CustomerListItemProps> = ({ customer, isSelected, onSelect }) => {
  return (
    <li
      onClick={onSelect}
      className={`p-3 sm:p-4 hover:bg-slate-50 cursor-pointer transition-all duration-150 ease-in-out flex justify-between items-center
        ${isSelected ? 'bg-primary-light/10 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      aria-selected={isSelected}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <UserGroupIcon className={`w-6 h-6 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-slate-500'}`} />
        <div className="min-w-0">
          <p className={`font-medium truncate ${isSelected ? 'text-primary-dark font-semibold' : 'text-slate-800'}`}>{customer.name}</p>
          {customer.contactEmail && <p className="text-sm text-slate-500 truncate">{customer.contactEmail}</p>}
          <p className="text-xs text-slate-400 mt-0.5">Joined: {new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      {isSelected && <ChevronRightIcon className="w-5 h-5 text-primary flex-shrink-0 ml-2" />}
    </li>
  );
};

export default CustomerListItem;
