/**
 * OTP Fix Test Script
 * 
 * This script tests the OTP functionality by making a request to the correct endpoint
 * (auth/request-otp) and displaying the response.
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:7000/api';
const EMAIL = 'test@example.com'; // Change this to your test email

async function testOtpRequest() {
    console.log('=================================================');
    console.log('  OTP Fix Test Script');
    console.log('=================================================');
    console.log(`Testing OTP request for email: ${EMAIL}`);
    
    try {
        // Make request to the correct endpoint
        console.log('\nSending request to auth/request-otp endpoint...');
        const response = await axios.post(`${API_BASE_URL}/auth/request-otp`, {
            email: EMAIL
        });
        
        console.log('\n✅ Request successful!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        // Check server logs for the OTP code
        console.log('\n⚠️ IMPORTANT: Check the server console logs for the OTP code.');
        console.log('Look for a message like:');
        console.log('==================================================');
        console.log('DEVELOPMENT OTP CODE: XXXXXX');
        console.log('==================================================');
        
    } catch (error) {
        console.log('\n❌ Request failed!');
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Status:', error.response.status);
            console.log('Response:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            // The request was made but no response was received
            console.log('No response received from server. Make sure the server is running.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error:', error.message);
        }
    }
}

// Run the test
testOtpRequest();
