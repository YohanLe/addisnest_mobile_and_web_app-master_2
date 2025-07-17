const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./config/db');
const routes = require('./routes');

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// MongoDB connection string comes from .env file
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('Port:', process.env.PORT);

// Connect to database
connectDB();

// Create Express app
const app = express();
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ 
  server,
  path: '/'
});

// Create a separate HTTP server for WebSocket on port 5177
const wsServer = http.createServer((req, res) => {
  // Handle HTTP GET requests to serve the WebSocket test page
  if (req.method === 'GET') {
    if (req.url === '/' || req.url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(require('fs').readFileSync(path.join(__dirname, 'public/websocket-test.html')));
      return;
    }
  }
  
  // Default response for unhandled requests
  res.writeHead(426, { 'Content-Type': 'text/plain' });
  res.end('Upgrade Required');
});

// Create WebSocket server attached to the HTTP server
const wss5177 = new WebSocket.Server({ server: wsServer });

// Handle connections on port 5177
wss5177.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log(`WebSocket client connected on port 5177 from ${ip}`);
  
  // Send initial connection confirmation
  ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
  
  // Handle incoming messages
  ws.on('message', function incoming(message) {
    console.log('Received message on port 5177:', message.toString());
    
    try {
      const parsedMessage = JSON.parse(message);
      
      // Handle different message types
      switch(parsedMessage.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
        default:
          console.log('Unhandled message type:', parsedMessage.type);
      }
    } catch (err) {
      console.error('Error processing WebSocket message:', err);
    }
  });
  
  // Handle connection close
  ws.on('close', function() {
    console.log('WebSocket client disconnected from port 5177');
  });
});

// Log all WebSocket errors for port 5177 server
wss5177.on('error', function(error) {
  console.error('WebSocket server error on port 5177:', error);
});

// Start the WebSocket HTTP server
wsServer.listen(5178, () => {
  console.log('WebSocket HTTP server running on port 5178');
});

// WebSocket connection handling
wss.on('connection', function connection(ws) {
  console.log('WebSocket client connected');
  
  // Send initial connection confirmation
  ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
  
  // Handle incoming messages
  ws.on('message', function incoming(message) {
    console.log('Received message:', message.toString());
    
    try {
      const parsedMessage = JSON.parse(message);
      
      // Handle different message types
      switch(parsedMessage.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
        default:
          console.log('Unhandled message type:', parsedMessage.type);
      }
    } catch (err) {
      console.error('Error processing WebSocket message:', err);
    }
  });
  
  // Handle connection close
  ws.on('close', function() {
    console.log('WebSocket client disconnected');
  });
});

// Log all WebSocket errors
wss.on('error', function(error) {
  console.error('WebSocket server error:', error);
});

// Body parser
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// File upload middleware
app.use(fileUpload({
  createParentPath: true
}));

// Set static folders - ensure uploads directory is properly served
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Also explicitly add the properties subdirectory to ensure it's accessible
app.use('/uploads/properties', express.static(path.join(__dirname, '../uploads/properties')));
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes with logging
console.log('Registering routes...');
console.log('Mounting agent routes at /api/agents');
app.use('/api/agents', routes.agentRoutes);
console.log('Mounting user routes at /api/users');
app.use('/api/users', routes.userRoutes);
console.log('Mounting auth routes at /api/auth');
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
app.use('/api/partnership-requests', routes.partnershipRequestRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running'
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  // Log the full error details
  console.error('=== SERVER ERROR ===');
  console.error(`Error in ${req.method} ${req.path}`);
  console.error('Request params:', req.params);
  console.error('Request query:', req.query);
  console.error('Request body:', req.body);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode || 500
  });
  console.error('Stack trace:', err.stack);
  console.error('===================');
  
  // Format validation errors from Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', '),
      details: err.errors
    });
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `Duplicate field value entered: ${field}`,
      field
    });
  }
  
  // Return appropriate error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 7000;

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Start the server
server.listen(PORT, () => {
console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
console.log(`WebSocket server running on port 5178`.cyan.bold);
console.log(`WebSocket test page available at http://localhost:5178/`.cyan.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
