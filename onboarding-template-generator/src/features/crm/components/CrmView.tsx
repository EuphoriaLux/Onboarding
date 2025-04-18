// onboarding-template-generator/src/features/crm/components/CrmView.tsx
import React, { useState, useCallback } from 'react';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
// import useCrm from '../hooks/useCrm'; // Keep commented for now

const CrmView: React.FC = () => {
  // State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [listRefreshTrigger, setListRefreshTrigger] = useState<number>(0); // To force list refresh

  // Handlers
  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setShowCreateForm(false);
  };

  const handleShowCreate = () => {
    setSelectedCustomerId(null);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setSelectedCustomerId(null);
    setShowCreateForm(false);
  };

  // Callback for successful save/update/delete to refresh list and close form
  const handleSaveSuccess = useCallback((savedCustomerId: string) => {
    console.log("CrmView: Save successful for", savedCustomerId);
    setListRefreshTrigger(prev => prev + 1); // Increment trigger to refresh list
    setSelectedCustomerId(savedCustomerId); // Select the saved/updated customer
    setShowCreateForm(false); // Close create form if it was open
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    console.log("CrmView: Delete successful");
    setListRefreshTrigger(prev => prev + 1); // Refresh list
    setSelectedCustomerId(null); // Deselect customer
    setShowCreateForm(false); // Ensure form is closed
  }, []);


  return (
    <div style={{ padding: '1rem' }}>
      <h2>Customer Management</h2>
      <button onClick={handleShowCreate} disabled={showCreateForm}>
        Add New Customer
      </button>

      {/* TODO: Integrate CustomerList and CustomerForm */}
      <div style={{ display: 'flex', marginTop: '1rem', gap: '1rem' }}>
        {/* Customer List Pane */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '0.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          <h3>Customer List</h3>
          <CustomerList
            onSelectCustomer={handleSelectCustomer}
            refreshTrigger={listRefreshTrigger}
          />
        </div>
        {/* Details/Form Pane */}
        <div style={{ flex: 2, border: '1px solid #ccc', padding: '0.5rem' }}>
          <h3>Details / Form</h3>
          {showCreateForm && (
            <>
              <h4>Create New Customer</h4>
              <CustomerForm
                onSaveSuccess={handleSaveSuccess}
                onCancel={handleCloseForm}
              />
            </>
          )}
          {selectedCustomerId && !showCreateForm && (
            <>
              <h4>Edit Customer</h4>
              <CustomerForm
                customerId={selectedCustomerId}
                onSaveSuccess={handleSaveSuccess}
                onDeleteSuccess={handleDeleteSuccess}
                onCancel={handleCloseForm}
              />
            </>
          )}
          {!showCreateForm && !selectedCustomerId && (
            <p>Select a customer from the list or click "Add New Customer".</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrmView;
