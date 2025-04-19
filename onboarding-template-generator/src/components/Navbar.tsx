import React from 'react';
// Import AzureLogin from its location within the supportRequests feature
import { AzureLogin } from '../features/supportRequests/components/AzureLogin';

const Navbar: React.FC = () => {
  return (
    <nav className="app-navbar">
      <div className="navbar-content">
        {/* Placeholder for potential future elements like logo or title */}
        <div className="navbar-brand">
          {/* Could add a title or logo here later */}
        </div>
        <div className="navbar-auth">
          <AzureLogin />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
