// Test script for property detail authentication fix
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting test for property detail authentication fix...');

// Function to start the application
function startApp() {
  console.log('Starting the application...');
  
  // Start the application using the existing start script
  const appProcess = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  });
  
  console.log('Application started! Open http://localhost:5175/property/684a5fb17cb3172bbb3c75d7 in your browser');
  console.log('This should now work without authentication errors');
  
  // Log instructions to the user
  console.log('\n=== VERIFICATION STEPS ===');
  console.log('1. Navigate to http://localhost:5175/property/684a5fb17cb3172bbb3c75d7');
  console.log('2. Check the browser console (F12 > Console)');
  console.log('3. Verify that there are no 401 Unauthorized errors');
  console.log('4. You should see the property details loading successfully');
  console.log('5. The "Property Not Found" error should be resolved');
  
  // Keep the process running
  return appProcess;
}

// Start the app
const appProcess = startApp();

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping the application...');
  appProcess.kill();
  process.exit(0);
});
