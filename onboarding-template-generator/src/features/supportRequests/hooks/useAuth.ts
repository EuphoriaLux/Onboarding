import { useState, useEffect, useCallback } from 'react';
// Import the NEW functions from our manual auth service
import {
  login as manualLogin,
  logout as manualLogout,
  getAccessTokenForScopes, // Use the new function
  getUserInfo,
  getRefreshToken, // Import helper to check initial state
  GRAPH_SCOPES, // Import specific scopes
  STORAGE_SCOPES
} from '../services/authService';

// Define a simpler user info structure
interface UserInfo {
  username: string; // e.g., email
  name?: string; // Display name
  id?: string; // Added id from getUserInfo
}

interface AuthState {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseAuthReturn extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  // Renamed to avoid conflict and reflect its purpose
  getAccessToken: (scopes: string[]) => Promise<string | null>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userInfo: null,
  isLoading: true,
  error: null,
};

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Check initial authentication state when the hook mounts
  useEffect(() => {
    const checkAuthState = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const refreshToken = await getRefreshToken(); // Check for refresh token
        if (refreshToken) {
          console.log("useAuth: Found refresh token on mount. Verifying...");
          // Try to get user info to verify the refresh token is valid
          const userInfo = await getUserInfo();
          if (userInfo) {
             setAuthState({
               isAuthenticated: true,
               userInfo: userInfo,
               isLoading: false,
               error: null,
             });
             console.log("useAuth: Refresh token valid, user info fetched:", userInfo.username);
          } else {
             // Refresh token exists but couldn't get user info - treat as error/logged out
             console.warn("useAuth: Had refresh token but failed to get user info.");
             await manualLogout(); // Clear invalid token
             setAuthState({ ...initialState, isLoading: false, error: new Error("Failed to verify session.") });
          }
        } else {
          console.log("useAuth: No refresh token found on mount.");
          setAuthState({ ...initialState, isLoading: false }); // Not authenticated
        }
      } catch (error: any) {
        console.error("useAuth: Error checking auth state:", error);
        await manualLogout(); // Clear potentially bad state
        setAuthState({
          ...initialState,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to check authentication status'),
        });
      }
    };

    checkAuthState();
  }, []); // Run only on mount

  const login = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await manualLogin(); // Trigger the manual login flow
      // After successful login, tokens are stored. Fetch user info to confirm.
      const userInfo = await getUserInfo();
      if (userInfo) {
          setAuthState({
            isAuthenticated: true,
            userInfo: userInfo,
            isLoading: false,
            error: null,
          });
          console.log("useAuth: Login successful, user info fetched:", userInfo.username);
      } else {
           throw new Error("Login succeeded but failed to fetch user details.");
      }
    } catch (error: any) {
      console.error("useAuth: Login process error:", error);
      await manualLogout(); // Ensure tokens are cleared on any login error
      setAuthState({
        ...initialState,
        isLoading: false,
        error: error instanceof Error ? error : new Error('An unknown login error occurred'),
      });
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await manualLogout(); // Call the manual logout (clears tokens)
      setAuthState({ ...initialState, isLoading: false }); // Reset state
      console.log("useAuth: Logout successful");
    } catch (error: any) {
      console.error("useAuth: Logout error:", error);
      setAuthState({
        ...initialState,
        isLoading: false,
        error: error instanceof Error ? error : new Error('An unknown logout error occurred'),
      });
    }
  }, []);

  // Wrapper around getAccessTokenForScopes
  const getAccessToken = useCallback(async (scopes: string[]): Promise<string | null> => {
    if (!authState.isAuthenticated) {
      console.warn("getAccessToken: Not authenticated.");
      return null;
    }
    try {
      const token = await getAccessTokenForScopes(scopes); // Call the service function
      if (!token) {
         // If token is null after being authenticated, likely needs refresh failed -> logout
         console.warn("getAccessToken: Token acquisition failed (refresh token might be invalid).");
         await manualLogout();
         setAuthState({...initialState, isLoading: false, error: new Error("Session expired. Please log in again.")});
         return null;
      }
       // Clear error if token fetch succeeds
       if (authState.error) {
           setAuthState(prev => ({ ...prev, error: null }));
       }
      return token;
    } catch (error: any) {
      console.error("getAccessToken: Error getting access token:", error);
      // If the error indicates session expiry, update state
      if (error.message?.includes('Session expired')) {
          await manualLogout(); // Ensure cleanup
          setAuthState({...initialState, isLoading: false, error: error });
      } else {
          setAuthState(prev => ({ ...prev, error: error instanceof Error ? error : new Error('Failed to get access token') }));
      }
      return null;
    }
    // Depend only on isAuthenticated; authState.error dependency could cause loops if token fetch fails repeatedly
  }, [authState.isAuthenticated]);

  // Expose the new state structure and functions
  return { ...authState, login, logout, getAccessToken };
};
