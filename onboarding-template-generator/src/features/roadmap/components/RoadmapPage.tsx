import React, { useState } from 'react';

type Status = 'Completed' | 'In Progress' | 'Planned';

// Define the structure for a roadmap item
interface RoadmapItem {
  id: string;
  quarter: string; // e.g., "Q3 2025", "Q4 2025"
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned'; // Possible statuses
}

// Updated Roadmap Data reflecting constants.tsx
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
  // --- Q2 2025 ---
  {
    id: 'engage-services-v1',
    quarter: 'Q2 2025',
    title: 'Microsoft Engage Services Integration',
    description: 'Integrate Microsoft Engage Services into the extension.',
    status: 'Planned',
  },
  // Moved 'deployment-readiness-v1' to Q3
  {
    id: 'roadmap-v1',
    quarter: 'Q2 2025',
    title: 'Roadmap Feature',
    description: 'Display planned features and improvements within the extension.',
    status: 'Completed', // Marked as completed now
  },
  // --- Q3 2025 ---
  {
    id: 'deployment-readiness-v1',
    quarter: 'Q3 2025', // Updated Quarter
    title: 'Enterprise Deployment Readiness',
    description: 'Capability for enterprise deployment established via private store.',
    status: 'Planned', // Updated Status
  },
  {
    id: 'azure-transfer-assist-v1',
    quarter: 'Q3 2025',
    title: 'Azure Transfer Assist tool (Planned)',
    description: 'Tool to assist with planning or executing Azure resource transfers.',
    status: 'Planned',
  },
  // --- Q4 2025 ---
  // --- Q1 2026 --- // Moved Support Reporting here
  {
    id: 'reporting-v1', // Matches constants.tsx
    quarter: 'Q1 2026', // Updated Quarter
    title: 'Support Reporting (Planned)',
    description: 'Create and export support usage reports and analytics.',
    status: 'Planned',
  },
  {
    id: 'azure-cost-optimization-v1', // New ID
    quarter: 'Q4 2025',
    title: 'Azure Cost Optimization (Planned)', // New Title
    description: 'Features to help analyze or suggest Azure cost savings.', // Description
    status: 'Planned',
  },
  {
    id: 'crm-v1-alpha', // New unique ID
    quarter: 'Q4 2025',
    title: 'CRM Integration (Alpha)',
    description: 'Basic customer relationship management features (Alpha version).',
    status: 'Planned',
  },
  // Moved Support Requests Management to Q4 2025
  {
    id: 'support-requests-mgmt-v1-alpha', // New unique ID
    quarter: 'Q4 2025', // Updated Quarter
    title: 'Support Requests Management (Alpha)',
    description: 'Tool for viewing and managing support requests via Azure (Alpha version).',
    status: 'Planned',
  },
  // Add future planned items beyond constants.tsx here if needed
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

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-500 text-white';
    case 'In Progress':
      return 'bg-blue-500 text-white';
    case 'Planned':
      return 'bg-yellow-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const RoadmapPage: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const groupedItems = groupItemsByQuarter(roadmapData);
  // Define a sort order for quarters if needed, e.g., ["Q3 2025", "Q4 2025", "Q1 2026"]
  const sortedQuarters = Object.keys(groupedItems).sort((a, b) => {
    const [aQ, aY] = a.split(' ');
    const [bQ, bY] = b.split(' ');
    if (aY !== bY) return parseInt(aY) - parseInt(bY);
    return parseInt(aQ.substring(1)) - parseInt(bQ.substring(1));
  });


  return (
    <div className="p-6 mx-auto max-w-7xl bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-3">Extension Roadmap</h2>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
        Overview of planned features and improvements for the Microsoft Support Tools extension. Statuses are indicative and subject to change.
      </p>

      {/* Horizontal Timeline Structure */}
      <div className="w-full overflow-x-auto py-10">
        <div className="relative flex md:flex-row min-w-fit px-10">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2"></div>
          
          {sortedQuarters.map((quarter, quarterIndex) => (
            <div key={quarter} className="relative flex flex-col items-start flex-1 md:min-w-[200px] px-5 z-10">
              {/* Timeline marker */}
              <div className="relative w-5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full border-4 border-white dark:border-gray-800 -mt-2 z-20"></div>
              
              {/* Quarter label */}
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {quarter}
              </span>

              {/* Timeline items */}
              <div className="w-full flex flex-col gap-3 mt-12">
                {groupedItems[quarter].map((item) => {
                  const isExpanded = expandedItems.includes(item.id);

                  const toggleExpanded = () => {
                    setExpandedItems((prev) =>
                      prev.includes(item.id)
                        ? prev.filter((id) => id !== item.id)
                        : [...prev, item.id]
                    );
                  };

                  return (
                    <button
                      key={item.id}
                      className={`relative bg-white dark:bg-gray-700 rounded-md border ${
                        item.status === 'Completed'
                          ? 'border-green-200 dark:border-green-800'
                          : item.status === 'In Progress'
                          ? 'border-blue-200 dark:border-blue-800'
                          : 'border-gray-200 dark:border-gray-600'
                      } p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 w-full text-left`}
                      onClick={toggleExpanded}
                    >
                      <div className="item-content">
                        <h4 className="text-gray-800 dark:text-gray-200 font-medium mb-1">{item.title}</h4>
                        <p
                          className={`text-gray-600 dark:text-gray-400 text-sm mb-8 overflow-hidden transition-all duration-200 ${
                            isExpanded ? 'max-h-40' : 'max-h-0'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                      <span className={`absolute bottom-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      {/* Connector line */}
                      <div className={`absolute top-5 left-1/2 w-0.5 h-10 -translate-y-full transform -translate-x-1/2 ${
                        item.status === 'Completed'
                          ? 'bg-green-300 dark:bg-green-600'
                          : item.status === 'In Progress'
                          ? 'bg-blue-300 dark:bg-blue-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
