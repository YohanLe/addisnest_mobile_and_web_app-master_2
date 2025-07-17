const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:7000/api';
const ACTUAL_EMAIL = 'addisnest123@gmail.com';

// Test the OTP request endpoint with the actual email
async function testOtpRequestActual() {
  try {
    console.log(`Testing OTP request for actual email: ${ACTUAL_EMAIL}`);
    
    const response = await axios.post(`${API_URL}/auth/request-otp`, {
      email: ACTUAL_EMAIL
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data && response.data.otp) {
      console.log('✅ OTP received in development mode:', response.data.otp);
    } else {
      console.log('✅ OTP request successful, but OTP not included in response (expected in production mode)');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing OTP request:');
    
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
testOtpRequestActual()
  .then(result => {
    console.log('Test completed successfully');
  })
  .catch(error => {
    console.error('Test failed');
    process.exit(1);
  });
