import React from 'react';
import CollapsibleSection from '../../../components/CollapsibleSection';
import { ServiceCategory } from '../types/index';

interface EngageServicesSectionProps {
  services: ServiceCategory[];
}

export const EngageServicesSection: React.FC<EngageServicesSectionProps> = ({ services }) => {
  return (
    <div className="mb-10 w-full max-w-6xl">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Microsoft Engage Services
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {services.map((category) => (
          <CollapsibleSection 
            key={category.id}
            title={category.name}
            initialExpanded={false}
          >
            <div className="p-4 space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.services.map((service) => (
                  <div 
                    key={service.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{service.description}</p>
                    {service.examples && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Examples:</p>
                        <ul className="list-disc list-inside text-xs text-gray-500 dark:text-gray-400">
                          {service.examples.map((example, i) => (
                            <li key={i}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
};
