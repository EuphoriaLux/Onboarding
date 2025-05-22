import React, { useState, useEffect } from 'react';
import { Customer, OnboardingStatus } from '../types';

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
  initialCustomer?: Customer | null;
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
      _etag: initialCustomer?._etag || undefined, // Include _etag for updates
      tenants: initialCustomer?.tenants || [], // Include existing tenants
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{initialCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
      <div>
        <label className="block text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] text-sm font-bold mb-1">
          Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm text-black dark:text-white font-normal" />
        </label>
      </div>
      <div>
        <label className="block text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] text-sm font-bold mb-1">
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm text-black dark:text-white font-normal" />
        </label>
      </div>
      <div>
        <label className="block text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] text-sm font-bold mb-1">
          Company:
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm text-black dark:text-white font-normal" />
        </label>
      </div>
      <div>
        <label className="block text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] text-sm font-bold mb-1">
          Onboarding Status:
          <select value={onboardingStatus} onChange={e => setOnboardingStatus(e.target.value as OnboardingStatus)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm text-black dark:text-white font-normal">
            <option value={OnboardingStatus.NOT_STARTED}>Not Started</option>
            <option value={OnboardingStatus.IN_PROGRESS}>In Progress</option>
            <option value={OnboardingStatus.COMPLETED}>Completed</option>
            <option value={OnboardingStatus.ON_HOLD}>On Hold</option>
          </select>
        </label>
      </div>
      <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] transition-colors">{initialCustomer ? 'Update Customer' : 'Add Customer'}</button>
    </form>
  );
};

export default CustomerForm;
