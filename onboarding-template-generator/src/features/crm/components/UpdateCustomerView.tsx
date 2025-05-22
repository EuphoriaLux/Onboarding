import React from 'react';
import CustomerForm from './CustomerForm';
import { useAppState } from '../../../contexts/AppStateContext';
import { Customer } from '../types';

interface UpdateCustomerViewProps {
  selectedCustomerId: string | null;
  onUpdateSuccess: () => void; // New prop for success callback
}

const UpdateCustomerView: React.FC<UpdateCustomerViewProps> = ({ selectedCustomerId, onUpdateSuccess }) => {
  const { updateCustomer, state } = useAppState();

  // Find the selected customer
  const selectedCustomer = state.crmData.find(customer => customer.id === selectedCustomerId);

  if (!selectedCustomer) {
    return <div>No customer selected.</div>;
  }

  const handleSubmit = async (customer: Customer) => {
    await updateCustomer(customer);
    onUpdateSuccess(); // Call the success callback after update
  };

  return (
    <div>
      {/* Removed the duplicate <h2>Update Customer</h2> here */}
      <CustomerForm onSubmit={handleSubmit} initialCustomer={selectedCustomer} />
    </div>
  );
};

export default UpdateCustomerView;
