import React from 'react';
import OnboardingTemplateGenerator from '../../features/onboarding/components/OnboardingTemplateGenerator';
import SettingsPage from '../settings/components/SettingsPage';
import OnCallDutyForm from '../icsGenerator/components/OnCallDutyForm';
import VacationRequestForm from '../icsGenerator/components/VacationRequestForm';
import SupportRequestForm from '../icsGenerator/components/SupportRequestForm';
import RoadmapPage from '../roadmap/components/RoadmapPage'; // Import the new Roadmap component
import { SupportRequestViewer } from '../supportRequests'; // Import the new Azure tool
import {
  OnboardingIcon,
  ComplianceIcon, // Still used for Azure Transfer Assist placeholder
  ReportingIcon,  // Still used for Support Reporting & Cost Optimization placeholders
  SettingsIcon,   // Still used for Settings & Deployment Readiness placeholder
  CalendarIcon,   // Still used for ICS & Roadmap placeholder
  // Import new placeholder icons
  AzureTransferIcon,
  CostOptimizationIcon,
  RoadmapIcon,
  DeploymentIcon,
  EngageServicesIcon
  // ReportingIcon is already imported above
} from '../../components/Icons'; // Adjusted path
import { EngageServicesSection } from '../engageServices/components/EngageServicesSection';
import CrmView from '../crm/components/CrmView'; // Re-add the CRM view component

// Feature type definition
export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  enabled: boolean;
  category: string; // Add category field
}

// Define available features
export const features: Feature[] = [
  {
    id: 'onboarding',
    name: 'Onboarding Template Generator',
    description: 'Create rich text onboarding templates for Microsoft support customers.',
    icon: <OnboardingIcon />,
    component: OnboardingTemplateGenerator,
    enabled: true,
    category: 'Template & Email Tools'
  },
  {
    id: 'azure-transfer-assist',
    name: 'Azure Transfer Assist tool',
    description: 'Tool to assist with planning or executing Azure resource transfers.',
    icon: <AzureTransferIcon />, // Use new placeholder
    component: () => <div className="coming-soon">Coming Soon</div>,
    enabled: false,
    category: 'Coming Soon Features'
  },
  {
    id: 'reporting',
    name: 'Support Reporting',
    description: 'Create and export support usage reports and analytics.',
    icon: <ReportingIcon />,
    component: () => <div className="coming-soon">Coming Soon</div>,
    enabled: false,
    category: 'Coming Soon Features' // Renamed Category
  },
  {
    id: 'azure-cost-optimization',
    name: 'Azure Cost Optimization',
    description: 'Features to help analyze or suggest Azure cost savings.',
    icon: <CostOptimizationIcon />, // Use new placeholder
    component: () => <div className="coming-soon">Coming Soon</div>,
    enabled: false,
    category: 'Coming Soon Features'
  },
  {
    id: 'settings',
    name: 'Extension Settings',
    description: 'Configure extension preferences and defaults.',
    icon: <SettingsIcon />,
    component: SettingsPage, // Use the actual component
    enabled: true,
    category: 'Configuration'
  },
   {
    id: 'roadmap',
    name: 'Extension Roadmap',
    description: 'View planned features and improvements for the extension.',
    icon: <RoadmapIcon />, // Use new placeholder
    component: RoadmapPage,
    enabled: true,
    category: 'Configuration'
  },
  {
    id: 'deployment-readiness',
    name: 'Enterprise Deployment Readiness',
    description: 'Capability for enterprise deployment via private store.',
    icon: <DeploymentIcon />, // Use new placeholder
    component: () => <div className="coming-soon">Coming Soon</div>,
    enabled: false,
    category: 'Coming Soon Features'
  },
  // Add new ICS Generator Features
  {
    id: 'onCallDuty',
    name: 'On-Call Duty ICS Generator',
    description: 'Create an .ics file for on-call duty periods.',
    icon: <CalendarIcon color="#E81123" />, // Red color for On-Call
    component: OnCallDutyForm,
    enabled: true,
    category: 'Calendar (.ics) Generators'
  },
  {
    id: 'vacationRequest',
    name: 'Vacation Request ICS Generator',
    description: 'Generate an .ics file for vacation requests.',
    icon: <CalendarIcon color="#0078D4" />, // Blue color for Vacation
    component: VacationRequestForm,
    enabled: true,
    category: 'Calendar (.ics) Generators'
  },
  {
    id: 'supportRequest',
    name: 'Support Request ICS Generator',
    description: 'Generate an .ics file for support request entries.',
    icon: <CalendarIcon color="#107C10" />, // Green color for Support
    component: SupportRequestForm,
    enabled: true,
    category: 'Calendar (.ics) Generators'
  },
  // Add the new Support Request Viewer feature
  {
    id: 'supportRequestViewer',
    name: 'Support Requests Management (Alpha)', // Updated Name
    description: 'View support requests stored in Azure Blob Storage (Alpha version).', // Updated Description
    icon: <ReportingIcon />, // Using ReportingIcon as placeholder
    component: SupportRequestViewer,
    enabled: false, // Disabled as it's coming soon
    category: 'Coming Soon Features' // Moved to Coming Soon
  },
  {
    id: 'crm',
    name: 'Customer Management (CRM - Alpha)',
    description: 'Manage customer records.',
    icon: <ReportingIcon />, // Using ReportingIcon as placeholder
    component: CrmView,
    enabled: true,
    category: 'Coming Soon Features'
  },
  {
    id: 'engage-services',
    name: 'Microsoft Engage Services',
    description: 'View and manage Microsoft Engage service offerings and tools.',
    icon: <EngageServicesIcon />,
    component: () => <EngageServicesSection services={[]} />,
    enabled: true,
    category: 'Sales & Engage Services'
  }
];
