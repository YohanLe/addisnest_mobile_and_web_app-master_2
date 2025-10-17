/**
 * Admin Login Test Script
 * 
 * This script tests the admin login functionality by making direct API calls
 * to different possible admin-login endpoints with the default admin credentials.
 */

const axios = require('axios');

// Admin credentials
const adminCredentials = {
  email: 'admin@addisnest.com',
  password: 'Admin@123'
};

// API base URLs to try
const API_BASE_URLS = [
  'http://localhost:7000/api',
  'http://localhost:5000/api',
  'http://localhost:3000/api',
  'http://localhost:5186/api'
];

// Endpoints to try
const ENDPOINTS = [
  '/auth/admin-login',
  '/users/admin-login',
  '/admin-login'
];

// Test admin login with all combinations
async function testAdminLogin() {
  console.log('Testing admin login with credentials:', adminCredentials);
  
  for (const baseUrl of API_BASE_URLS) {
    for (const endpoint of ENDPOINTS) {
      const fullUrl = `${baseUrl}${endpoint}`;
      
      try {
        console.log(`\nTrying endpoint: ${fullUrl}`);
        
        const response = await axios.post(fullUrl, adminCredentials, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        });
        
        console.log('✅ SUCCESS! Admin login successful at:', fullUrl);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        // Check if user has admin role
        if (response.data.role === 'admin') {
          console.log('✅ User has admin role');
        } else {
          console.log('❌ User does not have admin role:', response.data.role);
        }
        
        // Check if token is present
        if (response.data.token) {
          console.log('✅ Token received');
        } else {
          console.log('❌ No token received');
        }
        
        return; // Exit after first successful login
        
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log(`❌ Connection refused at ${fullUrl} - server not running on this port`);
        } else if (error.code === 'ETIMEDOUT') {
          console.log(`❌ Connection timed out at ${fullUrl}`);
        } else if (error.response) {
          console.log(`❌ Failed with status ${error.response.status} at ${fullUrl}`);
          if (error.response.data) {
            console.log('Error response:', error.response.data);
          }
        } else {
          console.log(`❌ Failed at ${fullUrl}:`, error.message);
        }
      }
    }
  }
  
  console.log('\n❌ All endpoints failed. The server might not be running or the admin login endpoint is not configured correctly.');
}

// Run the test
testAdminLogin();
