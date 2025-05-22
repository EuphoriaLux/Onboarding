
import React, { useState, useEffect, useCallback } from 'react';
import { Customer, Tenant, SubscriptionStatus, AuthorizedContact } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CustomerList from './components/CustomerList';
import TenantList from './components/TenantList';
import Modal from './components/Modal';
import AddCustomerForm from './components/AddCustomerForm';
import AddTenantForm from './components/AddTenantForm';
import CustomerContactSidebar from './components/CustomerContactSidebar';
import AuthorizedContactsSidebar from './components/AuthorizedContactsSidebar';
import AddAuthorizedContactForm from './components/AddAuthorizedContactForm';
import { PlusIcon } from './components/icons';

const initialCustomers: Customer[] = [
  { id: 'cust1', name: 'Innovate Solutions Ltd. More Detailed Name for Testing Truncation and Layout Adjustments', contactEmail: 'contact@innovate.com', createdAt: new Date(Date.now() - 100000000).toISOString() },
  { id: 'cust2', name: 'Synergy Corp', contactEmail: 'info@synergy.com', createdAt: new Date(Date.now() - 200000000).toISOString() },
  { id: 'cust3', name: 'Apex Digital Services International Group Holdings LLC', contactEmail: 'support@apex.com', createdAt: new Date(Date.now() - 50000000).toISOString() },
];

const initialTenants: Tenant[] = [
  { id: 'ten1', customerId: 'cust1', name: 'Innovate Prod Tenant', microsoftTenantId: 'innovate.onmicrosoft.com', subscriptionStatus: 'Active', createdAt: new Date(Date.now() - 50000000).toISOString() },
  { id: 'ten2', customerId: 'cust1', name: 'Innovate Dev Tenant', microsoftTenantId: 'innovatedev.onmicrosoft.com', subscriptionStatus: 'Trial', createdAt: new Date(Date.now() - 40000000).toISOString() },
  { id: 'ten3', customerId: 'cust2', name: 'Synergy Main Tenant', microsoftTenantId: 'synergy.onmicrosoft.com', subscriptionStatus: 'Active', createdAt: new Date(Date.now() - 60000000).toISOString() },
  { id: 'ten4', customerId: 'cust3', name: 'Apex Primary', microsoftTenantId: 'apex.onmicrosoft.com', subscriptionStatus: 'Inactive', createdAt: new Date(Date.now() - 20000000).toISOString() },
];

const initialAuthorizedContacts: AuthorizedContact[] = [
  { id: 'ac1', customerId: 'cust1', name: 'Alice Smith Wonderland', email: 'alice.smith.innovations@innovate.com', phone: '555-0101-12345', createdAt: new Date().toISOString() },
  { id: 'ac2', customerId: 'cust1', name: 'Bob Johnson Junior The Third', email: 'bob.johnson.the.third.esquire@innovate.com', createdAt: new Date().toISOString() },
  { id: 'ac3', customerId: 'cust2', name: 'Carol White', email: 'carol.white@synergy.com', phone: '555-0102', createdAt: new Date().toISOString() },
];


const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [authorizedContacts, setAuthorizedContacts] = useState<AuthorizedContact[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddAuthorizedContactModalOpen, setIsAddAuthorizedContactModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(initialCustomers);
      setTenants(initialTenants);
      setAuthorizedContacts(initialAuthorizedContacts);
      setIsLoading(false);
      if (initialCustomers.length > 0) {
        setSelectedCustomerId(initialCustomers[0].id);
      }
    }, 1000);
  }, []);

  const handleSelectCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId);
  }, []);

  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setSelectedCustomerId(newCustomer.id); // Select the new customer
    setIsAddCustomerModalOpen(false);
  };

  const handleAddTenant = (tenantData: Omit<Tenant, 'id' | 'customerId' | 'createdAt'>) => {
    if (!selectedCustomerId) return;
    const newTenant: Tenant = {
      ...tenantData,
      id: `ten-${Date.now()}`,
      customerId: selectedCustomerId,
      createdAt: new Date().toISOString(),
    };
    setTenants(prev => [newTenant, ...prev]);
    setIsAddTenantModalOpen(false);
  };

  const handleAddAuthorizedContact = (contactData: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => {
    if (!selectedCustomerId) return;
    const newContact: AuthorizedContact = {
      ...contactData,
      id: `ac-${Date.now()}`,
      customerId: selectedCustomerId,
      createdAt: new Date().toISOString(),
    };
    setAuthorizedContacts(prev => [newContact, ...prev]);
    setIsAddAuthorizedContactModalOpen(false);
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const displayedTenants = tenants.filter(t => t.customerId === selectedCustomerId);
  const displayedAuthorizedContacts = authorizedContacts.filter(ac => ac.customerId === selectedCustomerId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Customer List Section */}
            <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-700">Customers</h2>
                <button
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  className="flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
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
              />
            </div>

            {/* Tenant List Section */}
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-700">
                  {selectedCustomer ? `${selectedCustomer.name}'s Tenants` : 'Select a Customer'}
                </h2>
                <button
                  onClick={() => setIsAddTenantModalOpen(true)}
                  disabled={!selectedCustomerId}
                  className="flex items-center bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
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
              />
            </div>
            
            {/* Sidebars Column */}
            <div className="lg:col-span-1 flex flex-col space-y-6">
              <CustomerContactSidebar customer={selectedCustomer} />
              <AuthorizedContactsSidebar 
                contacts={displayedAuthorizedContacts} 
                selectedCustomerId={selectedCustomerId}
                onAddContactClick={() => setIsAddAuthorizedContactModalOpen(true)}
                customerName={selectedCustomer?.name}
              />
            </div>
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
        <AddTenantForm 
          onAddTenant={handleAddTenant} 
          onCancel={() => setIsAddTenantModalOpen(false)} 
        />
      </Modal>

      <Modal isOpen={isAddAuthorizedContactModalOpen} onClose={() => setIsAddAuthorizedContactModalOpen(false)} title={`Add Contact for ${selectedCustomer?.name || ''}`}>
        <AddAuthorizedContactForm
          onAddContact={handleAddAuthorizedContact}
          onCancel={() => setIsAddAuthorizedContactModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default App;
