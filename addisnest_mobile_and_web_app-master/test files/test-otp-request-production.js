const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:7000/api';
const TEST_EMAIL = 'addisnest123@gmail.com';

// Test the OTP request endpoint with production mode
async function testOtpRequestProduction() {
  try {
    console.log(`Testing OTP request for email: ${TEST_EMAIL}`);
    console.log(`Sending request to: ${API_URL}/auth/request-otp`);
    
    const startTime = Date.now();
    console.log(`Request started at: ${new Date(startTime).toISOString()}`);
    
    // Set NODE_ENV to production for this test
    process.env.NODE_ENV = 'production';
    
    const response = await axios.post(`${API_URL}/auth/request-otp`, {
      email: TEST_EMAIL
    }, {
      timeout: 30000 // 30 second timeout for production test
    });
    
    const endTime = Date.now();
    console.log(`Request completed at: ${new Date(endTime).toISOString()}`);
    console.log(`Request took ${endTime - startTime}ms to complete`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.message) {
      console.log('✅ Response message:', response.data.message);
    } else {
      console.log('❓ Unexpected response format');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing OTP request:');
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out after 30 seconds');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    throw error;
  }
}

// Run the test
testOtpRequestProduction()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed');
    process.exit(1);
  });
