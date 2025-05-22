import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAppState } from '../../../contexts/AppStateContext';
import Navbar from '../../../components/Navbar';
import { features, Feature } from '../constants';

const Homepage: React.FC = () => {
  const { translate } = useLanguage();
  const { state, setActiveFeatureId } = useAppState(); // Destructure setActiveFeatureId
  // Removed local activeFeature state

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'ArrowLeft' && state.activeFeatureId !== null) {
        event.preventDefault();
        setActiveFeatureId(null); // Use setActiveFeatureId from context
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 3 && state.activeFeatureId !== null) {
        event.preventDefault();
        setActiveFeatureId(null); // Use setActiveFeatureId from context
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.activeFeatureId, setActiveFeatureId]); // Update dependencies

  const groupedFeatures = features.reduce((acc, feature) => {
    const category = feature.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(feature);
    acc[category].sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {} as Record<string, Feature[]>);

  const categoryOrder = [
    'Template & Email Tools',
    'Calendar (.ics) Generators',
    'Coming Soon Features',
    'Configuration',
    'Other'
  ];

  const sortedCategories = Object.keys(groupedFeatures).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const handleBackToHome = () => setActiveFeatureId(null); // Use setActiveFeatureId from context

  if (state.activeFeatureId) { // Use activeFeatureId from context
    const feature = features.find(f => f.id === state.activeFeatureId); // Use activeFeatureId from context
    if (feature) {
      const FeatureComponent = feature.component;
      return (
        <div className="flex flex-col min-h-screen">
          <div className="flex items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <button 
              className="bg-transparent text-blue-600 dark:text-blue-400 text-base px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              onClick={handleBackToHome}
            >
              ← Back to Home
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white ml-4">
              {feature.name}
            </h1>
          </div>
          <div className="flex-1 p-6">
            <FeatureComponent />
          </div>
        </div>
      );
    }
  }

  return (
    // Ensure the main container allows its children to grow
    <div className="w-full px-4 sm:px-6 py-10 min-h-screen flex flex-col items-center"> {/* Center items */}
      <Navbar />
      {/* Center the header content, ensure it doesn't exceed max width */}
      <div className="text-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Microsoft Support Tools</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Select a tool to get started</p>
      </div>

      {/* Container for categories, ensure it takes appropriate width */}
      {sortedCategories.map((category) => (
        <div key={category} className="mb-10 w-full max-w-6xl"> {/* Set max-width here */}
          {/* Sticky header for category */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-4 mb-6 border-b border-gray-200 dark:border-gray-700"> {/* Increased mb */}
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white"> {/* Adjusted font weight */}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"> {/* Changed gradient */}
                {category}
              </span>
            </h2>
          </div>
          {/* Grid container - ensure it's using the grid display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Removed w-full, max-w, mx-auto as parent handles width */}
            {groupedFeatures[category].map((feature) => {
              const isFeatureEnabled = feature.enabled || (state.showAlphaBetaFeatures && feature.category === 'Coming Soon Features');
              const showComingSoonBadge = !feature.enabled && !state.showAlphaBetaFeatures && feature.category === 'Coming Soon Features';

              // Card is now the direct grid item
              return (
                <div
                  key={feature.id}
                  className={`group flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700
                    ${!isFeatureEnabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer hover:shadow-md hover:-translate-y-1'}`}
                  onClick={() => isFeatureEnabled && setActiveFeatureId(feature.id)} // Use setActiveFeatureId from context
                  aria-label={feature.name}
                >
                  {/* Icon with hover effect */}
                  <div className="flex-shrink-0 mb-4 transition-transform duration-300 ease-in-out group-hover:scale-105"> {/* Increased margin-bottom */}
                    {feature.icon}
                  </div>
                  {/* Text content area */}
                  <div className="flex flex-col flex-grow gap-2"> {/* Use flex-grow to push badge down */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.name}</h3> {/* Increased font-weight */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 transition-colors duration-200 flex-grow"> {/* Added flex-grow here too */}
                      {feature.description}
                    </p>
                  </div>
                  {/* Coming Soon Badge */}
                  {showComingSoonBadge && (
                    <div className="mt-4 pt-2"> {/* Adjusted margin */}
                      <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium"> {/* Changed badge style */}
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p className="mb-1">Microsoft Support Tools Extension v1.0.2</p>
        <p>© 2025 Microsoft Corporation. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Homepage;
