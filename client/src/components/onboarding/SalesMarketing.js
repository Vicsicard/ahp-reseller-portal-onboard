import React from 'react';

const SalesMarketing = ({ formData, handleChange, handleArrayChange, errors }) => {
  const salesVolumes = [
    '1-5 clients per month',
    '6-15 clients per month',
    '16-30 clients per month',
    '31-50 clients per month',
    '50+ clients per month'
  ];

  const marketingChannels = [
    'Website',
    'Email Marketing',
    'Social Media',
    'Content Marketing',
    'SEO',
    'PPC Advertising',
    'Direct Sales',
    'Events/Webinars',
    'Referrals',
    'Other'
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
      <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">Sales & Marketing Plan</h2>
      <p className="text-gray mb-8">
        Share your sales projections and marketing strategy for AHP MOD 2.0.
      </p>

      <div className="space-y-8">
        {/* Projected Sales Volume */}
        <div>
          <label htmlFor="projectedSalesVolume" className="block text-sm font-medium text-gray-light mb-2">
            Projected Monthly Sales Volume *
          </label>
          <select
            id="projectedSalesVolume"
            name="projectedSalesVolume"
            value={formData.projectedSalesVolume}
            onChange={handleChange}
            className={`form-input ${errors.projectedSalesVolume ? 'border-red-500' : ''}`}
          >
            <option value="">Select projected sales volume</option>
            {salesVolumes.map((volume) => (
              <option key={volume} value={volume}>
                {volume}
              </option>
            ))}
          </select>
          {errors.projectedSalesVolume && (
            <p className="mt-1 text-sm text-red-500">{errors.projectedSalesVolume}</p>
          )}
        </div>

        {/* Marketing Channels */}
        <div>
          <label className="block text-sm font-medium text-gray-light mb-3">
            Marketing Channels You'll Use *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {marketingChannels.map((channel) => (
              <div key={channel} className="flex items-center">
                <input
                  type="checkbox"
                  id={`channel-${channel}`}
                  name="marketingChannels"
                  value={channel}
                  checked={formData.marketingChannels.includes(channel)}
                  onChange={(e) => handleCheckboxChange(e, 'marketingChannels')}
                  className="h-5 w-5 text-primary focus:ring-primary-light"
                />
                <label htmlFor={`channel-${channel}`} className="ml-2 text-gray-light">
                  {channel}
                </label>
              </div>
            ))}
          </div>
          {errors.marketingChannels && (
            <p className="mt-1 text-sm text-red-500">{errors.marketingChannels}</p>
          )}
        </div>

        {/* Positioning Plan */}
        <div>
          <label htmlFor="positioningPlan" className="block text-sm font-medium text-gray-light mb-2">
            How Will You Position AHP MOD 2.0?
          </label>
          <textarea
            id="positioningPlan"
            name="positioningPlan"
            value={formData.positioningPlan}
            onChange={handleChange}
            rows="4"
            className="form-input"
            placeholder="Describe how you plan to position and market AHP MOD 2.0 to your clients"
          />
        </div>

        {/* Target Market */}
        <div>
          <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-light mb-2">
            Target Market
          </label>
          <textarea
            id="targetMarket"
            name="targetMarket"
            value={formData.targetMarket || ''}
            onChange={handleChange}
            rows="3"
            className="form-input"
            placeholder="Describe your target market for AHP MOD 2.0 (optional)"
          />
        </div>
      </div>
    </div>
  );
};

export default SalesMarketing;
