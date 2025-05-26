import React, { useState, useEffect, useCallback } from 'react';
import { Customer, Tenant, AuthorizedContact } from '../types/index';
import Header from './common/Header';
import Footer from './common/Footer';
import Modal from './common/Modal';
import AddCustomerForm from './customers/AddCustomerForm';
import TenantForm from './tenants/TenantForm';
import AddAuthorizedContactForm from './contacts/AddAuthorizedContactForm';
import UpdateCustomerView from './customers/UpdateCustomerView';
import UpdateTenantView from './tenants/UpdateTenantView';
import CrmNavbar from './common/CrmNavbar';
import CustomersView from './customers/CustomersView';
import TenantMatchingView from './tenants/TenantMatchingView';
import { useAppState } from '../../../contexts/AppStateContext';
import * as crmStorageService from '../services/crmStorageService';

const CrmApp: React.FC = () => {
  const { state, setSelectedCustomerId, addCustomer, addAuthorizedContactToCustomer, deleteCustomer, addTenant } = useAppState(); // Removed addTenantToCustomer, added addTenant
  const { crmData: customers, allTenants, selectedCustomerId } = state; // Added allTenants
  const [currentView, setCurrentView] = useState<'customers' | 'tenantMatching'>('customers');
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddAuthorizedContactModalOpen, setIsAddAuthorizedContactModalOpen] = useState(false);
  const [isUpdateCustomerModalOpen, setIsUpdateCustomerModalOpen] = useState(false);
  const [selectedCustomerIdForEdit, setSelectedCustomerIdForEdit] = useState<string | null>(null);
  const [isUpdateTenantModalOpen, setIsUpdateTenantModalOpen] = useState(false);
  const [selectedTenantIdForEdit, setSelectedTenantIdForEdit] = useState<string | null>(null);

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'>) => {
    await addCustomer(customerData);
    setIsAddCustomerModalOpen(false);
  };

  const handleEditCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
    setSelectedCustomerIdForEdit(customerId);
    setIsUpdateCustomerModalOpen(true);
  }, [setSelectedCustomerId]);

  const handleCloseUpdateModal = useCallback(() => {
    setSelectedCustomerIdForEdit(null);
    setIsUpdateCustomerModalOpen(false);
  }, []);

  const handleDeleteCustomer = useCallback(async () => {
    if (selectedCustomerId) {
      await deleteCustomer(selectedCustomerId);
      setSelectedCustomerId(null); // Deselect customer after deletion
    }
  }, [selectedCustomerId, deleteCustomer, setSelectedCustomerId]);

  const handleEditTenant = useCallback((tenantId: string) => {
    setSelectedTenantIdForEdit(tenantId);
    setIsUpdateTenantModalOpen(true);
  }, []);

  const handleCloseUpdateTenantModal = useCallback(() => {
    setSelectedTenantIdForEdit(null);
    setIsUpdateTenantModalOpen(false);
  }, []);

  const handleAddTenant = async (tenantData: Omit<Tenant, 'id' | 'createdAt'>) => {
    if (!selectedCustomerId) {
      alert('Please select a customer to add a tenant to.');
      return;
    }
    try {
      // Use the new addTenant from AppStateContext, passing the selectedCustomerId
      await addTenant({ ...tenantData, customerId: selectedCustomerId });
      setIsAddTenantModalOpen(false);
    } catch (error) {
      console.error("Error adding tenant to customer:", error);
    }
  };

  const handleAddAuthorizedContact = async (contactData: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => {
    if (!selectedCustomerId) return;
    await addAuthorizedContactToCustomer(selectedCustomerId, contactData);
    setIsAddAuthorizedContactModalOpen(false);
  };

  const selectedCustomer = customers.find((c: Customer) => c.id === selectedCustomerId);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-light-light)] dark:bg-[var(--background-light-dark)] font-sans text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">
      <Header />
      <CrmNavbar
        onViewChange={setCurrentView}
        currentView={currentView} // Pass the currentView prop
      />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'customers' && (
          <CustomersView
            onAddCustomerClick={() => setIsAddCustomerModalOpen(true)}
            onAddTenantClick={() => setIsAddTenantModalOpen(true)}
            onAddAuthorizedContactClick={() => setIsAddAuthorizedContactModalOpen(true)}
            onEditCustomer={handleEditCustomer}
            onEditTenant={handleEditTenant}
            // Pass handleDeleteCustomer if needed in CustomersView, or keep it in CrmApp if it's a global action
            // For now, keeping modal triggers in CrmApp as per previous design
          />
        )}
        {currentView === 'tenantMatching' && (
          <TenantMatchingView
            onClose={() => setCurrentView('customers')}
          />
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
      <Modal isOpen={isUpdateTenantModalOpen} onClose={handleCloseUpdateTenantModal} title={`Update Tenant: ${allTenants.find(t => t.id === selectedTenantIdForEdit)?.name || ''}`}>
        <UpdateTenantView
          selectedTenantId={selectedTenantIdForEdit}
          onUpdateSuccess={handleCloseUpdateTenantModal}
        />
      </Modal>
    </div>
  );
};

export default CrmApp;
