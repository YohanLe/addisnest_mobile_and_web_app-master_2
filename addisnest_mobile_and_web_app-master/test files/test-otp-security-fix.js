const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:7000/api';
const TEST_EMAIL = 'jonegrow143@gmail.com';
const INCORRECT_OTP = '111111'; // Deliberately incorrect OTP
const PROVIDER = 'google';

// Test the social login verification with incorrect OTP
async function testSocialLoginSecurity() {
  try {
    console.log(`Testing social login security with incorrect OTP for email: ${TEST_EMAIL}`);
    
    // First, request a new OTP to ensure there's a valid record in the database
    console.log('Requesting a new OTP...');
    const otpResponse = await axios.post(`${API_URL}/auth/request-otp`, {
      email: TEST_EMAIL,
      provider: PROVIDER
    });
    
    console.log('OTP request response:', otpResponse.data);
    console.log('Correct OTP (for reference only):', otpResponse.data.otp);
    
    // Now try to verify with an incorrect OTP
    console.log(`Attempting to verify with incorrect OTP: ${INCORRECT_OTP}`);
    try {
      const response = await axios.post(`${API_URL}/auth/verify-social-login`, {
        email: TEST_EMAIL,
        otp: INCORRECT_OTP,
        provider: PROVIDER
      });
      
      // If we get here, the verification succeeded (which is a security issue)
      console.error('❌ SECURITY ISSUE: Verification succeeded with incorrect OTP!');
      console.error('Response status:', response.status);
      console.error('Response data:', response.data);
      
      return false;
    } catch (error) {
      // We expect an error here (401 or 500 with "Invalid OTP")
      if (error.response) {
        console.log('Verification with incorrect OTP failed as expected.');
        console.log('Status:', error.response.status);
        console.log('Error message:', error.response.data.error || 'Unknown error');
        
        // Check if the error message indicates invalid OTP
        const errorMessage = error.response.data.error || '';
        if (errorMessage.includes('Invalid OTP') || error.response.status === 401) {
          console.log('✅ Security check passed: Incorrect OTP was properly rejected');
          return true;
        } else {
          console.warn('⚠️ Unexpected error message. Expected "Invalid OTP" but got:', errorMessage);
          return false;
        }
      } else {
        console.error('❌ Unexpected error:', error.message);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Error in security test:', error);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    return false;
  }
}

// Run the test
testSocialLoginSecurity()
  .then(result => {
    if (result) {
      console.log('🔒 Security test completed successfully. The system correctly rejects incorrect OTPs.');
      process.exit(0);
    } else {
      console.error('🔓 Security test failed. The system may still have vulnerabilities.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Test failed with unexpected error:', error);
    process.exit(1);
  });
