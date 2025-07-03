const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

/**
 * Payment Routes
 * Handles all payment-related API endpoints
 */

// Public routes
router.get('/plans', paymentController.getPlans);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Protected routes (require authentication)
router.post('/checkout-session', authenticateToken, paymentController.createCheckoutSession);
router.get('/checkout-success', authenticateToken, paymentController.handleCheckoutSuccess);

module.exports = router;
