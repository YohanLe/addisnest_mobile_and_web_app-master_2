const axios = require('axios');

// Define the base URL for the API
const API_BASE_URL = 'http://localhost:7000/api';

// Mock authentication token (replace with a valid token for testing)
const MOCK_AUTH_TOKEN = 'your_mock_auth_token';
const MOCK_USER_ID = 'your_mock_user_id';

// Function to simulate the API call to post property data
async function testPropertySubmission() {
  // Define a sample property payload with a valid furnishingStatus
  const propertyData = {
    title: 'Test Property with Valid Furnishing Status',
    description: 'This is a test property to validate the furnishingStatus fix.',
    propertyType: 'House',
    offeringType: 'For Sale',
    furnishingStatus: 'Furnished', // Using a valid enum value
    price: 5000000,
    area: 150,
    bedrooms: 3,
    bathrooms: 2,
    street: '123 Test Street',
    city: 'Addis Ababa',
    state: 'Addis Ababa City Administration',
    regionalState: 'Addis Ababa City Administration',
    country: 'Ethiopia',
    owner: MOCK_USER_ID,
    ownerName: 'Test User',
    images: [{ url: 'https://example.com/test.jpg' }],
    amenities: ['parking-space'],
    promotionType: 'Basic',
  };

  try {
    console.log('Attempting to post property data with payload:');
    console.log(JSON.stringify(propertyData, null, 2));

    // Simulate the API post request to the properties endpoint
    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
      headers: {
        'Authorization': `Bearer ${MOCK_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('API Response:', response.data);

    // Check if the success field is true in the response
    if (response.data.success) {
      console.log('SUCCESS: The property was submitted successfully.');
      console.log('Test PASSED: The application correctly handles valid furnishingStatus values.');
    } else {
      console.error('ERROR: The API responded with success:false.');
      console.log('Test FAILED: The furnishingStatus fix may not be effective.');
    }
  } catch (error) {
    // Handle specific error responses
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error(`Test FAILED: The API returned a status code of ${error.response.status}.`);
      if (error.response.data.error.includes('furnishingStatus')) {
        console.error('The error is still related to `furnishingStatus`. The fix was not effective.');
      } else {
        console.error('The error is not related to `furnishingStatus`, but another issue occurred.');
      }
    } else {
      console.error('An unexpected error occurred during the test:', error.message);
      console.error('Test FAILED: The API could not be reached or another issue occurred.');
    }
  }
}

// Run the test
testPropertySubmission();
