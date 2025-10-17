/**
 * Test script for property detail database field mapping fix
 * This script launches the application and navigates to a property detail page
 * to verify that database fields are correctly displayed
 */

const { spawn } = require('child_process');
const open = require('open');
const path = require('path');
const fs = require('fs');

// MongoDB ObjectId to test with - this should match a property in your database
// or the app will fall back to mock data
const TEST_PROPERTY_ID = '684a57857cb3172bbb3c73d9'; // Using the ID from the URL

console.log('Starting Property Detail Database Fix Test');
console.log('==========================================');
console.log('Test Property ID:', TEST_PROPERTY_ID);

// Check if the server is already running
const checkServerRunning = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/healthcheck');
    if (response.ok) {
      console.log('Server is already running');
      return true;
    }
  } catch (error) {
    console.log('Server is not running, will start it');
    return false;
  }
  return false;
};

// Start the server if it's not already running
const startServer = () => {
  console.log('Starting server...');
  
  // Create a detached child process to run the server
  const server = spawn('node', ['src/server.js'], {
    detached: true,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Unref the child process so it can run independently
  server.unref();
  
  console.log('Server started in the background');
  
  // Return a promise that resolves when the server is ready
  return new Promise((resolve) => {
    // Give the server some time to start up
    setTimeout(resolve, 3000);
  });
};

// Start the frontend development server
const startFrontend = () => {
  console.log('Starting frontend development server...');
  
  // Create a detached child process to run the frontend
  const frontend = spawn('npm', ['run', 'dev'], {
    detached: true,
    stdio: 'inherit'
  });
  
  // Unref the child process so it can run independently
  frontend.unref();
  
  console.log('Frontend development server started in the background');
  
  // Return a promise that resolves when the frontend is ready
  return new Promise((resolve) => {
    // Give the frontend some time to start up
    setTimeout(resolve, 5000);
  });
};

// Open the property detail page in the default browser
const openPropertyDetailPage = async () => {
  console.log('Opening property detail page in browser...');
  
  // Construct the URL for the property detail page
  // Use the debug route to help diagnose issues
  const url = `http://localhost:5175/debug/property/${TEST_PROPERTY_ID}`;
  
  // Open the URL in the default browser
  await open(url);
  
  console.log('Browser opened with URL:', url);
  console.log('\nTest Instructions:');
  console.log('1. Verify that property details are displayed correctly');
  console.log('2. Check that the following fields match the database values:');
  console.log('   - Title: "Test Property With Fixed Image URLs"');
  console.log('   - Property Type: "House"');
  console.log('   - Property For: "For Sale"');
  console.log('   - Location: "Addis Ababa, Ethiopia"');
  console.log('   - Price: 1,000,000');
  console.log('   - Bedrooms: 3');
  console.log('   - Bathrooms: 2');
  console.log('   - Size: 100 sqm');
  console.log('   - Furnishing: "Furnished"');
  console.log('3. Verify that images are displayed properly');
};

// Main function to run the test
const runTest = async () => {
  try {
    const isServerRunning = await checkServerRunning();
    
    if (!isServerRunning) {
      await startServer();
    }
    
    await startFrontend();
    await openPropertyDetailPage();
    
    console.log('\nTest running. Press Ctrl+C to exit script (servers will continue running in background)');
  } catch (error) {
    console.error('Error running test:', error);
  }
};

// Run the test
runTest();
