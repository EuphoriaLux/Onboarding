import React from 'react';
import CrmApp from './CrmApp'; // Import the new CrmApp

interface CrmViewProps {}

const CrmView: React.FC<CrmViewProps> = () => {
  return (
    <CrmApp />
  );
};

export default CrmView;
