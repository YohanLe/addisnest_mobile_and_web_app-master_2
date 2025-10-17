const axios = require('axios');

// Test the API endpoint
async function testAgentAPI() {
  try {
    console.log('Testing agent list API...');
    
    console.log('Making request to http://localhost:7000/api/agents/list');
    const response = await axios.get('http://localhost:7000/api/agents/list');
    console.log('API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check agent count
    const agents = response.data?.data?.agents || [];
    console.log(`Total agents found: ${agents.length}`);
    
    // Log agent details if any exist
    if (agents.length > 0) {
      console.log('\nFirst agent details:');
      console.log('ID:', agents[0]._id);
      console.log('Name:', agents[0].firstName, agents[0].lastName);
      console.log('Role:', agents[0].role);
      console.log('Specialties:', agents[0].specialties);
      console.log('Languages:', agents[0].languagesSpoken);
      console.log('Rating:', agents[0].averageRating);
      console.log('Verified:', agents[0].isVerified);
    }
  } catch (error) {
    console.error('Error testing agent API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testAgentAPI();
