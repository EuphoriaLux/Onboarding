// src/components/TierSelector.tsx
import React from 'react';
import { supportTiers } from '../data/supportTiers';
// Remove CSS import
// import './TierSelector.css';

interface TierSelectorProps {
  selectedTier: string;
  onChange: (tier: string) => void;
}

const TierSelector: React.FC<TierSelectorProps> = ({ selectedTier, onChange }) => {
  return (
    // Container with margin and spacing
    <div className="mb-8 space-y-4">
      {/* Section title */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">1. Support Tier Selection</h2>
      {/* Grid layout for tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(supportTiers).map(([key, tier]) => (
          // Tier card styling
          <div
            key={key}
            className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:-translate-y-1 shadow-md hover:shadow-lg dark:bg-gray-800 dark:border-gray-800 ${selectedTier === key ? 'border-indigo-500 dark:border-indigo-400' : 'border-transparent'}`}
            style={{ backgroundColor: selectedTier === key ? `${tier.color}20` : 'transparent' }} // Keep dynamic background color
            onClick={() => onChange(key)}
          >
            {/* Tier header styling */}
            <div className="text-center py-3 text-white font-semibold" style={{ backgroundColor: tier.color }}> {/* Keep dynamic background color */}
              {tier.name}
            </div>
            {/* Tier content styling */}
            <div className="p-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>{tier.description}</p>
              <ul className="list-none pl-0 space-y-1">
                <li><strong className="text-gray-900 dark:text-gray-100">Support Hours:</strong> {tier.supportHours}</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Critical Situation:</strong> {tier.criticalSituation ? 'Yes' : 'No'}</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Tenants:</strong> {tier.tenants}</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Authorized Contacts:</strong> {tier.authorizedContacts}</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Support Requests:</strong> {tier.supportRequestsIncluded}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierSelector;
