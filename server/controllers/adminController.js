const Reseller = require('../models/Reseller');
const Customer = require('../models/Customer');
const User = require('../models/User');
const emailService = require('../utils/emailService');

/**
 * Admin Controller
 * Handles administrative functions for managing resellers and customers
 */
const adminController = {
  /**
   * Get all resellers with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with resellers data or error
   */
  getAllResellers: async (req, res) => {
    try {
      const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      // Build query
      const query = {};
      
      // Add status filter if provided
      if (status) {
        query.status = status;
      }
      
      // Get resellers with pagination
      const resellers = await Reseller.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-password')
        .exec();
      
      // Get total count for pagination
      const count = await Reseller.countDocuments(query);
      
      return res.status(200).json({
        success: true,
        data: {
          resellers,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          totalResellers: count
        }
      });
    } catch (error) {
      console.error('Error fetching all resellers:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching resellers'
      });
    }
  },
  
  /**
   * Get reseller details by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with reseller data or error
   */
  getResellerById: async (req, res) => {
    try {
      const { resellerId } = req.params;
      
      // Find reseller by ID
      const reseller = await Reseller.findById(resellerId)
        .select('-password')
        .exec();
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Reseller not found'
        });
      }
      
      // Get customer count for this reseller
      const customerCount = await Customer.countDocuments({ reseller: resellerId });
      
      return res.status(200).json({
        success: true,
        data: {
          ...reseller.toObject(),
          customerCount
        }
      });
    } catch (error) {
      console.error('Error fetching reseller details:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching reseller details'
      });
    }
  },
  
  /**
   * Update reseller status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with updated reseller data or error
   */
  updateResellerStatus: async (req, res) => {
    try {
      const { resellerId } = req.params;
      const { status } = req.body;
      
      // Validate status
      if (!['pending', 'approved', 'rejected', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      
      // Find and update reseller
      const reseller = await Reseller.findByIdAndUpdate(
        resellerId,
        { status },
        { new: true }
      ).select('-password');
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Reseller not found'
        });
      }
      
      // Send email notification to reseller about status change
      try {
        await emailService.sendResellerStatusUpdate({
          to: reseller.contactInfo.email,
          resellerName: reseller.businessInfo.companyName,
          status,
          message: req.body.message || ''
        });
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
        // Continue despite email error
      }
      
      return res.status(200).json({
        success: true,
        data: reseller
      });
    } catch (error) {
      console.error('Error updating reseller status:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while updating reseller status'
      });
    }
  },
  
  /**
   * Get all customers across all resellers with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with customers data or error
   */
  getAllCustomers: async (req, res) => {
    try {
      const { page = 1, limit = 10, resellerId, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      // Build query
      const query = {};
      
      // Add filters if provided
      if (resellerId) {
        query.reseller = resellerId;
      }
      
      if (status) {
        query.status = status;
      }
      
      // Get customers with pagination
      const customers = await Customer.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('reseller', 'businessInfo.companyName')
        .exec();
      
      // Get total count for pagination
      const count = await Customer.countDocuments(query);
      
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
      console.error('Error fetching all customers:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching customers'
      });
    }
  },
  
  /**
   * Get system statistics for admin dashboard
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with system statistics or error
   */
  getSystemStats: async (req, res) => {
    try {
      // Get counts
      const totalResellers = await Reseller.countDocuments();
      const activeResellers = await Reseller.countDocuments({ status: 'approved' });
      const pendingResellers = await Reseller.countDocuments({ status: 'pending' });
      const totalCustomers = await Customer.countDocuments();
      
      // Get resellers by status
      const resellersByStatus = await Reseller.aggregate([
        { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }}
      ]);
      
      // Format resellers by status
      const statusCounts = {
        pending: 0,
        approved: 0,
        rejected: 0,
        inactive: 0
      };
      
      resellersByStatus.forEach(status => {
        statusCounts[status._id] = status.count;
      });
      
      // Get recent resellers
      const recentResellers = await Reseller.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('businessInfo.companyName contactInfo.email status createdAt');
      
      // Get recent customers
      const recentCustomers = await Customer.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('fullName email companyName createdAt')
        .populate('reseller', 'businessInfo.companyName');
      
      // Get reseller registrations by date (for trend analysis)
      const resellersByDate = await Reseller.aggregate([
        { $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }},
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      
      // Format resellers by date
      const resellerTrend = resellersByDate.map(item => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        count: item.count
      }));
      
      return res.status(200).json({
        success: true,
        data: {
          totalResellers,
          activeResellers,
          pendingResellers,
          totalCustomers,
          statusCounts,
          recentResellers,
          recentCustomers,
          resellerTrend
        }
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching system statistics'
      });
    }
  },
  
  /**
   * Manage admin users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with admin users data or error
   */
  getAdminUsers: async (req, res) => {
    try {
      // Get all admin users
      const adminUsers = await User.find({ role: 'admin' })
        .select('-password')
        .sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        data: adminUsers
      });
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching admin users'
      });
    }
  },
  
  /**
   * Create admin user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with created admin user data or error
   */
  createAdminUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      // Create new admin user
      const user = new User({
        name,
        email,
        password,
        role: 'admin'
      });
      
      // Save user
      await user.save();
      
      return res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error creating admin user:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while creating admin user'
      });
    }
  }
};

module.exports = adminController;
