import React from 'react';
import CustomerForm from './CustomerForm';
import { useAppState } from '../../../contexts/AppStateContext';
import { Customer } from '../types'; // Import Customer type

interface CreateCustomerViewProps {
  onCustomerAdded: () => void;
}

const CreateCustomerView: React.FC<CreateCustomerViewProps> = ({ onCustomerAdded }) => {
  const { addCustomer } = useAppState();

  const handleSubmit = (customer: Customer) => {
    addCustomer(customer);
    onCustomerAdded(); // Call the callback after adding the customer
  };

  return (
    <div>
      <h2>Create Customer</h2>
      <CustomerForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateCustomerView;
