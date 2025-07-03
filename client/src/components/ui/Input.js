import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input component following AHP Mod 2.0 Brand Style Guide
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Input component
 */
const Input = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
        required={required}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
