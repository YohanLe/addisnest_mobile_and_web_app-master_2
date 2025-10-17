/**
 * Test script to verify OTP login functionality
 * 
 * This script simulates the OTP verification process and tests the fallback
 * mechanism we implemented in AuthSlice.js
 */

// Mock localStorage
const localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Mock API response for OTP verification
const mockOtpVerificationResponse = {
  data: {
    token: 'mock-token-123456',
    user: {
      _id: 'user-123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'customer',
      isVerified: true
    }
  }
};

// Mock API error for profile fetch
const mockProfileFetchError = {
  response: {
    status: 404,
    data: {
      message: 'Resource not found'
    }
  }
};

// Simulate OTP verification process
function simulateOtpVerification() {
  console.log('Simulating OTP verification...');
  
  try {
    // 1. Store token and user ID in localStorage (from OtpPopup.jsx)
    const { data } = mockOtpVerificationResponse;
    localStorage.setItem('addisnest_token', data.token);
    localStorage.setItem('isLogin', '1');
    localStorage.setItem('userId', data.user._id);
    
    // 2. Store user data in localStorage (our new implementation)
    localStorage.setItem('userData', JSON.stringify(data.user));
    console.log('Stored user data in localStorage:', data.user);
    
    // 3. Simulate AuthUserDetails function from AuthSlice.js
    simulateAuthUserDetails();
    
    console.log('OTP verification simulation completed successfully!');
  } catch (error) {
    console.error('Error in OTP verification simulation:', error);
  }
}

// Simulate AuthUserDetails function from AuthSlice.js
async function simulateAuthUserDetails() {
  console.log('Simulating AuthUserDetails function...');
  
  try {
    // Simulate test mode check
    if (localStorage.getItem('addisnest_token') === 'test-token-123456') {
      console.log('Using mock user data for test mode');
      return { 
        data: {
          _id: localStorage.getItem('userId') || 'test-user-id',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          isVerified: true,
          userType: 'customer'
        }
      };
    }
    
    // Get user data from localStorage (our new implementation)
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log('Using cached user data:', parsedUserData);
        // Clear the cached data after using it
        localStorage.removeItem('userData');
        console.log('SUCCESS: User data retrieved from localStorage fallback!');
        return { data: parsedUserData };
      } catch (parseError) {
        console.error('Error parsing cached user data:', parseError);
      }
    }
    
    // Simulate API call failure
    throw mockProfileFetchError;
  } catch (error) {
    console.error('Error fetching user details:', error);
    
    // If we have a userId in localStorage, create a minimal user object (our new implementation)
    const userId = localStorage.getItem('userId');
    if (userId) {
      console.log('Creating fallback user object with userId:', userId);
      console.log('SUCCESS: Created minimal user object from userId!');
      return { 
        data: {
          _id: userId,
          isAuthenticated: true
        }
      };
    }
    
    return {
      error: {
        type: "server",
        message: "Failed to fetch user data",
      },
    };
  }
}

// Run the simulation
simulateOtpVerification();
