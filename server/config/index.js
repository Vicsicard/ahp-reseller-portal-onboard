/**
 * Configuration for AHP Reseller Portal
 * 
 * This file exports configuration settings for the application
 * based on environment variables
 */

// Load environment variables
require('dotenv').config();

// Database configuration
const dbConfig = {
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ahp-reseller-portal',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};

// API configuration
const apiConfig = {
  internalApiKey: process.env.INTERNAL_API_KEY,
  baseUrl: process.env.API_BASE_URL || 'http://localhost:5000'
};

// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'ahp-reseller-portal-secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d'
};

// Export configuration
module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  db: dbConfig,
  api: apiConfig,
  jwt: jwtConfig
};
