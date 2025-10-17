const axios = require('axios');

async function updateAgent() {
  try {
    console.log('Updating agent via HTTP request...');
    
    const agentId = '6845436d504a2bf073a4a7e2'; // Yohan's agent ID
    const response = await axios.put(`http://localhost:7000/api/users/${agentId}`, {
      specialties: ['Buying', 'Selling', 'Residential'],
      languagesSpoken: ['Amharic', 'English'],
      averageRating: 4.5,
      region: 'Addis Ababa',
      isVerified: true
    });
    
    console.log('Agent update response:', response.data);
    
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
    console.error('Error updating agent:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

updateAgent();
