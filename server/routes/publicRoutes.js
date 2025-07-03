const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

/**
 * Public API Routes
 * These routes are accessible without authentication
 */

// Get public reseller data for landing page
router.get('/resellers/:resellerId/public', publicController.getResellerPublicData);

// Track customer visit to reseller landing page
router.post('/resellers/:resellerId/track-visit', publicController.trackCustomerVisit);

module.exports = router;
