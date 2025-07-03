import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ResellerLandingPage from '../../templates/landing-page';
import axios from 'axios';

/**
 * Dynamic Reseller Landing Page
 * This page fetches reseller data based on the resellerId parameter
 * and renders the customized landing page with the reseller's branding
 */
const ResellerLanding = () => {
  const router = useRouter();
  const { resellerId } = router.query;
  const [reseller, setReseller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch data when resellerId is available (after hydration)
    if (resellerId) {
      fetchResellerData();
    }
  }, [resellerId]);

  const fetchResellerData = async () => {
    try {
      setLoading(true);
      // Call API to get reseller data
      const response = await axios.get(`/api/resellers/${resellerId}/public`);
      setReseller(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reseller data:', err);
      setError('Unable to load this reseller page. It may not exist or has been removed.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading reseller page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!reseller) {
    return null; // Still loading or no data
  }

  return <ResellerLandingPage reseller={reseller} />;
};

export default ResellerLanding;
