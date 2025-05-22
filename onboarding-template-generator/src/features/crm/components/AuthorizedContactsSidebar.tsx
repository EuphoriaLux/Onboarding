import React from 'react';
import { AuthorizedContact } from '../types/index'; // Updated import path
import { UsersIcon, PlusIcon, InformationCircleIcon } from './icons'; // Updated import path
import AuthorizedContactListItem from './AuthorizedContactListItem'; // Updated import path
import EmptyState from './EmptyState'; // Updated import path

interface AuthorizedContactsSidebarProps {
  contacts: AuthorizedContact[];
  selectedCustomerId: string | null;
  onAddContactClick: () => void;
  customerName: string | undefined;
}

const AuthorizedContactsSidebar: React.FC<AuthorizedContactsSidebarProps> = ({ contacts, selectedCustomerId, onAddContactClick, customerName }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg lg:sticky lg:top-[calc(theme(spacing.6)_+_250px)] flex flex-col flex-grow"> {/* Adjust top based on CustomerContactSidebar height */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-7 h-7 text-[var(--primary-color-light)] opacity-80 dark:text-[var(--primary-color-dark)] opacity-80" />
          <h3 className="text-lg font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">Authorized Contacts</h3>
        </div>
        <button
          onClick={onAddContactClick}
          disabled={!selectedCustomerId}
          className="flex items-center bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] text-white font-semibold py-1.5 px-3 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out text-sm disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
          title={selectedCustomerId ? "Add New Contact" : "Select a customer first"}
        >
          <PlusIcon className="w-4 h-4 mr-1.5" />
          Add
        </button>
      </div>

      {!selectedCustomerId ? (
        <EmptyState
            icon={<InformationCircleIcon className="w-12 h-12 text-[var(--text-color-light)] opacity-50 dark:text-[var(--text-color-dark)] opacity-50" />}
            title="No Customer Selected"
            message="Select a customer to see their authorized contacts."
            className="flex flex-col justify-center items-center flex-grow"
        />
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="w-12 h-12 text-[var(--text-color-light)] opacity-50 dark:text-[var(--text-color-dark)] opacity-50" />}
          title={`No Contacts for ${customerName || 'this Customer'}`}
          message="Add the first authorized contact using the 'Add' button."
          className="flex flex-col justify-center items-center flex-grow"
        />
      ) : (
        <ul className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 flex-grow">
          {contacts.map(contact => (
            <AuthorizedContactListItem key={contact.id} contact={contact} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorizedContactsSidebar;
