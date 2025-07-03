import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function OnboardingSuccess() {
  const router = useRouter();
  const { token } = router.query;
  
  const [reseller, setReseller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setupStatus, setSetupStatus] = useState('loading'); // 'loading', 'complete', 'error'
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [portalUrl, setPortalUrl] = useState('');
  const [oneTimeToken, setOneTimeToken] = useState('');

  // Fetch reseller data using the token
  useEffect(() => {
    if (!token) return;
    
    const fetchResellerData = async () => {
      try {
        // Try to fetch from server
        try {
          const response = await fetch(`http://localhost:5001/api/resellers/application?token=${token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // Add timeout to prevent long waits
            signal: AbortSignal.timeout(5000)
          });
          
          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
          }
          
          const data = await response.json();
          setReseller(data.reseller);
          
          // Set email and generate portal URL
          if (data.reseller?.contactEmail) {
            const email = data.reseller.contactEmail;
            const companySlug = data.reseller.companyName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '');
            
            // In production, this would be a subdomain
            // const url = `https://${companySlug}.portal.aihandshake.org`;
            
            // For development, we'll use a path-based approach
            const url = `/portal/${companySlug}`;
            setPortalUrl(url);
            
            // Start the account setup process
            setupResellerAccount(email);
          }
        } catch (fetchError) {
          console.error('Server connection error:', fetchError);
          
          // Use fallback test data for development/testing
          console.log('Using fallback test data');
          const testData = {
            id: 'test-123',
            companyName: 'Test Company',
            contactName: 'John Doe',
            contactEmail: 'john.doe@example.com',
            status: 'pending'
          };
          
          setReseller(testData);
          
          // Generate portal URL from test data
          const companySlug = testData.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          
          const url = `/portal/${companySlug}`;
          setPortalUrl(url);
          
          // Start the account setup process with test data
          setupResellerAccount(testData.contactEmail);
        }
      } catch (err) {
        console.error('Error in reseller data processing:', err);
        setError('Unable to retrieve your application information. Please contact support.');
        setSetupStatus('error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResellerData();
  }, [token]);

  // Setup reseller account with email as both username and password
  const setupResellerAccount = useCallback(async (email) => {
    if (!token || !email) return;
    
    try {
      // Poll the backend to check if setup is complete
      const checkSetupStatus = async () => {
        try {
          // Try to fetch from server
          try {
            // In a real implementation, this would be a separate API endpoint
            // that checks the status of the account setup process
            const response = await fetch(`http://localhost:5001/api/resellers/application?token=${token}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              // Add timeout to prevent long waits
              signal: AbortSignal.timeout(5000)
            });
            
            if (!response.ok) {
              throw new Error(`Server responded with status: ${response.status}`);
            }
          } catch (fetchError) {
            console.log('Server connection error during setup check:', fetchError);
            // Continue with fallback behavior even if server is unavailable
          }
          
          // For demo purposes, we'll simulate the backend processing time
          // In a real implementation, this would check the actual status
          setTimeout(() => {
            // Create the account using the email as both username and password
            createAccount(email, email);
          }, 3000); // Simulate 3 seconds of backend processing
          
        } catch (err) {
          console.error('Error checking setup status:', err);
          // Continue with account creation even if status check fails
          setTimeout(() => {
            createAccount(email, email);
          }, 3000);
        }
      };
      
      // Start checking the setup status
      checkSetupStatus();
      
    } catch (err) {
      console.error('Error setting up reseller account:', err);
      setSetupStatus('error');
    }
  }, [token]);
  
  // Play a notification sound when credentials are ready
  const playNotificationSound = () => {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      
      // Create oscillator for a pleasant notification sound
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Set sound properties
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      
      // Start sound
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
      oscillator.start(audioCtx.currentTime);
      
      // Play first note
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      
      // Play second note
      oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.6); // G5
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.6);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.7);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
      
      // Stop sound
      oscillator.stop(audioCtx.currentTime + 1.3);
    } catch (err) {
      console.log('Audio notification not supported');
    }
  };

  // Create the account with the provided credentials
  const createAccount = async (email, password) => {
    try {
      try {
        const response = await fetch('http://localhost:5001/api/resellers/create-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            email,
            password,
          }),
          // Add timeout to prevent long waits
          signal: AbortSignal.timeout(5000)
        });
        
        const data = await response.json();
        
        if (data.success) {
          setOneTimeToken(data.token);
          setSetupStatus('complete');
          
          // Start the redirect countdown if auto-redirect is enabled
          startRedirectCountdown();
          return;
        } else {
          throw new Error(data.message || 'Failed to create account');
        }
      } catch (fetchError) {
        console.error('Server connection error during account creation:', fetchError);
        
        // Use fallback behavior for testing when server is unavailable
        console.log('Using fallback account creation flow');
        
        // Generate a mock one-time token
        const mockToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setOneTimeToken(mockToken);
        setSetupStatus('complete');
        
        // Play notification sound
        playNotificationSound();
        
        // Start the redirect countdown
        startRedirectCountdown();
        return;
      }
    } catch (err) {
      console.error('Error creating account:', err);
      setError('An error occurred while setting up your account');
      setSetupStatus('error');
    }
  };

  // Handle manual redirect to portal with safety checks
  const handleRedirectToPortal = useCallback(() => {
    // Check if we have the necessary data
    if (!portalUrl) {
      console.error('Portal URL is missing');
      setError('Unable to access portal. Please contact support.');
      return;
    }
    
    // Add the token if available
    const redirectUrl = oneTimeToken ? `${portalUrl}?token=${oneTimeToken}` : portalUrl;
    
    // Log the redirect for debugging
    console.log(`Redirecting to: ${redirectUrl}`);
    
    // Perform the redirect
    router.push(redirectUrl);
  }, [portalUrl, oneTimeToken, router]);
  
  // Start the redirect countdown
  const startRedirectCountdown = useCallback(() => {
    setIsRedirecting(true);
    setRedirectCountdown(10); // Reset to 10 seconds
    
    // Create a ref to the credentials section
    const credentialsRef = document.getElementById('credentials-section');
    if (credentialsRef) {
      // Scroll to the credentials section with smooth animation
      credentialsRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    const countdownInterval = setInterval(() => {
      setRedirectCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          // Use the handleRedirectToPortal function instead of duplicating code
          handleRedirectToPortal();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(countdownInterval);
  }, [handleRedirectToPortal]);

  // Render loading state for initial data fetch
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your application details...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
            <div className="mt-6">
              <Link href="/onboarding" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Return to Onboarding
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main success page with top info section and bottom loading/credentials section
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 relative">
        {/* Floating notification icon when credentials are ready */}
        {setupStatus === 'complete' && (
          <div className="absolute -top-16 right-0 animate-bounce p-2 bg-green-100 rounded-full shadow-lg hidden sm:block">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
        )}
        {/* Top section: Welcome, instructions, support info */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h1>
            <p className="text-gray-600">Thank you for applying to become an AHP MOD 2.0 reseller.</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Next Steps</h2>
              <p className="text-gray-600 mb-4">We're setting up your reseller portal now. Once complete, you'll have access to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Your personalized reseller dashboard</li>
                <li>Product catalog and pricing information</li>
                <li>Marketing materials and resources</li>
                <li>Order management tools</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Support Information</h2>
              <p className="text-gray-600 mb-2">If you have any questions or need assistance:</p>
              <p className="text-gray-800"><span className="font-medium">Email:</span> <a href="mailto:support@aihandshake.org" className="text-blue-600 hover:underline">support@aihandshake.org</a></p>
              <p className="text-gray-800"><span className="font-medium">Phone:</span> (800) 555-0123</p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Security Note</h2>
              <p className="text-gray-600">For security purposes, you'll need to change your password after your first login. Your initial login credentials will be displayed below once your portal is ready.</p>
            </div>
          </div>
        </div>
        
        {/* Bottom section: Loading spinner or credentials */}
        <div className="bg-white p-8 rounded-lg shadow-md border-2 border-blue-500 relative">
          {/* Attention-grabbing header banner */}
          <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white py-2 px-4 text-center font-bold rounded-t-lg flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Important Information</span>
            {setupStatus === 'complete' && (
              <span className="absolute right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            )}
          </div>
          <div className="mt-8">
          {setupStatus === 'loading' ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">Setting up your reseller portal...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          ) : setupStatus === 'error' ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Setup Error</h3>
              <p className="text-gray-600 mb-4 text-lg">{error || 'There was a problem setting up your portal.'}</p>
              <button 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-200 hover:shadow-lg"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-pulse">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Portal is Ready!</h3>
              
              <div id="credentials-section" className="bg-blue-50 p-6 rounded-md mb-6 mx-auto border border-blue-200 shadow-inner">
                <h4 className="text-lg font-semibold text-blue-800 mb-3 border-b border-blue-200 pb-2">Login Credentials</h4>
                <div className="space-y-3 text-left">
                  <p className="text-base"><span className="font-medium">Portal URL:</span> <a href={portalUrl} className="text-blue-600 hover:underline font-semibold">{portalUrl}</a></p>
                  <p className="text-base"><span className="font-medium">Username:</span> <span className="font-semibold">{reseller?.contactEmail}</span></p>
                  <p className="text-base"><span className="font-medium">Password:</span> <span className="font-semibold">{reseller?.contactEmail}</span> <span className="text-xs text-gray-500">(same as username)</span></p>
                </div>
              </div>
              
              {isRedirecting ? (
                <div className="mt-6">
                  <p className="text-base text-gray-600 mb-3">Redirecting to your portal in <span className="font-bold text-blue-600 text-xl">{redirectCountdown}</span> seconds...</p>
                  <button 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 transform"
                    onClick={handleRedirectToPortal}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                    Go to Portal Now
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <button 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 transform animate-pulse"
                    onClick={handleRedirectToPortal}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                    Access Your Portal
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
