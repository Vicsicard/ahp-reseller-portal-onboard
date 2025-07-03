import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProgressIndicator from '../../components/ProgressIndicator';

// Form step components (will be imported from separate files)
import BusinessInfo from '../../components/onboarding/BusinessInfo';
import ContactInfo from '../../components/onboarding/ContactInfo';
import ResellerProfile from '../../components/onboarding/ResellerProfile';
import TermsConfirmation from '../../components/onboarding/TermsConfirmation';

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Business Information
    companyName: '',
    websiteUrl: '',
    businessAddress: '',
    businessType: '',
    yearsInBusiness: '',
    
    // Contact Information
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    preferredContact: '',
    
    // Reseller Profile
    clientsServed: '',
    clientTypes: [],
    servicesOffered: [],
    aiSeoExperience: '',
    
    // Terms & Confirmation
    acceptedTerms: false,
    paymentPreference: '',
    
    // Branding preferences
    primaryColor: '#8b5cf6', // Default to AHP primary color
    logo: null,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveToken, setSaveToken] = useState('');
  
  const steps = [
    'Business Info',
    'Contact Info',
    'Reseller Profile',
    'Terms'
  ];
  
  // Function to handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Function to handle array field changes (checkboxes, multi-select)
  const handleArrayChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Function to handle file uploads (for logo)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        logo: file
      });
    }
  };
  
  // Function to handle color picker changes
  const handleColorChange = (color) => {
    setFormData({
      ...formData,
      primaryColor: color
    });
  };
  
  // Function to go to next step
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Function to go to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  // Function to validate current step
  const validateStep = () => {
    let errors = {};
    let isValid = true;
    
    // Validation logic for each step
    switch (currentStep) {
      case 0: // Business Information
        if (!formData.companyName.trim()) {
          errors.companyName = 'Company name is required';
          isValid = false;
        }
        if (!formData.websiteUrl.trim()) {
          errors.websiteUrl = 'Website URL is required';
          isValid = false;
        }
        if (!formData.businessAddress.trim()) {
          errors.businessAddress = 'Business address is required';
          isValid = false;
        }
        if (!formData.businessType) {
          errors.businessType = 'Business type is required';
          isValid = false;
        }
        break;
        
      case 1: // Contact Information
        if (!formData.contactName.trim()) {
          errors.contactName = 'Contact name is required';
          isValid = false;
        }
        if (!formData.contactEmail.trim()) {
          errors.contactEmail = 'Contact email is required';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          errors.contactEmail = 'Email address is invalid';
          isValid = false;
        }
        if (!formData.contactPhone.trim()) {
          errors.contactPhone = 'Contact phone is required';
          isValid = false;
        }
        if (!formData.preferredContact) {
          errors.preferredContact = 'Preferred contact method is required';
          isValid = false;
        }
        break;
        
      case 2: // Reseller Profile
        if (!formData.clientsServed) {
          errors.clientsServed = 'Number of clients is required';
          isValid = false;
        }
        if (formData.clientTypes.length === 0) {
          errors.clientTypes = 'At least one client type is required';
          isValid = false;
        }
        if (formData.servicesOffered.length === 0) {
          errors.servicesOffered = 'At least one service is required';
          isValid = false;
        }
        break;
        
      case 3: // Terms & Confirmation
        if (!formData.acceptedTerms) {
          errors.acceptedTerms = 'You must accept the terms and conditions';
          isValid = false;
        }
        break;
        
      default:
        break;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Function to save progress
  const saveProgress = async () => {
    try {
      setIsSubmitting(true);
      
      // API call to save progress
      const response = await fetch('/api/save-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSaveToken(data.token);
        alert('Your progress has been saved. Use this token to resume: ' + data.token);
      } else {
        alert('Error saving progress: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('An error occurred while saving your progress.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to submit the form
  const submitForm = async () => {
    if (validateStep()) {
      try {
        setIsSubmitting(true);
        
        // API call to submit form
        const response = await fetch('/api/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Redirect to success page
          router.push('/onboarding/success?token=' + data.token);
        } else {
          alert('Error submitting form: ' + data.message);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting your application.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BusinessInfo 
            formData={formData} 
            handleChange={handleChange} 
            errors={formErrors}
          />
        );
      case 1:
        return (
          <ContactInfo 
            formData={formData} 
            handleChange={handleChange} 
            errors={formErrors}
          />
        );
      case 2:
        return (
          <ResellerProfile 
            formData={formData} 
            handleChange={handleChange} 
            handleArrayChange={handleArrayChange}
            errors={formErrors}
          />
        );
      case 3:
        return (
          <TermsConfirmation 
            formData={formData} 
            handleChange={handleChange} 
            handleColorChange={handleColorChange}
            handleFileChange={handleFileChange}
            errors={formErrors}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark-light py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold font-montserrat text-white">
              <span className="text-primary">AHP</span> MOD 2.0 Reseller Application
            </h1>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator steps={steps} currentStep={currentStep} />
          
          <div className="card">
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              {currentStep > 0 && (
                <button 
                  onClick={prevStep}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}
              
              <div className="flex gap-4">
                <button 
                  onClick={saveProgress}
                  className="text-primary hover:text-primary-light transition-colors"
                  disabled={isSubmitting}
                >
                  Save & Continue Later
                </button>
                
                {currentStep < steps.length - 1 ? (
                  <button 
                    onClick={nextStep}
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    onClick={submitForm}
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-dark-light py-6">
        <div className="container mx-auto px-4 text-center text-gray">
          <p>&copy; {new Date().getFullYear()} AHP MOD 2.0. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
