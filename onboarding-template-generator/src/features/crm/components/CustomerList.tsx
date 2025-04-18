// onboarding-template-generator/src/features/crm/components/CustomerList.tsx
import React, { useState, useEffect } from 'react';
import * as crmDataService from '../services/crmDataService';

interface CustomerListItem {
  id: string;
  name: string;
  internalName?: string; // Add internalName
  updatedAt: string;
}

interface CustomerListProps {
  onSelectCustomer: (id: string) => void;
  refreshTrigger?: number; // Optional prop to trigger refresh
}

const CustomerList: React.FC<CustomerListProps> = ({ onSelectCustomer, refreshTrigger = 0 }) => {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("CustomerList: Fetching customers...");
        const customerList = await crmDataService.listCustomers();
        // Sort by name for consistent display
        customerList.sort((a, b) => a.name.localeCompare(b.name));
        setCustomers(customerList);
        console.log("CustomerList: Customers fetched successfully.", customerList.length);
      } catch (err) {
        console.error("CustomerList: Error fetching customers:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching customers.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  if (isLoading) {
    return <p>Loading customers...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (customers.length === 0) {
    return <p>No customers found.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {customers.map((customer) => (
        <li
          key={customer.id}
          onClick={() => onSelectCustomer(customer.id)}
          style={{
            padding: '0.5rem',
            borderBottom: '1px solid #eee',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {/* Display internal name prominently if it exists, otherwise display primary name */}
          <strong>{customer.internalName || customer.name}</strong>
          {/* Show primary name in parentheses if internal name is different */}
          {customer.internalName && customer.name !== customer.internalName && (
            <span style={{ fontSize: '0.8em', marginLeft: '5px', color: '#666' }}>({customer.name})</span>
          )}
          <br />
          <small>ID: {customer.id}</small>
          <br />
          <small>Updated: {new Date(customer.updatedAt).toLocaleString()}</small>
        </li>
      ))}
    </ul>
  );
};

export default CustomerList;
