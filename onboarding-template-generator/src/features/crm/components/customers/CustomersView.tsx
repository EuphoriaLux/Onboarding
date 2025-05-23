import React from 'react';
import CustomerList from './CustomerList';
import { useAppState } from '../../../contexts/AppStateContext';

interface CustomersViewProps {
  // Removed onSelectCustomer prop
}

const CustomersView: React.FC<CustomersViewProps> = () => { // Removed onSelectCustomer from props
  const { state } = useAppState();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Customers</h2>
      <CustomerList customers={state.crmData} /> {/* Removed onSelectCustomer prop */}
    </div>
  );
};

export default CustomersView;
