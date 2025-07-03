import React, { useState } from 'react';
import axios from 'axios';

/**
 * Customer Signup Form Component
 * Used on reseller landing pages to capture customer information
 * and attribute the signup to the specific reseller
 */
const CustomerSignupForm = ({ resellerId, resellerName, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    websiteUrl: '',
    phoneNumber: '',
    howHeard: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.companyName || !formData.websiteUrl) {
      setError('Please fill out all required fields.');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    // URL validation
    try {
      // Check if URL has protocol, if not add https://
      const urlToCheck = formData.websiteUrl.match(/^https?:\/\//) 
        ? formData.websiteUrl 
        : `https://${formData.websiteUrl}`;
      
      new URL(urlToCheck);
    } catch (err) {
      setError('Please enter a valid website URL.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Submit customer signup data
      const response = await axios.post('/api/customers/signup', {
        ...formData,
        resellerId,
        // Include UTM parameters if available from URL
        utmSource: new URLSearchParams(window.location.search).get('utm_source'),
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
        utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      });
      
      setLoading(false);
      
      if (response.data.success) {
        setSuccess(true);
        // Clear form
        setFormData({
          fullName: '',
          email: '',
          companyName: '',
          websiteUrl: '',
          phoneNumber: '',
          howHeard: '',
          message: '',
        });
        
        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(response.data);
        }
      } else {
        setError(response.data.message || 'An error occurred during signup. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred. Please try again later.');
      console.error('Customer signup error:', err);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Thank You for Signing Up!</h3>
          <p className="mb-4">
            Your registration with {resellerName} has been successfully submitted. 
            You will receive an email with further instructions shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Submit Another Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Get Started with AHP Module 2.0</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyName">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="websiteUrl">
            Website URL *
          </label>
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://example.com"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="howHeard">
            How did you hear about us?
          </label>
          <select
            id="howHeard"
            name="howHeard"
            value={formData.howHeard}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Please select...</option>
            <option value="search">Search Engine</option>
            <option value="social">Social Media</option>
            <option value="referral">Referral</option>
            <option value="email">Email</option>
            <option value="advertisement">Advertisement</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Additional Comments
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          ></textarea>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
            }`}
            style={{ 
              backgroundColor: 'var(--primary)',
              ':hover': { backgroundColor: 'var(--primary-dark)' }
            }}
          >
            {loading ? 'Processing...' : 'Sign Up Now'}
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          * Required fields
        </div>
      </form>
    </div>
  );
};

export default CustomerSignupForm;
