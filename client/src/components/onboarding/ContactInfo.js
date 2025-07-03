import React from 'react';

const ContactInfo = ({ formData, handleChange, errors }) => {
  const contactMethods = [
    'Email',
    'Phone',
    'Text',
    'Video Call'
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold font-montserrat mb-6 text-white">Contact Information</h2>
      <p className="text-gray mb-8">
        Please provide your primary contact information. We'll use this to communicate with you about your application.
      </p>

      <div className="space-y-6">
        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-light mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className={`form-input ${errors.contactName ? 'border-red-500' : ''}`}
            placeholder="Full name"
          />
          {errors.contactName && (
            <p className="mt-1 text-sm text-red-500">{errors.contactName}</p>
          )}
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-light mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className={`form-input ${errors.contactEmail ? 'border-red-500' : ''}`}
            placeholder="email@example.com"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>
          )}
        </div>

        {/* Contact Phone */}
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-light mb-2">
            Contact Phone *
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className={`form-input ${errors.contactPhone ? 'border-red-500' : ''}`}
            placeholder="(123) 456-7890"
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-500">{errors.contactPhone}</p>
          )}
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-light mb-2">
            Preferred Contact Method *
          </label>
          <div className="grid grid-cols-2 gap-4">
            {contactMethods.map((method) => (
              <div key={method} className="flex items-center">
                <input
                  type="radio"
                  id={`contact-${method}`}
                  name="preferredContact"
                  value={method}
                  checked={formData.preferredContact === method}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary focus:ring-primary-light"
                />
                <label htmlFor={`contact-${method}`} className="ml-2 text-gray-light">
                  {method}
                </label>
              </div>
            ))}
          </div>
          {errors.preferredContact && (
            <p className="mt-1 text-sm text-red-500">{errors.preferredContact}</p>
          )}
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-light mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle || ''}
            onChange={handleChange}
            className="form-input"
            placeholder="Your position in the company"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
