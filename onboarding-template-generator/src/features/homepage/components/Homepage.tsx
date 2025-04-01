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

  // Sort features alphabetically by name, keeping Settings last
  const sortedFeatures = features
    .filter(f => f.id !== 'settings')
    .sort((a, b) => a.name.localeCompare(b.name));
  const settingsFeature = features.find(f => f.id === 'settings');
  if (settingsFeature) {
    sortedFeatures.push(settingsFeature);
  }


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
      
      <div className="features-grid">
        {/* Use sortedFeatures */}
        {sortedFeatures.map((feature) => (
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
      
      <div className="homepage-footer">
        <p>Microsoft Support Tools Extension v1.0.2</p>
        <p>© 2025 Microsoft Corporation. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Homepage;
