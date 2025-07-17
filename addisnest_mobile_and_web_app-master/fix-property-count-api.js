/**
 * Property Count API Fix
 * 
 * This script fixes the issue with the /api/properties/count endpoint returning a 500 error.
 * The problem is that the route order in server.js is incorrect, causing the "count" to be
 * treated as a MongoDB ID in the getPropertyById method.
 * 
 * This script modifies the server.js file to change the order of route registration.
 */

const fs = require('fs');
const path = require('path');

// Path to the server.js file
const serverFilePath = path.join(__dirname, 'src', 'server.js');

// Read the server.js file
console.log('Reading server.js file...');
let serverContent = fs.readFileSync(serverFilePath, 'utf8');

// Create a backup of the original file
const backupPath = path.join(__dirname, 'src', 'server.js.bak');
fs.writeFileSync(backupPath, serverContent);
console.log(`Created backup at ${backupPath}`);

// Check if the routes are in the wrong order using a more flexible approach
const propertiesRoutePattern = /app\.use\(['"]\/api\/properties['"]\s*,\s*routes\.propertyRoutes\)/;
const countRoutePattern = /app\.use\(['"]\/api\/properties\/count['"]\s*,\s*routes\.propertyCountRoutes\)/;

// Find the positions of both route registrations
const propertiesRouteMatch = propertiesRoutePattern.exec(serverContent);
const countRouteMatch = countRoutePattern.exec(serverContent);

if (propertiesRouteMatch && countRouteMatch) {
  const propertiesRoutePos = propertiesRouteMatch.index;
  const countRoutePos = countRouteMatch.index;
  
  console.log(`Found properties route at position ${propertiesRoutePos}`);
  console.log(`Found count route at position ${countRoutePos}`);
  
  if (propertiesRoutePos < countRoutePos) {
    console.log('Routes are in the wrong order. Fixing...');
    
    // Extract the route registration lines
    const propertiesRouteLine = serverContent.substring(
      serverContent.lastIndexOf('\n', propertiesRoutePos) + 1,
      serverContent.indexOf('\n', propertiesRoutePos)
    );
    
    const countRouteLine = serverContent.substring(
      serverContent.lastIndexOf('\n', countRoutePos) + 1,
      serverContent.indexOf('\n', countRoutePos)
    );
    
    console.log('Properties route line:', propertiesRouteLine);
    console.log('Count route line:', countRouteLine);
    
    // Remove the count route line
    serverContent = serverContent.replace(countRouteLine + '\n', '');
    
    // Insert the count route line before the properties route line
    serverContent = serverContent.replace(
      propertiesRouteLine,
      countRouteLine + '\n' + propertiesRouteLine
    );
    
    // Write the modified content back to the file
    fs.writeFileSync(serverFilePath, serverContent);
    console.log('Fixed route order in server.js');
    console.log('Now restart the server for the changes to take effect.');
  } else {
    console.log('Routes are already in the correct order.');
  }
} else {
  console.log('Could not find one or both route registration patterns in server.js.');
  if (!propertiesRouteMatch) {
    console.log('Could not find the properties route registration.');
  }
  if (!countRouteMatch) {
    console.log('Could not find the count route registration.');
  }
  console.log('Please check the server.js file manually and ensure that the /api/properties/count route is registered before the /api/properties route.');
}
