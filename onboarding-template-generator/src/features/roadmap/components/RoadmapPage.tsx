import React from 'react';
import './RoadmapPage.css'; // Import CSS for styling

// Define the structure for a roadmap item
interface RoadmapItem {
  id: string;
  quarter: string; // e.g., "Q3 2025", "Q4 2025"
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned'; // Possible statuses
}

// Updated Roadmap Data for 2025
const roadmapData: RoadmapItem[] = [
  // --- Q1 2025 ---
  {
    id: 'onboarding-v1',
    quarter: 'Q1 2025',
    title: 'Onboarding Template Generator',
    description: 'Core feature for generating rich text templates.',
    status: 'Completed',
  },
  {
    id: 'ics-gen-v1',
    quarter: 'Q1 2025',
    title: 'ICS Generators (On-Call, Vacation, Support)',
    description: 'Tools to create calendar event files.',
    status: 'Completed',
  },
   {
    id: 'settings-v1',
    quarter: 'Q1 2025',
    title: 'Extension Settings Page',
    description: 'Initial configuration options.',
    status: 'Completed',
  },
  {
    id: 'roadmap-v1',
    quarter: 'Q1 2025', // Assuming roadmap feature completed in Q2
    title: 'Roadmap Feature',
    description: 'Display planned features and improvements within the extension.',
    status: 'Completed',
  },
  // --- Q2 2025 ---
  {
    id: 'deployment-readiness-v1',
    quarter: 'Q2 2025',
    title: 'Enterprise Deployment Readiness',
    description: 'Capability for enterprise deployment established via private store.',
    status: 'Completed',
  },
  // --- Q3 2025 ---
  {
    id: 'azure-transfer-tool-v1',
    quarter: 'Q3 2025',
    title: 'Azure Transfer Tool (Planned)',
    description: 'Tool to assist with Azure resource transfers or migrations (details TBD).',
    status: 'Planned',
  },
  // --- Q4 2025 ---
  {
    id: 'azure-cost-optimization-v1',
    quarter: 'Q4 2025',
    title: 'Azure Cost Optimization (Planned)',
    description: 'Features to help analyze or suggest Azure cost savings (details TBD).',
    status: 'Planned',
  },
  // Add items for 2026+ here if needed
];

// Helper function to group items by quarter
const groupItemsByQuarter = (items: RoadmapItem[]) => {
  return items.reduce((acc, item) => {
    const quarter = item.quarter;
    if (!acc[quarter]) {
      acc[quarter] = [];
    }
    acc[quarter].push(item);
    return acc;
  }, {} as Record<string, RoadmapItem[]>);
};

const RoadmapPage: React.FC = () => {
  const groupedItems = groupItemsByQuarter(roadmapData);
  // Define a sort order for quarters if needed, e.g., ["Q3 2025", "Q4 2025", "Q1 2026"]
  const sortedQuarters = Object.keys(groupedItems).sort((a, b) => {
    const [aQ, aY] = a.split(' ');
    const [bQ, bY] = b.split(' ');
    if (aY !== bY) return parseInt(aY) - parseInt(bY);
    return parseInt(aQ.substring(1)) - parseInt(bQ.substring(1));
  });


  return (
    <div className="roadmap-page-container">
      <h2>Extension Roadmap</h2>
      <p className="roadmap-intro">
        Overview of planned features and improvements for the Microsoft Support Tools extension. Statuses are indicative and subject to change.
      </p>

      {/* Horizontal Timeline Structure */}
      <div className="roadmap-timeline-container">
        <div className="timeline">
          {/* Iterate through sorted quarters to create timeline sections */}
          {sortedQuarters.map((quarter, quarterIndex) => (
            <div key={quarter} className="timeline-quarter-section">
              <div className="timeline-marker">
                <span className="quarter-label">{quarter}</span>
              </div>
              <div className="timeline-items">
                {/* Map items within this quarter */}
                {groupedItems[quarter].map((item, itemIndex) => (
                  // Add alternating class for positioning above/below if needed by CSS
                  <div key={item.id} className={`timeline-item status-${item.status.toLowerCase().replace(' ', '-')} item-pos-${itemIndex % 2 === 0 ? 'even' : 'odd'}`}>
                    <div className="item-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <span className="roadmap-item-status">{item.status}</span>
                    {/* Optional: Add a connector line/arrow via CSS */}
                    <div className="item-connector"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End of Horizontal Timeline Structure */}

    </div>
  );
};

export default RoadmapPage;
