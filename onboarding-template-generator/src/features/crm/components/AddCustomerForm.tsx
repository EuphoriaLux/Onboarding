import React, { useState } from 'react';
import { Customer } from '../types/index'; // Updated import path

interface AddCustomerFormProps {
  onAddCustomer: (customerData: Omit<Customer, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onAddCustomer, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Changed from contactEmail to email
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Customer name is required.');
      return;
    }
    setError('');
    onAddCustomer({ 
      name, 
      email, 
      notes: [], // Initialize notes as an empty array
      updatedAt: new Date().toISOString(), // Set current timestamp for updatedAt
    });
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Customer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="customerName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--text-color-light)] opacity-30 dark:border-[var(--text-color-dark)] opacity-30 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm"
          placeholder="e.g., Contoso Ltd."
        />
      </div>
      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Contact Email (Optional)
        </label>
        <input
          type="email"
          id="contactEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--text-color-light)] opacity-30 dark:border-[var(--text-color-dark)] opacity-30 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm"
          placeholder="e.g., contact@contoso.com"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] bg-[var(--background-light-light)] hover:bg-[color-mix(in srgb, var(--background-light-light) 90%, black)] dark:bg-[var(--background-light-dark)] dark:hover:bg-[color-mix(in srgb, var(--background-light-dark) 90%, black)] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color-light)] opacity-70 dark:focus:ring-[var(--text-color-dark)] opacity-70 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] transition-colors"
        >
          Add Customer
        </button>
      </div>
    </form>
  );
};

export default AddCustomerForm;
