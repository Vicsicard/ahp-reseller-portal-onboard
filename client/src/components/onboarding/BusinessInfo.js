import React from 'react';

const BusinessInfo = ({ formData, handleChange, errors }) => {
  const businessTypes = [
    'Agency',
    'Consultant',
    'Freelancer',
    'Software Company',
    'Marketing Firm',
    'SEO Company',
    'Web Development Company',
    'Other'
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">Business Information</h2>
      <p className="text-gray mb-8">
        Tell us about your business. This information will be used to create your reseller account.
      </p>

      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-light mb-2">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className={`form-input ${errors.companyName ? 'border-red-500' : ''}`}
            placeholder="Your company name"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-light mb-2">
            Website URL *
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            className={`form-input ${errors.websiteUrl ? 'border-red-500' : ''}`}
            placeholder="https://yourcompany.com"
          />
          {errors.websiteUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.websiteUrl}</p>
          )}
        </div>

        {/* Business Address */}
        <div>
          <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-light mb-2">
            Business Address *
          </label>
          <textarea
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            rows="3"
            className={`form-input ${errors.businessAddress ? 'border-red-500' : ''}`}
            placeholder="Your business address"
          />
          {errors.businessAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.businessAddress}</p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-light mb-2">
            Business Type *
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className={`form-input ${errors.businessType ? 'border-red-500' : ''}`}
          >
            <option value="">Select business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>
          )}
        </div>

        {/* Years in Business */}
        <div>
          <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-light mb-2">
            Years in Business
          </label>
          <select
            id="yearsInBusiness"
            name="yearsInBusiness"
            value={formData.yearsInBusiness}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select years in business</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
