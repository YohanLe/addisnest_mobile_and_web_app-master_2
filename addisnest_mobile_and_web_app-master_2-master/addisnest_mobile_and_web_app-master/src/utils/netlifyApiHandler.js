import axios from 'axios';
import { getToken } from './tokenHandler';

// Determine the environment
const isNetlify = import.meta.env.VITE_API_BASE_URL && 
                  import.meta.env.VITE_API_BASE_URL.includes('.netlify.app');

// Set base URLs for different environments

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// For Netlify, we'll use the simplified paths that will be redirected via _redirects
const NETLIFY_BASE_URL = isNetlify ? import.meta.env.VITE_API_BASE_URL.replace('/.netlify/functions/api', '') : '';

// Debug logs removed for security

// Function to determine the correct API endpoint for different resource types
const getEndpointUrl = (resourceType, endpoint) => {
  // If we're in a Netlify environment, use the simplified paths that will be redirected
  if (isNetlify) {
    // Special handling for properties endpoints in Netlify
    if (resourceType === 'properties') {
      return `${NETLIFY_BASE_URL}/properties${endpoint ? `/${endpoint}` : ''}`;
    }
    
    // For all other API endpoints in Netlify, use the api path
    return `${NETLIFY_BASE_URL}/api/${resourceType}${endpoint ? `/${endpoint}` : ''}`;
  } 
  
  // For local development, use the standard API routes with /api prefix
  return `${API_BASE_URL}/api/${resourceType}${endpoint ? `/${endpoint}` : ''}`;
};

// Helper function for making GET requests to properties endpoints
export const getProperties = async (queryParams = {}) => {
  try {
    const url = getEndpointUrl('properties');
    
    // Ensure we always filter for active properties unless explicitly requesting all
    if (!queryParams.status && !queryParams.admin) {
      queryParams.status = 'active';
    }
    
    
    const response = await axios.get(url, { params: queryParams });
    
    // Handle different response formats between local and Netlify environments
    if (!isNetlify) {
      // For local development, the API might return data in a different format
      // Check if we need to restructure the response to match expected format
      if (response.data && !response.data.success && !response.data.data) {
        // Format response to match the expected structure for the Redux store
        return {
          success: true,
          count: response.data.length || 0,
          totalPages: 1,
          currentPage: parseInt(queryParams.page || 1),
          data: response.data
        };
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Helper function for getting a single property by ID
export const getPropertyById = async (id) => {
  try {
    const url = getEndpointUrl('properties', id);
    
    
    const response = await axios.get(url);
    
    // If we're in local development, the API might return data differently
    if (!isNetlify && response.data && !response.data.data) {
      // Format response to match the expected structure
      return { 
        success: true,
        data: response.data 
      };
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
};

// Helper function for getting properties by user ID
export const getPropertiesByUser = async (userId) => {
  try {
    let url;
    const token = getToken(); // Get auth token

    // Use the appropriate URL based on environment
    if (isNetlify) {
      url = `${NETLIFY_BASE_URL}/properties/user/${userId}`;
    } else {
      url = `${API_BASE_URL}/api/properties/user/${userId}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add Authorization header
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user properties:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

// Helper function for creating or updating properties
export const postProperty = async (propertyData) => {
  try {
    let url;
    const token = getToken(); // Get auth token

    // Use the appropriate URL based on environment
    if (isNetlify) {
      url = `${NETLIFY_BASE_URL}/properties`;
    } else {
      url = `${API_BASE_URL}/properties`;
    }
    
    const response = await axios.post(url, propertyData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add Authorization header
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error posting property data:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  getProperties,
  getPropertyById,
  getPropertiesByUser,
  postProperty
};
