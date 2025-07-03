const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Customer Schema
 * Represents customers who sign up through reseller landing pages
 */
const CustomerSchema = new Schema({
  // Personal information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  
  // Company information
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  websiteUrl: {
    type: String,
    required: true,
    trim: true
  },
  
  // Additional information
  howHeard: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  
  // Reseller attribution
  reseller: {
    type: Schema.Types.ObjectId,
    ref: 'Reseller',
    required: true,
    index: true
  },
  
  // Tracking information
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  referrer: String,
  ipAddress: String,
  
  // Status information
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive'],
    default: 'pending'
  },
  
  // Subscription/payment information (can be expanded later)
  subscription: {
    plan: String,
    status: String,
    startDate: Date,
    endDate: Date
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a compound index for email and reseller to ensure uniqueness
CustomerSchema.index({ email: 1, reseller: 1 }, { unique: true });

module.exports = mongoose.model('Customer', CustomerSchema);
