// onboarding-template-generator/src/features/crm/components/CustomerForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import * as crmDataService from '../services/crmDataService';
import { Customer, CustomerNote, CustomerStatus } from '../types';

interface CustomerFormProps {
  customerId?: string | null; // If provided, we are editing; otherwise creating
  onSaveSuccess: (customerId: string) => void; // Callback after successful save/update
  onDeleteSuccess?: () => void; // Callback after successful delete (optional)
  onCancel: () => void; // Callback to close the form
}

// Initial empty state for creating a new customer
const initialCustomerState: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'> = {
  name: '',
  internalName: '', // Add internalName
  email: '',
  phone: '',
  company: '',
  status: CustomerStatus.LEAD, // Default status
  tenantIds: [], // Add tenantIds
  parentId: '', // Add parentId
  notes: [],
};

const CustomerForm: React.FC<CustomerFormProps> = ({
  customerId,
  onSaveSuccess,
  onDeleteSuccess,
  onCancel,
}) => {
  const [customer, setCustomer] = useState<Partial<Customer>>(initialCustomerState);
  // Separate state for the tenant IDs textarea content
  const [tenantIdsString, setTenantIdsString] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(customerId);

  // Fetch customer data if in edit mode
  useEffect(() => {
    if (isEditMode && customerId) {
      const fetchCustomer = async () => {
        setIsLoading(true);
        setError(null);
        console.log(`CustomerForm: Fetching customer ${customerId}...`);
        try {
          const fetchedCustomer = await crmDataService.getCustomer(customerId);
          if (fetchedCustomer) {
            setCustomer(fetchedCustomer);
            // Format tenantIds array into a string for the textarea
            setTenantIdsString((fetchedCustomer.tenantIds || []).join('\n'));
            console.log(`CustomerForm: Customer ${customerId} fetched successfully.`);
          } else {
            setError(`Customer with ID ${customerId} not found.`);
            console.warn(`CustomerForm: Customer ${customerId} not found.`);
          }
        } catch (err) {
          console.error(`CustomerForm: Error fetching customer ${customerId}:`, err);
          setError(err instanceof Error ? err.message : 'Failed to load customer data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCustomer();
    } else {
      // Reset to initial state if switching to create mode or customerId becomes null
      setCustomer(initialCustomerState);
      setTenantIdsString(''); // Reset tenant IDs string as well
      setError(null);
      setIsLoading(false);
    }
  }, [customerId, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: CustomerNote = {
        text: newNote.trim(),
        timestamp: new Date().toISOString(),
        // author: 'Current User' // TODO: Get current user info if available
      };
      setCustomer((prev) => ({
        ...prev,
        notes: [...(prev.notes || []), note],
      }));
      setNewNote('');
    }
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      // Parse tenantIdsString into array before saving
      const tenantIds = tenantIdsString
        .split('\n')
        .map(id => id.trim())
        .filter(id => id); // Remove empty strings

      // Prepare the complete customer data object to save
      const customerDataToSave = {
        ...customer,
        tenantIds: tenantIds,
      };

      let savedCustomer: Customer;
      if (isEditMode) {
        console.log(`CustomerForm: Updating customer ${customerId}...`);
        // Ensure required fields for update are present
        if (!customerDataToSave.id || !customerDataToSave._etag) {
            throw new Error("Cannot update customer: ID or ETag missing.");
        }
        // Pass the full object including parsed tenantIds
        savedCustomer = await crmDataService.updateCustomer(customerDataToSave as Customer);
        console.log(`CustomerForm: Customer ${customerId} updated successfully.`);
      } else {
        console.log("CustomerForm: Creating new customer...");
        // Ensure required fields for create are present
        if (!customerDataToSave.name) {
            throw new Error("Cannot create customer: Name is required.");
        }

        // Construct the object with definite types for required fields
        // to match Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'>
        const dataToCreate: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'> = {
            name: customerDataToSave.name, // Known to be string due to check above
            notes: customerDataToSave.notes || [], // Ensure notes is CustomerNote[]
            // Include other optional fields from customerDataToSave
            internalName: customerDataToSave.internalName,
            email: customerDataToSave.email,
            phone: customerDataToSave.phone,
            company: customerDataToSave.company,
            status: customerDataToSave.status,
            tenantIds: customerDataToSave.tenantIds, // Already processed
            parentId: customerDataToSave.parentId,
        };

        savedCustomer = await crmDataService.createCustomer(dataToCreate);
        console.log(`CustomerForm: Customer created successfully with ID ${savedCustomer.id}.`);
      }
      onSaveSuccess(savedCustomer.id); // Notify parent of success
    } catch (err) {
      console.error("CustomerForm: Error saving customer:", err);
      setError(err instanceof Error ? err.message : 'Failed to save customer data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
     if (!isEditMode || !customer.id || !customer._etag) {
        setError("Cannot delete: Customer ID or ETag missing.");
        return;
    }
    if (!window.confirm(`Are you sure you want to delete customer "${customer.name}"? This cannot be undone.`)) {
        return;
    }

    setError(null);
    setIsDeleting(true);
    try {
        console.log(`CustomerForm: Deleting customer ${customer.id}...`);
        await crmDataService.deleteCustomer(customer.id, customer._etag);
        console.log(`CustomerForm: Customer ${customer.id} deleted successfully.`);
        if (onDeleteSuccess) {
            onDeleteSuccess(); // Notify parent
        }
    } catch (err) {
        console.error(`CustomerForm: Error deleting customer ${customer.id}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to delete customer.');
    } finally {
        setIsDeleting(false);
    }
  };


  if (isLoading) {
    return <p>Loading customer details...</p>;
  }

  // Render form fields
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div>
        <label htmlFor="customer-name">Name: *</label>
        <input
          type="text"
          id="customer-name"
          name="name"
          value={customer.name || ''}
          onChange={handleInputChange}
          required
          disabled={isSaving || isDeleting}
        />
      </div>
      <div>
        <label htmlFor="customer-internalName">Internal Name:</label>
        <input
          type="text"
          id="customer-internalName"
          name="internalName"
          value={customer.internalName || ''}
          onChange={handleInputChange}
          disabled={isSaving || isDeleting}
        />
      </div>
      <div>
        <label htmlFor="customer-email">Email:</label>
        <input
          type="email"
          id="customer-email"
          name="email"
          value={customer.email || ''}
          onChange={handleInputChange}
          disabled={isSaving || isDeleting}
        />
      </div>
      <div>
        <label htmlFor="customer-phone">Phone:</label>
        <input
          type="tel"
          id="customer-phone"
          name="phone"
          value={customer.phone || ''}
          onChange={handleInputChange}
          disabled={isSaving || isDeleting}
        />
      </div>
      <div>
        <label htmlFor="customer-company">Company:</label>
        <input
          type="text"
          id="customer-company"
          name="company"
          value={customer.company || ''}
          onChange={handleInputChange}
          disabled={isSaving || isDeleting}
        />
      </div>
      <div>
        <label htmlFor="customer-status">Status:</label>
        <select
            id="customer-status"
            name="status"
            value={customer.status || CustomerStatus.LEAD}
            onChange={handleInputChange}
            disabled={isSaving || isDeleting}
        >
            {Object.values(CustomerStatus).map(status => (
                <option key={status} value={status}>{status}</option>
            ))}
        </select>
      </div>
      <div>
        <label htmlFor="customer-tenantIds">Tenant IDs (one per line):</label>
        <textarea
          id="customer-tenantIds"
          name="tenantIdsString" // Bind to the temporary string state
          value={tenantIdsString}
          onChange={(e) => setTenantIdsString(e.target.value)} // Update the string state
          rows={3}
          style={{ width: '95%' }}
          placeholder="Enter each Tenant ID on a new line"
          disabled={isSaving || isDeleting}
        />
      </div>
      <div>
        <label htmlFor="customer-parentId">Parent Customer ID:</label>
        <input
          type="text"
          id="customer-parentId"
          name="parentId"
          value={customer.parentId || ''}
          onChange={handleInputChange}
          placeholder="Enter ID of parent company if applicable"
          disabled={isSaving || isDeleting}
        />
      </div>

      {/* Notes Section */}
      <div>
        <h4>Notes</h4>
        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: '0.5rem', padding: '0.5rem' }}>
          {(customer.notes?.length || 0) === 0 ? (
            <p>No notes yet.</p>
          ) : (
            <ul>
              {customer.notes?.map((note, index) => (
                <li key={index}>
                  <small>{new Date(note.timestamp).toLocaleString()}{note.author ? ` by ${note.author}` : ''}:</small>
                  <p style={{ margin: '0 0 0.5rem 0' }}>{note.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <textarea
          id="customer-new-note"
          aria-label="New Note" // Added aria-label for accessibility
          placeholder="Add a new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
          style={{ width: '95%', marginBottom: '0.5rem' }}
          disabled={isSaving || isDeleting}
        />
        <button type="button" onClick={handleAddNote} disabled={!newNote.trim() || isSaving || isDeleting}>
          Add Note
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <button type="submit" disabled={isSaving || isDeleting || isLoading}>
          {isSaving ? 'Saving...' : (isEditMode ? 'Update Customer' : 'Create Customer')}
        </button>
        <button type="button" onClick={onCancel} disabled={isSaving || isDeleting} style={{ marginLeft: '0.5rem' }}>
          Cancel
        </button>
        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSaving || isDeleting || isLoading}
            style={{ marginLeft: '1rem', color: 'red' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Customer'}
          </button>
        )}
      </div>
       {isEditMode && customer.updatedAt && (
            <p><small>Last updated: {new Date(customer.updatedAt).toLocaleString()} (ETag: {customer._etag})</small></p>
        )}
    </form>
  );
};

export default CustomerForm;
