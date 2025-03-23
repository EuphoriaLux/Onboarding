// src/components/TenantForm.tsx
import React from 'react';

interface TenantFormProps {
  tenantId: string;
  companyName: string;
  onChange: (field: string, value: string) => void;
}

const TenantForm: React.FC<TenantFormProps> = ({ tenantId, companyName, onChange }) => {
  return (
    <div className="tenant-form">
      <h2>3. Tenant Information</h2>
      
      <div className="form-group">
        <label htmlFor="company-name">Company Name</label>
        <input
          id="company-name"
          type="text"
          value={companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
          placeholder="Company Name"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tenant-id">Microsoft Tenant ID</label>
        <input
          id="tenant-id"
          type="text"
          value={tenantId}
          onChange={(e) => onChange('tenantId', e.target.value)}
          placeholder="00000000-0000-0000-0000-000000000000"
          pattern="^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
        />
        <small className="form-text">
          Format: 00000000-0000-0000-0000-000000000000
        </small>
      </div>
      
      <div className="info-box">
        <p>
          <strong>Note:</strong> The tenant ID will be used in the GDAP link acceptance and RBAC role establishment steps.
        </p>
      </div>
    </div>
  );
};

export default TenantForm;