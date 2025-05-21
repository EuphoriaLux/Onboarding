import React, { useState, useEffect } from 'react';
import { Customer, OnboardingStatus } from '../types';

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
  initialCustomer?: Customer | null;
  customer?: Customer;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialCustomer }) => {
  const [name, setName] = useState(initialCustomer?.name || '');
  const [email, setEmail] = useState(initialCustomer?.email || '');
  const [company, setCompany] = useState(initialCustomer?.company || '');
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>(initialCustomer?.onboardingStatus || OnboardingStatus.NOT_STARTED);

  // Update local state when initialCustomer prop changes
  useEffect(() => {
    setName(initialCustomer?.name || '');
    setEmail(initialCustomer?.email || '');
    setCompany(initialCustomer?.company || '');
    setOnboardingStatus(initialCustomer?.onboardingStatus || OnboardingStatus.NOT_STARTED);
  }, [initialCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: initialCustomer?.id || Math.random().toString(), // Temporary ID
      name,
      email,
      company,
      onboardingStatus,
      notes: initialCustomer?.notes || [],
      contacts: initialCustomer?.contacts || [], // Include existing contacts
      createdAt: initialCustomer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(newCustomer);
    // Only clear the form if it's for adding a new customer (no initialCustomer)
    if (!initialCustomer) {
      setName('');
      setEmail('');
      setCompany('');
      setOnboardingStatus(OnboardingStatus.NOT_STARTED);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{initialCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
      <div className="mb-2">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
          Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600" />
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600" />
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
          Company:
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600" />
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
          Onboarding Status:
          <select value={onboardingStatus} onChange={e => setOnboardingStatus(e.target.value as OnboardingStatus)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600">
            <option value={OnboardingStatus.NOT_STARTED}>Not Started</option>
            <option value={OnboardingStatus.IN_PROGRESS}>In Progress</option>
            <option value={OnboardingStatus.COMPLETED}>Completed</option>
            <option value={OnboardingStatus.ON_HOLD}>On Hold</option>
          </select>
        </label>
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700">{initialCustomer ? 'Update Customer' : 'Add Customer'}</button>
    </form>
  );
};

export default CustomerForm;
