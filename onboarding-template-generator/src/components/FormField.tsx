import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value?: string | number | readonly string[]; // Made optional, more specific types
  checked?: boolean; // Added for checkbox
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; // Made optional, added HTMLSelectElement
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean; // Added readOnly
  className?: string; // Added className
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  checked, // Destructure checked prop
  children,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className={`block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ${type === 'checkbox' ? 'inline-flex items-center' : ''}`}>
        {type === 'checkbox' && (
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            required={required}
            className="form-checkbox h-4 w-4 text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] rounded border-gray-300 dark:border-gray-600 focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] mr-2"
          />
        )}
        {label}
      </label>
      {children ? (
        children
      ) : type !== 'checkbox' ? (
        <input
          type={type}
          id={id}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color-light)] dark:focus:ring-[var(--primary-color-dark)] focus:border-[var(--primary-color-light)] dark:focus:border-[var(--primary-color-dark)] sm:text-sm text-black dark:text-white font-normal"
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      ) : null}
    </div>
  );
};

export default FormField;
