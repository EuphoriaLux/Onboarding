import { Customer, AuthorizedContact, Tenant } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'crmData';

interface CrmStorageData {
  customers: Customer[];
}

const getStorageData = async (): Promise<CrmStorageData> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        const storedData = result[STORAGE_KEY];
        // Ensure storedData is an object and has a 'customers' array
        if (storedData && typeof storedData === 'object' && Array.isArray(storedData.customers)) {
          resolve(storedData);
        } else {
          resolve({ customers: [] }); // Return a clean initial state if data is missing or malformed
        }
      });
    } else {
      // Fallback for non-Chrome extension environments
      const localStorageData = localStorage.getItem(STORAGE_KEY);
      try {
        const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
        if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.customers)) {
          resolve(parsedData);
        } else {
          resolve({ customers: [] });
        }
      } catch (e) {
        console.warn("Error parsing localStorage data. Using empty fallback.", e);
        resolve({ customers: [] });
      }
    }
  });
};

const setStorageData = async (data: CrmStorageData): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: data }, () => {
        resolve();
      });
    } else {
      // Fallback for non-Chrome extension environments
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
  const newId = uuidv4();
  const now = new Date().toISOString();
  const newCustomer: Customer = {
    ...customerData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    notes: customerData.notes || [],
    contacts: customerData.contacts || [],
    tenants: customerData.tenants || [],
    _etag: uuidv4(), // Simulate ETag for consistency, though not strictly needed for local storage
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
    _etag: uuidv4(), // Generate new ETag on update
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
    id: uuidv4(),
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

export const updateAuthorizedContact = async (customerId: string, contact: AuthorizedContact): Promise<Customer> => {
  const customer = await getCustomer(customerId);
  if (!customer) throw new Error(`Customer with ID ${customerId} not found.`);

  const updatedCustomer: Customer = {
    ...customer,
    contacts: customer.contacts?.map(c => (c.id === contact.id ? contact : c)) || [],
  };
  return await updateCustomer(updatedCustomer);
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

export const addTenantToCustomer = async (customerId: string, tenant: Tenant): Promise<Customer> => {
  const customer = await getCustomer(customerId);
  if (!customer) throw new Error(`Customer with ID ${customerId} not found.`);

  const { id: _, ...restOfTenant } = tenant;
  const newTenant: Tenant = {
    id: uuidv4(),
    ...restOfTenant,
    customerId: customerId,
    createdAt: new Date().toISOString(),
  };

  const updatedCustomer: Customer = {
    ...customer,
    tenants: customer.tenants ? [...customer.tenants, newTenant] : [newTenant],
  };
  return await updateCustomer(updatedCustomer);
};

export const updateTenantInCustomer = async (customerId: string, tenant: Tenant): Promise<Customer> => {
  const customer = await getCustomer(customerId);
  if (!customer) throw new Error(`Customer with ID ${customerId} not found.`);

  const updatedCustomer: Customer = {
    ...customer,
    tenants: customer.tenants?.map(t => (t.id === tenant.id ? tenant : t)) || [],
  };
  return await updateCustomer(updatedCustomer);
};

export const deleteTenantFromCustomer = async (customerId: string, tenantId: string): Promise<Customer> => {
  const customer = await getCustomer(customerId);
  if (!customer) throw new Error(`Customer with ID ${customerId} not found.`);

  const updatedCustomer: Customer = {
    ...customer,
    tenants: customer.tenants?.filter(t => t.id !== tenantId) || [],
  };
  return await updateCustomer(updatedCustomer);
};
