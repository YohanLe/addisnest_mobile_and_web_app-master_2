# Quick Manual Deployment (Without Git Pull)

Since Git is asking for authentication, here's how to deploy without pulling from GitHub:

## Step 1: Cancel Git Pull
```bash
# Press Ctrl+C to cancel the git pull command
```

## Step 2: Create the Production Server File Manually
```bash
# Create the production server file
nano server-production.js
```

**Copy and paste this entire content into the file:**

```javascript
/**
 * Production Server Launcher for AddisNest
 * This script starts only the backend server for production deployment
 */

const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const connectDB = require('./src/config/db');
const routes = require('./src/routes');

// Load env vars
dotenv.config();

console.log(`
=================================================
     AddisNest Production Server Starting           
=================================================
`.green.bold);

console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT || 3000);

// Connect to database
connectDB();

// Create Express app
const app = express();
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ 
  server,
  path: '/ws'
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
  next();
});

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Set static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/properties', express.static(path.join(__dirname, 'uploads/properties')));
app.use(express.static(path.join(__dirname, 'src/public')));

// Mount routes
console.log('Registering API routes...');
app.use('/api/agents', routes.agentRoutes);
app.use('/api/users', routes.userRoutes);
app.use('/api/auth', routes.authRoutes);
app.use('/api/properties/count', routes.propertyCountRoutes);
app.use('/api/properties', routes.propertyRoutes);
app.use('/api/property-submit', routes.propertySubmitRoute
