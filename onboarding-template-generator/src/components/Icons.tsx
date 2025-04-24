import React from 'react';

export const OnboardingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#0078D4" fillOpacity="0.1"/>
    <path d="M30 10H10C8.9 10 8 10.9 8 12V28C8 29.1 8.9 30 10 30H30C31.1 30 32 29.1 32 28V12C32 10.9 31.1 10 30 10ZM30 28H10V12H30V28Z" fill="#0078D4"/>
    <path d="M15 22H25V24H15V22ZM15 18H25V20H15V18ZM15 14H25V16H15V14Z" fill="#0078D4"/>
    <circle cx="30" cy="10" r="4" fill="#0078D4"/>
    <path d="M30 8V12M28 10H32" stroke="white" strokeWidth="1.5"/>
  </svg>
);

export const ComplianceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#107C10" fillOpacity="0.1"/>
    <path d="M20 8L8 14V20C8 26.6274 13.3726 32 20 32C26.6274 32 32 26.6274 32 20V14L20 8Z" stroke="#107C10" strokeWidth="2" fill="none"/>
    <path d="M17.25 20.25L19.25 22.25L23.25 18.25" stroke="#107C10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 15V16M16 19H15M25 19H24M17 16L16 15M23 16L24 15" stroke="#107C10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ReportingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#D83B01" fillOpacity="0.1"/>
    <rect x="10" y="8" width="6" height="24" rx="1" stroke="#D83B01" strokeWidth="2" fill="none"/>
    <rect x="22" y="14" width="6" height="18" rx="1" stroke="#D83B01" strokeWidth="2" fill="none"/>
    <path d="M10 20L18 12L30 22" stroke="#D83B01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="12" r="2" fill="#D83B01"/>
    <circle cx="30" cy="22" r="2" fill="#D83B01"/>
  </svg>
);

export const SettingsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#605E5C" fillOpacity="0.1"/>
    <path d="M20 24C22.2091 24 24 22.2091 24 20C24 17.7909 22.2091 16 20 16C17.7909 16 16 17.7909 16 20C16 22.2091 17.7909 24 20 24Z" stroke="#605E5C" strokeWidth="2" fill="none"/>
    <path d="M32 21.3299V18.6699C32 18.1876 31.6693 17.7742 31.2 17.6839L28.6745 17.1838C28.4805 16.6984 28.238 16.235 27.9525 15.8026L29.0395 13.4359C29.2489 13.0171 29.1663 12.5086 28.8264 12.1687L26.8311 10.1734C26.4912 9.8335 25.9827 9.75091 25.5639 9.96028L23.1972 11.0473C22.7648 10.7618 22.3013 10.5193 21.8159 10.3253L21.3159 7.79992C21.2255 7.33063 20.8122 7 20.3299 7H17.6699C17.1876 7 16.7742 7.33063 16.6839 7.79992L16.1838 10.3253C15.6984 10.5193 15.235 10.7618 14.8026 11.0473L12.4359 9.96028C12.0171 9.75091 11.5086 9.8335 11.1687 10.1734L9.17346 12.1687C8.83356 12.5086 8.75096 13.0171 8.96034 13.4359L10.0473 15.8026C9.76183 16.235 9.51933 16.6984 9.32532 17.1838L6.79991 17.6839C6.33061 17.7742 5.99998 18.1876 5.99998 18.6699V21.3299C5.99998 21.8122 6.33061 22.2255 6.79991 22.3159L9.32532 22.816C9.51933 23.3013 9.76183 23.7648 10.0473 24.1972L8.96034 26.5639C8.75096 26.9827 8.83356 27.4912 9.17346 27.8311L11.1687 29.8264C11.5086 30.1663 12.0171 30.2489 12.4359 30.0395L14.8026 28.9525C15.235 29.238 15.6984 29.4805 16.1838 29.6745L16.6839 32.1999C16.7742 32.6692 17.1876 32.9998 17.6699 32.9998H20.3299C20.8122 32.9998 21.2255 32.6692 21.3159 32.1999L21.8159 29.6745C22.3013 29.4805 22.7648 29.238 23.1972 28.9525L25.5639 30.0395C25.9827 30.2489 26.4912 30.1663 26.8311 29.8264L28.8264 27.8311C29.1663 27.4912 29.2489 26.9827 29.0395 26.5639L27.9525 24.1972C28.238 23.7648 28.4805 23.3013 28.6745 22.816L31.2 22.3159C31.6693 22.2255 32 21.8122 32 21.3299Z" stroke="#605E5C" strokeWidth="2" fill="none"/>
  </svg>
);

// Placeholder Icons for new features (Simple Calendar Icons)
export const CalendarIcon = ({ color = "#757575" }) => ( // Default gray color
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill={color} fillOpacity="0.1"/>
    <path d="M29 12H11C9.89543 12 9 12.8954 9 14V30C9 31.1046 9.89543 32 11 32H29C30.1046 32 31 31.1046 31 30V14C31 12.8954 30.1046 12 29 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 8V12M14 8V12M9 18H31" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Optional: Add a small detail like a plus or checkmark */}
    {/* <path d="M20 23V29M17 26H23" stroke={color} strokeWidth="1.5" strokeLinecap="round"/> */}
  </svg>
);

// --- New Placeholder Icons ---

// Placeholder for Azure Transfer Assist (using ComplianceIcon structure)
export const AzureTransferIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#0078D4" fillOpacity="0.1"/> {/* Blue base */}
    <path d="M14 26L20 32L26 26M20 8V31M8 14H14M26 14H32" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> {/* Arrows */}
  </svg>
);

// Placeholder for Cost Optimization (using ReportingIcon structure)
export const CostOptimizationIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#D83B01" fillOpacity="0.1"/> {/* Orange base */}
    <path d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10Z" stroke="#D83B01" strokeWidth="2"/>
    <path d="M22 16V20H26M18 24V20H14" stroke="#D83B01" strokeWidth="2" strokeLinecap="round"/> {/* Dollar-like sign */}
  </svg>
);

// Placeholder for Roadmap (using CalendarIcon structure)
export const RoadmapIcon = () => (
  <CalendarIcon color="#605E5C" /> // Reuse CalendarIcon with gray color
);

// Placeholder for Deployment (using SettingsIcon structure)
export const DeploymentIcon = () => (
  <SettingsIcon /> // Reuse SettingsIcon
);

export const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 8V4M12 20V16M16 12H20M4 12H8M15.5355 15.5355L18.3639 18.3639M5.63604 5.63604L8.46447 8.46447M15.5355 8.46447L18.3639 5.63604M5.63604 18.3639L8.46447 15.5355" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1125 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.754 21.1181 10.0808 20.7461C8.4076 20.3741 6.85793 19.5345 5.60897 18.3288C4.36001 17.1231 3.46637 15.6031 3.02868 13.9268C2.591 12.2505 2.62814 10.4928 3.13616 8.84153C3.64418 7.19028 4.59924 5.71347 5.88973 4.5839C7.18022 3.45433 8.74742 2.72161 10.416 2.45679C10.1716 3.43023 10.147 4.4363 10.3437 5.41992C10.5404 6.40354 10.9536 7.33824 11.5514 8.15795C12.1492 8.97767 12.9166 9.66229 13.8001 10.1614C14.6836 10.6605 15.6618 10.9613 16.6667 11.0413C17.6716 11.1213 18.6775 10.9788 19.616 10.6247C20.5545 10.2706 21.4019 9.71445 22.0944 8.99811C22.7869 8.28177 23.3065 7.42361 23.6145 6.48622C23.9225 5.54882 24.0109 4.55718 23.8733 3.58398C22.1834 4.15626 20.6731 5.13714 19.4896 6.43257C18.3062 7.728 17.4908 9.2931 17.1232 10.9844C16.7556 12.6757 16.8494 14.4329 17.3956 16.0795C17.9418 17.7261 18.9215 19.2018 20.238 20.3534" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const EngageServicesIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#0078D4" fillOpacity="0.1"/>
    <path d="M20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28C24.4183 28 28 24.4183 28 20C28 15.5817 24.4183 12 20 12Z" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 12V8M20 32V28M12 20H8M32 20H28M14.9289 14.9289L12.3431 12.3431M27.6569 27.6569L25.0711 25.0711M14.9289 25.0711L12.3431 27.6569M27.6569 12.3431L25.0711 14.9289" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 16L24 20L20 24L16 20L20 16Z" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
