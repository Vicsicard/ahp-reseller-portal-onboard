const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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

// MongoDB connection string (from .env or default)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ahp-reseller-portal';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Reseller schema
const ResellerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  status: { type: String, default: 'pending' },
  saveToken: { type: String, required: true }
}, { timestamps: true });

// Define User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'reseller' },
  resellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reseller' },
  oneTimeToken: { type: String }
}, { timestamps: true });

// Create models
const Reseller = mongoose.model('Reseller', ResellerSchema);
const User = mongoose.model('User', UserSchema);

// Create test data if none exists
const createTestData = async () => {
  try {
    // Check if test reseller exists
    const existingReseller = await Reseller.findOne({ saveToken: 'test-token-123' });
    
    if (!existingReseller) {
      // Create test reseller
      const testReseller = new Reseller({
        companyName: 'Test Company',
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
        status: 'approved',
        saveToken: 'test-token-123'
      });
      
      await testReseller.save();
      console.log('Test reseller created');
    }
  } catch (err) {
    console.error('Error creating test data:', err);
  }
};

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
    
    // Create or update reseller application
    let reseller = await Reseller.findOne({ contactEmail });
    
    if (reseller) {
      // Update existing application
      if (companyName) reseller.companyName = companyName;
      if (contactName) reseller.contactName = contactName;
      reseller.saveToken = token;
      // Update other fields as needed
      
      await reseller.save();
    } else {
      // Create new application
      reseller = new Reseller({
        companyName: companyName || '',
        contactName: contactName || '',
        contactEmail,
        status: 'draft',
        saveToken: token
        // Add other fields as needed
      });
      
      await reseller.save();
    }
    
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

// Get reseller application by token - simplified version without MongoDB interaction
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
    
    // Return mock reseller data for testing
    const mockReseller = {
      _id: '12345',
      companyName: 'Test Company',
      contactName: 'John Doe',
      contactEmail: 'john.doe@example.com',
      status: 'pending',
      saveToken: token,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return res.status(200).json({
      success: true,
      data: mockReseller
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
      // Create user with provided credentials
      user = new User({
        email,
        password, // In a real app, this would be hashed
        role: 'reseller',
        resellerId: reseller._id,
        oneTimeToken
      });
      
      await user.save();
    } else {
      // Update user credentials and one-time token
      user.email = email;
      user.password = password; // In a real app, this would be hashed
      user.oneTimeToken = oneTimeToken;
      await user.save();
    }
    
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

// Create test data
createTestData();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
