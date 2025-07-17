import axios from 'axios';
import { getToken } from '../utils/tokenHandler';
import propertyApi from '../utils/netlifyApiHandler';

// Function to add an access token to the headers
export const addAccessToken = (token) => {
  if (token) {
    // Store the token for axios interceptors to use
    localStorage.setItem('addisnest_token', token);
    return true;
  }
  return false;
};

// Helper method to check authentication status
export const checkAuthStatus = () => {
  const token = getToken();
  const isLogin = localStorage.getItem('isLogin') === '1';
  
  return {
    isAuthenticated: !!token && isLogin,
    token,
  };
};

// Configure base URL for all API requests
const API_BASE_URL = 'http://localhost:7001/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with an error status
      const status = error.response.status;
      
      // Special handling for payment history endpoint - silently handle 401 errors
      if (status === 401 && error.config && error.config.url && 
         (error.config.url.includes('/payments/history') || error.config.url.includes('/api/payments'))) {
        // For payment-related endpoints, don't log 401 errors - handle silently
        // This prevents console errors when users aren't logged in
        return Promise.reject(error);
      }
      
      if (status === 401) {
        // Handle unauthorized access
        console.log('Unauthorized access - redirecting to login');
        // You could dispatch a logout action here
      } else if (status === 403) {
        // Handle forbidden access
        console.log('Forbidden access');
      } else if (status === 404) {
        // Handle not found
        console.log('Resource not found');
      } else if (status === 500) {
        // Handle server errors
        console.log('Server error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.log('No response received from server');
    } else {
      // Error in setting up the request
      console.log('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add method for public GET requests (no auth)
api.getPublic = async (endpoint) => {
  try {
    // Create a new axios instance without auth interceptors
    const response = await axios.get(`${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': undefined,
      },
      // No timestamp needed, caching is handled by the browser
    });
    
    return response;
  } catch (error) {
    console.error(`Error in getPublic for ${endpoint}:`, error);
    throw error;
  }
};

// Add convenience method for authenticated GET requests
api.getWithtoken = async (endpoint) => {
  try {
    const token = getToken();
    
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error in getWithtoken for ${endpoint}:`, error);
    throw error;
  }
};

// Legacy method name for compatibility
api.getWithAuth = async (endpoint) => {
  try {
    const { isAuthenticated, token } = checkAuthStatus();
    
    if (!isAuthenticated) {
      console.warn('Attempting authenticated request without valid auth');
    }
    
    const response = await api.get(endpoint, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error in getWithAuth for ${endpoint}:`, error);
    throw error;
  }
};

// Add methods for authenticated API operations
api.postWithtoken = async (endpoint, data) => {
  try {
    // Special handling for properties endpoint
    if (endpoint === 'properties') {
      console.log('Using propertyApi.postProperty for properties endpoint');
      try {
        return await propertyApi.postProperty(data);
      } catch (propertyError) {
        console.error('Error in postWithtoken for properties:', propertyError);
        throw propertyError;
      }
    }
    
    // Regular handling for other endpoints
    const token = getToken();
    
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error in postWithtoken for ${endpoint}:`, error);
    throw error;
  }
};

api.putWithtoken = async (endpoint, data) => {
  try {
    const token = getToken();
    
    const response = await axios.put(`${API_BASE_URL}/${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error in putWithtoken for ${endpoint}:`, error);
    throw error;
  }
};

api.deleteWithtoken = async (endpoint) => {
  try {
    const token = getToken();
    
    const response = await axios.delete(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error in deleteWithtoken for ${endpoint}:`, error);
    throw error;
  }
};

// Add method for uploading files with authentication
api.postFileWithtoken = async (endpoint, formData) => {
  try {
    const token = getToken();
    
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error uploading files to ${endpoint}:`, error);
    throw error;
  }
};

export default api;
