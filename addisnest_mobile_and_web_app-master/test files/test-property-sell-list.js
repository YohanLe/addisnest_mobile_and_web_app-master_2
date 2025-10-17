const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting test for PropertySellListPage component...');

// Function to start the development server
function startDevServer() {
  console.log('Starting development server...');
  
  // Start the development server
  const serverProcess = exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting development server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Development server stderr: ${stderr}`);
    }
    console.log(`Development server stdout: ${stdout}`);
  });
  
  // Return the server process so it can be killed later
  return serverProcess;
}

// Function to open the PropertySellListPage in a browser
function openPropertySellListPage() {
  console.log('Opening PropertySellListPage in browser...');
  
  // Determine the appropriate command based on the operating system
  let command;
  switch (process.platform) {
    case 'win32':
      command = 'start http://localhost:5173/sell';
      break;
    case 'darwin':
      command = 'open http://localhost:5173/sell';
      break;
    default:
      command = 'xdg-open http://localhost:5173/sell';
  }
  
  // Execute the command to open the browser
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening browser: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Browser stderr: ${stderr}`);
    }
    console.log(`Browser stdout: ${stdout}`);
    console.log('PropertySellListPage should now be open in your browser.');
    console.log('Please verify that the page is displaying correctly with proper styling.');
    console.log('When you are done testing, press Ctrl+C to stop the development server.');
  });
}

// Main function to run the test
function runTest() {
  console.log('Running test for PropertySellListPage component...');
  
  // Check if the component files exist
  const componentPath = path.join(__dirname, 'src', 'components', 'Property-sell-list', 'PropertySellListPage.jsx');
  const cssPath = path.join(__dirname, 'src', 'components', 'Property-sell-list', 'PropertySellListPage.css');
  const indexPath = path.join(__dirname, 'src', 'components', 'Property-sell-list', 'index.jsx');
  
  if (!fs.existsSync(componentPath)) {
    console.error(`Component file not found: ${componentPath}`);
    return;
  }
  
  if (!fs.existsSync(cssPath)) {
    console.error(`CSS file not found: ${cssPath}`);
    return;
  }
  
  if (!fs.existsSync(indexPath)) {
    console.error(`Index file not found: ${indexPath}`);
    return;
  }
  
  console.log('All component files found.');
  
  // Start the development server
  const serverProcess = startDevServer();
  
  // Wait for the server to start before opening the browser
  console.log('Waiting for development server to start...');
  setTimeout(() => {
    openPropertySellListPage();
    
    // Set up event handler for process termination
    process.on('SIGINT', () => {
      console.log('Stopping development server...');
      serverProcess.kill();
      console.log('Test completed.');
      process.exit(0);
    });
  }, 10000); // Wait 10 seconds for the server to start
}

// Run the test
runTest();
