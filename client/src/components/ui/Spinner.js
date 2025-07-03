import React from 'react';
import PropTypes from 'prop-types';

/**
 * Spinner component following AHP Mod 2.0 Brand Style Guide
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Spinner component
 */
const Spinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    light: 'text-light',
    dark: 'text-dark',
  };
  
  // Combine classes
  const spinnerClasses = `animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  return (
    <svg
      className={spinnerClasses}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'light', 'dark']),
  className: PropTypes.string,
};

export default Spinner;
