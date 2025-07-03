const express = require('express');
const router = express.Router();
const multer = require('multer');
const brandingController = require('../controllers/brandingController');
const { authenticateToken, isResellerOrAdmin } = require('../middleware/auth');

// Configure multer for memory storage (we'll process the file in the controller)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * Branding Routes
 * Handles all branding-related API endpoints
 */

// Get reseller branding
router.get('/resellers/:resellerId/branding', brandingController.getBranding);

// Update reseller branding (protected route)
router.post(
  '/resellers/:resellerId/branding', 
  authenticateToken, 
  isResellerOrAdmin, 
  upload.single('logo'), 
  brandingController.updateBranding
);

module.exports = router;
