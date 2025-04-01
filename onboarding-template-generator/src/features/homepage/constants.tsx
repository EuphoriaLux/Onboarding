import React from 'react';
import App from '../common/components/App';
import SettingsPage from '../settings/components/SettingsPage';
import OnCallDutyForm from '../icsGenerator/components/OnCallDutyForm';
import VacationRequestForm from '../icsGenerator/components/VacationRequestForm';
import SupportRequestForm from '../icsGenerator/components/SupportRequestForm';
import {
  OnboardingIcon,
  ComplianceIcon,
  ReportingIcon,
  SettingsIcon,
  CalendarIcon
} from '../common/components/Icons'; // Assuming Icons.tsx is in common/components

// Feature type definition
export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  enabled: boolean;
}

// Define available features
export const features: Feature[] = [
  {
    id: 'onboarding',
    name: 'Onboarding Template Generator',
    description: 'Create rich text onboarding templates for Microsoft support customers.',
    icon: <OnboardingIcon />,
    component: App,
    enabled: true
  },
  {
    id: 'compliance',
    name: 'Compliance Assessment',
    description: 'Generate Microsoft compliance assessment reports and recommendations.',
    icon: <ComplianceIcon />,
    component: () => <div className="coming-soon">Coming Soon</div>,
    enabled: false
  },
  {
    id: 'reporting',
    name: 'Support Reporting',
    description: 'Create and export support usage reports and analytics.',
    icon: <ReportingIcon />,
    component: () => <div className="coming-soon">Coming Soon</div>,
    enabled: false
  },
  {
    id: 'settings',
    name: 'Extension Settings',
    description: 'Configure extension preferences and defaults.',
    icon: <SettingsIcon />,
    component: SettingsPage, // Use the actual component
    enabled: true
  },
  // Add new ICS Generator Features
  {
    id: 'onCallDuty',
    name: 'On-Call Duty ICS Generator',
    description: 'Create an .ics file for on-call duty periods.',
    icon: <CalendarIcon color="#E81123" />, // Red color for On-Call
    component: OnCallDutyForm,
    enabled: true
  },
  {
    id: 'vacationRequest',
    name: 'Vacation Request ICS Generator',
    description: 'Generate an .ics file for vacation requests.',
    icon: <CalendarIcon color="#0078D4" />, // Blue color for Vacation
    component: VacationRequestForm,
    enabled: true
  },
  {
    id: 'supportRequest',
    name: 'Support Request ICS Generator',
    description: 'Generate an .ics file for support request entries.',
    icon: <CalendarIcon color="#107C10" />, // Green color for Support
    component: SupportRequestForm,
    enabled: true
  },
];
