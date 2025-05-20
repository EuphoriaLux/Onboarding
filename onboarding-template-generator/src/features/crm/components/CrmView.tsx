import React, { useState } from 'react';
import CrmNavbar from './CrmNavbar';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import CustomersView from './CustomersView';
import ContactsView from './ContactsView';
import CreateCustomerView from './CreateCustomerView';
import UpdateCustomerView from './UpdateCustomerView';
import { useAppState } from '../../../contexts/AppStateContext';
import { Customer } from '../types';

const CrmView: React.FC = () => {
  const { state, addCustomer, updateCustomer } = useAppState();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'customers' | 'contacts' | 'create' | 'update' | 'delete'>('customers');

  const handleAddCustomer = (customer: Customer) => {
    addCustomer(customer);
  };

  const handleUpdateCustomer = (customer: Customer) => {
    updateCustomer(customer);
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveView('update');
  };

  const handleViewChange = (view: 'customers' | 'contacts' | 'create' | 'update' | 'delete') => {
    setActiveView(view);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900">
      <CrmNavbar onViewChange={handleViewChange} />
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">CRM View</h1>
      {activeView === 'customers' && (
        <CustomersView onSelectCustomer={handleSelectCustomer} />
      )}
      {activeView === 'contacts' && (
        <ContactsView />
      )}
      {activeView === 'create' && (
        <CreateCustomerView />
      )}
      {activeView === 'update' && (
        <UpdateCustomerView selectedCustomerId={selectedCustomerId} />
      )}
    </div>
  );
};

export default CrmView;
