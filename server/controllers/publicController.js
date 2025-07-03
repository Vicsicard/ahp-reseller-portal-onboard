const Reseller = require('../models/Reseller');

/**
 * Public Controller
 * Handles public-facing API endpoints for reseller data
 */
const publicController = {
  /**
   * Get public reseller data for landing page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Public reseller data
   */
  getResellerPublicData: async (req, res) => {
    try {
      const { resellerId } = req.params;
      
      // Find reseller by ID or vanity URL
      const reseller = await Reseller.findOne({
        $or: [
          { _id: resellerId },
          { vanityUrl: resellerId }
        ],
        status: 'approved' // Only return approved resellers
      });
      
      if (!reseller) {
        return res.status(404).json({ 
          success: false, 
          message: 'Reseller not found or not approved' 
        });
      }
      
      // Return only the public data needed for the landing page
      const publicData = {
        companyName: reseller.businessInfo.companyName,
        logoUrl: reseller.branding.logoUrl,
        primaryColor: reseller.branding.primaryColor,
        contactEmail: reseller.contactInfo.email,
        contactPhone: reseller.contactInfo.phone,
        portalUrl: reseller.portalInfo?.url || `${process.env.BASE_URL}/r/${reseller.vanityUrl || reseller._id}`,
        vanityUrl: reseller.vanityUrl,
        // Add any other fields needed for the landing page
      };
      
      return res.status(200).json(publicData);
    } catch (error) {
      console.error('Error fetching reseller public data:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error while fetching reseller data' 
      });
    }
  },
  
  /**
   * Track customer visit to reseller landing page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  trackCustomerVisit: async (req, res) => {
    try {
      const { resellerId } = req.params;
      const { referrer, utm_source, utm_medium, utm_campaign } = req.body;
      
      // Find reseller
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
      
      // Record the visit analytics
      // This could be expanded to a more robust analytics system
      await Reseller.updateOne(
        { _id: reseller._id },
        { 
          $push: { 
            'analytics.visits': {
              timestamp: new Date(),
              referrer,
              utmSource: utm_source,
              utmMedium: utm_medium,
              utmCampaign: utm_campaign,
              ip: req.ip // Be careful with PII/GDPR compliance
            } 
          },
          $inc: { 'analytics.totalVisits': 1 }
        }
      );
      
      return res.status(200).json({ 
        success: true, 
        message: 'Visit tracked successfully' 
      });
    } catch (error) {
      console.error('Error tracking customer visit:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error while tracking visit' 
      });
    }
  }
};

module.exports = publicController;
