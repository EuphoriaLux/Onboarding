import {
  BlobServiceClient,
  ContainerClient,
  BlobClient,
  StorageSharedKeyCredential, // Using token auth instead
  AnonymousCredential // Using token auth instead
  // TokenCredential is an interface from @azure/core-auth, implicitly satisfied
} from '@azure/storage-blob';
import { TokenCredential } from '@azure/core-auth'; // Import TokenCredential correctly
// Note: AccountInfo comes from @azure/msal-browser, not needed here
import * as msal from '@azure/msal-browser'; // Keep for error type checking
// Removed import of acquireTokenSilent
import { SupportRequest } from '../types'; // Import the type definition

const STORAGE_ACCOUNT_NAME = 'powerupticketstorage';
const CONTAINER_NAME = 'support-tickets';
const STORAGE_ACCOUNT_URL = `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;

// Removed getTokenCredential helper function

// --- Service Functions ---

/**
 * Creates a simple TokenCredential object from a provided access token.
 * This is used internally by the service functions.
 */
const createTokenCredential = (accessToken: string): TokenCredential => { // Use the imported TokenCredential type
    // Simple implementation assuming the token is valid when passed.
    // The expiry check is handled by MSAL when acquiring the token.
    return {
        getToken: async () => {
            return {
                token: accessToken,
                // expiresOnTimestamp is technically required by the interface,
                // but for short-lived operations after getting a fresh token,
                // setting it far in the future is often sufficient.
                // A more robust solution might involve passing expiresOnTimestamp too.
                expiresOnTimestamp: Date.now() + 60 * 60 * 1000 // Assume valid for 1 hour
            };
        }
    };
};


/**
 * Lists basic information about support requests (blobs) in the container.
 * Requires a valid access token to be passed in.
 * @param accessToken A valid Azure AD access token with storage permissions.
 */
export const listRequests = async (accessToken: string): Promise<{ name: string }[]> => {
  if (!accessToken) {
    throw new Error("Access token is required to list requests.");
  }
  try {
    const tokenCredential = createTokenCredential(accessToken);
    const blobServiceClient = new BlobServiceClient(STORAGE_ACCOUNT_URL, tokenCredential);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const requests: { name: string }[] = [];

    console.log(`Listing blobs in container: ${CONTAINER_NAME}`);
    for await (const blob of containerClient.listBlobsFlat()) {
      // TODO: Enhance to read metadata if needed for status/priority/etc.
      // const blobClient = containerClient.getBlobClient(blob.name);
      // const properties = await blobClient.getProperties();
      // const metadata = properties.metadata;
      requests.push({ name: blob.name });
    }
    console.log(`Found ${requests.length} blobs.`);
    return requests;
  } catch (error) {
    console.error('Error listing blobs:', error);
    // Handle specific errors (e.g., auth failure, container not found)
    if (error instanceof msal.InteractionRequiredAuthError) {
        console.warn("Listing blobs requires user interaction (login).");
    }
    // Re-throw or return empty array/error object
    throw error;
  }
};

/**
 * Downloads and parses the content of a specific support request blob.
 * Requires a valid access token to be passed in.
 * @param blobName The name of the blob to fetch.
 * @param accessToken A valid Azure AD access token with storage permissions.
 * @returns The parsed SupportRequest object or null if an error occurs.
 */
export const getRequest = async (blobName: string, accessToken: string): Promise<SupportRequest | null> => {
   if (!accessToken) {
    throw new Error("Access token is required to get request details.");
  }
  try {
    const tokenCredential = createTokenCredential(accessToken);
    const blobServiceClient = new BlobServiceClient(STORAGE_ACCOUNT_URL, tokenCredential);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobClient = containerClient.getBlobClient(blobName);

    console.log(`Downloading blob: ${blobName}`);
    const downloadResponse = await blobClient.downloadToBuffer();

    console.log(`Parsing blob content: ${blobName}`);
    const content = downloadResponse.toString('utf-8'); // Assuming UTF-8 encoded JSON
    const requestData: SupportRequest = JSON.parse(content);

    // Basic validation (can be expanded)
    if (!requestData.id || !requestData.subject) {
        console.warn(`Parsed data for ${blobName} seems incomplete.`);
        // Decide how to handle incomplete data - return partial, null, or throw error
    }

    console.log(`Successfully fetched and parsed request: ${requestData.id}`);
    return requestData;

  } catch (error) {
    console.error(`Error getting request blob "${blobName}":`, error);
     if (error instanceof msal.InteractionRequiredAuthError) {
        console.warn(`Fetching blob ${blobName} requires user interaction (login).`);
    } else if (error instanceof SyntaxError) {
        console.error(`Failed to parse JSON content for blob: ${blobName}`);
    }
    // Handle other errors (e.g., blob not found, network issues)
    // Re-throw or return null
    throw error; // Let the caller (hook) handle the error state
  }
};

/**
 * Uploads a new support request as a JSON blob.
 * Requires a valid access token with write permissions.
 * @param requestData The SupportRequest object to upload.
 * @param accessToken A valid Azure AD access token with storage write permissions.
 * @returns The name of the created blob.
 */
export const uploadRequest = async (requestData: SupportRequest, accessToken: string): Promise<string> => {
  if (!accessToken) {
    throw new Error("Access token is required to upload request.");
  }
  if (!requestData.id) {
    // Ensure there's an ID, generate one if missing (e.g., using UUID)
    requestData.id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.warn(`Generated ID for new request: ${requestData.id}`);
  }
  // Use ID or another unique property for the blob name (ensure valid blob name characters)
  const blobName = `${requestData.id}.json`;
  const content = JSON.stringify(requestData, null, 2); // Pretty-print JSON

  try {
    const tokenCredential = createTokenCredential(accessToken);
    const blobServiceClient = new BlobServiceClient(STORAGE_ACCOUNT_URL, tokenCredential);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log(`Uploading blob: ${blobName}`);
    await blockBlobClient.upload(content, content.length, {
        blobHTTPHeaders: { blobContentType: "application/json" }
    });

    console.log(`Successfully uploaded request: ${blobName}`);
    return blobName;

  } catch (error) {
    console.error(`Error uploading request blob "${blobName}":`, error);
     if (error instanceof msal.InteractionRequiredAuthError) {
        console.warn(`Uploading blob ${blobName} requires user interaction (login).`);
    }
    // Handle other errors (e.g., auth failure, container not found)
    throw error; // Let the caller handle the error
  }
};


// --- Helper to convert stream to string (if needed instead of downloadToBuffer) ---
// async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const chunks: any[] = [];
//     readableStream.on("data", (data) => {
//       chunks.push(data.toString());
//     });
//     readableStream.on("end", () => {
//       resolve(chunks.join(""));
//     });
//     readableStream.on("error", reject);
//   });
// }
