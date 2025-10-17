const axios = require('axios');

// Test the message sending endpoint
async function testMessageSending() {
  try {
    console.log('Testing message sending endpoint...');
    
    const testData = {
      agentId: '507f1f77bcf86cd799439011', // Mock agent ID
      agentEmail: 'test-agent@example.com',
      agentName: 'Test Agent',
      senderName: 'John Doe',
      senderEmail: 'john.doe@example.com',
      message: 'This is a test message to verify the endpoint is working.',
      subject: 'Test Message'
    };

    console.log('Sending test data:', testData);

    const response = await axios.post('http://localhost:7002/api/messages/send-to-agent', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.data.success) {
      console.log('✅ Message sending test PASSED');
    } else {
      console.log('❌ Message sending test FAILED - success is false');
    }

  } catch (error) {
    console.error('❌ Message sending test FAILED with error:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running on port 7002?');
    }
  }
}

// Run the test
testMessageSending();
