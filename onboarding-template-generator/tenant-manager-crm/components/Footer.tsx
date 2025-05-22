import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-dark text-slate-300 p-4 text-center text-sm mt-auto">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} Tenant Manager CRM. Crafted with care.
      </div>
    </footer>
  );
};

export default Footer;
