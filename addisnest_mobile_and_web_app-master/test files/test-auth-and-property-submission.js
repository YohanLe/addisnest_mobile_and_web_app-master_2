const axios = require('axios');

const API_BASE_URL = 'http://localhost:7000/api';
const VALID_EMAIL = 'test@example.com';
const VALID_PASSWORD = 'password123';

async function getAuthToken() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error('Authentication failed:', error.response ? error.response.data : error.message);
    throw new Error('Could not retrieve auth token.');
  }
}

async function testPropertySubmission() {
  try {
    const token = await getAuthToken();
    const propertyData = {
      title: 'Authenticated Test Property',
      description: 'This property was submitted with a valid auth token.',
      propertyType: 'House',
      offeringType: 'For Sale',
      furnishingStatus: 'Furnished',
      price: 5000000,
      area: 150,
      bedrooms: 3,
      bathrooms: 2,
      street: '123 Auth Street',
      city: 'Addis Ababa',
      state: 'Addis Ababa City Administration',
      regionalState: 'Addis Ababa City Administration',
      country: 'Ethiopia',
      ownerName: 'Authenticated User',
      images: [{ url: 'https://example.com/auth-test.jpg' }],
      amenities: ['parking-space'],
      promotionType: 'Basic',
    };

    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      console.log('SUCCESS: Property submitted successfully with authentication.');
      console.log('Test PASSED.');
    } else {
      console.error('ERROR: API responded with success:false despite authentication.');
      console.log('Test FAILED.');
    }
  } catch (error) {
    console.error('Test FAILED:', error.response ? error.response.data : error.message);
  }
}

testPropertySubmission();
