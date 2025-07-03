const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify token
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 'error',
          message: 'Invalid token.'
        });
      }
      
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Authentication error.'
    });
  }
};

/**
 * Middleware to check if user is admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Authorization error.'
    });
  }
};

/**
 * Middleware to check if user is reseller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.isReseller = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'reseller') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Reseller privileges required.'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Authorization error.'
    });
  }
};
