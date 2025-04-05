import React, { useState } from 'react';

// Collapsible Section component (moved from App.tsx)
const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}> = ({ title, children, initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div className="form-section collapsible-section">
      <div
        className={`collapsible-header ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{title}</h3>
        <span className="toggle-icon">{isExpanded ? '−' : '+'}</span>
      </div>
      {isExpanded && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
