import React from 'react';

const TermsConfirmation = ({ formData, handleChange, handleColorChange, handleFileChange, errors }) => {
  const paymentPreferences = [
    'Direct Deposit',
    'PayPal',
    'Stripe',
    'Wire Transfer',
    'Check'
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">Terms & Branding</h2>
      <p className="text-gray mb-8">
        Review our terms and set up your branding preferences.
      </p>

      <div className="space-y-8">
        {/* Payment Preference */}
        <div>
          <label htmlFor="paymentPreference" className="block text-sm font-medium text-gray-light mb-2">
            Payment Preference
          </label>
          <select
            id="paymentPreference"
            name="paymentPreference"
            value={formData.paymentPreference}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select payment preference</option>
            {paymentPreferences.map((preference) => (
              <option key={preference} value={preference}>
                {preference}
              </option>
            ))}
          </select>
        </div>

        {/* Branding - Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-light mb-2">
            Portal Primary Color
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              id="primaryColor"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-10 w-20 rounded-md border-none cursor-pointer"
            />
            <span className="text-gray-light">{formData.primaryColor}</span>
          </div>
          <p className="mt-1 text-sm text-gray">
            This color will be used as the primary color for your branded portal.
          </p>
        </div>

        {/* Branding - Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-light mb-2">
            Company Logo
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="logo"
              className="bg-dark border border-white/10 rounded-lg py-3 px-4 text-white cursor-pointer hover:bg-dark-light transition-colors"
            >
              {formData.logo ? 'Change Logo' : 'Upload Logo'}
            </label>
            {formData.logo && (
              <span className="text-gray-light">
                {typeof formData.logo === 'string' ? formData.logo : formData.logo.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray">
            Recommended size: 200x50px. Formats: PNG, JPG, SVG.
          </p>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-dark p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Terms and Conditions</h3>
          <div className="h-48 overflow-y-auto mb-4 text-gray-light text-sm p-4 bg-dark-light rounded-md">
            <p className="mb-4">
              <strong>AHP MOD 2.0 RESELLER AGREEMENT</strong>
            </p>
            <p className="mb-2">
              This Reseller Agreement (the "Agreement") is entered into between AHP MOD 2.0 ("Company") and the applicant ("Reseller").
            </p>
            <p className="mb-2">
              1. <strong>Appointment.</strong> Company appoints Reseller as a non-exclusive reseller of the AHP MOD 2.0 solution.
            </p>
            <p className="mb-2">
              2. <strong>Term.</strong> This Agreement shall commence upon approval of Reseller's application and continue for one (1) year, automatically renewing unless terminated.
            </p>
            <p className="mb-2">
              3. <strong>Obligations.</strong> Reseller agrees to market and promote the AHP MOD 2.0 solution in accordance with Company guidelines.
            </p>
            <p className="mb-2">
              4. <strong>Commission.</strong> Reseller shall receive commission as per the selected commission model for each client that subscribes to the AHP MOD 2.0 solution through Reseller's portal.
            </p>
            <p className="mb-2">
              5. <strong>Intellectual Property.</strong> All intellectual property rights in the AHP MOD 2.0 solution remain the property of the Company.
            </p>
            <p className="mb-2">
              6. <strong>Confidentiality.</strong> Reseller agrees to maintain the confidentiality of all proprietary information.
            </p>
            <p className="mb-2">
              7. <strong>Termination.</strong> Either party may terminate this Agreement with 30 days written notice.
            </p>
            <p>
              By checking the box below, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptedTerms"
              name="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              className="h-5 w-5 text-primary focus:ring-primary-light"
            />
            <label htmlFor="acceptedTerms" className="ml-2 text-gray-light">
              I accept the Terms and Conditions *
            </label>
          </div>
          {errors.acceptedTerms && (
            <p className="mt-1 text-sm text-red-500">{errors.acceptedTerms}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsConfirmation;
