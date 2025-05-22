import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--background-light-light)] dark:bg-[var(--background-light-dark)] text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] p-4 text-center text-sm mt-auto">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} Tenant Manager CRM. Crafted with care.
      </div>
    </footer>
  );
};

export default Footer;
