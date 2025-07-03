const Reseller = require('../models/Reseller');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Branding Controller
 * Handles reseller branding customization (logo and primary color)
 */
const brandingController = {
  /**
   * Update reseller branding (logo and primary color)
   * @param {Object} req - Express request object with file upload
   * @param {Object} res - Express response object
   * @returns {Object} - Response with updated branding data or error
   */
  updateBranding: async (req, res) => {
    try {
      const { resellerId } = req.params;
      const { primaryColor } = req.body;
      
      // Find the reseller
      const reseller = await Reseller.findById(resellerId);
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Reseller not found'
        });
      }
      
      // Check if user has permission to update this reseller
      // This would be handled by middleware in a real implementation
      // For now, we'll assume the user has access
      
      // Update branding data
      let logoUrl = reseller.branding?.logoUrl || null;
      
      // Handle logo upload if provided
      if (req.file) {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'logos');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Generate unique filename for the logo
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${resellerId}-${uuidv4()}${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);
        
        // Write file to disk
        fs.writeFileSync(filePath, req.file.buffer);
        
        // Set the logo URL
        logoUrl = `/uploads/logos/${fileName}`;
        
        // Remove old logo file if it exists
        if (reseller.branding?.logoUrl) {
          const oldLogoPath = path.join(__dirname, '..', '..', 'public', reseller.branding.logoUrl);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }
      }
      
      // Update reseller with new branding
      const updatedReseller = await Reseller.findByIdAndUpdate(
        resellerId,
        {
          branding: {
            primaryColor: primaryColor || reseller.branding?.primaryColor || '#0066CC',
            logoUrl
          }
        },
        { new: true }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Branding updated successfully',
        data: {
          primaryColor: updatedReseller.branding.primaryColor,
          logoUrl: updatedReseller.branding.logoUrl
        }
      });
    } catch (error) {
      console.error('Error updating branding:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while updating branding'
      });
    }
  },
  
  /**
   * Get reseller branding
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with branding data or error
   */
  getBranding: async (req, res) => {
    try {
      const { resellerId } = req.params;
      
      // Find the reseller
      const reseller = await Reseller.findById(resellerId);
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Reseller not found'
        });
      }
      
      // Return branding data
      return res.status(200).json({
        success: true,
        data: {
          primaryColor: reseller.branding?.primaryColor || '#0066CC',
          logoUrl: reseller.branding?.logoUrl || null
        }
      });
    } catch (error) {
      console.error('Error fetching branding:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching branding'
      });
    }
  }
};

module.exports = brandingController;
