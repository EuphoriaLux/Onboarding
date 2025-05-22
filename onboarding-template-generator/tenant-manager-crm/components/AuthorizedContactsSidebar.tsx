
import React from 'react';
import { AuthorizedContact } from '../types';
import { UsersIcon, PlusIcon, InformationCircleIcon } from './icons';
import AuthorizedContactListItem from './AuthorizedContactListItem';
import EmptyState from './EmptyState';

interface AuthorizedContactsSidebarProps {
  contacts: AuthorizedContact[];
  selectedCustomerId: string | null;
  onAddContactClick: () => void;
  customerName: string | undefined;
}

const AuthorizedContactsSidebar: React.FC<AuthorizedContactsSidebarProps> = ({ contacts, selectedCustomerId, onAddContactClick, customerName }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg lg:sticky lg:top-[calc(theme(spacing.6)_+_250px)]"> {/* Adjust top based on CustomerContactSidebar height */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-7 h-7 text-primary-light" />
          <h3 className="text-lg font-semibold text-slate-700">Authorized Contacts</h3>
        </div>
        <button
          onClick={onAddContactClick}
          disabled={!selectedCustomerId}
          className="flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-1.5 px-3 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out text-sm disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
          title={selectedCustomerId ? "Add New Contact" : "Select a customer first"}
        >
          <PlusIcon className="w-4 h-4 mr-1.5" />
          Add
        </button>
      </div>

      {!selectedCustomerId ? (
        <EmptyState
            icon={<InformationCircleIcon className="w-12 h-12 text-slate-300" />}
            title="No Customer Selected"
            message="Select a customer to see their authorized contacts."
        />
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="w-12 h-12 text-slate-300" />}
          title={`No Contacts for ${customerName || 'this Customer'}`}
          message="Add the first authorized contact using the 'Add' button."
        />
      ) : (
        <ul className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
          {contacts.map(contact => (
            <AuthorizedContactListItem key={contact.id} contact={contact} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorizedContactsSidebar;
