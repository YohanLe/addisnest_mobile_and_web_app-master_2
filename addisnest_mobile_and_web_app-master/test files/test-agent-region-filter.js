// Script to test the agent filtering by region
// Run with: node test-agent-region-filter.js

require('dotenv').config();
const axios = require('axios');

// API base URL
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5173/api';

async function testAgentRegionFilter() {
  try {
    console.log('Testing agent filtering by region...');
    
    // Test region to filter by
    const testRegion = 'addis-ababa-city-administration';
    
    // Fetch agents with region filter
    console.log(`Fetching agents with region filter: ${testRegion}`);
    const response = await axios.get(`${baseUrl}/agents/list?region=${testRegion}`);
    
    const { data } = response.data;
    const { agents, totalCount } = data;
    
    console.log(`Found ${totalCount} agents matching region: ${testRegion}`);
    
    if (agents.length === 0) {
      console.log('❌ TEST FAILED: No agents found with this region filter');
    } else {
      console.log('✅ TEST PASSED: Found agents with this region filter');
      
      // Check if our test agent is in the results
      const testAgent = agents.find(agent => agent.email === 'test.agent@addisnest.com');
      
      if (testAgent) {
        console.log('✅ TEST PASSED: Test agent was found in the results');
        console.log('Test agent details:', {
          name: `${testAgent.firstName} ${testAgent.lastName}`,
          email: testAgent.email,
          region: testAgent.region || (testAgent.address && testAgent.address.state)
        });
      } else {
        console.log('❌ TEST FAILED: Test agent was not found in the results');
      }
    }
    
    console.log('\nTest completed.');
  } catch (error) {
    console.error('Error testing agent region filter:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testAgentRegionFilter();
