import React, { useState } from 'react';
import { Contact } from '../types';

interface AddContactFormProps {
  customerId: string;
  onSubmit: (contact: Contact) => void;
  onCancel: () => void;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ customerId, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      id: Math.random().toString(), // Generate a random ID for now
      customerId: customerId,
      name: name,
      email: email,
      phone: phone,
      jobTitle: jobTitle,
    };
    onSubmit(newContact);
    setName('');
    setEmail('');
    setPhone('');
    setJobTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Add New Contact</h2>
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
          Phone:
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600" />
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
          Job Title:
          <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600" />
        </label>
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700">Add Contact</button>
      <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:hover:bg-gray-700 ml-2">Cancel</button>
    </form>
  );
};

export default AddContactForm;
