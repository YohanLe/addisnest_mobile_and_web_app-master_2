const axios = require('axios');

async function registerUser() {
  try {
    console.log('Attempting to register a test user...');
    
    const userData = {
      email: `test-user-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      password: 'Password123',
      role: 'customer',
      isVerified: true
    };
    
    console.log(`Using test email: ${userData.email}`);
    
    const response = await axios.post('http://localhost:7000/api/users/register', userData);
    
    console.log('Registration response status:', response.status);
    console.log('Registration response data:', response.data);
    
    if (response.status === 200 || response.status === 201) {
      console.log('\n✅ User registration SUCCESSFUL!');
      
      if (response.data && response.data._id) {
        console.log(`User ID: ${response.data._id}`);
      }
    } else {
      console.log('\n❌ User registration FAILED!');
    }
  } catch (error) {
    console.error('\n❌ Error registering user:');
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

registerUser();
