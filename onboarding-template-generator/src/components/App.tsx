// src/components/App.tsx
import React from 'react';
import OnboardingTemplateGenerator from './OnboardingTemplateGenerator';
import '../styles/App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <OnboardingTemplateGenerator />
    </div>
  );
};

export default App;