import React from 'react';

const ResellerProfile = ({ formData, handleChange, handleArrayChange, errors }) => {
  const clientTypes = [
    'Small Businesses',
    'Medium Businesses',
    'Large Enterprises',
    'E-commerce',
    'Local Services',
    'SaaS Companies',
    'Healthcare',
    'Education',
    'Non-profit',
    'Other'
  ];

  const servicesOffered = [
    'SEO',
    'Web Development',
    'Digital Marketing',
    'Content Creation',
    'Social Media Management',
    'PPC Advertising',
    'Email Marketing',
    'Analytics & Reporting',
    'Consulting',
    'Other'
  ];

  const experienceLevels = [
    'No experience',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  // Handle checkbox changes for array fields
  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    const currentValues = [...formData[fieldName]];
    
    if (checked) {
      // Add to array if checked
      handleArrayChange(fieldName, [...currentValues, value]);
    } else {
      // Remove from array if unchecked
      handleArrayChange(fieldName, currentValues.filter(item => item !== value));
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">Reseller Profile</h2>
      <p className="text-gray mb-8">
        Tell us about your client base and the services you currently offer.
      </p>

      <div className="space-y-8">
        {/* Number of Clients Served */}
        <div>
          <label htmlFor="clientsServed" className="block text-sm font-medium text-gray-light mb-2">
            Number of Clients Served Monthly *
          </label>
          <select
            id="clientsServed"
            name="clientsServed"
            value={formData.clientsServed}
            onChange={handleChange}
            className={`form-input ${errors.clientsServed ? 'border-red-500' : ''}`}
          >
            <option value="">Select number of clients</option>
            <option value="1-5">1-5 clients</option>
            <option value="6-20">6-20 clients</option>
            <option value="21-50">21-50 clients</option>
            <option value="51-100">51-100 clients</option>
            <option value="100+">100+ clients</option>
          </select>
          {errors.clientsServed && (
            <p className="mt-1 text-sm text-red-500">{errors.clientsServed}</p>
          )}
        </div>

        {/* Client Types */}
        <div>
          <label className="block text-sm font-medium text-gray-light mb-3">
            Types of Clients You Serve *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {clientTypes.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`client-${type}`}
                  name="clientTypes"
                  value={type}
                  checked={formData.clientTypes.includes(type)}
                  onChange={(e) => handleCheckboxChange(e, 'clientTypes')}
                  className="h-5 w-5 text-primary focus:ring-primary-light"
                />
                <label htmlFor={`client-${type}`} className="ml-2 text-gray-light">
                  {type}
                </label>
              </div>
            ))}
          </div>
          {errors.clientTypes && (
            <p className="mt-1 text-sm text-red-500">{errors.clientTypes}</p>
          )}
        </div>

        {/* Services Offered */}
        <div>
          <label className="block text-sm font-medium text-gray-light mb-3">
            Services Currently Offered *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {servicesOffered.map((service) => (
              <div key={service} className="flex items-center">
                <input
                  type="checkbox"
                  id={`service-${service}`}
                  name="servicesOffered"
                  value={service}
                  checked={formData.servicesOffered.includes(service)}
                  onChange={(e) => handleCheckboxChange(e, 'servicesOffered')}
                  className="h-5 w-5 text-primary focus:ring-primary-light"
                />
                <label htmlFor={`service-${service}`} className="ml-2 text-gray-light">
                  {service}
                </label>
              </div>
            ))}
          </div>
          {errors.servicesOffered && (
            <p className="mt-1 text-sm text-red-500">{errors.servicesOffered}</p>
          )}
        </div>

        {/* AI/SEO Experience */}
        <div>
          <label htmlFor="aiSeoExperience" className="block text-sm font-medium text-gray-light mb-2">
            AI/SEO Experience Level
          </label>
          <select
            id="aiSeoExperience"
            name="aiSeoExperience"
            value={formData.aiSeoExperience}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select experience level</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ResellerProfile;
