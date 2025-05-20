import React from 'react';
import CustomerForm from './CustomerForm';
import { useAppState } from '../../../contexts/AppStateContext';

const CreateCustomerView: React.FC = () => {
  const { addCustomer } = useAppState();

  return (
    <div>
      <h2>Create Customer</h2>
      <CustomerForm onSubmit={addCustomer} />
    </div>
  );
};

export default CreateCustomerView;
