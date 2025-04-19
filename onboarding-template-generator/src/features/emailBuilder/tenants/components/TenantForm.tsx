// src/components/TenantForm.tsx
import React from 'react';

interface TenantFormProps {
  tenantId: string;
  companyName: string;
  gdapLink?: string; // Add optional gdapLink prop
  onChange: (field: string, value: string) => void;
}

const TenantForm: React.FC<TenantFormProps> = ({ tenantId, companyName, gdapLink, onChange }) => {
  return (
    <div className="tenant-form">
      {/* Keep h2 if this form is standalone, remove if TenantManager provides it */}
      {/* <h2>3. Tenant Information</h2> */}
      
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

      {/* Add GDAP Link Input */}
      <div className="form-group">
        <label htmlFor="gdap-link">Tenant-Specific GDAP Link (Optional)</label>
        <input
          id="gdap-link"
          type="url" // Use URL type for better validation
          value={gdapLink || ''}
          onChange={(e) => onChange('gdapLink', e.target.value)}
          placeholder="https://partner.microsoft.com/..."
        />
         <small className="form-text">
          If provided, this link will be used for this tenant. Otherwise, a default link will be used.
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
