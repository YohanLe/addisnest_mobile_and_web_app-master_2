/**
 * Test script for MongoDB ID property lookup fix
 * 
 * This script tests that properties can be fetched using MongoDB IDs
 * without authentication errors.
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const CONFIG = {
  // Server API URL
  apiUrl: 'http://localhost:7000/api',
  // Test property IDs
  testPropertyIds: [
    '684a5fb17cb3172bbb3c75d7',
    '684a57857cb3172bbb3c73d9'
  ],
  // Test endpoints
  endpoints: [
    '/properties/mongo-id/',  // MongoDB ID endpoint
    '/properties/',           // Standard endpoint
    '/properties/direct-db-query/'  // Direct DB query endpoint
  ]
};

// Helper for colored console output
function log(message, color = 'white') {
  console.log(colors[color](message));
}

// Make a GET request to the API
async function testEndpoint(endpoint, propertyId) {
  const url = `${CONFIG.apiUrl}${endpoint}${propertyId}`;
  log(`Testing endpoint: ${url}`, 'cyan');
  
  try {
    const response = await axios.get(url);
    log(`✓ Success! Status: ${response.status}`, 'green');
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    log(`✗ Error! Status: ${error.response?.status || 'Unknown'}`, 'red');
    log(`Error message: ${error.message}`, 'red');
    
    return {
      success: false,
      status: error.response?.status || 500,
      error: error.message,
      details: error.response?.data || {}
    };
  }
}

// Test all endpoints for a property ID
async function testPropertyId(propertyId) {
  log(`\n=== Testing property ID: ${propertyId} ===`, 'yellow');
  
  const results = [];
  
  for (const endpoint of CONFIG.endpoints) {
    const result = await testEndpoint(endpoint, propertyId);
    results.push({
      endpoint,
      ...result
    });
  }
  
  return results;
}

// Test summary
function printSummary(results) {
  log('\n=== Test Summary ===', 'magenta');
  
  const successCount = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  log(`Successful tests: ${successCount}/${totalTests}`, successCount === totalTests ? 'green' : 'yellow');
  
  // Group by property ID
  const byPropertyId = {};
  
  for (const result of results) {
    const propertyId = result.propertyId;
    
    if (!byPropertyId[propertyId]) {
      byPropertyId[propertyId] = [];
    }
    
    byPropertyId[propertyId].push(result);
  }
  
  // Print results by property ID
  for (const [propertyId, propertyResults] of Object.entries(byPropertyId)) {
    log(`\nProperty ID: ${propertyId}`, 'cyan');
    
    for (const result of propertyResults) {
      const statusColor = result.success ? 'green' : 'red';
      const symbol = result.success ? '✓' : '✗';
      
      log(`  ${symbol} ${result.endpoint}${propertyId} - Status: ${result.status}`, statusColor);
    }
  }
  
  // Overall result
  if (successCount === totalTests) {
    log('\n✓ All tests passed! The MongoDB ID property lookup fix is working correctly.', 'green');
  } else {
    log('\n✗ Some tests failed. Please check the results above.', 'red');
  }
}

// Main function
async function main() {
  log('\n=======================================================', 'magenta');
  log('   MongoDB ID Property Lookup Fix - Test Script', 'magenta');
  log('=======================================================\n', 'magenta');
  
  try {
    // Test API connection
    log('Testing API connection...', 'cyan');
    try {
      const response = await axios.get(`${CONFIG.apiUrl}/test-public`);
      log(`✓ API connection successful! Response: ${JSON.stringify(response.data)}`, 'green');
    } catch (error) {
      log('✗ API connection failed!', 'red');
      log(`Error: ${error.message}`, 'red');
      log('\nPlease make sure the server is running with the MongoDB ID fix enabled:', 'yellow');
      log('  1. Run "start-app-with-mongo-id-fix.bat"', 'yellow');
      log('  2. Or manually start the server with "node src/server-with-mongo-id-fix.js"', 'yellow');
      process.exit(1);
    }
    
    // Test property IDs
    const allResults = [];
    
    for (const propertyId of CONFIG.testPropertyIds) {
      const results = await testPropertyId(propertyId);
      
      for (const result of results) {
        allResults.push({
          propertyId,
          ...result
        });
      }
    }
    
    // Print summary
    printSummary(allResults);
    
  } catch (error) {
    log(`\nUnexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
