
import React, { useState } from 'react';
import { Customer } from '../types';

interface AddCustomerFormProps {
  onAddCustomer: (customerData: Omit<Customer, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onAddCustomer, onCancel }) => {
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Customer name is required.');
      return;
    }
    setError('');
    onAddCustomer({ name, contactEmail });
    setName('');
    setContactEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-1">
          Customer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="customerName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="e.g., Contoso Ltd."
        />
      </div>
      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-1">
          Contact Email (Optional)
        </label>
        <input
          type="email"
          id="contactEmail"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="e.g., contact@contoso.com"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Add Customer
        </button>
      </div>
    </form>
  );
};

export default AddCustomerForm;
