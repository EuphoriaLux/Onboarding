import React, { useState } from 'react';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import { useAppState } from '../../../contexts/AppStateContext';
import { Customer } from '../types';

const CrmView: React.FC = () => {
  const { state, addCustomer, updateCustomer } = useAppState();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAddCustomer = (customer: Customer) => {
    addCustomer(customer);
  };

  const handleUpdateCustomer = (customer: Customer) => {
    updateCustomer(customer);
    setSelectedCustomer(null); // Clear selected customer after update
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">CRM View</h1>
      <CustomerForm onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer} initialCustomer={selectedCustomer} />
      <CustomerList customers={state.crmData} onSelectCustomer={handleSelectCustomer} />
    </div>
  );
};

export default CrmView;
