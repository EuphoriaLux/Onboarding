import { StorageService } from '../../../services/storage'; // Assuming a storage service exists

// --- Configuration ---
const CLIENT_ID = 'f5f89a88-7e64-4260-9e73-5e4e823ac94e'; // Your Azure AD App Client ID
const TENANT_ID = 'common'; // Or your specific tenant ID
const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`;
const TOKEN_ENDPOINT = `${AUTHORITY}/oauth2/v2.0/token`;
const AUTHORIZE_ENDPOINT = `${AUTHORITY}/oauth2/v2.0/authorize`;
const REDIRECT_URI = chrome.identity.getRedirectURL();

// Define the *minimal* scopes needed for initial login and refresh token
const INITIAL_SCOPES = ['openid', 'profile', 'offline_access'];
const INITIAL_SCOPE_STRING = INITIAL_SCOPES.join(' ');

// Define specific scopes needed for API calls
export const GRAPH_SCOPES = ['https://graph.microsoft.com/User.Read'];
export const STORAGE_SCOPES = ['https://storage.azure.com/user_impersonation'];

// Storage keys
const STORAGE_KEY_REFRESH_TOKEN = 'azure_refresh_token_v2'; // Use new key to avoid conflicts
const STORAGE_KEY_PKCE_VERIFIER = 'azure_pkce_verifier_v2';

// --- PKCE Helper Functions (Unchanged) ---

const generateCodeVerifier = (): string => {
  const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// --- Token Management ---

/**
 * Stores only the refresh token securely.
 */
const storeRefreshToken = async (tokenResponse: any): Promise<void> => {
  if (!tokenResponse.refresh_token) {
    throw new Error('Invalid token response: refresh_token missing.');
  }
  await StorageService.set(STORAGE_KEY_REFRESH_TOKEN, tokenResponse.refresh_token);
  console.log("AuthService: Refresh token stored successfully.");
};

/**
 * Retrieves the stored refresh token. Exported for use in initial auth check.
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await StorageService.get<string>(STORAGE_KEY_REFRESH_TOKEN);
    return token ?? null; // Return null if undefined
  } catch (error) {
    console.error("AuthService: Error retrieving refresh token:", error);
    return null;
  }
};

/**
 * Clears the stored refresh token and PKCE verifier.
 */
const clearRefreshToken = async (): Promise<void> => {
  try {
    await Promise.all([
      StorageService.remove(STORAGE_KEY_REFRESH_TOKEN),
      StorageService.remove(STORAGE_KEY_PKCE_VERIFIER),
    ]);
    console.log("AuthService: Stored refresh token cleared.");
  } catch (error) {
    console.error("AuthService: Error clearing refresh token:", error);
  }
};

// --- Core Authentication Functions ---

/**
 * Initiates the login flow using launchWebAuthFlow with minimal scopes.
 */
export const login = async (): Promise<void> => {
  // Check if already logged in (has refresh token)
  const existingRefreshToken = await getRefreshToken();
  if (existingRefreshToken) {
      console.log("AuthService: Refresh token already exists. Skipping login flow.");
      // Optionally, verify token validity here by trying to get an access token
      try {
          await getAccessTokenForScopes(GRAPH_SCOPES); // Try getting a token for Graph
          console.log("AuthService: Existing refresh token is valid.");
          return; // Exit if token is valid
      } catch (error) {
          console.warn("AuthService: Existing refresh token failed validation. Proceeding with login.", error);
          await clearRefreshToken(); // Clear invalid token before new login
      }
  }


  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  await StorageService.set(STORAGE_KEY_PKCE_VERIFIER, verifier);

  const authUrl = new URL(AUTHORIZE_ENDPOINT);
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('scope', INITIAL_SCOPE_STRING); // Use minimal scopes
  authUrl.searchParams.append('code_challenge', challenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('prompt', 'select_account'); // Force account selection

  console.log("AuthService: Starting web auth flow (minimal scopes) to:", authUrl.toString());

  try {
    const resultUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl.toString(),
      interactive: true,
    });

    if (!resultUrl) throw new Error('Authentication flow cancelled or failed.');

    console.log("AuthService: Web auth flow returned:", resultUrl);
    const url = new URL(resultUrl);
    const code = url.searchParams.get('code');

    if (!code) {
      const error = url.searchParams.get('error');
      const errorDescription = url.searchParams.get('error_description');
      throw new Error(`Authorization failed: ${error} - ${errorDescription || 'No code returned'}`);
    }

    console.log("AuthService: Authorization code received.");
    await exchangeCodeForRefreshToken(code); // Exchange code for refresh token

  } catch (error) {
    console.error("AuthService: launchWebAuthFlow error:", error);
    await StorageService.remove(STORAGE_KEY_PKCE_VERIFIER);
    throw error;
  }
};

/**
 * Exchanges the authorization code for a refresh token.
 */
const exchangeCodeForRefreshToken = async (code: string): Promise<void> => {
  const verifier = await StorageService.get<string>(STORAGE_KEY_PKCE_VERIFIER);
  if (!verifier) throw new Error('PKCE code verifier not found.');

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('scope', INITIAL_SCOPE_STRING); // Use minimal scopes
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('grant_type', 'authorization_code');
  params.append('code_verifier', verifier);

  console.log("AuthService: Exchanging code for refresh token...");

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const tokenResponse = await response.json();
    if (!response.ok) throw new Error(`Token exchange failed: ${tokenResponse.error} - ${tokenResponse.error_description}`);

    console.log("AuthService: Refresh token exchange successful.");
    await storeRefreshToken(tokenResponse); // Store only refresh token

  } finally {
    await StorageService.remove(STORAGE_KEY_PKCE_VERIFIER);
  }
};

/**
 * Gets a *new* access token for specific scopes using the stored refresh token.
 */
export const getAccessTokenForScopes = async (scopes: string[]): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    console.warn("AuthService: No refresh token available to get access token.");
    return null; // Requires login
  }

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('scope', scopes.join(' ')); // Use requested scopes
  params.append('refresh_token', refreshToken);
  params.append('grant_type', 'refresh_token');

  console.log(`AuthService: Requesting new access token for scopes: ${scopes.join(' ')}...`);

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const tokenResponse = await response.json();

    if (!response.ok) {
      console.error(`AuthService: Failed to get access token: ${tokenResponse.error} - ${tokenResponse.error_description}`);
      // If refresh fails (e.g., token revoked), clear token and signal failure
      if (tokenResponse.error === 'invalid_grant') {
          await clearRefreshToken();
          console.warn("AuthService: Refresh token invalid or expired. Cleared token.");
          throw new Error('Session expired. Please log in again.'); // Specific error for UI
      }
      throw new Error(`Failed to get access token: ${tokenResponse.error_description || tokenResponse.error}`);
    }

    console.log("AuthService: New access token obtained successfully.");
    // IMPORTANT: If the response includes a new refresh_token, store it!
    if (tokenResponse.refresh_token) {
        await storeRefreshToken(tokenResponse);
    }
    // We don't store the access token long-term anymore. Return it directly.
    return tokenResponse.access_token;

  } catch (error) {
    console.error("AuthService: Error during access token acquisition:", error);
    // If the error was due to invalid grant, token is already cleared.
    // Otherwise, re-throw for the caller.
    throw error;
  }
};

/**
 * Logs the user out by clearing the stored refresh token.
 */
export const logout = async (): Promise<void> => {
  await clearRefreshToken();
  console.log("AuthService: Logout completed (refresh token cleared).");
};

/**
 * Fetches basic user profile information from Microsoft Graph.
 * Requires requesting an access token with Graph scopes first.
 */
export const getUserInfo = async (): Promise<any | null> => {
  let accessToken: string | null = null;
  try {
      accessToken = await getAccessTokenForScopes(GRAPH_SCOPES);
      if (!accessToken) {
          console.warn("AuthService: Cannot get user info, failed to get Graph access token.");
          return null;
      }
  } catch (error) {
       console.error("AuthService: Error getting access token for Graph:", error);
       return null; // Can't proceed without token
  }

  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Graph API error: ${errorData.error?.message || response.statusText}`);
    }
    const userInfo = await response.json();
    console.log("AuthService: User info fetched successfully:", userInfo.displayName);
    return {
        username: userInfo.userPrincipalName,
        name: userInfo.displayName,
        id: userInfo.id
    };
  } catch (error) {
    console.error("AuthService: Error fetching user info from Graph:", error);
    return null;
  }
};
