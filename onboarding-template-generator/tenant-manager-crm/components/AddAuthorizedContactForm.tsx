
import React, { useState } from 'react';
import { AuthorizedContact } from '../types';

interface AddAuthorizedContactFormProps {
  onAddContact: (contactData: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddAuthorizedContactForm: React.FC<AddAuthorizedContactFormProps> = ({ onAddContact, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = 'Contact name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    onAddContact({ name, email, phone });
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="contactName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
          placeholder="e.g., Jane Doe"
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="contactEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
          placeholder="e.g., jane.doe@example.com"
        />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700 mb-1">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="contactPhone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="e.g., 555-123-4567"
        />
      </div>
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
          Add Contact
        </button>
      </div>
    </form>
  );
};

export default AddAuthorizedContactForm;
