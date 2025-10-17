/**
 * Test script to verify social login OTP functionality
 * 
 * This script simulates the social login OTP verification process
 * for both Google and Apple login methods.
 */

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:7000/api';
const TEST_EMAIL = 'social-test@example.com';

// Test social login with Google
async function testGoogleLogin() {
  try {
    console.log('=== Testing Google Social Login ===');
    console.log(`Testing social login for email: ${TEST_EMAIL}`);
    
    // Step 1: Simulate social login request
    console.log('Step 1: Sending social-login request for Google...');
    const socialLoginResponse = await axios.post(`${API_URL}/auth/social-login`, {
      provider: 'google',
      email: TEST_EMAIL,
      socialId: 'google-test-id-' + Date.now(),
      firstName: 'Google',
      lastName: 'User'
    });
    
    console.log('Social login response status:', socialLoginResponse.status);
    console.log('Social login response data:', socialLoginResponse.data);
    
    // Check if OTP was generated
    if (socialLoginResponse.data && socialLoginResponse.data.otp) {
      console.log('✅ OTP received in development mode:', socialLoginResponse.data.otp);
      
      // Step 2: Verify the OTP
      console.log('Step 2: Verifying OTP for Google login...');
      const verifyResponse = await axios.post(`${API_URL}/auth/verify-social-login`, {
        email: TEST_EMAIL,
        otp: socialLoginResponse.data.otp,
        provider: 'google'
      });
      
      console.log('OTP verification response status:', verifyResponse.status);
      console.log('OTP verification response data:', verifyResponse.data);
      
      if (verifyResponse.data && verifyResponse.data.token) {
        console.log('✅ Google login OTP verification successful!');
        console.log('Token received:', verifyResponse.data.token);
        return true;
      } else {
        console.error('❌ Google login OTP verification failed: No token received');
        return false;
      }
    } else {
      console.log('⚠️ OTP not included in response (expected in production mode)');
      console.log('Cannot proceed with verification test without OTP');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing Google social login:');
    
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

// Test social login with Apple
async function testAppleLogin() {
  try {
    console.log('\n=== Testing Apple Social Login ===');
    console.log(`Testing social login for email: ${TEST_EMAIL}`);
    
    // Step 1: Simulate social login request
    console.log('Step 1: Sending social-login request for Apple...');
    const socialLoginResponse = await axios.post(`${API_URL}/auth/social-login`, {
      provider: 'apple',
      email: TEST_EMAIL,
      socialId: 'apple-test-id-' + Date.now(),
      firstName: 'Apple',
      lastName: 'User'
    });
    
    console.log('Social login response status:', socialLoginResponse.status);
    console.log('Social login response data:', socialLoginResponse.data);
    
    // Check if OTP was generated
    if (socialLoginResponse.data && socialLoginResponse.data.otp) {
      console.log('✅ OTP received in development mode:', socialLoginResponse.data.otp);
      
      // Step 2: Verify the OTP
      console.log('Step 2: Verifying OTP for Apple login...');
      const verifyResponse = await axios.post(`${API_URL}/auth/verify-social-login`, {
        email: TEST_EMAIL,
        otp: socialLoginResponse.data.otp,
        provider: 'apple'
      });
      
      console.log('OTP verification response status:', verifyResponse.status);
      console.log('OTP verification response data:', verifyResponse.data);
      
      if (verifyResponse.data && verifyResponse.data.token) {
        console.log('✅ Apple login OTP verification successful!');
        console.log('Token received:', verifyResponse.data.token);
        return true;
      } else {
        console.error('❌ Apple login OTP verification failed: No token received');
        return false;
      }
    } else {
      console.log('⚠️ OTP not included in response (expected in production mode)');
      console.log('Cannot proceed with verification test without OTP');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing Apple social login:');
    
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

// Run the tests
async function runTests() {
  console.log('Starting social login OTP verification tests...');
  
  const googleResult = await testGoogleLogin();
  const appleResult = await testAppleLogin();
  
  console.log('\n=== Test Results ===');
  console.log('Google Login Test:', googleResult ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Apple Login Test:', appleResult ? 'PASSED ✅' : 'FAILED ❌');
  
  if (googleResult && appleResult) {
    console.log('\n✅ All social login OTP tests passed successfully!');
    return 0;
  } else {
    console.error('\n❌ Some social login OTP tests failed');
    return 1;
  }
}

// Run the tests
runTests()
  .then(exitCode => {
    console.log(`\nTests completed with exit code: ${exitCode}`);
    process.exit(exitCode);
  })
  .catch(error => {
    console.error('Unexpected error running tests:', error);
    process.exit(1);
  });
