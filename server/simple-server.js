const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS handling
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Using in-memory data for testing instead of MongoDB
console.log('Using in-memory data store for testing');

// In-memory data stores
const inMemoryResellers = [];
const inMemoryUsers = [];

// Add test reseller
inMemoryResellers.push({
  _id: '12345',
  companyName: 'Test Company',
  contactName: 'John Doe',
  contactEmail: 'john.doe@example.com',
  status: 'pending',
  saveToken: 'test-token-123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Mock models using in-memory arrays instead of MongoDB
const Reseller = {
  findOne: (query) => {
    return Promise.resolve(
      inMemoryResellers.find(r => 
        (query.saveToken && r.saveToken === query.saveToken) ||
        (query.contactEmail && r.contactEmail === query.contactEmail)
      )
    );
  },
  save: function() {
    return Promise.resolve(this);
  }
};

const User = {
  findOne: (query) => {
    return Promise.resolve(
      inMemoryUsers.find(u => 
        (query.email && u.email === query.email) ||
        (query.resellerId && u.resellerId === query.resellerId)
      )
    );
  },
  save: function() {
    return Promise.resolve(this);
  }
};

// No need to create test data as we've already added it to the in-memory array
console.log('Test data ready');

// API Routes

// Save application progress
app.post('/api/save-progress', async (req, res) => {
  try {
    const { 
      companyName, 
      contactName, 
      contactEmail, 
      currentStep,
      saveToken
    } = req.body;
    
    // Validate required fields
    if (!contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Contact email is required.'
      });
    }
    
    // Generate a unique token for this application if not provided
    const token = saveToken || 'test-token-123'; // In a real app, generate a unique token
    
    // Create or update reseller application in memory
    let reseller = inMemoryResellers.find(r => r.contactEmail === contactEmail);
    
    if (reseller) {
      // Update existing application
      if (companyName) reseller.companyName = companyName;
      if (contactName) reseller.contactName = contactName;
      reseller.saveToken = token;
      // Update other fields as needed
    } else {
      // Create new application
      reseller = {
        _id: Date.now().toString(),
        companyName: companyName || '',
        contactName: contactName || '',
        contactEmail,
        status: 'draft',
        saveToken: token,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      inMemoryResellers.push(reseller);
    }
    
    console.log('Progress saved for:', contactEmail);
    
    return res.status(200).json({
      success: true,
      message: 'Progress saved successfully.',
      token
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while saving your progress.',
      error: error.message
    });
  }
});

// Submit application - simplified version without MongoDB interaction
app.post('/api/apply', (req, res) => {
  try {
    console.log('Received application submission:', req.body);
    
    // Generate a fixed token for testing
    const saveToken = 'test-token-123';
    
    // Return success response without DB interaction
    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully.',
      token: saveToken
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    console.error('Error details:', JSON.stringify(req.body, null, 2));
    return res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your application.',
      error: error.message
    });
  }
});

// Get reseller application by token
app.get('/api/resellers/application', (req, res) => {
  try {
    const { token } = req.query;
    console.log('Fetching reseller application with token:', token);
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required.'
      });
    }
    
    // Find reseller in memory
    const reseller = inMemoryResellers.find(r => r.saveToken === token);
    
    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: 'No application found with this token.'
      });
    }
    
    return res.status(200).json({
      success: true,
      reseller: {
        id: reseller._id,
        companyName: reseller.companyName,
        contactName: reseller.contactName,
        contactEmail: reseller.contactEmail,
        status: reseller.status
      }
    });
  } catch (error) {
    console.error('Error getting reseller application:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving application data.',
      error: error.message
    });
  }
});

// Check setup status and generate one-time token
app.get('/api/resellers/setup-status', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required.'
      });
    }
    
    const reseller = await Reseller.findOne({ saveToken: token });
    
    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: 'No application found with this token.'
      });
    }
    
    // Generate one-time token for portal access
    const oneTimeToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Check if user exists
    let user = await User.findOne({ resellerId: reseller._id });
    
    if (!user) {
      // Create user with email as both username and password
      user = new User({
        email: reseller.contactEmail,
        password: reseller.contactEmail, // In a real app, this would be hashed
        role: 'reseller',
        resellerId: reseller._id,
        oneTimeToken
      });
      
      await user.save();
    } else {
      // Update one-time token
      user.oneTimeToken = oneTimeToken;
      await user.save();
    }
    
    return res.status(200).json({
      success: true,
      status: 'complete',
      oneTimeToken,
      email: reseller.contactEmail
    });
  } catch (error) {
    console.error('Error checking setup status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking setup status.',
      error: error.message
    });
  }
});

// Create reseller account
app.post('/api/resellers/create-account', async (req, res) => {
  try {
    const { token, email, password } = req.body;
    
    if (!token || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token, email, and password are required.'
      });
    }
    
    const reseller = inMemoryResellers.find(r => r.saveToken === token);
    
    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: 'No application found with this token.'
      });
    }
    
    // Generate one-time token for portal access
    const oneTimeToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Check if user exists
    let user = inMemoryUsers.find(u => u.resellerId === reseller._id);
    
    if (!user) {
      // Create user with provided credentials
      user = {
        _id: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        role: 'reseller',
        resellerId: reseller._id,
        oneTimeToken,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      inMemoryUsers.push(user);
    } else {
      // Update user credentials and one-time token
      user.email = email;
      user.password = password; // In a real app, this would be hashed
      user.oneTimeToken = oneTimeToken;
    }
    
    console.log('Account created for:', email);
    
    return res.status(200).json({
      success: true,
      message: 'Account created successfully.',
      token: oneTimeToken
    });
  } catch (error) {
    console.error('Error creating reseller account:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating your account.',
      error: error.message
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// No need to call createTestData() as we've already added test data

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
