const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const apiHandler = require('./functions/api');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 7001;

// Enable file upload handling
app.use(fileUpload({ createParentPath: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', apiHandler);

// For development, we don't serve static files since Vite handles the frontend
// Only serve API routes and uploaded files

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
