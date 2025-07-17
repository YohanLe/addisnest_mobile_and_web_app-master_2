/**
 * User Login Test Script
 * 
 * This script tests the regular user login functionality by making a direct API call
 * to the login endpoint with the admin credentials.
 */

const axios = require('axios');

// Admin credentials
const adminCredentials = {
  email: 'admin@addisnest.com',
  password: 'Admin@123'
};

// API base URL
const API_BASE_URL = 'http://localhost:7000/api';

// Test user login
async function testUserLogin() {
  try {
    console.log('Testing user login with credentials:', adminCredentials);
    
    const response = await axios.post(`${API_BASE_URL}/users/login`, adminCredentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('User login successful!');
    console.log('Response:', response.data);
    
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
    
  } catch (error) {
    console.error('❌ User login failed!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testUserLogin();
