const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting property detail object rendering fix test...');

// Start the frontend development server
const frontendProcess = exec('npm run dev', (error, stdout, stderr) => {
  if (error) {
    console.error(`Frontend server error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Frontend stderr: ${stderr}`);
  }
  console.log(`Frontend stdout: ${stdout}`);
});

// Start the backend server
const backendProcess = exec('node src/server.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Backend server error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Backend stderr: ${stderr}`);
  }
  console.log(`Backend stdout: ${stdout}`);
});

console.log('Servers started. Please navigate to the property detail page to test the fix:');
console.log('http://localhost:5173/property/684a5fb17cb3172bbb3c75d7');
console.log('\nThe page should load without any "Objects are not valid as a React child" errors.');
console.log('To stop the servers, press Ctrl+C in this terminal window.');

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping servers...');
  frontendProcess.kill();
  backendProcess.kill();
  process.exit();
});
