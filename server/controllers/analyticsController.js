const analyticsService = require('../utils/analyticsService');

/**
 * Analytics Controller
 * Handles analytics data retrieval for reseller dashboards
 */
const analyticsController = {
  /**
   * Get dashboard summary for a reseller
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with dashboard summary data or error
   */
  getDashboardSummary: async (req, res) => {
    try {
      const { resellerId } = req.params;
      
      // Get dashboard summary
      const summary = await analyticsService.getDashboardSummary(resellerId);
      
      return res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching dashboard summary'
      });
    }
  },
  
  /**
   * Get customer acquisition metrics for a reseller
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with customer acquisition metrics or error
   */
  getCustomerAcquisitionMetrics: async (req, res) => {
    try {
      const { resellerId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Get customer acquisition metrics
      const metrics = await analyticsService.getCustomerAcquisitionMetrics(resellerId, {
        startDate,
        endDate
      });
      
      return res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error getting customer acquisition metrics:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching customer acquisition metrics'
      });
    }
  },
  
  /**
   * Get revenue metrics for a reseller
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with revenue metrics or error
   */
  getRevenueMetrics: async (req, res) => {
    try {
      const { resellerId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Get revenue metrics
      const metrics = await analyticsService.getRevenueMetrics(resellerId, {
        startDate,
        endDate
      });
      
      return res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error getting revenue metrics:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching revenue metrics'
      });
    }
  },
  
  /**
   * Get landing page performance metrics for a reseller
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with landing page metrics or error
   */
  getLandingPageMetrics: async (req, res) => {
    try {
      const { resellerId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Get landing page metrics
      const metrics = await analyticsService.getLandingPageMetrics(resellerId, {
        startDate,
        endDate
      });
      
      return res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error getting landing page metrics:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching landing page metrics'
      });
    }
  },
  
  /**
   * Track landing page visit
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response acknowledging visit tracking
   */
  trackLandingPageVisit: async (req, res) => {
    try {
      const { resellerId } = req.params;
      const { referrer, userAgent } = req.body;
      const ipAddress = req.ip;
      
      // Find reseller by ID or vanity URL
      const Reseller = require('../models/Reseller');
      const reseller = await Reseller.findOne({
        $or: [
          { _id: resellerId },
          { vanityUrl: resellerId }
        ]
      });
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Reseller not found'
        });
      }
      
      // Update landing page visit analytics
      await Reseller.findByIdAndUpdate(
        reseller._id,
        {
          $inc: {
            'analytics.landingPageVisits': 1
          },
          $push: {
            'analytics.visits': {
              timestamp: new Date(),
              ipAddress,
              referrer: referrer || '',
              userAgent: userAgent || ''
            }
          }
        }
      );
      
      // Return success
      return res.status(200).json({
        success: true,
        message: 'Visit tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking landing page visit:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while tracking visit'
      });
    }
  }
};

module.exports = analyticsController;
