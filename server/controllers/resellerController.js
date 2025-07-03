const Reseller = require('../models/Reseller');
const User = require('../models/User');
const { generateToken, validateToken } = require('../utils/tokenUtils');
const { uploadImage } = require('../utils/fileUpload');
const sendEmail = require('../utils/emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Save application progress
 * @route POST /api/save-progress
 * @access Public
 */
exports.saveProgress = async (req, res) => {
  try {
    const formData = req.body;
    let reseller;
    let saveToken;

    // Check if there's an existing draft with this token
    if (formData.saveToken) {
      reseller = await Reseller.findOne({ saveToken: formData.saveToken });
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'No application found with this token.'
        });
      }
      
      // Update existing application
      saveToken = formData.saveToken;
      Object.keys(formData).forEach(key => {
        if (key !== 'saveToken' && key !== 'logo') {
          reseller[key] = formData[key];
        }
      });
    } else {
      // Create new application draft
      saveToken = generateToken();
      reseller = new Reseller({
        ...formData,
        saveToken,
        status: 'draft'
      });
    }

    // Handle logo upload if provided
    if (req.files && req.files.logo) {
      const logoUrl = await uploadImage(req.files.logo);
      reseller.logoUrl = logoUrl;
    }

    await reseller.save();

    return res.status(200).json({
      success: true,
      token: saveToken,
      message: 'Application progress saved successfully.'
    });
  } catch (error) {
    console.error('Error saving application progress:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while saving your application.',
      error: error.message
    });
  }
};

/**
 * Submit reseller application
 * @route POST /api/apply
 * @access Public
 */
exports.submitApplication = async (req, res) => {
  try {
    const formData = req.body;
    let reseller;

    // Check if there's an existing draft with this token
    if (formData.saveToken) {
      reseller = await Reseller.findOne({ saveToken: formData.saveToken });
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'No application found with this token.'
        });
      }
      
      // Update existing application
      Object.keys(formData).forEach(key => {
        if (key !== 'saveToken' && key !== 'logo') {
          reseller[key] = formData[key];
        }
      });
    } else {
      // Create new application
      const saveToken = generateToken();
      reseller = new Reseller({
        ...formData,
        saveToken
      });
    }

    // Handle logo upload if provided
    if (req.files && req.files.logo) {
      const logoUrl = await uploadImage(req.files.logo);
      reseller.logoUrl = logoUrl;
    }

    // Update status and submission date
    reseller.status = 'submitted';
    reseller.submittedAt = new Date();

    await reseller.save();

    // Send confirmation email to applicant
    await sendEmail({
      to: reseller.contactEmail,
      subject: 'AHP MOD 2.0 Reseller Application Received',
      template: 'application-confirmation',
      data: {
        name: reseller.contactName,
        companyName: reseller.companyName,
        applicationId: reseller._id
      }
    });

    // Send notification to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Reseller Application Submitted',
      template: 'admin-notification',
      data: {
        companyName: reseller.companyName,
        contactName: reseller.contactName,
        applicationId: reseller._id
      }
    });

    return res.status(200).json({
      success: true,
      token: reseller.saveToken,
      message: 'Application submitted successfully.'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your application.',
      error: error.message
    });
  }
};

/**
 * Resume application with token
 * @route GET /api/resume/:token
 * @access Public
 */
exports.resumeApplication = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided.'
      });
    }

    const reseller = await Reseller.findOne({ saveToken: token });
    
    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: 'No application found with this token.'
      });
    }

    // Don't return sensitive fields
    const applicationData = reseller.toObject();
    delete applicationData.__v;
    delete applicationData.adminNotes;

    return res.status(200).json({
      success: true,
      data: applicationData
    });
  } catch (error) {
    console.error('Error resuming application:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving your application.',
      error: error.message
    });
  }
};

/**
 * Get application status
 * @route GET /api/status/:token
 * @access Public
 */
exports.getApplicationStatus = async (req, res) => {
  try {
    const { token } = req.params;
    
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
    
    return res.status(200).json({
      success: true,
      status: reseller.status,
      message: `Application status: ${reseller.status}`
    });
  } catch (error) {
    console.error('Error getting application status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving application status.',
      error: error.message
    });
  }
};

/**
 * Get reseller application data by token
 * @route GET /api/resellers/application
 * @access Public
 */
exports.getResellerApplication = async (req, res) => {
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
    
    // Check if user account already exists for this reseller
    const existingUser = await User.findOne({ resellerId: reseller._id });
    
    return res.status(200).json({
      success: true,
      reseller: {
        id: reseller._id,
        companyName: reseller.companyName,
        contactName: reseller.contactName,
        contactEmail: reseller.contactEmail,
        status: reseller.status,
        hasAccount: !!existingUser
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
};

/**
 * Create reseller user account
 * @route POST /api/resellers/create-account
 * @access Public
 */
exports.createResellerAccount = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    
    if (!token || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token, email, and password are required.'
      });
    }
    
    // Find the reseller application
    const reseller = await Reseller.findOne({ saveToken: token });
    
    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: 'No application found with this token.'
      });
    }
    
    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user account
    const user = new User({
      email,
      password: hashedPassword,
      resellerId: reseller._id,
      role: 'reseller',
      name: reseller.contactName
    });
    
    await user.save();
    
    // Update reseller status to 'active'
    reseller.status = 'active';
    await reseller.save();
    
    // Generate JWT token for authentication
    const authToken = jwt.sign(
      { id: user._id, role: user.role, resellerId: user.resellerId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to AHP MOD 2.0 Reseller Portal',
        text: `Welcome to AHP MOD 2.0 Reseller Portal! Your account has been created successfully. You can now access your reseller portal.`,
        html: `
          <h1>Welcome to AHP MOD 2.0 Reseller Portal!</h1>
          <p>Your account has been created successfully.</p>
          <p>You can now access your reseller portal at: <a href="${process.env.CLIENT_URL}/portal/${reseller._id}">Your Reseller Portal</a></p>
        `
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue even if email fails
    }
    
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        resellerId: user.resellerId
      }
    });
  } catch (error) {
    console.error('Error creating reseller account:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating your account.',
      error: error.message
    });
  }
};

/**
 * Reseller login
 * @route POST /api/resellers/login
 * @access Public
 */
exports.loginReseller = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email, role: 'reseller' });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }
    
    // Get reseller data
    const reseller = await Reseller.findById(user.resellerId);
    
    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: 'Reseller account not found.'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, resellerId: user.resellerId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        resellerId: user.resellerId
      },
      reseller: {
        id: reseller._id,
        companyName: reseller.companyName,
        logoUrl: reseller.logoUrl,
        primaryColor: reseller.primaryColor
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while logging in.',
      error: error.message
    });
  }
};
