const axios = require('axios');

async function updateAgent() {
  try {
    console.log('Attempting to login first to get authentication token...');
    
    // First login to get a token
    const loginResponse = await axios.post('http://localhost:7000/api/users/login', {
      email: "yohanb1212@gmail.com",  // Use the email of the agent we want to update
      password: "password123"          // Use what you believe is the password (modify as needed)
    });
    
    if (!loginResponse.data.token) {
      throw new Error('Login failed - no token received');
    }
    
    const token = loginResponse.data.token;
    console.log('Successfully logged in and got token');
    
    // Now update the agent with the token in the header
    const agentId = '6845436d504a2bf073a4a7e2';
    const updateResponse = await axios.put(`http://localhost:7000/api/users/${agentId}`, 
      {
        specialties: ['Buying', 'Selling', 'Residential'],
        languagesSpoken: ['Amharic', 'English'],
        averageRating: 4.5,
        region: 'Addis Ababa',
        isVerified: true
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Agent update response:', updateResponse.data);
    
    // Now test the agent list API
    console.log('\nTesting agent list API...');
    const agentsResponse = await axios.get('http://localhost:7000/api/agents/list');
    
    // Find our updated agent in the response
    const agents = agentsResponse.data?.data?.agents || [];
    const updatedAgent = agents.find(agent => agent._id === agentId);
    
    if (updatedAgent) {
      console.log('\nUpdated agent details:');
      console.log('ID:', updatedAgent._id);
      console.log('Name:', updatedAgent.firstName, updatedAgent.lastName);
      console.log('Specialties:', updatedAgent.specialties);
      console.log('Languages:', updatedAgent.languagesSpoken);
      console.log('Rating:', updatedAgent.averageRating);
      console.log('Verified:', updatedAgent.isVerified);
    } else {
      console.log('Could not find the updated agent in the response');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

updateAgent();
