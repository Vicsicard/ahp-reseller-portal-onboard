import React from 'react';
import PropTypes from 'prop-types';

/**
 * Alert component following AHP Mod 2.0 Brand Style Guide
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Alert component
 */
const Alert = ({
  type = 'info',
  title,
  message,
  className = '',
  onClose,
  ...props
}) => {
  // Alert type styles
  const alertStyles = {
    info: {
      containerClass: 'bg-primary bg-opacity-10 border-primary',
      titleClass: 'text-primary',
      iconClass: 'text-primary',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    success: {
      containerClass: 'bg-secondary bg-opacity-10 border-secondary',
      titleClass: 'text-secondary',
      iconClass: 'text-secondary',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      containerClass: 'bg-accent bg-opacity-10 border-accent',
      titleClass: 'text-accent',
      iconClass: 'text-accent',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    error: {
      containerClass: 'bg-red-500 bg-opacity-10 border-red-500',
      titleClass: 'text-red-500',
      iconClass: 'text-red-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const { containerClass, titleClass, iconClass, icon } = alertStyles[type];

  return (
    <div 
      className={`border rounded-md p-4 flex items-start ${containerClass} ${className}`}
      role="alert"
      {...props}
    >
      <div className={`mr-3 ${iconClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        {title && <h4 className={`font-semibold ${titleClass}`}>{title}</h4>}
        {message && <div className="mt-1">{message}</div>}
      </div>
      {onClose && (
        <button 
          type="button" 
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  onClose: PropTypes.func
};

export default Alert;
