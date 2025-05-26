import React, { useEffect, useState } from 'react';
import { AuthorizedContact } from '../../types';
import { useAppState } from '../../../../contexts/AppStateContext';
import ContactForm from './ContactForm'; // Import the reusable ContactForm

interface UpdateAuthorizedContactViewProps {
  selectedContactId: string | null;
  onUpdateSuccess: () => void;
}

const UpdateAuthorizedContactView: React.FC<UpdateAuthorizedContactViewProps> = ({ selectedContactId, onUpdateSuccess }) => {
  const { state, updateAuthorizedContact } = useAppState();
  const { allAuthorizedContacts } = state;
  const [initialContact, setInitialContact] = useState<AuthorizedContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedContactId) {
      const contactToEdit = allAuthorizedContacts.find(c => c.id === selectedContactId);
      if (contactToEdit) {
        setInitialContact(contactToEdit);
        setIsLoading(false);
      } else {
        setError("Authorized contact not found.");
        setIsLoading(false);
      }
    } else {
      setError("No authorized contact selected for update.");
      setIsLoading(false);
    }
  }, [selectedContactId, allAuthorizedContacts]);

  const handleSubmit = async (updatedContact: Omit<AuthorizedContact, 'id' | 'createdAt'>) => {
    if (!selectedContactId) {
      setError("No authorized contact selected for update.");
      return;
    }
    try {
      const fullUpdatedContact: AuthorizedContact = {
        ...updatedContact,
        id: selectedContactId,
        createdAt: initialContact?.createdAt || new Date().toISOString(),
      };
      await updateAuthorizedContact(fullUpdatedContact);
      onUpdateSuccess();
    } catch (err) {
      console.error("Failed to update authorized contact:", err);
      setError("Failed to update authorized contact. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color-light)] dark:border-[var(--primary-color-dark)]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">{error}</div>;
  }

  if (!initialContact) {
    return <div className="text-gray-600 dark:text-gray-400">No authorized contact data available for editing.</div>;
  }

  return (
    <ContactForm
      initialContact={initialContact}
      customerId={initialContact.customerId} // Pass customerId
      onSubmit={handleSubmit}
      onCancel={onUpdateSuccess}
    />
  );
};

export default UpdateAuthorizedContactView;
