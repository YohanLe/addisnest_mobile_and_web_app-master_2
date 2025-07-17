const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

// Import routes
const routes = require('../src/routes');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.endsWith('netlify.app') || origin.includes('--addisnesttest.netlify.app')) {
      return callback(null, true);
    }
    if (origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
      return callback(null, true);
    }
    if (origin === 'https://addisnesttest.netlify.app') {
      return callback(null, true);
    }
    callback(null, true); // Temporary allow-all during debugging
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(fileUpload());

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const hasDBName = mongoUri.split('/').length > 3;
    const connectionString = hasDBName ? mongoUri : `${mongoUri}/addisnest`;
    console.log('Connecting to MongoDB with URI:', connectionString.replace(/:[^\/]+@/, ':****@'));
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

// ✅ CHANGED: Removed '/api' prefix
// ✅ FIXED: Mount specific routes before general routes to avoid conflicts
app.use('/agents', routes.agentRoutes);
app.use('/users', routes.userRoutes);
app.use('/auth', routes.authRoutes);
app.use('/properties/count', routes.propertyCountRoutes);
app.use('/properties', routes.propertyRoutes);
app.use('/property-submit', routes.propertySubmitRoute);
app.use('/conversations', routes.conversationRoutes);
app.use('/messages', routes.messageRoutes);
app.use('/notifications', routes.notificationRoutes);
app.use('/payments', routes.paymentRoutes);
app.use('/connectiontests', routes.connectionTestRoutes);
app.use('/media', routes.mediaRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Addisnest API is running'
  });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', '),
      details: err.errors
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `Duplicate field value entered: ${field}`,
      field
    });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Connect to database on startup for local development
connectDB();

// Export the app for local development
module.exports = app;

// Also export serverless handler for deployment
const handler = serverless(app);
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  return handler(event, context);
};
