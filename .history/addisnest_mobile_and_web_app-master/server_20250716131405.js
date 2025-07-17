const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const apiHandler = require('./functions/api');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 7001;

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable file upload handling
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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/', apiHandler);

// For development, we don't serve static files since Vite handles the frontend
// Only serve API routes and uploaded files

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
