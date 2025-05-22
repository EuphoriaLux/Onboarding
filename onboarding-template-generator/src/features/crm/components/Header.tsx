import React from 'react';
import { BuildingOfficeIcon } from './icons'; // Updated import path

const Header: React.FC = () => {
  return (
    <header className="bg-[var(--background-light-light)] dark:bg-[var(--background-light-dark)] text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] p-4 sm:p-6 shadow-lg">
      <div className="container mx-auto flex items-center space-x-3">
        <BuildingOfficeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)]" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">Tenant Manager CRM</h1>
      </div>
    </header>
  );
};

export default Header;
