// src/components/TenantManager.tsx
import React, { useEffect } from 'react'; // Import useEffect
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import { supportTiers } from '../../supportTiers/constants'; // Corrected import path
import { TenantInfo } from '../types'; // Import updated TenantInfo type

interface TenantManagerProps {
  tenants: TenantInfo[]; // Use imported TenantInfo
  selectedTier: string;
  onChange: (tenants: TenantInfo[]) => void;
  calculatedDeadline: Date; // Add prop for calculated deadline
}

const TenantManager: React.FC<TenantManagerProps> = ({ tenants, selectedTier, onChange, calculatedDeadline }) => { // Destructure new prop
  const tier = supportTiers[selectedTier];

  // Effect to adjust tenants when tier changes
  useEffect(() => {
    const currentTier = supportTiers[selectedTier];
    const tenantLimit = currentTier.tenants;
    if (tenants.length > tenantLimit) {
      // If current tenants exceed the new limit, truncate the array
      const updatedTenants = tenants.slice(0, tenantLimit);
      onChange(updatedTenants);
    }
    // Dependencies: run when selectedTier changes or the onChange function reference changes
    // It's generally safe to include tenants array too, though it might cause extra runs if not memoized upstream
  }, [selectedTier, tenants, onChange]);

  // Handle tenant field changes, including Date and boolean types
  const handleTenantChange = (index: number, field: keyof TenantInfo, value: string | Date | boolean | null) => {
    const updatedTenants = tenants.map((tenant, i) => {
      if (i === index) {
        // Handle potential null value for DatePicker when cleared
        const newValue = field === 'implementationDeadline' && value === null ? null : value;
        return { ...tenant, [field]: newValue };
      }
      return tenant;
    });
    onChange(updatedTenants);
  };

  // Add a new tenant, initializing new flags
  const addTenant = () => {
    if (tenants.length < tier.tenants) {
      // Initialize tenantDomain, msDomain, deadline, hasAzure
      onChange([...tenants, { 
        id: '', 
        companyName: '', 
        tenantDomain: '', 
        microsoftTenantDomain: '', // Initialize MS Domain
        implementationDeadline: null, 
        hasAzure: false, // Default to false
        // Removed includeRbacScript initialization
        gdapLink: '' 
      }]);
    }
  };

  // Remove a tenant
  const removeTenant = (index: number) => {
    const updatedTenants = [...tenants];
    updatedTenants.splice(index, 1);
    onChange(updatedTenants);
  };

  return (
    <div className="tenant-manager">
      <h2>3. Tenant Information <span className="tenant-limit">({tenants.length}/{tier.tenants})</span></h2>
      <p className="section-description">
        Your {tier.name} allows for up to {tier.tenants} tenant{tier.tenants !== 1 ? 's' : ''}.
        Please provide the information for each tenant you want to include.
      </p>
      
      {tenants.map((tenant, index) => (
        <div key={index} className={`tenant-card ${selectedTier}`}>
          <div className="tenant-header">
            <h3>Tenant #{index + 1}</h3>
            {tenants.length > 1 && (
              <button 
                type="button" 
                className="remove-button"
                onClick={() => removeTenant(index)}
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="tenant-fields">
            <div className="form-group">
              <label htmlFor={`company-name-${index}`}>Company Name</label>
              <input
                id={`company-name-${index}`}
                type="text"
                value={tenant.companyName}
                onChange={(e) => handleTenantChange(index, 'companyName', e.target.value)}
                placeholder="Company Name"
                required
              />
            </div>

            {/* Add Tenant Domain Input */}
            <div className="form-group">
              <label htmlFor={`tenant-domain-${index}`}>Tenant Domain</label>
              <input
                id={`tenant-domain-${index}`}
                type="text"
                value={tenant.tenantDomain}
                onChange={(e) => handleTenantChange(index, 'tenantDomain', e.target.value)}
                placeholder="contoso.onmicrosoft.com"
                required
              />
              <small className="form-text">
                The primary domain name (e.g., contoso.onmicrosoft.com).
              </small>
            </div>

            {/* Moved Tenant ID Up */}
            <div className="form-group">
              <label htmlFor={`tenant-id-${index}`}>Microsoft Tenant ID</label>
              <input
                id={`tenant-id-${index}`}
                type="text"
                value={tenant.id}
                onChange={(e) => handleTenantChange(index, 'id', e.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
                pattern="^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              />
              <small className="form-text">
                Format: 00000000-0000-0000-0000-000000000000
              </small>
            </div>
            
            {/* Moved GDAP Link Input Up */}
            <div className="form-group">
              <label htmlFor={`gdap-link-${index}`}>Tenant-Specific GDAP Link (Optional)</label>
              <input
                id={`gdap-link-${index}`}
                type="url"
                value={tenant.gdapLink || ''}
                onChange={(e) => handleTenantChange(index, 'gdapLink', e.target.value)}
                placeholder="https://partner.microsoft.com/..."
              />
              <small className="form-text">
                If provided, this link will be used for this tenant. Otherwise, a default link will be used.
              </small>
            </div>

            {/* Configuration Section Starts Here */}
            <hr className="tenant-divider" /> {/* Optional visual divider */}

            {/* Display Calculated Deadline */}
            <div className="form-group">
              <label htmlFor={`calculated-deadline-${index}`}>GDAP Implementation Deadline (Auto-calculated)</label>
              <input
                id={`calculated-deadline-${index}`} // Add ID
                type="text"
                value={calculatedDeadline.toLocaleDateString()} // Format the date
                readOnly // Make it read-only
                className="form-control" // Optional styling
              />
               <small className="form-text">
                This date (90 days from today) will be used in the email template.
              </small>
            </div>

            {/* Moved Microsoft Tenant Domain Input Down */}
            <div className="form-group">
              <label htmlFor={`ms-tenant-domain-${index}`}>Microsoft Tenant Domain</label>
              <input
                id={`ms-tenant-domain-${index}`}
                type="text"
                value={tenant.microsoftTenantDomain}
                onChange={(e) => handleTenantChange(index, 'microsoftTenantDomain', e.target.value)}
                placeholder="yourcompany.onmicrosoft.com"
                required 
              />
              <small className="form-text">
                The `.onmicrosoft.com` domain, needed for the RBAC script.
              </small>
            </div>

            {/* Has Azure Checkbox */}
            <div className="form-group checkbox-container inline-label">
              <input
                type="checkbox"
                id={`has-azure-${index}`}
                checked={tenant.hasAzure}
                onChange={(e) => handleTenantChange(index, 'hasAzure', e.target.checked)}
              />
              <label htmlFor={`has-azure-${index}`}>Azure RBAC Relevant?</label>
              <small className="form-text">Check if Azure RBAC configuration is needed for this tenant.</small>
            </div>

            {/* Removed Include RBAC Script Checkbox */}
          </div>
          
          <div className="info-box">
            <p>
              <strong>Note:</strong> The tenant ID will be used in the GDAP link acceptance and RBAC role establishment steps.
            </p>
          </div>
        </div>
      ))}
      
      {tenants.length < tier.tenants && (
        <button 
          type="button" 
          className="add-button"
          onClick={addTenant}
        >
          Add Tenant
        </button>
      )}
    </div>
  );
};

export default TenantManager;
