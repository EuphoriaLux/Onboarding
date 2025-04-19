// src/features/homepage/components/Homepage.tsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAppState } from '../../../contexts/AppStateContext'; // Import useAppState
import Navbar from '../../../components/Navbar'; // Import the Navbar
import '../../../styles/Navbar.css'; // Import Navbar styles
import { features, Feature } from '../constants'; // Import features and type

const Homepage: React.FC = () => {
  const { translate } = useLanguage();
  const { state } = useAppState(); // Get the global state, including showAlphaBetaFeatures
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Effect for keyboard and mouse navigation back to home
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Alt key is pressed and ArrowLeft key
      if (event.altKey && event.key === 'ArrowLeft') {
        // Check if a feature is currently active (not on the main dashboard)
        if (activeFeature !== null) {
          event.preventDefault(); // Prevent default browser back navigation
          setActiveFeature(null); // Navigate back to the homepage dashboard
        }
      }
      // Note: Alt + ArrowRight is not handled here as there's no "forward" concept in this component's state
    };

    const handleMouseUp = (event: MouseEvent) => {
      // Check if the "Back" mouse button (typically button 3) was pressed
      if (event.button === 3) {
        // Check if a feature is currently active (not on the main dashboard)
        if (activeFeature !== null) {
          event.preventDefault(); // Prevent default browser back navigation
          setActiveFeature(null); // Navigate back to the homepage dashboard
        }
      }
      // Note: Forward mouse button (button 4) is not handled due to lack of forward history state
    };

    // Add event listeners when the component mounts
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', handleMouseUp); // Listen for mouse button releases

    // Remove event listeners when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeFeature]); // Dependency array includes activeFeature to ensure checks inside handlers use the latest state

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
      <Navbar /> {/* Add the Navbar component here */}
      <div className="homepage-header">
        <h1>Microsoft Support Tools</h1>
        <p>Select a tool to get started</p>
      </div>

      {/* Render features grouped by category */}
      {sortedCategories.map((category) => (
        <div key={category} className="feature-category-section">
          <h2>{category}</h2>
          <div className="features-grid">
            {groupedFeatures[category].map((feature) => {
              // Determine if the feature should be enabled based on its own flag OR the global toggle
              const isFeatureEnabled = feature.enabled || (state.showAlphaBetaFeatures && feature.category === 'Coming Soon Features');
              // Determine if the "Coming Soon" badge should be shown
              const showComingSoonBadge = !feature.enabled && !state.showAlphaBetaFeatures && feature.category === 'Coming Soon Features';

              return (
                <button
                  key={feature.id}
                  className={`feature-card ${!isFeatureEnabled ? 'disabled' : ''}`}
                  onClick={() => isFeatureEnabled && setActiveFeature(feature.id)}
                  disabled={!isFeatureEnabled} // Disable button if not enabled by either condition
                  aria-label={feature.name} // Add aria-label for accessibility
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  {/* Removed duplicate icon and extra div */}
                  <div className="feature-content">
                    <h3>{feature.name}</h3>
                    <p>{feature.description}</p>
                    {showComingSoonBadge && <span className="coming-soon-badge">Coming Soon</span>}
                  </div>
                </button>
              );
            })}
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
