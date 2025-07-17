const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:7000/api';
const TEST_EMAIL = 'jonegrow143@gmail.com';
const TEST_OTP = '377891'; // Use the latest OTP from the test
const PROVIDER = 'google';

// Test the social login verification endpoint
async function testSocialLoginVerification() {
  try {
    console.log(`Testing social login verification for email: ${TEST_EMAIL}`);
    
    const response = await axios.post(`${API_URL}/auth/verify-social-login`, {
      email: TEST_EMAIL,
      otp: TEST_OTP,
      provider: PROVIDER
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing social login verification:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    throw error;
  }
}

// Run the test
testSocialLoginVerification()
  .then(result => {
    console.log('Test completed successfully');
  })
  .catch(error => {
    console.error('Test failed');
    process.exit(1);
  });
