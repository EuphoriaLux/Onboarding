// src/components/TenantManager.tsx
import React from 'react';
import { supportTiers } from '../data/supportTiers';

export interface TenantInfo {
  id: string;
  companyName: string;
}

interface TenantManagerProps {
  tenants: TenantInfo[];
  selectedTier: string;
  onChange: (tenants: TenantInfo[]) => void;
}

const TenantManager: React.FC<TenantManagerProps> = ({ tenants, selectedTier, onChange }) => {
  const tier = supportTiers[selectedTier];
  
  // Handle tenant field changes
  const handleTenantChange = (index: number, field: keyof TenantInfo, value: string) => {
    const updatedTenants = [...tenants];
    updatedTenants[index] = { ...updatedTenants[index], [field]: value };
    onChange(updatedTenants);
  };

  // Add a new tenant
  const addTenant = () => {
    if (tenants.length < tier.tenants) {
      onChange([...tenants, { id: '', companyName: '' }]);
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