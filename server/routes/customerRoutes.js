const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateToken, isAdmin, isResellerOrAdmin } = require('../middleware/auth');

/**
 * Customer Routes
 * Handles all customer-related API endpoints
 */

// Public routes
router.post('/signup', customerController.signup);

// Protected routes (require authentication)
router.get('/reseller/:resellerId', authenticateToken, isResellerOrAdmin, customerController.getResellerCustomers);
router.patch('/:customerId/status', authenticateToken, isAdmin, customerController.updateCustomerStatus);

module.exports = router;
