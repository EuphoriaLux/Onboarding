import React, { useState } from 'react';

// Collapsible Section component (moved from App.tsx)
const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}> = ({ title, children, initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    // Container with spacing and border
    <div className="mb-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      {/* Header with toggle button */}
      <div
        className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Title styling */}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        {/* Toggle icon styling */}
        <span className="text-gray-500 dark:text-gray-400">{isExpanded ? '−' : '+'}</span>
      </div>
      {/* Collapsible content area */}
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
