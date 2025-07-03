import React from 'react';

const TechnicalReadiness = ({ formData, handleChange, errors }) => {
  const expertiseLevels = [
    'No technical expertise',
    'Basic understanding',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  const apiFamiliarityLevels = [
    'No experience',
    'Basic understanding',
    'Have integrated APIs before',
    'Regularly work with APIs',
    'Expert API developer'
  ];

  const integrationPreferences = [
    'API Integration',
    'White Label Solution',
    'Referral Partnership',
    'Not sure yet'
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">Technical Readiness</h2>
      <p className="text-gray mb-8">
        Help us understand your technical capabilities and integration preferences.
      </p>

      <div className="space-y-6">
        {/* Technical Expertise Level */}
        <div>
          <label htmlFor="expertiseLevel" className="block text-sm font-medium text-gray-light mb-2">
            Technical Expertise Level *
          </label>
          <select
            id="expertiseLevel"
            name="expertiseLevel"
            value={formData.expertiseLevel}
            onChange={handleChange}
            className={`form-input ${errors.expertiseLevel ? 'border-red-500' : ''}`}
          >
            <option value="">Select expertise level</option>
            {expertiseLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.expertiseLevel && (
            <p className="mt-1 text-sm text-red-500">{errors.expertiseLevel}</p>
          )}
        </div>

        {/* API Familiarity */}
        <div>
          <label htmlFor="apiFamiliarity" className="block text-sm font-medium text-gray-light mb-2">
            API Familiarity
          </label>
          <select
            id="apiFamiliarity"
            name="apiFamiliarity"
            value={formData.apiFamiliarity}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select API familiarity level</option>
            {apiFamiliarityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Integration Preference */}
        <div>
          <label htmlFor="integrationPreference" className="block text-sm font-medium text-gray-light mb-2">
            Preferred Integration Model *
          </label>
          <div className="space-y-3">
            {integrationPreferences.map((preference) => (
              <div key={preference} className="flex items-center">
                <input
                  type="radio"
                  id={`integration-${preference}`}
                  name="integrationPreference"
                  value={preference}
                  checked={formData.integrationPreference === preference}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary focus:ring-primary-light"
                />
                <label htmlFor={`integration-${preference}`} className="ml-2 text-gray-light">
                  {preference}
                </label>
              </div>
            ))}
          </div>
          {errors.integrationPreference && (
            <p className="mt-1 text-sm text-red-500">{errors.integrationPreference}</p>
          )}
        </div>

        {/* Development Resources */}
        <div>
          <label htmlFor="developmentResources" className="block text-sm font-medium text-gray-light mb-2">
            Available Development Resources
          </label>
          <textarea
            id="developmentResources"
            name="developmentResources"
            value={formData.developmentResources || ''}
            onChange={handleChange}
            rows="3"
            className="form-input"
            placeholder="Describe your development team or resources (optional)"
          />
        </div>
      </div>
    </div>
  );
};

export default TechnicalReadiness;
