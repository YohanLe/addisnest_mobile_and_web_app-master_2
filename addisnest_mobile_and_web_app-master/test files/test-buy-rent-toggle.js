/**
 * Test Script for Header Buy/Rent Toggle Button Functionality
 * 
 * This script provides a way to test the Buy/Rent toggle functionality 
 * in the main navigation header.
 */

// Import required modules
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('=================================================');
console.log('  TESTING BUY/RENT TOGGLE BUTTON FUNCTIONALITY   ');
console.log('=================================================');
console.log('\nThis script will help verify the Buy/Rent toggle button in the header works correctly.');

// Function to start the application
function startApplication() {
  console.log('\n1. Starting the application...');
  
  // Check if there's an existing Node process and kill it
  exec('taskkill /im node.exe /f', (error) => {
    // Start the application using the existing launcher
    const startProcess = exec('node fixed-launcher.js', {
      windowsHide: false
    });
    
    startProcess.stdout.on('data', (data) => {
      console.log(`App output: ${data}`);
      
      // Once we see the server is running, provide instructions
      if (data.includes('Server running') || data.includes('running at http://localhost')) {
        console.log('\n2. Application has started successfully!');
        console.log('\nTEST INSTRUCTIONS:');
        console.log('------------------');
        console.log('1. Open your browser and navigate to: http://localhost:5173');
        console.log('2. Locate the "Buy/Rent" toggle button in the header navigation');
        console.log('3. Click the button to toggle between Buy and Rent modes');
        console.log('4. Verify that:');
        console.log('   - The button label shows the current state');
        console.log('   - The button visually indicates which mode is active');
        console.log('   - When clicked, it navigates to the property listing page');
        console.log('   - The property listing page shows the correct type of properties');
        console.log('\nExpected behavior:');
        console.log('- Initial state should show "Buy/Rent" with "Buy" as the active state');
        console.log('- Clicking toggles between "Buy" and "Rent" states');
        console.log('- When in "Buy" state, clicking should load properties for sale');
        console.log('- When in "Rent" state, clicking should load properties for rent');
        console.log('\nPress Ctrl+C in this terminal window to stop the test and close the application');
      }
    });
    
    startProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });
  });
}

// Start the process
startApplication();
