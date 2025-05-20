import React from 'react';
import CustomerList from './CustomerList';
import { useAppState } from '../../../contexts/AppStateContext';

interface CustomersViewProps {
  onSelectCustomer: (customerId: string) => void;
}

const CustomersView: React.FC<CustomersViewProps> = ({ onSelectCustomer }) => {
  const { state } = useAppState();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Customers</h2>
      <CustomerList customers={state.crmData} onSelectCustomer={onSelectCustomer} />
    </div>
  );
};

export default CustomersView;
