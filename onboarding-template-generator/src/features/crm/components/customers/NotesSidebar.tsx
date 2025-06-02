import React, { useState } from 'react';
import { Customer } from '../../types';
import { PlusIcon } from '../common/icons'; // Assuming PlusIcon is available here

import { CustomerNote } from '../../types'; // Import CustomerNote

interface Note extends CustomerNote {} // Use CustomerNote directly or extend it

interface NotesSidebarProps {
  customer: Customer | null;
  onUpdateCustomer: (customer: Customer) => void;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({ customer, onUpdateCustomer }) => {
  const [newNoteText, setNewNoteText] = useState('');

  if (!customer) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-4">Notes</h3>
        <p className="text-gray-600 dark:text-gray-400">Select a customer to view notes.</p>
      </div>
    );
  }

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      const updatedNotes: CustomerNote[] = [
        ...(customer.notes || []),
        { text: newNoteText.trim(), timestamp: new Date().toISOString() }, // Use ISO string for timestamp
      ];
      const updatedCustomer = { ...customer, notes: updatedNotes };
      onUpdateCustomer(updatedCustomer);
      setNewNoteText('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg flex flex-col flex-grow">
      <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-4">Notes</h3>
      <div className="flex-grow overflow-y-auto mb-4 pr-2"> {/* Added pr-2 for scrollbar */}
        {customer.notes && customer.notes.length > 0 ? (
          <ul className="space-y-3">
            {customer.notes.map((note, index) => (
              <li key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 text-sm">
                <p>{note.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(note.timestamp).toLocaleString()} {/* Still display as local string */}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No notes found for this customer.</p>
        )}
      </div>
      <div className="flex mt-auto"> {/* Use mt-auto to push to bottom */}
        <input
          type="text"
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Add a new note..."
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={handleAddNote}
          className="bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] text-white font-semibold py-2 px-4 rounded-r-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center justify-center"
          title="Add Note"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NotesSidebar;
