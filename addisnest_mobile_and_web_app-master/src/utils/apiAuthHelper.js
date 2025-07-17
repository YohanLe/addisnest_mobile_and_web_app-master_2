/**
 * API Authentication Helper
 * 
 * This module provides functions to handle authenticated API requests
 * and properly handle authentication errors.
 */

import Api from '../Apis/Api';
import { checkAuthenticationStatus, getToken, getAuthErrorMessage } from './tokenHandler';
import { toast } from 'react-toastify';

/**
 * Make an authenticated API request with proper error handling
 * 
 * @param {string} endpoint - API endpoint to call
 * @param {object} data - Data to send with the request
 * @param {function} onAuthError - Callback to handle authentication errors
 * @returns {Promise<any>} API response
 */
export const makeAuthenticatedRequest = async (endpoint, data, onAuthError) => {
  try {
    // Check authentication status before making the request
    const authStatus = checkAuthenticationStatus();
    console.log('Authentication status before API request:', authStatus);
    
    if (!authStatus.isAuthenticated) {
      const errorMessage = !authStatus.hasToken 
        ? 'Authentication token is missing. Please log in again.'
        : !authStatus.isLoggedIn 
          ? 'Login session is invalid. Please log in again.'
          : !authStatus.hasValidStructure 
            ? 'Authentication token is invalid. Please log in again.'
            : 'Authentication required. Please log in.';
      
      console.error('Authentication check failed:', errorMessage);
      
      // Call the auth error handler if provided
      if (onAuthError && typeof onAuthError === 'function') {
        onAuthError(new Error(errorMessage));
      }
      
      throw new Error(errorMessage);
    }
    
    // Make the API call with token
    console.log(`Making authenticated API call to ${endpoint}`);
    const response = await Api.postWithtoken(endpoint, data);
    console.log(`API response from ${endpoint}:`, response);
    
    return response;
  } catch (error) {
    console.error(`Error in authenticated request to ${endpoint}:`, error);
    
    // Handle authentication errors specifically
    if (error.response && error.response.status === 401) {
      console.error('Authentication error: User not authorized');
      const errorMessage = 'Authentication failed. Please log in again to continue.';
      
      // Call the auth error handler if provided
      if (onAuthError && typeof onAuthError === 'function') {
        onAuthError(error);
      }
      
      throw new Error(errorMessage);
    }
    
    // Re-throw the error to be handled by the caller
    throw error;
  }
};

/**
 * Handle authentication errors with standard behavior
 * 
 * @param {Error} error - The authentication error
 * @param {function} navigate - React Router's navigate function
 * @param {object} navigateOptions - Options for navigation after error
 */
export const handleAuthError = (error, navigate, navigateOptions = {}) => {
  const errorMessage = getAuthErrorMessage(error);
  
  // Show error toast
  toast.error(errorMessage, {
    position: "top-center",
    autoClose: 5000
  });
  
  // Default navigation options
  const options = {
    path: '/login',
    state: { returnUrl: window.location.pathname },
    delay: 2000,
    ...navigateOptions
  };
  
  // Navigate to login page after delay
  setTimeout(() => {
    navigate(options.path, { state: options.state });
  }, options.delay);
};

/**
 * Save property data to localStorage for retrieval after login
 * 
 * @param {object} propertyData - The property data to save
 * @param {string} selectedPlan - The selected plan
 */
export const savePropertyDataForLaterSubmission = (propertyData, selectedPlan) => {
  try {
    localStorage.setItem('pending_property_data', JSON.stringify(propertyData));
    localStorage.setItem('pending_property_plan', selectedPlan);
    console.log('Property data saved to localStorage for after login');
    return true;
  } catch (storageError) {
    console.error('Failed to save property data to localStorage:', storageError);
    return false;
  }
};

/**
 * Retrieve saved property data after login
 * 
 * @returns {object|null} The saved property data and plan, or null if none exists
 */
export const retrieveSavedPropertyData = () => {
  try {
    const pendingData = localStorage.getItem('pending_property_data');
    const pendingPlan = localStorage.getItem('pending_property_plan');
    
    if (!pendingData || !pendingPlan) return null;
    
    const parsedData = JSON.parse(pendingData);
    
    // Clear the pending data
    localStorage.removeItem('pending_property_data');
    localStorage.removeItem('pending_property_plan');
    
    return {
      propertyData: parsedData,
      selectedPlan: pendingPlan
    };
  } catch (error) {
    console.error('Error retrieving saved property data:', error);
    return null;
  }
};
