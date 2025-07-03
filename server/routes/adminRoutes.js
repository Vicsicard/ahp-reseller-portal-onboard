const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

/**
 * Admin Routes
 * Handles all admin-related API endpoints
 * All routes require admin authentication
 */

// Protect all admin routes
router.use(authenticateToken, isAdmin);

// Reseller management
router.get('/resellers', adminController.getAllResellers);
router.get('/resellers/:resellerId', adminController.getResellerById);
router.patch('/resellers/:resellerId/status', adminController.updateResellerStatus);

// Customer management
router.get('/customers', adminController.getAllCustomers);

// System statistics
router.get('/stats', adminController.getSystemStats);

// Admin user management
router.get('/users', adminController.getAdminUsers);
router.post('/users', adminController.createAdminUser);

module.exports = router;
