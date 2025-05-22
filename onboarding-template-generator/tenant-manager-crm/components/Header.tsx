import React from 'react';
import { BuildingOfficeIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-secondary-dark text-white p-4 sm:p-6 shadow-lg">
      <div className="container mx-auto flex items-center space-x-3">
        <BuildingOfficeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-light" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tenant Manager CRM</h1>
      </div>
    </header>
  );
};

export default Header;
