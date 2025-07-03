import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold font-montserrat text-white">
            <span className="text-primary">AHP</span> MOD 2.0
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="#features" className="hover:text-primary transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#benefits" className="hover:text-primary transition-colors">
                Benefits
              </Link>
            </li>
            <li>
              <Link href="#faq" className="hover:text-primary transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <button 
                onClick={() => router.push('/onboarding')}
                className="btn-primary"
              >
                Become a Reseller
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-dark-gradient animate-gradient-flow py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h2 className="text-5xl font-bold font-montserrat leading-tight mb-6">
              Grow Your Business with <span className="text-primary">AHP MOD 2.0</span> Reseller Program
            </h2>
            <p className="text-xl mb-8 text-gray-light">
              Join our partner network and offer cutting-edge AI handshake technology to your clients. 
              Expand your service offerings and increase your revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => router.push('/onboarding')}
                className="btn-primary"
              >
                Apply Now
              </button>
              <button 
                onClick={() => router.push('#learn-more')}
                className="btn-secondary"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-80 animate-float">
              {/* Replace with actual hero image */}
              <div className="w-full h-full rounded-xl bg-primary-gradient opacity-80 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">AHP MOD 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold font-montserrat text-center mb-16">
            Why Become an <span className="text-primary">AHP MOD 2.0</span> Reseller?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card">
              <div className="bg-primary-gradient w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Increased Revenue</h3>
              <p className="text-gray">
                Generate additional revenue streams by offering AHP MOD 2.0 to your existing clients and attracting new ones.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="bg-secondary-gradient w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Branded Portal</h3>
              <p className="text-gray">
                Get your own branded portal with customizable colors and logo to maintain your brand identity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="bg-accent-gradient w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Analytics Dashboard</h3>
              <p className="text-gray">
                Track your customers' usage, performance, and revenue with our comprehensive analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-gradient animate-gradient-flow py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-montserrat text-white mb-8">
            Ready to Expand Your Business?
          </h2>
          <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
            Join our reseller program today and start offering AHP MOD 2.0 to your clients.
            The application process is simple and quick.
          </p>
          <button 
            onClick={() => router.push('/onboarding')}
            className="btn-secondary bg-white text-primary border-white hover:bg-white/80"
          >
            Apply Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-light py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold font-montserrat text-white">
                <span className="text-primary">AHP</span> MOD 2.0
              </h2>
              <p className="text-gray mt-2">
                The Protocol That Powers Human-AI Communication
              </p>
            </div>
            <div className="flex space-x-8">
              <Link href="/privacy" className="text-gray hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-dark mt-8 pt-8 text-center text-gray">
            <p>&copy; {new Date().getFullYear()} AHP MOD 2.0. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
