import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const AzureLogin: React.FC = () => {
  // Use userInfo instead of account
  const { isAuthenticated, userInfo, isLoading, error, login, logout } = useAuth();

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
      <h4>Azure Authentication</h4>
      {isLoading && <p>Loading authentication status...</p>}
      {error && <p style={{ color: 'red' }}>Authentication Error: {error.message}</p>} {/* Revert to error.message */}

      {!isLoading && ( // Show content even if there's an error, just display the error message
        <>
          {isAuthenticated && userInfo ? ( // Check for userInfo
            <div>
              {/* Display username or name from userInfo */}
              <p>Signed in as: {userInfo.name || userInfo.username}</p>
              <button onClick={logout} disabled={isLoading}>
                Logout
              </button>
            </div>
          ) : (
            <div>
              <p>Not signed in.</p>
              <button onClick={login} disabled={isLoading}>
                Login with Azure AD
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
