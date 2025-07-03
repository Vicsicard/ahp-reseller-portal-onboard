import React from 'react';
import PropTypes from 'prop-types';

/**
 * Heading component following AHP Mod 2.0 Brand Style Guide
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Heading component
 */
const Heading = ({
  level = 1,
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  // Map variant to appropriate class
  const variantClasses = {
    default: '',
    headline: 'headline',
    subheadline: 'subheadline',
    'section-title': 'section-title',
    tagline: 'tagline'
  };
  
  // Combine classes
  const headingClasses = `${variantClasses[variant]} ${className}`;
  
  // Render appropriate heading level
  const HeadingTag = `h${level}`;
  
  return (
    <HeadingTag className={headingClasses} {...props}>
      {children}
    </HeadingTag>
  );
};

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'headline', 'subheadline', 'section-title', 'tagline']),
  className: PropTypes.string,
};

export default Heading;
