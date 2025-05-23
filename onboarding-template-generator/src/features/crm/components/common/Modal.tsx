import React from 'react';
import { XMarkIcon } from './icons'; // Updated import path

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} p-6 m-4 transform transition-all duration-300 ease-in-out scale-100 opacity-100 flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-[var(--text-color-light)] dark:text-[var(--text-color-dark)]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-color-light)] opacity-60 hover:text-[var(--text-color-light)] hover:opacity-80 dark:text-[var(--text-color-dark)] dark:hover:text-[var(--text-color-dark)] dark:hover:opacity-80 transition-colors p-1 rounded-full hover:bg-[color-mix(in srgb, var(--background-light-light) 90%, black)] dark:hover:bg-[color-mix(in srgb, var(--background-light-dark) 90%, black)]"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
