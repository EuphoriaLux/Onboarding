import React, { useState, useEffect } from 'react';
import { AuthorizedContact } from '../../types/index';
import FormField from '../../../../components/FormField'; // Import FormField

interface AddAuthorizedContactFormProps {
  onAddContact: (contactData: Omit<AuthorizedContact, 'id' | 'customerId' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddAuthorizedContactForm: React.FC<AddAuthorizedContactFormProps> = ({ onAddContact, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [teamsAddress, setTeamsAddress] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

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
      lastName,
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
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Add New Authorized Contact</h2>
      <FormField
        label="First Name (Optional)"
        id="firstName"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="e.g., Jane"
      />
      <FormField
        label="Last Name (Optional)"
        id="lastName"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="e.g., Doe"
      />
      <FormField
        label="Full Name (Auto-completed)"
        id="fullNameDisplay"
        type="text"
        value={fullName}
        readOnly
        className={`bg-gray-100 dark:bg-gray-700 cursor-not-allowed ${errors.fullName ? 'border-red-500' : ''}`}
        placeholder="Auto-generated from First and Last Name"
      />
      {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
      <FormField
        label="Email Address"
        id="contactEmail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={`${errors.email ? 'border-red-500' : ''}`}
        placeholder="e.g., jane.doe@example.com"
      />
      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      <FormField
        label="Business Phone (Optional)"
        id="businessPhone"
        type="tel"
        value={businessPhone}
        onChange={(e) => setBusinessPhone(e.target.value)}
        placeholder="e.g., +1-234-567-8900"
      />
      <FormField
        label="Mobile Number (Optional)"
        id="mobileNumber"
        type="tel"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        placeholder="e.g., +1-987-654-3210"
      />
      <FormField
        label="Teams Address (Optional)"
        id="teamsAddress"
        type="text"
        value={teamsAddress}
        onChange={(e) => setTeamsAddress(e.target.value)}
        placeholder="e.g., jane.doe@teams.com"
      />
      <FormField
        label="Job Title (Optional)"
        id="jobTitle"
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="e.g., IT Manager"
      />
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
