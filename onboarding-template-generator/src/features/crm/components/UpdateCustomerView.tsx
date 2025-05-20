import React from 'react';
import CustomerForm from './CustomerForm';
import { useAppState } from '../../../contexts/AppStateContext';
import { Customer } from '../types';

interface UpdateCustomerViewProps {
  selectedCustomerId: string | null;
}

const UpdateCustomerView: React.FC<UpdateCustomerViewProps> = ({ selectedCustomerId }) => {
  const { updateCustomer, state } = useAppState();

  // Find the selected customer
  const selectedCustomer = state.crmData.find(customer => customer.id === selectedCustomerId);

  if (!selectedCustomer) {
    return <div>No customer selected.</div>;
  }

  return (
    <div>
      <h2>Update Customer</h2>
      <CustomerForm onSubmit={updateCustomer} initialCustomer={selectedCustomer} />
    </div>
  );
};

export default UpdateCustomerView;
