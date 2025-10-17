/**
 * Admin Login Test Script (Updated)
 * 
 * This script tests the admin login functionality by making a direct API call
 * to the admin-login endpoint with the default admin credentials.
 */

const axios = require('axios');

// Admin credentials
const adminCredentials = {
  email: 'admin@addisnest.com',
  password: 'Admin@123'
};

// API base URL
const API_BASE_URL = 'http://localhost:7000/api';

// Test admin login
async function testAdminLogin() {
  try {
    console.log('Testing admin login with credentials:', adminCredentials);
    
    // First try the users/login endpoint (which we know works)
    console.log('\nTrying regular login endpoint (users/login):');
    const regularLoginResponse = await axios.post(`${API_BASE_URL}/users/login`, adminCredentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Regular login successful!');
    console.log('Response:', regularLoginResponse.data);
    
    // Now try the auth/admin-login endpoint
    console.log('\nTrying admin login endpoint (auth/admin-login):');
    try {
      const adminLoginResponse = await axios.post(`${API_BASE_URL}/auth/admin-login`, adminCredentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin login successful!');
      console.log('Response:', adminLoginResponse.data);
    } catch (error) {
      console.error('❌ Admin login failed!');
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      
      // Suggest a solution
      console.log('\nSuggested solution:');
      console.log('The auth/admin-login endpoint is not properly configured. You can:');
      console.log('1. Use the regular login endpoint (users/login) for admin login');
      console.log('2. Fix the auth routes configuration in the server');
    }
    
  } catch (error) {
    console.error('❌ All login attempts failed!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testAdminLogin();
