// src/components/TierSelector.tsx
import React from 'react';
import { supportTiers } from '../data/supportTiers';

interface TierSelectorProps {
  selectedTier: string;
  onChange: (tier: string) => void;
}

const TierSelector: React.FC<TierSelectorProps> = ({ selectedTier, onChange }) => {
  return (
    <div className="tier-selector">
      <h2>1. Support Tier Selection</h2>
      <div className="tier-cards">
        {Object.entries(supportTiers).map(([key, tier]) => (
          <div 
            key={key}
            className={`tier-card ${selectedTier === key ? 'selected' : ''}`}
            style={{ 
              borderColor: tier.color,
              backgroundColor: selectedTier === key ? `${tier.color}20` : 'transparent'
            }}
            onClick={() => onChange(key)}
          >
            <div className="tier-header" style={{ backgroundColor: tier.color }}>
              <h3>{tier.name}</h3>
            </div>
            <div className="tier-content">
              <p>{tier.description}</p>
              <ul>
                <li><strong>Support Hours:</strong> {tier.supportHours}</li>
                <li><strong>Critical Situation:</strong> {tier.criticalSituation ? 'Yes' : 'No'}</li>
                <li><strong>Tenants:</strong> {tier.tenants}</li>
                <li><strong>Authorized Contacts:</strong> {tier.authorizedContacts}</li>
                <li><strong>Support Requests:</strong> {tier.supportRequestsIncluded}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierSelector;