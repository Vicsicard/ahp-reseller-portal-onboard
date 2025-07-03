const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Reseller schema
const ResellerSchema = new Schema({
  // Business Information
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  websiteUrl: {
    type: String,
    required: [true, 'Website URL is required'],
    trim: true
  },
  businessAddress: {
    type: String,
    required: [true, 'Business address is required'],
    trim: true
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: ['Agency', 'Consultant', 'Freelancer', 'Software Company', 'Marketing Firm', 'SEO Company', 'Web Development Company', 'Other']
  },
  yearsInBusiness: {
    type: String,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+', '']
  },
  
  // Contact Information
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  preferredContact: {
    type: String,
    required: [true, 'Preferred contact method is required'],
    enum: ['Email', 'Phone', 'Text', 'Video Call']
  },
  jobTitle: {
    type: String,
    trim: true
  },
  
  // Reseller Profile
  clientsServed: {
    type: String,
    required: [true, 'Number of clients served is required'],
    enum: ['1-5', '6-20', '21-50', '51-100', '100+']
  },
  clientTypes: {
    type: [String],
    required: [true, 'At least one client type is required'],
    validate: {
      validator: function(array) {
        return array && array.length > 0;
      },
      message: 'At least one client type is required'
    }
  },
  servicesOffered: {
    type: [String],
    required: [true, 'At least one service is required'],
    validate: {
      validator: function(array) {
        return array && array.length > 0;
      },
      message: 'At least one service is required'
    }
  },
  aiSeoExperience: {
    type: String,
    enum: ['No experience', 'Beginner', 'Intermediate', 'Advanced', 'Expert', '']
  },
  
  // Technical Readiness
  expertiseLevel: {
    type: String,
    required: [true, 'Expertise level is required'],
    enum: ['No technical expertise', 'Basic understanding', 'Intermediate', 'Advanced', 'Expert']
  },
  apiFamiliarity: {
    type: String,
    enum: ['No experience', 'Basic understanding', 'Have integrated APIs before', 'Regularly work with APIs', 'Expert API developer', '']
  },
  integrationPreference: {
    type: String,
    required: [true, 'Integration preference is required'],
    enum: ['API Integration', 'White Label Solution', 'Referral Partnership', 'Not sure yet']
  },
  developmentResources: {
    type: String,
    trim: true
  },
  
  // Sales & Marketing
  projectedSalesVolume: {
    type: String,
    required: [true, 'Projected sales volume is required'],
    enum: ['1-5 clients per month', '6-15 clients per month', '16-30 clients per month', '31-50 clients per month', '50+ clients per month']
  },
  marketingChannels: {
    type: [String],
    required: [true, 'At least one marketing channel is required'],
    validate: {
      validator: function(array) {
        return array && array.length > 0;
      },
      message: 'At least one marketing channel is required'
    }
  },
  positioningPlan: {
    type: String,
    trim: true
  },
  targetMarket: {
    type: String,
    trim: true
  },
  
  // Terms & Confirmation
  commissionModel: {
    type: String,
    required: [true, 'Commission model is required'],
    enum: ['Revenue Share (30%)', 'Revenue Share (20% + Annual Fee)', 'Flat Fee Per Client', 'Custom Model']
  },
  paymentPreference: {
    type: String,
    enum: ['Direct Deposit', 'PayPal', 'Stripe', 'Wire Transfer', 'Check', '']
  },
  acceptedTerms: {
    type: Boolean,
    required: [true, 'Terms must be accepted'],
    validate: {
      validator: function(value) {
        return value === true;
      },
      message: 'You must accept the terms and conditions'
    }
  },
  
  // Branding preferences
  primaryColor: {
    type: String,
    default: '#8b5cf6' // Default to AHP primary color
  },
  logoUrl: {
    type: String
  },
  
  // Application status
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
    default: 'draft'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date
  },
  
  // Save token for resuming application
  saveToken: {
    type: String
  },
  
  // Portal information (once approved)
  portalUrl: {
    type: String
  },
  portalActivated: {
    type: Boolean,
    default: false
  },
  
  // Payment information
  stripeCustomerId: {
    type: String
  },
  subscriptionId: {
    type: String
  },
  
  // Admin notes
  adminNotes: {
    type: String
  }
});

// Update the updatedAt timestamp before saving
ResellerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Reseller', ResellerSchema);
