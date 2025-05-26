import { Customer, AuthorizedContact, Tenant } from '../types/index';
import { v4 as uuidv4 } from 'uuid'; // Revert to named import

const STORAGE_KEY = 'crmData';

interface CrmStorageData {
  customers: Customer[];
  tenants: Tenant[]; // New: Top-level tenants array
}

export const getStorageData = async (): Promise<CrmStorageData> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        const storedData = result[STORAGE_KEY];
        if (storedData && typeof storedData === 'object' && Array.isArray(storedData.customers) && Array.isArray(storedData.tenants)) {
          resolve(storedData);
        } else {
          // Initialize with empty arrays if data is missing or malformed
          resolve({ customers: [], tenants: [] });
        }
      });
    } else {
      const localStorageData = localStorage.getItem(STORAGE_KEY);
      try {
        const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
        if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.customers) && Array.isArray(parsedData.tenants)) {
          resolve(parsedData);
        } else {
          resolve({ customers: [], tenants: [] });
        }
      } catch (e) {
        console.warn("Error parsing localStorage data. Using empty fallback.", e);
        resolve({ customers: [], tenants: [] });
      }
    }
  });
};

export const setStorageData = async (data: CrmStorageData): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: data }, () => {
        resolve();
      });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      resolve();
    }
  });
};

export const listCustomers = async (): Promise<{ id: string; name: string; internalName?: string; updatedAt: string }[]> => {
  const data = await getStorageData();
  return data.customers.map(c => ({
    id: c.id,
    name: c.name,
    internalName: c.internalName,
    updatedAt: c.updatedAt,
  }));
};

export const getCustomer = async (customerId: string): Promise<Customer | null> => {
  const data = await getStorageData();
  return data.customers.find(c => c.id === customerId) || null;
};

export const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'>): Promise<Customer> => {
  const data = await getStorageData();
  const newId = uuidv4(); // Revert to uuidv4()
  const now = new Date().toISOString();
  const newCustomer: Customer = {
    ...customerData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    notes: customerData.notes || [],
    contacts: customerData.contacts || [],
    // Tenants are now managed globally, not nested in customer
    _etag: uuidv4(), // Revert to uuidv4()
  };
  data.customers.push(newCustomer);
  await setStorageData(data);
  return newCustomer;
};

export const updateCustomer = async (customerData: Customer): Promise<Customer> => {
  const data = await getStorageData();
  const now = new Date().toISOString();
  const index = data.customers.findIndex(c => c.id === customerData.id);
  if (index === -1) {
    throw new Error(`Customer with ID ${customerData.id} not found.`);
  }
  // Simulate ETag check (optional for local storage, but good practice for API consistency)
  if (customerData._etag && data.customers[index]._etag !== customerData._etag) {
    console.warn(`Concurrency conflict for customer ${customerData.id}. ETag mismatch.`);
    // In a real app, you might throw an error or merge changes
  }

  const updatedCustomer: Customer = {
    ...customerData,
    updatedAt: now,
    _etag: uuidv4(), // Revert to uuidv4()
  };
  data.customers[index] = updatedCustomer;
  await setStorageData(data);
  return updatedCustomer;
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  const data = await getStorageData();
  data.customers = data.customers.filter(c => c.id !== customerId);
  await setStorageData(data);
};

export const addAuthorizedContactToCustomer = async (customerId: string, contact: AuthorizedContact): Promise<Customer> => {
  const customer = await getCustomer(customerId);
  if (!customer) throw new Error(`Customer with ID ${customerId} not found.`);

  const { id: _, ...restOfContact } = contact;
  const newContact: AuthorizedContact = {
    id: uuidv4(), // Revert to uuidv4()
    ...restOfContact,
    customerId: customerId,
    createdAt: new Date().toISOString(),
  };

  const updatedCustomer: Customer = {
    ...customer,
    contacts: customer.contacts ? [...customer.contacts, newContact] : [newContact],
  };
  return await updateCustomer(updatedCustomer);
};

export const updateAuthorizedContact = async (contactToUpdate: AuthorizedContact): Promise<Customer> => {
  const data = await getStorageData();
  const customerIndex = data.customers.findIndex(c => c.id === contactToUpdate.customerId);
  if (customerIndex === -1) {
    throw new Error(`Customer with ID ${contactToUpdate.customerId} not found for contact update.`);
  }

  const customer = data.customers[customerIndex];
  const updatedContacts = customer.contacts?.map(c =>
    c.id === contactToUpdate.id ? contactToUpdate : c
  ) || [];

  const updatedCustomer: Customer = {
    ...customer,
    contacts: updatedContacts,
    updatedAt: new Date().toISOString(), // Update customer's updatedAt
    _etag: uuidv4(), // Update customer's etag
  };

  data.customers[customerIndex] = updatedCustomer;
  await setStorageData(data);
  return updatedCustomer;
};

export const deleteAuthorizedContact = async (customerId: string, contactId: string): Promise<Customer> => {
  const customer = await getCustomer(customerId);
  if (!customer) throw new Error(`Customer with ID ${customerId} not found.`);

  const updatedCustomer: Customer = {
    ...customer,
    contacts: customer.contacts?.filter(c => c.id !== contactId) || [],
  };
  return await updateCustomer(updatedCustomer);
};

export const addTenant = async (tenantData: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> => {
  const data = await getStorageData();
  const newId = uuidv4(); // Revert to uuidv4()
  const now = new Date().toISOString();
  const newTenant: Tenant = {
    ...tenantData,
    id: newId,
    createdAt: now,
    customerId: tenantData.customerId || '', // Ensure customerId is set, even if empty
  };
  data.tenants.push(newTenant);
  await setStorageData(data);
  return newTenant;
};

export const updateTenant = async (tenantData: Tenant): Promise<Tenant> => {
  const data = await getStorageData();
  const index = data.tenants.findIndex(t => t.id === tenantData.id);
  if (index === -1) {
    throw new Error(`Tenant with ID ${tenantData.id} not found.`);
  }
  data.tenants[index] = tenantData;
  await setStorageData(data);
  return tenantData;
};

export const deleteTenant = async (tenantId: string): Promise<void> => {
  const data = await getStorageData();
  data.tenants = data.tenants.filter(t => t.id !== tenantId);
  await setStorageData(data);
};

export const deleteTenants = async (tenantIds: string[]): Promise<void> => {
  const data = await getStorageData();
  data.tenants = data.tenants.filter(t => !tenantIds.includes(t.id));
  await setStorageData(data);
};

export const getAllTenants = async (): Promise<Tenant[]> => {
  const data = await getStorageData();
  return data.tenants;
};

export const getTenant = async (tenantId: string): Promise<Tenant | null> => {
  const data = await getStorageData();
  return data.tenants.find(t => t.id === tenantId) || null;
};

export const matchTenantToCustomer = async (tenantId: string, newCustomerId: string | null): Promise<void> => {
  const data = await getStorageData();
  const tenantIndex = data.tenants.findIndex(t => t.id === tenantId);

  if (tenantIndex === -1) {
    throw new Error(`Tenant with ID ${tenantId} not found.`);
  }

  // Update tenant's customerId
  data.tenants[tenantIndex].customerId = newCustomerId || ''; // Set to empty string if unmatching

  await setStorageData(data);
};
