const Customer = require('../models/Customer');
const Reseller = require('../models/Reseller');
const emailService = require('../utils/emailService');

/**
 * Customer Controller
 * Handles customer signup and management
 */
const customerController = {
  /**
   * Handle customer signup through reseller landing page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with customer data or error
   */
  signup: async (req, res) => {
    try {
      const {
        fullName,
        email,
        companyName,
        websiteUrl,
        phoneNumber,
        howHeard,
        message,
        resellerId,
        utmSource,
        utmMedium,
        utmCampaign
      } = req.body;

      // Validate required fields
      if (!fullName || !email || !companyName || !websiteUrl || !resellerId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      // Find the reseller
      const reseller = await Reseller.findOne({
        $or: [
          { _id: resellerId },
          { vanityUrl: resellerId }
        ],
        status: 'approved'
      });

      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Reseller not found or not approved'
        });
      }

      // Check if customer already exists for this reseller
      const existingCustomer = await Customer.findOne({
        email,
        reseller: reseller._id
      });

      if (existingCustomer) {
        return res.status(409).json({
          success: false,
          message: 'You have already signed up through this reseller'
        });
      }

      // Create new customer
      const customer = new Customer({
        fullName,
        email,
        companyName,
        websiteUrl,
        phoneNumber: phoneNumber || '',
        howHeard: howHeard || '',
        message: message || '',
        reseller: reseller._id,
        utmSource,
        utmMedium,
        utmCampaign,
        referrer: req.headers.referer || '',
        ipAddress: req.ip
      });

      // Save customer
      await customer.save();

      // Update reseller with new customer
      await Reseller.updateOne(
        { _id: reseller._id },
        {
          $push: { customers: customer._id },
          $inc: { 'analytics.totalCustomers': 1 }
        }
      );

      // Send confirmation email to customer
      try {
        await emailService.sendCustomerSignupConfirmation({
          to: email,
          fullName,
          companyName: reseller.businessInfo.companyName,
          resellerEmail: reseller.contactInfo.email,
          resellerPhone: reseller.contactInfo.phone
        });
      } catch (emailError) {
        console.error('Error sending customer confirmation email:', emailError);
        // Continue despite email error
      }

      // Send notification to reseller
      try {
        await emailService.sendResellerCustomerNotification({
          to: reseller.contactInfo.email,
          resellerName: reseller.businessInfo.companyName,
          customerName: fullName,
          customerEmail: email,
          customerCompany: companyName,
          customerWebsite: websiteUrl
        });
      } catch (emailError) {
        console.error('Error sending reseller notification email:', emailError);
        // Continue despite email error
      }

      return res.status(201).json({
        success: true,
        message: 'Signup successful',
        customerId: customer._id
      });
    } catch (error) {
      console.error('Error in customer signup:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during signup process'
      });
    }
  },

  /**
   * Get customers for a specific reseller (admin or reseller access)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with customers data or error
   */
  getResellerCustomers: async (req, res) => {
    try {
      const { resellerId } = req.params;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      // Check if user has access to this reseller's data
      // This would be handled by middleware in a real implementation
      // For now, we'll assume the user has access

      // Find customers for this reseller
      const customers = await Customer.find({ reseller: resellerId })
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      // Get total count for pagination
      const count = await Customer.countDocuments({ reseller: resellerId });

      return res.status(200).json({
        success: true,
        data: {
          customers,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          totalCustomers: count
        }
      });
    } catch (error) {
      console.error('Error fetching reseller customers:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching customers'
      });
    }
  },

  /**
   * Update customer status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with updated customer data or error
   */
  updateCustomerStatus: async (req, res) => {
    try {
      const { customerId } = req.params;
      const { status } = req.body;

      if (!['pending', 'active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }

      const customer = await Customer.findByIdAndUpdate(
        customerId,
        { status },
        { new: true }
      );

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Error updating customer status:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while updating customer'
      });
    }
  }
};

module.exports = customerController;
