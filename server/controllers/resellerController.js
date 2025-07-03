const Reseller = require('../models/Reseller');
const { generateToken, validateToken } = require('../utils/tokenUtils');
const { uploadImage } = require('../utils/fileUpload');
const sendEmail = require('../utils/emailService');

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

    return res.status(200).json({
      success: true,
      status: reseller.status,
      updatedAt: reseller.updatedAt
    });
  } catch (error) {
    console.error('Error getting application status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving your application status.',
      error: error.message
    });
  }
};
