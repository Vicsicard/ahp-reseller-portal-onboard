const express = require('express');
const router = express.Router();
const resellerController = require('../controllers/resellerController');

// Save application progress
router.post('/save-progress', resellerController.saveProgress);

// Submit application
router.post('/apply', resellerController.submitApplication);

// Resume application with token
router.get('/resume/:token', resellerController.resumeApplication);

// Get application status
router.get('/status/:token', resellerController.getApplicationStatus);

module.exports = router;
