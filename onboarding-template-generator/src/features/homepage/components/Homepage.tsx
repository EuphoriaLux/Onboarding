// src/features/homepage/components/Homepage.tsx
// src/features/homepage/components/Homepage.tsx
import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAppState } from '../../../contexts/AppStateContext';
import { features, Feature } from '../constants'; // Import features and type

const Homepage: React.FC = () => {
  const { translate } = useLanguage();
  const { state } = useAppState();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    const category = feature.category || 'Other'; // Default category if none provided
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    // Sort features within the category alphabetically by name
    acc[category].sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {} as Record<string, Feature[]>);

  // Define the desired order of categories
  const categoryOrder = [
    'Template & Email Tools',
    'Calendar (.ics) Generators',
    'Coming Soon Features', // Renamed category
    'Configuration', // Keep Settings/Configuration last
    'Other' // Catch-all for uncategorized features
  ];

  // Sort categories based on the defined order
  const sortedCategories = Object.keys(groupedFeatures).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    // If both categories are in the order list, sort by their index
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only A is in the list, it comes first
    if (indexA !== -1) return -1;
    // If only B is in the list, it comes first
    if (indexB !== -1) return 1;
    // Otherwise, sort alphabetically
    return a.localeCompare(b);
  });

  // Return to homepage
  const handleBackToHome = () => {
    setActiveFeature(null);
  };

  // Render active feature if selected
  if (activeFeature) {
    const feature = features.find(f => f.id === activeFeature);
    if (feature) {
      const FeatureComponent = feature.component;
      return (
        <div className="feature-container">
          <div className="feature-header">
            <button className="back-button" onClick={handleBackToHome}>
              ← Back to Home
            </button>
            <h1>{feature.name}</h1>
          </div>
          <FeatureComponent />
        </div>
      );
    }
  }

  // Render homepage with feature cards
  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Microsoft Support Tools</h1>
        <p>Select a tool to get started</p>
      </div>

      {/* Render features grouped by category */}
      {sortedCategories.map((category) => (
        <div key={category} className="feature-category-section">
          <h2>{category}</h2>
          <div className="features-grid">
            {groupedFeatures[category].map((feature) => (
              <button
                key={feature.id}
                className={`feature-card ${!feature.enabled ? 'disabled' : ''}`}
                onClick={() => feature.enabled && setActiveFeature(feature.id)}
                disabled={!feature.enabled} // Disable button if feature is not enabled
                aria-label={feature.name} // Add aria-label for accessibility
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h3>{feature.name}</h3>
                  <p>{feature.description}</p>
                  {!feature.enabled && <span className="coming-soon-badge">Coming Soon</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="homepage-footer">
        <p>Microsoft Support Tools Extension v1.0.2</p>
        <p>© 2025 Microsoft Corporation. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Homepage;
