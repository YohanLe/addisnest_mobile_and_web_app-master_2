/**
 * Server with MongoDB ID property lookup fix
 * 
 * This version of the server uses the fixed property routes file that positions 
 * the MongoDB ID lookup routes BEFORE the authentication middleware.
 */

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Running in ${process.env.NODE_ENV} mode`.yellow.bold);
}

// Enhanced request logging for MongoDB ID requests (when debug is enabled)
if (process.env.DEBUG_MONGODB_ID === 'true') {
  app.use((req, res, next) => {
    if (req.path.includes('/mongo-id/') || req.path.includes('/direct-db-query/')) {
      console.log(`${colors.cyan('[MongoDB ID Debug]')} ${req.method} ${req.originalUrl}`);
      console.log(`  ${colors.green('Headers:')} ${JSON.stringify(req.headers)}`);
    }
    next();
  });
}

// Test endpoint
app.get('/api/test-public', (req, res) => {
  res.json({ success: true, message: 'API is running and accessible' });
});

// Mount routers
const authRoutes = require('./routes/authRoutes');
// IMPORTANT: Use the fixed property routes file
const propertyRoutes = require('./routes/propertyRoutes-mongo-id-fix');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Register route files
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes); // Using fixed property routes
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, './dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './dist', 'index.html'));
  });
}

// Error handler
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 7000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
    ${colors.green('✓')} ${colors.green.bold('Server running in')} ${colors.yellow.bold(process.env.NODE_ENV)} ${colors.green.bold('mode on port')} ${colors.yellow.bold(PORT)}
    ${colors.cyan('•')} ${colors.cyan.bold('MongoDB ID property lookup fix is ENABLED')}
    ${colors.cyan('•')} ${colors.cyan.bold('Using fixed routes from:')} ${colors.yellow('routes/propertyRoutes-mongo-id-fix.js')}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;
