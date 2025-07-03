import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TestSuccessPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Simulate a token for testing purposes
    const testToken = 'test-token-' + Date.now();
    
    // Redirect to the success page with the test token
    router.push(`/onboarding/success?token=${testToken}`);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to success page...</p>
      </div>
    </div>
  );
}
