const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const config = require('./config');

// Import routes
const resellerRoutes = require('./routes/resellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const brandingRoutes = require('./routes/brandingRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// API Routes
app.use('/api/resellers', resellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/branding', brandingRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
