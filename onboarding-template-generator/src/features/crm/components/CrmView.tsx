import React, { useState, useCallback } from 'react';
import CrmNavbar from './CrmNavbar';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import CustomersView from './CustomersView';
import ContactsView from './ContactsView';
import CreateCustomerView from './CreateCustomerView';
import UpdateCustomerView from './UpdateCustomerView';
import CustomerView from './CustomerView';
import AddContactForm from './AddContactForm';
import { useAppState } from '../../../contexts/AppStateContext';
import { Customer, Contact } from '../types';

interface CrmViewProps {}

const CrmView: React.FC<CrmViewProps> = () => {
  const { state, addCustomer, updateCustomer, deleteCustomer, addContactToCustomer, updateContact: updateContactContext, deleteContact: deleteContactContext, setSelectedCustomerId } = useAppState();
  const { selectedCustomerId } = state;
  const [activeView, setActiveView] = useState<'customers' | 'contacts' | 'create' | 'update' | 'delete' | 'addContact'>('customers');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editingCustomer, setEditingCustomer] = useState(false);

  const handleAddCustomer = (customer: Customer) => {
    addCustomer(customer);
  };

  const handleUpdateCustomer = (customer: Customer) => {
    updateCustomer(customer);
  };

  const handleAddContact = useCallback((contact: Contact) => {
    if (selectedCustomerId) {
      addContactToCustomer(selectedCustomerId, contact);
      setActiveView('update'); // Go back to customer view after adding contact
    } else {
      console.error('No customer selected');
    }
  }, [selectedCustomerId, addContactToCustomer]);

  const handleUpdateContact = useCallback((contact: Contact) => {
    if (selectedCustomerId) {
      updateContactContext(selectedCustomerId, contact);
      // Optionally go back to customer view or refresh contacts list
    } else {
      console.error('No customer selected');
    }
  }, [updateContactContext, selectedCustomerId]);

  const handleDeleteContact = useCallback((contactId: string) => {
    if (selectedCustomerId) {
      deleteContactContext(selectedCustomerId, contactId);
      // Optionally go back to customer view or refresh contacts list
    } else {
      console.error('No customer selected');
    }
  }, [deleteContactContext, selectedCustomerId]);


  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveView('update');
  };

  const handleViewChange = (view: 'customers' | 'contacts' | 'create' | 'update' | 'delete' | 'addContact') => {
    setActiveView(view);
    // If navigating away from a customer view, deselect the customer
    if (view !== 'update' && view !== 'addContact') {
      setSelectedCustomerId(null);
    }
  };

  const selectedCustomer = state.crmData.find(customer => customer.id === state.selectedCustomerId);

  return (
    <div className="w-full h-screen bg-gray-100 dark:bg-gray-900">
      <CrmNavbar onViewChange={handleViewChange} />
      <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 mx-auto max-w-7xl"> {/* Adjusted grid to 4 columns */}
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200 col-span-full text-center">Customer Relationship Management</h1>
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> {/* Main content takes 2 columns */}
          {activeView === 'customers' && (
            <CustomersView />
          )}
          {activeView === 'contacts' && (
            <ContactsView />
          )}
          {activeView === 'create' && (
            <CreateCustomerView onCustomerAdded={() => handleViewChange('customers')} />
          )}
          {activeView === 'update' && selectedCustomer && (
            <CustomerView
              customer={selectedCustomer}
              onUpdate={handleUpdateCustomer}
              onDelete={() => { // Handle delete action
                deleteCustomer(selectedCustomer.id);
                handleViewChange('customers'); // Navigate back to customers list after deleting
              }}
              // Removed onAddContact prop from CustomerView
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
            />
          )}
          {activeView === 'addContact' && state.selectedCustomerId && ( // Use state.selectedCustomerId
            <AddContactForm customerId={state.selectedCustomerId} onSubmit={handleAddContact} onCancel={() => setActiveView('update')} /> // Use state.selectedCustomerId, Go back to update view after cancel
          )}
        </div>
        {selectedCustomer && (
          <> {/* Use fragment for multiple elements */}
            <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> {/* Customer Details/Edit sidebar */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Customer Details</h2>
              <div className="mb-4">
                  <strong>Name:</strong> {selectedCustomer.name}
              </div>
              <div className="mb-4">
                  <strong>Email:</strong> {selectedCustomer.email}
              </div>
               <div className="mb-4">
                  <strong>Company:</strong> {selectedCustomer.company}
              </div>
               <div className="mb-4">
                  <strong>Status:</strong> {selectedCustomer.status}
              </div>
               <div className="mb-4">
                  <strong>Onboarding Status:</strong> {selectedCustomer.onboardingStatus}
              </div>

              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Edit Customer</h2>
              <CustomerForm onSubmit={handleUpdateCustomer} initialCustomer={selectedCustomer} />
            </div>
            {console.log('Selected Customer Contacts:', selectedCustomer?.contacts)} {/* Log contacts */}
            <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> {/* Contacts sidebar */}
               <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Contacts</h2>
               {/* Moved Add Contact button here */}
               <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700 text-sm mb-4"
                  onClick={() => setActiveView('addContact')} // Navigate to add contact form
                >
                  Add Contact
                </button>
               {selectedCustomer?.contacts && selectedCustomer.contacts.length > 0 ? (
                  selectedCustomer.contacts.map(contact => (
                      <div key={contact.id} className="mb-2 p-2 border rounded border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {contact.name}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {contact.email}</p>
                        <p className="text-700 dark:text-gray-300"><strong>Phone:</strong> {contact.phone}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Job Title:</strong> {contact.jobTitle}</p>
                         {/* Add edit/delete buttons for contacts here if needed */}
                      </div>
                  ))
               ) : (
                   <p className="text-gray-700 dark:text-gray-300">No contacts found.</p>
               )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CrmView;
