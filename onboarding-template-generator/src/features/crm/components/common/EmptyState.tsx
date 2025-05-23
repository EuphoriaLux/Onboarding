import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionButton?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionButton, className }) => {
  return (
    <div className={`text-center p-6 sm:p-8 py-10 sm:py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center h-full min-h-[200px] ${className}`}>
      {icon && <div className="text-slate-400 mb-4 opacity-75">{icon}</div>}
      <h3 className="text-lg sm:text-xl font-semibold text-slate-600 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm sm:text-base mb-4 max-w-xs">{message}</p>
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
