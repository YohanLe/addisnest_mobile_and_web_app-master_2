const axios = require('axios');

// Test basic server connectivity
async function testServerStatus() {
  try {
    console.log('Testing server status...');
    
    // Test base endpoint
    const response = await axios.get('http://localhost:7002/', {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Base endpoint response status:', response.status);
    console.log('Base endpoint response data:', response.data);

    // Test if /api prefix works
    try {
      const apiResponse = await axios.get('http://localhost:7002/api/', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('API endpoint response status:', apiResponse.status);
      console.log('API endpoint response data:', apiResponse.data);
    } catch (apiError) {
      console.log('API endpoint error:', apiError.response?.status, apiError.response?.data);
    }

    // Test messages endpoint
    try {
      const messagesResponse = await axios.get('http://localhost:7002/api/messages', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Messages endpoint response status:', messagesResponse.status);
    } catch (messagesError) {
      console.log('Messages endpoint error:', messagesError.response?.status, messagesError.message);
    }

  } catch (error) {
    console.error('Server test failed:');
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
testServerStatus();
