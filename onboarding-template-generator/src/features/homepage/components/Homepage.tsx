// src/features/homepage/components/Homepage.tsx
import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAppState } from '../../../contexts/AppStateContext';
import App from '../../common/components/App';
import SettingsPage from '../../settings/components/SettingsPage';
// Import the new ICS form components
import OnCallDutyForm from '../../icsGenerator/components/OnCallDutyForm';
import VacationRequestForm from '../../icsGenerator/components/VacationRequestForm';
import SupportRequestForm from '../../icsGenerator/components/SupportRequestForm';

// Icon components
const OnboardingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#0078D4" fillOpacity="0.1"/>
    <path d="M30 10H10C8.9 10 8 10.9 8 12V28C8 29.1 8.9 30 10 30H30C31.1 30 32 29.1 32 28V12C32 10.9 31.1 10 30 10ZM30 28H10V12H30V28Z" fill="#0078D4"/>
    <path d="M15 22H25V24H15V22ZM15 18H25V20H15V18ZM15 14H25V16H15V14Z" fill="#0078D4"/>
    <circle cx="30" cy="10" r="4" fill="#0078D4"/>
    <path d="M30 8V12M28 10H32" stroke="white" strokeWidth="1.5"/>
  </svg>
);

const ComplianceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#107C10" fillOpacity="0.1"/>
    <path d="M20 8L8 14V20C8 26.6274 13.3726 32 20 32C26.6274 32 32 26.6274 32 20V14L20 8Z" stroke="#107C10" strokeWidth="2" fill="none"/>
    <path d="M17.25 20.25L19.25 22.25L23.25 18.25" stroke="#107C10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 15V16M16 19H15M25 19H24M17 16L16 15M23 16L24 15" stroke="#107C10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReportingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#D83B01" fillOpacity="0.1"/>
    <rect x="10" y="8" width="6" height="24" rx="1" stroke="#D83B01" strokeWidth="2" fill="none"/>
    <rect x="22" y="14" width="6" height="18" rx="1" stroke="#D83B01" strokeWidth="2" fill="none"/>
    <path d="M10 20L18 12L30 22" stroke="#D83B01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="12" r="2" fill="#D83B01"/>
    <circle cx="30" cy="22" r="2" fill="#D83B01"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#605E5C" fillOpacity="0.1"/>
    <path d="M20 24C22.2091 24 24 22.2091 24 20C24 17.7909 22.2091 16 20 16C17.7909 16 16 17.7909 16 20C16 22.2091 17.7909 24 20 24Z" stroke="#605E5C" strokeWidth="2" fill="none"/>
    <path d="M32 21.3299V18.6699C32 18.1876 31.6693 17.7742 31.2 17.6839L28.6745 17.1838C28.4805 16.6984 28.238 16.235 27.9525 15.8026L29.0395 13.4359C29.2489 13.0171 29.1663 12.5086 28.8264 12.1687L26.8311 10.1734C26.4912 9.8335 25.9827 9.75091 25.5639 9.96028L23.1972 11.0473C22.7648 10.7618 22.3013 10.5193 21.8159 10.3253L21.3159 7.79992C21.2255 7.33063 20.8122 7 20.3299 7H17.6699C17.1876 7 16.7742 7.33063 16.6839 7.79992L16.1838 10.3253C15.6984 10.5193 15.235 10.7618 14.8026 11.0473L12.4359 9.96028C12.0171 9.75091 11.5086 9.8335 11.1687 10.1734L9.17346 12.1687C8.83356 12.5086 8.75096 13.0171 8.96034 13.4359L10.0473 15.8026C9.76183 16.235 9.51933 16.6984 9.32532 17.1838L6.79991 17.6839C6.33061 17.7742 5.99998 18.1876 5.99998 18.6699V21.3299C5.99998 21.8122 6.33061 22.2255 6.79991 22.3159L9.32532 22.816C9.51933 23.3013 9.76183 23.7648 10.0473 24.1972L8.96034 26.5639C8.75096 26.9827 8.83356 27.4912 9.17346 27.8311L11.1687 29.8264C11.5086 30.1663 12.0171 30.2489 12.4359 30.0395L14.8026 28.9525C15.235 29.238 15.6984 29.4805 16.1838 29.6745L16.6839 32.1999C16.7742 32.6692 17.1876 32.9998 17.6699 32.9998H20.3299C20.8122 32.9998 21.2255 32.6692 21.3159 32.1999L21.8159 29.6745C22.3013 29.4805 22.7648 29.238 23.1972 28.9525L25.5639 30.0395C25.9827 30.2489 26.4912 30.1663 26.8311 29.8264L28.8264 27.8311C29.1663 27.4912 29.2489 26.9827 29.0395 26.5639L27.9525 24.1972C28.238 23.7648 28.4805 23.3013 28.6745 22.816L31.2 22.3159C31.6693 22.2255 32 21.8122 32 21.3299Z" stroke="#605E5C" strokeWidth="2" fill="none"/>
  </svg>
);

// Placeholder Icons for new features (Simple Calendar Icons)
const CalendarIcon = ({ color = "#757575" }) => ( // Default gray color
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill={color} fillOpacity="0.1"/>
    <path d="M29 12H11C9.89543 12 9 12.8954 9 14V30C9 31.1046 9.89543 32 11 32H29C30.1046 32 31 31.1046 31 30V14C31 12.8954 30.1046 12 29 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 8V12M14 8V12M9 18H31" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Optional: Add a small detail like a plus or checkmark */}
    {/* <path d="M20 23V29M17 26H23" stroke={color} strokeWidth="1.5" strokeLinecap="round"/> */}
  </svg>
);


// Feature type definition
interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  enabled: boolean;
}

const Homepage: React.FC = () => {
  const { translate } = useLanguage();
  const { state } = useAppState();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Define available features
  const features: Feature[] = [
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

  // Sort features alphabetically by name, keeping Settings last
  const sortedFeatures = features
    .filter(f => f.id !== 'settings')
    .sort((a, b) => a.name.localeCompare(b.name));
  const settingsFeature = features.find(f => f.id === 'settings');
  if (settingsFeature) {
    sortedFeatures.push(settingsFeature);
  }


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
      <div className="homepage-header">
        <h1>Microsoft Support Tools</h1>
        <p>Select a tool to get started</p>
      </div>
      
      <div className="features-grid">
        {/* Use sortedFeatures */}
        {sortedFeatures.map((feature) => (
          <div
            key={feature.id}
            className={`feature-card ${!feature.enabled ? 'disabled' : ''}`}
            onClick={() => feature.enabled && setActiveFeature(feature.id)}
          >
            <div className="feature-icon">
              {feature.icon}
            </div>
            <div className="feature-content">
              <h3>{feature.name}</h3>
              <p>{feature.description}</p>
              {!feature.enabled && <span className="coming-soon-badge">Coming Soon</span>}
            </div>
          </div>
        ))}
      </div>
      
      <div className="homepage-footer">
        <p>Microsoft Support Tools Extension v1.0.2</p>
        <p>© 2025 Microsoft Corporation. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Homepage;
