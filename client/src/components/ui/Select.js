import React from 'react';
import PropTypes from 'prop-types';

/**
 * Select component following AHP Mod 2.0 Brand Style Guide
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Select component
 */
const Select = ({
  id,
  label,
  options = [],
  value,
  onChange,
  error = '',
  required = false,
  placeholder = 'Select an option',
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
        required={required}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Select;
