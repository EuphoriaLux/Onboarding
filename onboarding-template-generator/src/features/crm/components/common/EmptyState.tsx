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
    <div className={`text-center p-6 sm:p-8 py-10 sm:py-12 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center h-full min-h-[200px] ${className}`}>
<<<<<<< HEAD
      {icon && <div className="text-slate-400 dark:text-gray-400 mb-4 opacity-75">{icon}</div>}
      <h3 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-gray-300 text-sm sm:text-base mb-4 max-w-xs">{message}</p>
=======
      {icon && <div className="text-slate-400 dark:text-slate-500 mb-4 opacity-75">{icon}</div>}
      <h3 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mb-4 max-w-xs">{message}</p>
>>>>>>> 193d398ec1755b1cec940e328a60dbc9fe8b6d4b
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
