import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Tenant, Customer } from '../../types';
import * as crmStorageService from '../../services/crmStorageService';
import Modal from '../common/Modal';
import { PlusIcon } from '../common/icons';
import TenantForm from './TenantForm';
import { useAppState } from '@contexts/AppStateContext';

interface TenantMatchingViewProps {
  onClose: () => void;
}

import TenantVerificationMenu from './TenantVerificationMenu'; // Import the new component

const TenantMatchingView: React.FC<TenantMatchingViewProps> = ({ onClose }) => {
  const { state, addTenant, matchTenantToCustomer, deleteTenants } = useAppState();
  const { allTenants, crmData: allCustomers } = state;

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedCustomerToMatch, setSelectedCustomerToMatch] = useState<string | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [showVerificationMenuForTenantId, setShowVerificationMenuForTenantId] = useState<string | null>(null); // New state

  const matchedTenants = allTenants.filter(tenant => tenant.customerId);
  const unmatchedTenants = allTenants.filter(tenant => !tenant.customerId);

  const handleMatchClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setSelectedCustomerToMatch(tenant.customerId || null);
    setIsMatchModalOpen(true);
  };

  const handleSaveMatch = async () => {
    if (selectedTenant) {
      await matchTenantToCustomer(selectedTenant.id, selectedCustomerToMatch);
      setIsMatchModalOpen(false);
      // After successful match, show the verification menu for the matched tenant
      setShowVerificationMenuForTenantId(selectedTenant.id);
      setSelectedTenant(null);
      setSelectedCustomerToMatch(null);
    }
  };

  const handleCloseVerificationMenu = () => {
    setShowVerificationMenuForTenantId(null);
  };

  const handleAddTenant = async (tenantData: Omit<Tenant, 'id' | 'createdAt'>) => {
    await addTenant(tenantData); // Use context action
    setIsAddTenantModalOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, tenantList: Tenant[]) => {
    if (e.target.checked) {
      setSelectedTenantIds(prevSelected => [...new Set([...prevSelected, ...tenantList.map(tenant => tenant.id)])]);
    } else {
      setSelectedTenantIds(prevSelected => prevSelected.filter(id => !tenantList.map(tenant => tenant.id).includes(id)));
    }
  };

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenantIds(prevSelected =>
      prevSelected.includes(tenantId)
        ? prevSelected.filter(id => id !== tenantId)
        : [...prevSelected, tenantId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedTenantIds.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${selectedTenantIds.length} selected tenant(s)?`)) {
        await deleteTenants(selectedTenantIds); // Use context action
        setSelectedTenantIds([]); // Clear selection after deletion
      }
    }
  };

  const renderTenantTable = (tenants: Tenant[], title: string, isMatchedView: boolean) => {
    const isAllCurrentSelected = tenants.length > 0 && tenants.every(tenant => selectedTenantIds.includes(tenant.id));

    return (
      <div className="mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] mb-3">{title}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-[var(--primary-color-light)] transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600"
                    checked={isAllCurrentSelected}
                    onChange={(e) => handleSelectAll(e, tenants)}
                    disabled={tenants.length === 0}
                    title={`Select all ${title.toLowerCase()}`}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tenant Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tenant ID
                </th> {/* New column for Tenant ID */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Associated Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                    No {title.toLowerCase()} found.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-[var(--primary-color-light)] transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600"
                        checked={selectedTenantIds.includes(tenant.id)}
                        onChange={() => handleSelectTenant(tenant.id)}
                        title={`Select tenant ${tenant.name}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {tenant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {/* Tenant ID as a hyperlink to Microsoft Partner Dashboard */}
                      <p className="text-sm text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80 truncate">
                        MS Tenant ID: <a
                          href={`https://partner.microsoft.com/dashboard/v2/customers/${tenant.microsoftTenantId}/account`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] hover:underline"
                          title={`Open Microsoft Partner Dashboard for ${tenant.microsoftTenantId}`}
                        >
                          {tenant.microsoftTenantId}
                        </a>
                      </p>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
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
            onClick={handleDeleteSelected}
            disabled={selectedTenantIds.length === 0}
            className={`flex items-center font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out ${
              selectedTenantIds.length > 0
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            }`}
            title="Delete Selected Tenants"
          >
            Delete Selected ({selectedTenantIds.length})
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>

      {renderTenantTable(unmatchedTenants, 'Unmatched Tenants', false)}
      {renderTenantTable(matchedTenants, 'Matched Tenants', true)}

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
          allowUnassociated={true}
        />
      </Modal>

      {/* Tenant Verification Menu Modal */}
      {showVerificationMenuForTenantId && (
        <Modal
          isOpen={!!showVerificationMenuForTenantId}
          onClose={handleCloseVerificationMenu}
          title={`Tenant Matched!`}
        >
          <TenantVerificationMenu
            tenant={allTenants.find(t => t.id === showVerificationMenuForTenantId)!} // Find the matched tenant
            onClose={handleCloseVerificationMenu}
          />
        </Modal>
      )}
    </div>
  );
};

export default TenantMatchingView;
