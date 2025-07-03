import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component following AHP Mod 2.0 Brand Style Guide
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Card component
 */
const Card = ({
  children,
  variant = 'default',
  className = '',
  hover = true,
  ...props
}) => {
  // Base card classes
  const baseClasses = 'card';
  
  // Variant classes
  const variantClasses = {
    default: '',
    primary: 'card-primary',
    secondary: 'card-secondary',
    accent: 'card-accent',
  };
  
  // Hover effect
  const hoverClass = hover ? '' : 'transform-none hover:transform-none';
  
  // Combine classes
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClass} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent']),
  className: PropTypes.string,
  hover: PropTypes.bool,
};

export default Card;
