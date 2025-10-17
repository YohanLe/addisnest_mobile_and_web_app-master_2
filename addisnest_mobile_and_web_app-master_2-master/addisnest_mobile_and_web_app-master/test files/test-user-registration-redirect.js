/**
 * Test script to verify the user registration redirect functionality
 * 
 * This script tests the scenario where a user tries to register with an email
 * that already exists in the system. The expected behavior is that they should
 * be redirected to the login page with a message indicating they already have an account.
 */

const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.VITE_BASEURL || 'http://localhost:5000/api/';

// Test user data
const testUser = {
  email: 'test-redirect@addisnest.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'Test@123',
  role: 'customer'
};

// Function to create a test user if it doesn't exist
async function createTestUserIfNotExists() {
  try {
    console.log('Checking if test user exists...');
    const checkResponse = await axios.get(`${API_URL}auth/check-user?email=${testUser.email}`);
    
    if (checkResponse.data && checkResponse.data.exists) {
      console.log('✅ Test user already exists, ready for testing redirect');
      return true;
    } else {
      console.log('Creating test user for redirect testing...');
      const createResponse = await axios.post(`${API_URL}auth/register`, testUser);
      
      if (createResponse.data) {
        console.log('✅ Test user created successfully');
        return true;
      } else {
        console.error('❌ Failed to create test user');
        return false;
      }
    }
  } catch (error) {
    console.error('Error creating/checking test user:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Function to test the OTP request for an existing user
async function testOtpRequestForExistingUser() {
  try {
    console.log('Testing OTP request for existing user...');
    console.log('This should trigger the redirect flow in the frontend');
    
    const response = await axios.post(`${API_URL}auth/request-otp`, {
      email: testUser.email
    });
    
    console.log('OTP request response:', response.data);
    
    if (response.data && response.data.otp) {
      console.log('==================================================');
      console.log(`DEVELOPMENT OTP CODE: ${response.data.otp}`);
      console.log('==================================================');
      console.log('✅ OTP generated successfully');
      console.log('');
      console.log('TESTING INSTRUCTIONS:');
      console.log('1. Open the registration form in the frontend');
      console.log('2. Enter the email:', testUser.email);
      console.log('3. Fill in other required fields and submit');
      console.log('4. When the OTP popup appears, enter the OTP code shown above');
      console.log('5. Verify that you are redirected to the login page with a message');
      console.log('   indicating you already have an account');
      return true;
    } else {
      console.log('⚠️ OTP not found in response (this is expected in production mode)');
      console.log('');
      console.log('TESTING INSTRUCTIONS:');
      console.log('1. Open the registration form in the frontend');
      console.log('2. Enter the email:', testUser.email);
      console.log('3. Fill in other required fields and submit');
      console.log('4. When the OTP popup appears, check your email for the OTP code');
      console.log('5. Enter the OTP code and verify that you are redirected to the login page');
      console.log('   with a message indicating you already have an account');
      return true;
    }
  } catch (error) {
    console.error('Error testing OTP request:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Main test function
async function runTest() {
  console.log('=== TESTING USER REGISTRATION REDIRECT ===');
  
  // First ensure we have a test user in the database
  const userCreated = await createTestUserIfNotExists();
  if (!userCreated) {
    console.error('❌ Failed to create/verify test user. Aborting test.');
    return;
  }
  
  // Now test the OTP request flow
  const testResult = await testOtpRequestForExistingUser();
  if (testResult) {
    console.log('✅ Test setup completed successfully');
    console.log('Follow the instructions above to complete the manual verification');
  } else {
    console.error('❌ Test failed');
  }
}

// Run the test
runTest();
