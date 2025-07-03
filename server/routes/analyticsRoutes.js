const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, isResellerOrAdmin } = require('../middleware/auth');

/**
 * Analytics Routes
 * Handles all analytics-related API endpoints
 */

// Public routes
router.post('/track/:resellerId', analyticsController.trackLandingPageVisit);

// Protected routes (require authentication)
router.get('/dashboard/:resellerId', authenticateToken, isResellerOrAdmin, analyticsController.getDashboardSummary);
router.get('/customers/:resellerId', authenticateToken, isResellerOrAdmin, analyticsController.getCustomerAcquisitionMetrics);
router.get('/revenue/:resellerId', authenticateToken, isResellerOrAdmin, analyticsController.getRevenueMetrics);
router.get('/landing-page/:resellerId', authenticateToken, isResellerOrAdmin, analyticsController.getLandingPageMetrics);

module.exports = router;
