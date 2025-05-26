import React from 'react';
import { Customer } from '../../types/index'; // Updated import path
import { UserGroupIcon, ChevronRightIcon, EditIcon } from '../common/icons'; // Updated import path

interface CustomerListItemProps {
  customer: Customer;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (customerId: string) => void; // New prop for edit action
}

const CustomerListItem: React.FC<CustomerListItemProps> = ({ customer, isSelected, onSelect, onEdit }) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the li's onClick from firing
    onEdit(customer.id);
  };

  return (
    <li
      onClick={onSelect}
      className={`p-3 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all duration-150 ease-in-out flex justify-between items-center
        ${isSelected ? 'bg-[color-mix(in srgb, var(--primary-color-light) 10%, white)] dark:bg-[color-mix(in srgb, var(--primary-color-dark) 10%, black)] border-l-4 border-[var(--primary-color-light)] dark:border-[var(--primary-color-dark)]' : 'border-l-4 border-transparent'}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <UserGroupIcon className={`w-6 h-6 flex-shrink-0 ${isSelected ? 'text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)]' : 'text-gray-700 dark:text-gray-300'}`} />
        <div className="min-w-0">
          <p className={`font-medium truncate ${isSelected ? 'text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>{customer.name}</p>
          {/* Removed email and joined date as per user feedback */}
        </div>
      </div>
      <div className="flex items-center space-x-2"> {/* Container for icons */}
        {isSelected && (
          <button
            onClick={handleEditClick}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] transition-all duration-150 ease-in-out"
            aria-label="Edit customer"
          >
            <EditIcon className={`w-5 h-5 ${isSelected ? 'text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)]' : 'text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]'}`} />
          </button>
        )}
        {isSelected && <ChevronRightIcon className="w-5 h-5 text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] flex-shrink-0" />}
      </div>
    </li>
  );
};

export default CustomerListItem;
