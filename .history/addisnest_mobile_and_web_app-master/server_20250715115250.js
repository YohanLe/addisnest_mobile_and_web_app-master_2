const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const apiHandler = require('./functions/api');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 7000;

// Enable file upload handling
app.use(fileUpload({ createParentPath: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', apiHandler);

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
