/**
 * Test script for property detail page fix - Final version
 * 
 * This script launches the application with the fixes for property detail data mapping.
 * It specifically targets the property with ID 6849e2ef7cb3172bbb3c718d to verify
 * that all property details are correctly displayed.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

console.log(`${colors.green}${colors.bright}=== Testing Property Detail Fix - Final Version ===${colors.reset}`);
console.log(`${colors.cyan}This test verifies the property detail data mapping fixes${colors.reset}`);
console.log(`${colors.cyan}Target property ID: 6849e2ef7cb3172bbb3c718d${colors.reset}`);
console.log('');

// Step 1: Check if the necessary files exist
console.log(`${colors.yellow}Step 1: Checking if necessary files exist...${colors.reset}`);
const requiredFiles = [
  'src/Redux-store/Slices/PropertyDetailSlice.js',
  'src/components/property-detail/sub-component/PropertyDetail.jsx'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`${colors.red}Error: File ${file} does not exist${colors.reset}`);
    allFilesExist = false;
  } else {
    console.log(`${colors.green}✓ ${file} exists${colors.reset}`);
  }
});

if (!allFilesExist) {
  console.log(`${colors.red}Test failed: Some required files are missing${colors.reset}`);
  process.exit(1);
}

// Step 2: Launch the application
console.log('');
console.log(`${colors.yellow}Step 2: Launching the application...${colors.reset}`);
console.log(`${colors.cyan}The application will start with the property detail fixes enabled.${colors.reset}`);
console.log(`${colors.cyan}To test:${colors.reset}`);
console.log(`${colors.cyan}1. Navigate to http://localhost:5174/property/6849e2ef7cb3172bbb3c718d${colors.reset}`);
console.log(`${colors.cyan}2. Verify that all property details are correctly displayed:${colors.reset}`);
console.log(`${colors.cyan}   - Title: "Amaizing house for sale jo"${colors.reset}`);
console.log(`${colors.cyan}   - Description: "hjgh"${colors.reset}`);
console.log(`${colors.cyan}   - Property Type: "Commercial"${colors.reset}`);
console.log(`${colors.cyan}   - Offering Type: "For Sale"${colors.reset}`);
console.log(`${colors.cyan}   - Price: 2112${colors.reset}`);
console.log(`${colors.cyan}   - Area: 56262 sq.m${colors.reset}`);
console.log(`${colors.cyan}   - Bedrooms: 26${colors.reset}`);
console.log(`${colors.cyan}   - Bathrooms: 32${colors.reset}`);
console.log(`${colors.cyan}   - Views: 9${colors.reset}`);
console.log('');

console.log(`${colors.green}${colors.bright}Starting the application...${colors.reset}`);

// Command to start the application
// Note: We're using npm start to use the default start script in package.json
const command = 'npm start';

// Execute the command
const childProcess = exec(command);

// Forward stdout and stderr to the console
childProcess.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});

childProcess.stderr.on('data', (data) => {
  console.error(`${colors.red}${data.toString().trim()}${colors.reset}`);
});

// Handle process exit
childProcess.on('exit', (code) => {
  if (code !== 0) {
    console.log(`${colors.red}Application exited with code ${code}${colors.reset}`);
  }
});

console.log('');
console.log(`${colors.green}${colors.bright}Test script execution complete. Application is starting...${colors.reset}`);
console.log(`${colors.yellow}Press Ctrl+C to stop the application when testing is complete.${colors.reset}`);
