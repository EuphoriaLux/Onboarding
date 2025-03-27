// src/components/TenantManager.tsx
import React from 'react';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS
import { supportTiers } from '../data/supportTiers';
import { TenantInfo } from '../types'; // Import updated TenantInfo type

interface TenantManagerProps {
  tenants: TenantInfo[]; // Use imported TenantInfo
  selectedTier: string;
  onChange: (tenants: TenantInfo[]) => void;
}

const TenantManager: React.FC<TenantManagerProps> = ({ tenants, selectedTier, onChange }) => {
  const tier = supportTiers[selectedTier];
  
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
      // Initialize tenantDomain, deadline, hasAzure, includeRbacScript
      onChange([...tenants, { 
        id: '', 
        companyName: '', 
        tenantDomain: '', 
        implementationDeadline: null, 
        hasAzure: false, // Default to false
        includeRbacScript: false, // Default to false
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

            {/* Configuration Section Starts Here */}
            <hr className="tenant-divider" /> {/* Optional visual divider */}

            {/* Implementation Deadline Date Picker */}
            <div className="form-group">
              <label htmlFor={`implementation-deadline-${index}`}>Implementation Deadline</label>
              <DatePicker
                id={`implementation-deadline-${index}`}
                selected={tenant.implementationDeadline}
                onChange={(date: Date | null) => handleTenantChange(index, 'implementationDeadline', date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                className="form-control" // Add form-control class if needed for styling
                isClearable // Allow clearing the date
              />
              <small className="form-text">
                Optional: Target date for implementation tasks.
              </small>
            </div>

            {/* Add Has Azure Checkbox */}
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

            {/* Add Include RBAC Script Checkbox (conditionally shown) */}
            {tenant.hasAzure && (
              <div className="form-group checkbox-container inline-label nested-checkbox">
                <input
                  type="checkbox"
                  id={`include-rbac-script-${index}`}
                  checked={tenant.includeRbacScript}
                  onChange={(e) => handleTenantChange(index, 'includeRbacScript', e.target.checked)}
                />
                <label htmlFor={`include-rbac-script-${index}`}>Include RBAC Script?</label>
                <small className="form-text">Include the PowerShell script for this tenant in the email.</small>
              </div>
            )}
            
            {/* GDAP Link Input */}
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
