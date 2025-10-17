const axios = require('axios');

const API_BASE_URL = 'http://localhost:7001/api';  // Use the correct backend port

// Test cases
const testCases = [
  {
    description: 'Test unregistered email',
    payload: {
      email: 'nonexistent@example.com',
      password: 'anypassword123'
    },
    expectedMessage: 'Email not registered. Please check your email or sign up.'
  },
  {
    description: 'Test wrong password',
    payload: {
      email: 'test@example.com',  // This email should exist in your database
      password: 'wrongpassword123'
    },
    expectedMessage: 'Incorrect password. Please try again.'
  }
];

async function runTests() {
  console.log('='.repeat(50));
  console.log('TESTING LOGIN ERROR MESSAGES');
  console.log('='.repeat(50));
  console.log();

  for (const test of testCases) {
    console.log(`Test: ${test.description}`);
    console.log(`Payload: ${JSON.stringify(test.payload)}`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, test.payload);
      console.log('❌ Test failed - Login succeeded when it should fail');
      console.log(`Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.log(`Status: ${status}`);
        console.log(`Error Message: ${data.message || 'No message'}`);
        
        if (data.message && data.message.includes(test.expectedMessage)) {
          console.log('✅ Test passed - Received expected error message');
        } else {
          console.log(`❌ Test failed - Expected "${test.expectedMessage}" but got "${data.message || 'No message'}"`);
        }
      } else {
        console.log('❌ Test failed - No response from server');
        console.log(error.message);
      }
    }
    
    console.log('-'.repeat(50));
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
