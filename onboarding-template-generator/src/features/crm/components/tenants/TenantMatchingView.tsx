import React, { useState, useEffect } from 'react';
import { Tenant, Customer } from '../../types';
import * as crmStorageService from '../../services/crmStorageService';
import Modal from '../common/Modal';
import { PlusIcon } from '../common/icons';
import TenantForm from './TenantForm'; // Import TenantForm
import { useAppState } from '@contexts/AppStateContext'; // Use alias

interface TenantMatchingViewProps {
  onClose: () => void;
}

const TenantMatchingView: React.FC<TenantMatchingViewProps> = ({ onClose }) => {
  const { state, addTenant, matchTenantToCustomer } = useAppState(); // Use addTenant and matchTenantToCustomer from context
  const { allTenants, crmData: allCustomers } = state; // Get allTenants and allCustomers from AppState

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedCustomerToMatch, setSelectedCustomerToMatch] = useState<string | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false); // State for Add Tenant modal

  // No need for useEffect to fetch all tenants/customers here, AppStateContext provides them
  // The list will update automatically when AppState changes

  const handleMatchClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setSelectedCustomerToMatch(tenant.customerId || null); // Pre-select if already matched
    setIsMatchModalOpen(true);
  };

  const handleSaveMatch = async () => {
    if (selectedTenant) {
      await matchTenantToCustomer(selectedTenant.id, selectedCustomerToMatch); // Use context action
      setIsMatchModalOpen(false);
      setSelectedTenant(null);
      setSelectedCustomerToMatch(null);
      // AppStateContext will re-fetch tenants and update state
    }
  };

  const handleAddTenant = async (tenantData: Omit<Tenant, 'id' | 'createdAt'>) => {
    await addTenant(tenantData); // Use context action
    setIsAddTenantModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 flex flex-col flex-grow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">Tenant Matching</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAddTenantModalOpen(true)}
            className="flex items-center bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
            title="Add New Tenant"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Tenant
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tenant Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Associated Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {allTenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tenant.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {allCustomers.find(c => c.id === tenant.customerId)?.name || 'Not Associated'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleMatchClick(tenant)}
                    className="text-[var(--primary-color-light)] hover:text-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:text-[var(--primary-color-dark)] dark:hover:text-[color-mix(in srgb, var(--primary-color-dark) 80%, black)]"
                  >
                    {tenant.customerId ? 'Change Match' : 'Match'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isMatchModalOpen} onClose={() => setIsMatchModalOpen(false)} title={`Match Tenant: ${selectedTenant?.name || ''}`}>
        <div className="p-4">
          <label htmlFor="customer-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Customer:
          </label>
          <select
            id="customer-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--primary-color-light)] focus:border-[var(--primary-color-light)] sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            value={selectedCustomerToMatch || ''}
            onChange={(e) => setSelectedCustomerToMatch(e.target.value)}
          >
            <option value="">-- Select a Customer --</option>
            {allCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsMatchModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMatch}
              className="bg-[var(--primary-color-light)] hover:bg-[color-mix(in srgb, var(--primary-color-light) 80%, black)] dark:bg-[var(--primary-color-dark)] dark:hover:bg-[color-mix(in srgb, var(--primary-color-dark) 80%, black)] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
              disabled={!selectedCustomerToMatch}
            >
              Save Match
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Tenant Modal */}
      <Modal isOpen={isAddTenantModalOpen} onClose={() => setIsAddTenantModalOpen(false)} title="Add New Tenant">
        <TenantForm
          onSubmit={handleAddTenant}
          onCancel={() => setIsAddTenantModalOpen(false)}
          // Pass a flag to indicate this is for unassociated tenants, if TenantForm needs it
          allowUnassociated={true}
        />
      </Modal>
    </div>
  );
};

export default TenantMatchingView;
