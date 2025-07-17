const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const apiHandler = require('./functions/api');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 7001;

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes - the apiHandler already has all middleware configured
app.use('/', apiHandler);

// For development, we don't serve static files since Vite handles the frontend
// Only serve API routes and uploaded files

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
