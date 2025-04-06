import React from 'react';
import App from '../../App'; // Adjusted path
import SettingsPage from '../settings/components/SettingsPage';
import OnCallDutyForm from '../icsGenerator/components/OnCallDutyForm';
import VacationRequestForm from '../icsGenerator/components/VacationRequestForm';
import SupportRequestForm from '../icsGenerator/components/SupportRequestForm';
import RoadmapPage from '../roadmap/components/RoadmapPage'; // Import the new Roadmap component
// Removed DeploymentGuide import
import {
  OnboardingIcon,
  ComplianceIcon,
  ReportingIcon,
  SettingsIcon,
  CalendarIcon
} from '../../components/Icons'; // Adjusted path

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
    component: App,
    enabled: true,
    category: 'Template & Email Tools'
  },
  {
    id: 'compliance',
    name: 'Compliance Assessment',
    description: 'Generate Microsoft compliance assessment reports and recommendations.',
    icon: <ComplianceIcon />,
    component: () => <div className="coming-soon">Coming Soon</div>,
    enabled: false,
    category: 'Reporting & Assessment (Future)'
  },
  {
    id: 'reporting',
    name: 'Support Reporting',
    description: 'Create and export support usage reports and analytics.',
    icon: <ReportingIcon />,
    component: () => <div className="coming-soon">Coming Soon</div>,
    enabled: false,
    category: 'Reporting & Assessment (Future)'
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
    icon: <ReportingIcon />, // Using ReportingIcon for now
    component: RoadmapPage,
    enabled: true,
    category: 'Configuration' // Or maybe a new 'Information' category? Sticking with Configuration for now.
  },
  // Removed deploymentGuide feature entry
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
];
