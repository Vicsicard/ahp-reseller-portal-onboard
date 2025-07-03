const mongoose = require('mongoose');
// Use consistent import path
const config = require('./index');

// Set strictQuery to suppress deprecation warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // Use the MongoDB URI from config
    const mongoURI = config.db.mongoURI;
    
    await mongoose.connect(mongoURI, config.db.options);
    console.log('MongoDB Connected...');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
};

module.exports = connectDB;
