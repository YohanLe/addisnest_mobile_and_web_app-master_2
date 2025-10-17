// This script tests the improved property detail page fix
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const open = require('open');

// Configuration
const PORT = 5175; // The port your application runs on
const WAIT_TIME = 5000; // Time to wait for server to start in milliseconds
const PROPERTY_ID = '6849cb367cb3172bbb3c708b'; // Property ID to test with

console.log('Starting Property Detail Fix Test...');

// Define paths
const appRoot = path.resolve(__dirname);
const envPath = path.join(appRoot, '.env');

// Check if .env exists and create a backup if needed
if (fs.existsSync(envPath)) {
  console.log('Backing up existing .env file...');
  fs.copyFileSync(envPath, `${envPath}.backup`);
}

// Create or update .env file with required settings
console.log('Creating test .env file...');
const envContent = `
# Application Configuration
VITE_API_BASE_URL=http://localhost:7000/api
PORT=7000
MONGODB_URI=mongodb://localhost:27017/addisnest
JWT_SECRET=addisnest_secret_key_for_development
JWT_EXPIRE=30d
NODE_ENV=development
`;

fs.writeFileSync(envPath, envContent);

// Start the application
console.log('Starting application...');
const app = spawn('npm', ['run', 'dev'], {
  cwd: appRoot,
  stdio: 'inherit',
  shell: true
});

// Handle application exit
app.on('close', (code) => {
  console.log(`Application process exited with code ${code}`);
  
  // Restore original .env file if backup exists
  if (fs.existsSync(`${envPath}.backup`)) {
    console.log('Restoring original .env file...');
    fs.copyFileSync(`${envPath}.backup`, envPath);
    fs.unlinkSync(`${envPath}.backup`);
  }
});

// Wait for the server to start, then open the property detail page
setTimeout(async () => {
  console.log('Opening property detail page in browser...');
  await open(`http://localhost:${PORT}/property/${PROPERTY_ID}`);
  
  console.log('Test running...');
  console.log('-------------------------');
  console.log('INSTRUCTIONS:');
  console.log('1. The property detail page should load successfully without showing "Property Not Found"');
  console.log('2. You should see property details including images, price, and other information');
  console.log('3. If the page loads correctly, the fix was successful');
  console.log('-------------------------');
  console.log('Press Ctrl+C to stop the test when finished');
}, WAIT_TIME);
