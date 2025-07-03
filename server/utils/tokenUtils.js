const crypto = require('crypto');

/**
 * Generate a random token for saving application progress
 * @returns {string} Random token
 */
exports.generateToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Validate a token
 * @param {string} token - Token to validate
 * @returns {boolean} True if valid
 */
exports.validateToken = (token) => {
  // Validate token format (hexadecimal string of length 32)
  return typeof token === 'string' && /^[0-9a-f]{32}$/.test(token);
};
