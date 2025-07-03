import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Modal component following AHP Mod 2.0 Brand Style Guide
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Modal component
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  className = '',
  ...props
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark bg-opacity-75 transition-opacity"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      {...props}
    >
      <div
        className={`bg-light rounded-lg shadow-lg overflow-hidden w-full ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-light">
          <h3 className="text-lg font-semibold font-montserrat text-dark">{title}</h3>
          <button
            type="button"
            className="text-gray hover:text-dark focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-4">{children}</div>

        {/* Modal footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-light">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Modal.Footer - Convenience component for modal footers
 */
Modal.Footer = ({ children, className = '', ...props }) => (
  <div className={`flex justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
);

Modal.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Modal.Actions - Pre-configured modal actions (close/confirm)
 */
Modal.Actions = ({ onClose, onConfirm, closeText = 'Cancel', confirmText = 'Confirm', ...props }) => (
  <Modal.Footer {...props}>
    <Button variant="outline" onClick={onClose}>
      {closeText}
    </Button>
    <Button variant="primary" onClick={onConfirm}>
      {confirmText}
    </Button>
  </Modal.Footer>
);

Modal.Actions.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  closeText: PropTypes.string,
  confirmText: PropTypes.string,
};

export default Modal;
