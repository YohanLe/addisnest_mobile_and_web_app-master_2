const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const apiHandler = require('./functions/api');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = 3000;

// API routes
app.use('/api', apiHandler);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
