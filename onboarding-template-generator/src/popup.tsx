import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/App.css';

const Popup: React.FC = () => {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="popup-container">
      <h2>Microsoft Support Onboarding</h2>
      <p>Click below to open the template generator</p>
      <button className="primary-button" onClick={openOptions}>
        Open Template Generator
      </button>
    </div>
  );
};

// Create root element for React
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}