import {
  BlobServiceClient,
  ContainerClient,
  BlobClient,
  RestError, // Import RestError for ETag checking
} from '@azure/storage-blob';
import { TokenCredential } from '@azure/core-auth';
import * as authService from '../../supportRequests/services/authService'; // Adjust path as needed
import { Customer, Contact } from '../types'; // Import the CRM Customer type
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// --- Configuration ---
// Re-use storage account from supportRequests, but use a dedicated container for CRM
const STORAGE_ACCOUNT_NAME = 'powerupticketstorage';
const CRM_CONTAINER_NAME = 'crm-data'; // Dedicated container for CRM data
const STORAGE_ACCOUNT_URL = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;

// --- Helper Functions ---

/**
 * Creates a simple TokenCredential object from a provided access token.
 * (Adapted from blobStorageService.ts)
 */
const createTokenCredential = (accessToken: string): TokenCredential => {
  return {
    getToken: async () => ({
      token: accessToken,
      expiresOnTimestamp: Date.now() + 60 * 60 * 1000, // Assume valid for 1 hour
    }),
  };
};

/**
 * Helper to get the ContainerClient, ensuring authentication.
 */
const getContainerClient = async (): Promise<ContainerClient> => {
  const accessToken = await authService.getAccessTokenForScopes(authService.STORAGE_SCOPES);
  if (!accessToken) {
    throw new Error('Authentication failed: Could not retrieve access token for storage.');
  }
  const tokenCredential = createTokenCredential(accessToken);
  const blobServiceClient = new BlobServiceClient(STORAGE_ACCOUNT_URL, tokenCredential);
  return blobServiceClient.getContainerClient(CRM_CONTAINER_NAME);
};

// --- Service Functions ---

/**
 * Lists basic information about customers (blobs) in the CRM container, including internal name.
 * TODO: Implement pagination or filtering for large datasets.
 */
export const listCustomers = async (): Promise<{ id: string; name: string; internalName?: string; updatedAt: string }[]> => {
  try {
    const containerClient = await getContainerClient();
    const customers: { id: string; name: string; internalName?: string; updatedAt: string }[] = [];
    console.log(`Listing blobs in CRM container: ${CRM_CONTAINER_NAME}`);

    for await (const blob of containerClient.listBlobsFlat({ includeMetadata: true, includeVersions: false })) {
        // Extract ID from name (assuming format customer-<id>.json)
        const idMatch = blob.name.match(/^customer-(.+)\.json$/);
        const id = idMatch ? idMatch[1] : blob.name; // Fallback to full name if pattern fails

        // Attempt to get name and internalName from metadata if available
        const displayName = blob.metadata?.customerName || id; // Fallback to ID if name missing
        const internalName = blob.metadata?.internalName; // Will be undefined if not set

        customers.push({
            id: id,
            name: displayName,
            internalName: internalName, // Add internalName
            updatedAt: blob.properties.lastModified?.toISOString() || new Date(0).toISOString(),
        });
    }
    console.log(`Found ${customers.length} customer blobs.`);
    return customers;
  } catch (error) {
    console.error('Error listing customer blobs:', error);
    // Handle specific errors (e.g., auth failure)
    if (error instanceof Error && error.message.includes('Authentication failed')) {
       throw error; // Re-throw auth errors clearly
    }
    throw new Error(`Failed to list customers: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Downloads and parses the content of a specific customer blob, including its ETag.
 * @param customerId The unique ID of the customer (used to construct blob name).
 * @returns The parsed Customer object (with _etag) or null if not found.
 */
export const getCustomer = async (customerId: string): Promise<Customer | null> => {
  const blobName = `customer-${customerId}.json`;
  try {
    const containerClient = await getContainerClient();
    const blobClient = containerClient.getBlobClient(blobName);

    console.log(`Fetching properties for blob: ${blobName}`);
    const properties = await blobClient.getProperties(); // Needed for ETag

    console.log(`Downloading blob: ${blobName}`);
    // Use download() which returns a Blob, compatible with browsers
    const downloadBlockBlobResponse = await blobClient.download();
    if (!downloadBlockBlobResponse.blobBody) {
        throw new Error(`Failed to download blob body for ${blobName}.`);
    }
    // Read the Blob content as text (await the promise first)
    const blob = await downloadBlockBlobResponse.blobBody;
    const content = await blob.text();

    console.log(`Parsing blob content: ${blobName}`);
    const customerData: Customer = JSON.parse(content);

    // Add the ETag to the returned object for concurrency control
    customerData._etag = properties.etag;

    console.log(`Successfully fetched and parsed customer: ${customerData.id}, ETag: ${customerData._etag}`);
    return customerData;

  } catch (error) {
     if (error instanceof RestError && error.statusCode === 404) {
        console.warn(`Customer blob not found: ${blobName}`);
        return null; // Return null if blob doesn't exist
    }
    console.error(`Error getting customer blob "${blobName}":`, error);
    if (error instanceof Error && error.message.includes('Authentication failed')) {
       throw error;
    } else if (error instanceof SyntaxError) {
        console.error(`Failed to parse JSON content for blob: ${blobName}`);
        throw new Error(`Failed to parse customer data for ${blobName}.`);
    }
    throw new Error(`Failed to get customer ${customerId}: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Creates a new customer record as a JSON blob.
 * @param customerData The initial customer data (ID will be generated if missing).
 * @returns The created Customer object with its ID and initial ETag.
 */
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | '_etag'>): Promise<Customer> => {
  const newId = uuidv4();
  const now = new Date().toISOString();
  const customerToSave: Omit<Customer, '_etag'> = {
    ...customerData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    notes: customerData.notes || [], // Ensure notes array exists
    contacts: customerData.contacts || [], // Ensure contacts array exists
  };

  const blobName = `customer-${newId}.json`;
  const content = JSON.stringify(customerToSave, null, 2);

  try {
    const containerClient = await getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log(`Creating blob: ${blobName}`);
    // Ensure optional arrays are initialized if not provided
    customerToSave.tenantIds = customerToSave.tenantIds || [];

    const uploadResponse = await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: 'application/json' },
      // Include internalName in metadata (ensure it's a string)
      metadata: {
          customerName: customerToSave.name || '', // Ensure name is not undefined
          internalName: customerToSave.internalName || '' // Ensure internalName is not undefined
      },
      // Conditions: ifNoneMatch: '*' ensures we don't overwrite if it somehow exists
      conditions: { ifNoneMatch: '*' }
    });

    console.log(`Successfully created customer: ${newId}, ETag: ${uploadResponse.etag}`);

    // Return the full customer object including the new ETag
    return {
        ...customerToSave,
        _etag: uploadResponse.etag
    };

  } catch (error) {
    console.error(`Error creating customer blob "${blobName}":`, error);
     if (error instanceof RestError && error.statusCode === 412) {
        console.error(`Concurrency conflict: Customer ${newId} already exists.`);
        throw new Error(`Customer with ID ${newId} already exists.`);
    }
    if (error instanceof Error && error.message.includes('Authentication failed')) {
       throw error;
    }
    throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Updates an existing customer record, using ETag for concurrency control.
 * @param customerData The complete customer data to save (must include id and _etag).
 * @returns The updated Customer object with the new ETag.
 * @throws Error if ETag does not match (concurrency conflict).
 */
export const updateCustomer = async (customerData: Customer): Promise<Customer> => {
  if (!customerData.id || !customerData._etag) {
    throw new Error('Customer ID and ETag (_etag) are required for updates.');
  }

  const blobName = `customer-${customerData.id}.json`;
  const etag = customerData._etag; // The ETag from when the data was fetched

  // Prepare data for saving (update timestamp, remove internal _etag field before stringify)
  const now = new Date().toISOString();
  const { _etag, ...dataToSave } = {
      ...customerData,
      updatedAt: now,
  };
  const content = JSON.stringify(dataToSave, null, 2);

  try {
    const containerClient = await getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log(`Updating blob: ${blobName} with ETag: ${etag}`);
    // Ensure optional arrays are initialized if not provided before saving
    dataToSave.tenantIds = dataToSave.tenantIds || [];

    const uploadResponse = await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: { blobContentType: 'application/json' },
      // Update metadata including internalName (ensure it's a string)
       metadata: {
          customerName: dataToSave.name || '', // Ensure name is not undefined
          internalName: dataToSave.internalName || '' // Ensure internalName is not undefined
      },
      conditions: { ifMatch: etag } // *** Optimistic concurrency check ***
    });

    console.log(`Successfully updated customer: ${customerData.id}, New ETag: ${uploadResponse.etag}`);

    // Return the updated customer object with the new ETag
    return {
        ...dataToSave,
        _etag: uploadResponse.etag
    };

  } catch (error) {
    if (error instanceof RestError && error.statusCode === 412) {
      console.warn(`Concurrency conflict updating blob: ${blobName}. ETag mismatch.`);
      throw new Error('Concurrency conflict: The customer data has been modified by someone else. Please refresh and try again.');
    }
    console.error(`Error updating customer blob "${blobName}":`, error);
     if (error instanceof Error && error.message.includes('Authentication failed')) {
       throw error;
    }
    throw new Error(`Failed to update customer ${customerData.id}: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Deletes a customer record, using ETag for concurrency control.
 * @param customerId The ID of the customer to delete.
 * @param etag The ETag of the customer record to ensure it hasn't changed.
 */
export const deleteCustomer = async (customerId: string, etag: string): Promise<void> => {
  if (!customerId || !etag) {
    throw new Error('Customer ID and ETag are required for deletion.');
  }
  const blobName = `customer-${customerId}.json`;

  try {
    const containerClient = await getContainerClient();
    const blobClient = containerClient.getBlobClient(blobName);

    console.log(`Deleting blob: ${blobName} with ETag: ${etag}`);
    await blobClient.delete({
      conditions: { ifMatch: etag } // *** Optimistic concurrency check ***
    });

    console.log(`Successfully deleted customer: ${customerId}`);

  } catch (error) {
    if (error instanceof RestError && error.statusCode === 412) {
      console.warn(`Concurrency conflict deleting blob: ${blobName}. ETag mismatch.`);
      throw new Error('Concurrency conflict: The customer data has been modified since you loaded it. Please refresh and try again.');
    }
     if (error instanceof RestError && error.statusCode === 404) {
        console.warn(`Attempted to delete non-existent blob: ${blobName}`);
        // Depending on requirements, this might not be an error (idempotency)
        return; // Or throw new Error(`Customer ${customerId} not found.`);
    }
    console.error(`Error deleting customer blob "${blobName}":`, error);
     if (error instanceof Error && error.message.includes('Authentication failed')) {
       throw error;
    }
    throw new Error(`Failed to delete customer ${customerId}: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Adds a contact to a customer's notes array.
 * @param customerId The ID of the customer to add the contact to.
 * @param contact The contact object to add.
 */
export const addContactToCustomer = async (customerId: string, contact: Contact): Promise<Customer> => {
  try {
    const customer = await getCustomer(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    const newContact: Contact = {
      id: uuidv4(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      jobTitle: contact.jobTitle
    };

    const updatedCustomer: Customer = {
      ...customer,
      contacts: customer.contacts ? [...customer.contacts, newContact] : [newContact],
    };

    return await updateCustomer(updatedCustomer);
  } catch (error) {
    console.error("Error in addContactToCustomer:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Updates an existing contact for a customer.
 * @param customerId The ID of the customer the contact belongs to.
 * @param contact The updated contact object.
 */
export const updateContact = async (customerId: string, contact: Contact): Promise<Customer> => {
  try {
    const customer = await getCustomer(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    const updatedCustomer: Customer = {
      ...customer,
      contacts: customer.contacts?.map(c => (c.id === contact.id ? contact : c)) || [],
    };

    return await updateCustomer(updatedCustomer);
  } catch (error) {
    console.error("Error in updateContact:", error);
    throw error;
  }
};

/**
 * Deletes a contact from a customer.
 * @param customerId The ID of the customer the contact belongs to.
 * @param contactId The ID of the contact to delete.
 */
export const deleteContact = async (customerId: string, contactId: string): Promise<Customer> => {
  try {
    const customer = await getCustomer(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    const updatedCustomer: Customer = {
      ...customer,
      contacts: customer.contacts?.filter(c => c.id !== contactId) || [],
    };

    return await updateCustomer(updatedCustomer);
  } catch (error) {
    console.error("Error in deleteContact:", error);
    throw error;
  }
};
