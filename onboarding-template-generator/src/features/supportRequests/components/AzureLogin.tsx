import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
// Import SVG assets (adjust path as needed)
import MsSignInLight from '../../../assets/ms-symbollockup_signin_light.svg';
import MsSignInDark from '../../../assets/ms-symbollockup_signin_dark.svg';

// Helper function to calculate luminance (0 = black, 1 = white)
const getLuminance = (hexColor: string): number => {
  try {
    // Remove # if present
    hexColor = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;

    // Handle shorthand hex (e.g., #03F -> #0033FF)
    if (hexColor.length === 3) {
      hexColor = hexColor.split('').map(char => char + char).join('');
    }

    // Convert hex to RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // Apply luminance formula (standard sRGB)
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  } catch (e) {
    console.error("Error calculating luminance for color:", hexColor, e);
    return 0.5; // Default to a mid-range luminance on error
  }
};


export const AzureLogin: React.FC = () => {
  const { isAuthenticated, userInfo, isLoading, error, login, logout } = useAuth();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light'); // Default to light

  useEffect(() => {
    // Check theme on mount
    const checkTheme = () => {
      try {
        const rootStyle = window.getComputedStyle(document.documentElement);
        const bgColor = rootStyle.getPropertyValue('--background-light').trim();

        if (bgColor) {
          const luminance = getLuminance(bgColor);
          setThemeMode(luminance > 0.5 ? 'light' : 'dark');
        } else {
          // Fallback if CSS variable is not set - check prefers-color-scheme
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeMode('dark');
          } else {
            setThemeMode('light');
          }
        }
      } catch (e) {
         console.error("Error detecting theme:", e);
         // Default to light theme on error
         setThemeMode('light');
      }
    };

    checkTheme();

    // Optional: Listen for changes if the theme can change dynamically without a page reload
    // This might require a more robust mechanism like a MutationObserver or a dedicated theme context
    // For now, we just check on mount.

  }, []); // Empty dependency array means this runs once on mount

  const loginButtonImage = themeMode === 'light' ? MsSignInLight : MsSignInDark;

  return (
    // Removed the outer div with padding/border, styling will be handled by Navbar.css
    <>
      {isLoading && <p style={{ color: 'var(--text-color)' }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {!isLoading && (
        <>
          {isAuthenticated && userInfo ? (
            <div className="auth-info">
              <p style={{ color: 'var(--text-color)', marginRight: '10px' }}>
                {userInfo.name || userInfo.username}
              </p>
              <button onClick={logout} disabled={isLoading} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              disabled={isLoading}
              className="login-button-svg"
              aria-label="Login with Microsoft"
            >
              <img src={loginButtonImage} alt="Sign in with Microsoft" />
            </button>
          )}
        </>
      )}
    </>
  );
};
