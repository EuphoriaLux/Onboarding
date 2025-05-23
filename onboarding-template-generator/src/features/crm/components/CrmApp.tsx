import React, { useState, useEffect, useCallback } from 'react';
import { Customer, Tenant, AuthorizedContact } from '../types/index';
import Header from './common/Header';
import Footer from './common/Footer';
import CustomerList from './customers/CustomerList';
import TenantList from './tenants/TenantList';
import Modal from './common/Modal';
import AddCustomerForm from './customers/AddCustomerForm';
import TenantForm from './tenants/TenantForm';
import CustomerContactSidebar from './contacts/CustomerContactSidebar';
import AuthorizedContactsSidebar from './contacts/AuthorizedContactsSidebar';
import AddAuthorizedContactForm from './contacts/AddAuthorizedContactForm';
import UpdateCustomerView from './customers/UpdateCustomerView'; // Import UpdateCustomerView
import UpdateTenantView from './tenants/UpdateTenantView'; // Import UpdateTenantView
import { PlusIcon } from './common/icons';
import { useAppState } from '../../../contexts/AppStateContext';
import * as crmStorageService from '../services/crmStorageService';

const CrmApp: React.FC = () => {
  const { state, setSelectedCustomerId, addCustomer, addTenantToCustomer, addAuthorizedContactToCustomer } = useAppState();
  const { crmData: customers, selectedCustomerId } = state;
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddAuthorizedContactModalOpen, setIsAddAuthorizedContactModalOpen] = useState(false);
  const [isUpdateCustomerModalOpen, setIsUpdateCustomerModalOpen] = useState(false); // New state for update modal
  const [selectedCustomerIdForEdit, setSelectedCustomerIdForEdit] = useState<string | null>(null);
  const [isUpdateTenantModalOpen, setIsUpdateTenantModalOpen] = useState(false); // New state for update tenant modal
  const [selectedTenantIdForEdit, setSelectedTenantIdForEdit] = useState<string | null>(null);

  const handleSelectCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
    // No need to set currentCrmView here anymore as it's not used for main content switching
  }, [setSelectedCustomerId]);

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'>) => {
    await addCustomer(customerData);
    setIsAddCustomerModalOpen(false);
  };

  const handleEditCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId); // Keep selected customer in main state
    setSelectedCustomerIdForEdit(customerId);
    setIsUpdateCustomerModalOpen(true); // Open update modal
  }, [setSelectedCustomerId]);

  const handleCloseUpdateModal = useCallback(() => {
    setSelectedCustomerIdForEdit(null);
    setIsUpdateCustomerModalOpen(false);
  }, []);

  const handleEditTenant = useCallback((tenantId: string) => {
    setSelectedTenantIdForEdit(tenantId);
    setIsUpdateTenantModalOpen(true);
  }, []);

  const handleCloseUpdateTenantModal = useCallback(() => {
    setSelectedTenantIdForEdit(null);
    setIsUpdateTenantModalOpen(false);
  }, []);

  const handleAddTenant = async (tenantData: Omit<Tenant, 'id' | 'customerId' | 'createdAt'>) => {
    if (!selectedCustomerId) return;
    await addTenantToCustomer(selectedCustomerId, tenantData);
    setIsAddTenantModalOpen(false);
  };

  const handleUpdateTenant = async (tenantData: Tenant) => {
    if (!selectedCustomerId) return;
    // Assuming updateTenantToCustomer exists in AppStateContext
    // await updateTenantToCustomer(selectedCustomerId, tenantData);
    setIsUpdateTenantModalOpen(false);
  };

  const handleAddAuthorizedContact = async (contactData: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => {
    if (!selectedCustomerId) return;
    await addAuthorizedContactToCustomer(selectedCustomerId, contactData);
    setIsAddAuthorizedContactModalOpen(false);
  };

  const selectedCustomer = customers.find((c: Customer) => c.id === selectedCustomerId);
  const displayedTenants = selectedCustomer?.tenants || [];
  const displayedAuthorizedContacts = selectedCustomer?.contacts || [];
  const isLoading = false; // AppStateContext handles loading, or we can add a loading state to context
  const error = null; // AppStateContext handles errors, or we can add an error state to context

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-light-light)] dark:bg-[var(--background-light-dark)] font-sans text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--primary-color-light)] dark:border-[var(--primary-color-dark)]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Customer List Section - Always visible */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">Customers</h2>
                <button
                  onClick={() => setIsAddCustomerModalOpen(true)}
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
                onEditCustomer={handleEditCustomer} // Pass the new onEditCustomer prop
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
                    onClick={() => setIsAddTenantModalOpen(true)}
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
                  onEditTenant={handleEditTenant} // Pass the new onEditTenant prop
                />
              </div>
              
              {/* Sidebars Column */}
              <div className="lg:col-span-1 flex flex-col space-y-6 flex-grow">
                <CustomerContactSidebar customer={selectedCustomer} />
                <AuthorizedContactsSidebar
                  contacts={displayedAuthorizedContacts}
                  selectedCustomerId={selectedCustomerId}
                  onAddContactClick={() => setIsAddAuthorizedContactModalOpen(true)}
                  customerName={selectedCustomer?.name}
                />
              </div>
            </>
          </div>
        )}
      </main>
      <Footer />

      <Modal isOpen={isAddCustomerModalOpen} onClose={() => setIsAddCustomerModalOpen(false)} title="Add New Customer">
        <AddCustomerForm
          onAddCustomer={handleAddCustomer}
          onCancel={() => setIsAddCustomerModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isAddTenantModalOpen} onClose={() => setIsAddTenantModalOpen(false)} title={`Add Tenant for ${selectedCustomer?.name || ''}`}>
        <TenantForm
          onSubmit={handleAddTenant}
          onCancel={() => setIsAddTenantModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isAddAuthorizedContactModalOpen} onClose={() => setIsAddAuthorizedContactModalOpen(false)} title={`Add Contact for ${selectedCustomer?.name || ''}`}>
        <AddAuthorizedContactForm
          onAddContact={handleAddAuthorizedContact}
          onCancel={() => setIsAddAuthorizedContactModalOpen(false)}
        />
      </Modal>

      {/* New Modal for Update Customer */}
      <Modal isOpen={isUpdateCustomerModalOpen} onClose={handleCloseUpdateModal} title={`Update Customer: ${selectedCustomer?.name || ''}`}>
        <UpdateCustomerView
          selectedCustomerId={selectedCustomerIdForEdit}
          onUpdateSuccess={handleCloseUpdateModal}
        />
      </Modal>

      {/* New Modal for Update Tenant */}
      <Modal isOpen={isUpdateTenantModalOpen} onClose={handleCloseUpdateTenantModal} title={`Update Tenant: ${selectedCustomer?.tenants?.find(t => t.id === selectedTenantIdForEdit)?.name || ''}`}>
        <UpdateTenantView
          selectedTenantId={selectedTenantIdForEdit}
          onUpdateSuccess={handleCloseUpdateTenantModal}
        />
      </Modal>
    </div>
  );
};

export default CrmApp;
