import React, { useCallback } from 'react';
import { Customer, Tenant, AuthorizedContact } from '../../types/index';
import CustomerList from './CustomerList';
import TenantList from '../tenants/TenantList';
import CustomerContactSidebar from '../contacts/CustomerContactSidebar';
import AuthorizedContactsSidebar from '../contacts/AuthorizedContactsSidebar';
import { PlusIcon } from '../common/icons';
import { useAppState } from '@contexts/AppStateContext';

interface CustomersViewProps {
  onAddCustomerClick: () => void;
  onAddTenantClick: () => void;
  onAddAuthorizedContactClick: () => void;
  onEditCustomer: (customerId: string) => void;
  onEditTenant: (tenantId: string) => void;
}

const CustomersView: React.FC<CustomersViewProps> = ({
  onAddCustomerClick,
  onAddTenantClick,
  onAddAuthorizedContactClick,
  onEditCustomer,
  onEditTenant,
}) => {
  const { state, setSelectedCustomerId } = useAppState();
  const { crmData: customers, allTenants, selectedCustomerId } = state; // Get allTenants from state

  const handleSelectCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
  }, [setSelectedCustomerId]);

  const selectedCustomer = customers.find((c: Customer) => c.id === selectedCustomerId);
  // Filter tenants from the global list based on selectedCustomerId
  const displayedTenants = allTenants.filter(tenant => tenant.customerId === selectedCustomerId) || [];
  const displayedAuthorizedContacts = selectedCustomer?.contacts || [];
  const isLoading = false; // AppStateContext handles loading, or we can add a loading state to context
  const error = null; // AppStateContext handles errors, or we can add an error state to context

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Customer List Section - Always visible */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">Customers</h2>
          <button
            onClick={onAddCustomerClick}
            className="flex items-center bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
            title="Add New Customer"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add
          </button>
        </div>
        <CustomerList
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={handleSelectCustomer}
          onEditCustomer={onEditCustomer}
        />
      </div>

      {/* Main Content Area - Always show Tenant List and Sidebars */}
      <>
        {/* Tenant List Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
              {selectedCustomer ? `${selectedCustomer.name}'s Tenants` : 'Select a Customer'}
            </h2>
            <button
              onClick={onAddTenantClick}
              disabled={!selectedCustomerId}
              className="flex items-center bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
              title={selectedCustomerId ? "Add New Tenant" : "Select a customer first"}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Tenant
            </button>
          </div>
          <TenantList
            tenants={displayedTenants}
            customerName={selectedCustomer?.name || ''}
            isLoading={false}
            selectedCustomerId={selectedCustomerId}
            onEditTenant={onEditTenant}
          />
        </div>
        
        {/* Sidebars Column */}
        <div className="lg:col-span-1 flex flex-col space-y-6 flex-grow">
          <CustomerContactSidebar customer={selectedCustomer} />
          <AuthorizedContactsSidebar
            contacts={displayedAuthorizedContacts}
            selectedCustomerId={selectedCustomerId}
            onAddContactClick={onAddAuthorizedContactClick}
            customerName={selectedCustomer?.name}
          />
        </div>
      </>
    </div>
  );
};

export default CustomersView;
