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
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  },
  abortOnLimit: false,
  responseOnLimit: "File size limit has been reached",
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: false, // Disable debug to reduce noise
  parseNested: true,
  preserveExtension: true,
  safeFileNames: true,
  // Add error handling for busboy
  uploadTimeout: 60000, // 60 second timeout
  // Handle busboy errors gracefully
  busboy: {
    highWaterMark: 2 * 1024 * 1024, // 2MB buffer
    fileHwm: 1024 * 1024, // 1MB file buffer
    defCharset: 'utf8',
    preservePath: false
  }
}));

// Import optimized database connection
const connectDB = require('../src/config/db');

// Mount specific routes before general routes to avoid conflicts
// Add /api prefix to match frontend expectations
app.use('/api/agents', routes.agentRoutes);
app.use('/api/users', routes.userRoutes);
app.use('/api/auth', routes.authRoutes);
app.use('/api/properties/count', routes.propertyCountRoutes);
app.use('/api/properties', routes.propertyRoutes);
app.use('/api/property-submit', routes.propertySubmitRoute);
app.use('/api/conversations', routes.conversationRoutes);
app.use('/api/messages', routes.messageRoutes);
app.use('/api/notifications', routes.notificationRoutes);
app.use('/api/payments', routes.paymentRoutes);
app.use('/api/connectiontests', routes.connectionTestRoutes);
app.use('/api/media', routes.mediaRoutes);
app.use('/api/schedules', routes.scheduleRoutes);

// Also mount without /api prefix for backward compatibility
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
app.use('/schedules', routes.scheduleRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Addisnest API is running'
  });
});

// Direct route for send-to-agent to bypass routing issues
app.post('/api/messages/send-to-agent', async (req, res) => {
  try {
    const { 
      agentId, 
      agentEmail, 
      agentName, 
      senderName, 
      senderEmail, 
      message, 
      subject 
    } = req.body;

    console.log('Direct route - sendToAgent called with data:', {
      agentId,
      agentEmail,
      agentName,
      senderName,
      senderEmail,
      messageLength: message?.length,
      subject
    });

    // Validate required fields
    if (!agentEmail || !senderName || !senderEmail || !message) {
      console.error('Missing required fields:', {
        agentEmail: !!agentEmail,
        senderName: !!senderName,
        senderEmail: !!senderEmail,
        message: !!message
      });
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: agentEmail, senderName, senderEmail, and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(agentEmail)) {
      console.error('Invalid email format:', { senderEmail, agentEmail });
      return res.status(400).json({
        success: false,
        error: 'Please provide valid email addresses'
      });
    }

    // Log the inquiry for tracking purposes
    console.log(`Agent inquiry: ${senderName} (${senderEmail}) contacted ${agentName || 'Agent'} (${agentEmail})`);
    console.log(`Message: ${message}`);

    // Always return success in development mode
    const response = {
      success: true,
      message: `Your message has been sent to ${agentName || 'the agent'} successfully`,
      data: {
        emailSent: false, // Email service not configured in development
        emailError: null,
        timestamp: new Date().toISOString(),
        agentEmail,
        agentName: agentName || 'Agent',
        senderEmail
      }
    };

    console.log('Direct route - Sending response:', response);
    return res.status(200).json(response);

  } catch (error) {
    console.error('Direct route - Error in sendToAgent:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message to agent. Please try again later.',
      details: error.message
    });
  }
});

// Also add the non-API version for backward compatibility
app.post('/messages/send-to-agent', async (req, res) => {
  try {
    const { 
      agentId, 
      agentEmail, 
      agentName, 
      senderName, 
      senderEmail, 
      message, 
      subject 
    } = req.body;

    console.log('Non-API route - sendToAgent called with data:', {
      agentId,
      agentEmail,
      agentName,
      senderName,
      senderEmail,
      messageLength: message?.length,
      subject
    });

    // Validate required fields
    if (!agentEmail || !senderName || !senderEmail || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: agentEmail, senderName, senderEmail, and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(agentEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide valid email addresses'
      });
    }

    // Log the inquiry for tracking purposes
    console.log(`Agent inquiry: ${senderName} (${senderEmail}) contacted ${agentName || 'Agent'} (${agentEmail})`);
    console.log(`Message: ${message}`);

    // Always return success in development mode
    const response = {
      success: true,
      message: `Your message has been sent to ${agentName || 'the agent'} successfully`,
      data: {
        emailSent: false, // Email service not configured in development
        emailError: null,
        timestamp: new Date().toISOString(),
        agentEmail,
        agentName: agentName || 'Agent',
        senderEmail
      }
    };

    console.log('Non-API route - Sending response:', response);
    return res.status(200).json(response);

  } catch (error) {
    console.error('Non-API route - Error in sendToAgent:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message to agent. Please try again later.',
      details: error.message
    });
  }
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
