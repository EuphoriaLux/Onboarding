import React, { useState, useEffect } from 'react';
import { AuthorizedContact } from '../types/index'; // Updated import path

interface AddAuthorizedContactFormProps {
  onAddContact: (contactData: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddAuthorizedContactForm: React.FC<AddAuthorizedContactFormProps> = ({ onAddContact, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); // Renamed from familyName
  const [fullName, setFullName] = useState(''); // Derived state
  const [email, setEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [teamsAddress, setTeamsAddress] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  // Effect to update fullName automatically
  useEffect(() => {
    setFullName(
      [firstName, lastName].filter(Boolean).join(' ').trim()
    );
  }, [firstName, lastName]);

  const validate = (): boolean => {
    const newErrors: { fullName?: string; email?: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required (derived from First and Last Name).';
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
    
    onAddContact({ 
      fullName, 
      firstName, 
      lastName, // Use lastName
      email, 
      businessPhone, 
      mobileNumber, 
      teamsAddress, 
      jobTitle 
    });
    setFirstName('');
    setLastName('');
    setEmail('');
    setBusinessPhone('');
    setMobileNumber('');
    setTeamsAddress('');
    setJobTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          First Name (Optional)
        </label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., Jane"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Last Name (Optional)
        </label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., Doe"
        />
      </div>
      <div>
        <label htmlFor="fullNameDisplay" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Full Name (Auto-completed) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullNameDisplay"
          value={fullName}
          readOnly
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 ${errors.fullName ? 'border-red-500' : ''} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`}
          placeholder="Auto-generated from First and Last Name"
        />
        {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
      </div>
      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="contactEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 ${errors.email ? 'border-red-500' : ''}`}
          placeholder="e.g., jane.doe@example.com"
        />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="businessPhone" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Business Phone (Optional)
        </label>
        <input
          type="tel"
          id="businessPhone"
          value={businessPhone}
          onChange={(e) => setBusinessPhone(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., +1-234-567-8900"
        />
      </div>
      <div>
        <label htmlFor="mobileNumber" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Mobile Number (Optional)
        </label>
        <input
          type="tel"
          id="mobileNumber"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., +1-987-654-3210"
        />
      </div>
      <div>
        <label htmlFor="teamsAddress" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Teams Address (Optional)
        </label>
        <input
          type="text"
          id="teamsAddress"
          value={teamsAddress}
          onChange={(e) => setTeamsAddress(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., jane.doe@teams.com"
        />
      </div>
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-1">
          Job Title (Optional)
        </label>
        <input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g., IT Manager"
        />
      </div>
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
          Add Contact
        </button>
      </div>
    </form>
  );
};

export default AddAuthorizedContactForm;
