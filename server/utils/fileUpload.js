const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload an image file to the server
 * @param {Object} file - File object from express-fileupload
 * @returns {Promise<string>} URL of the uploaded image
 */
exports.uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const fileExt = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Move file to uploads directory
      file.mv(filePath, (err) => {
        if (err) {
          return reject(err);
        }
        
        // Return relative URL to the file
        const fileUrl = `/uploads/${fileName}`;
        resolve(fileUrl);
      });
    } catch (error) {
      reject(error);
    }
  });
};
