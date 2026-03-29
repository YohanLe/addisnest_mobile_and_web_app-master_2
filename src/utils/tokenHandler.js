/**
 * Token Handler Utility
 * 
 * This module provides functions to handle authentication tokens
 * and verify authentication status.
 */

/**
 * Get the authentication token from localStorage
 * 
 * @returns {string|null} The token if it exists, null otherwise
 */
export const getToken = () => {
  return localStorage.getItem('addisnest_token');
};

/**
 * Check if the user is authenticated
 * 
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  const isLogin = localStorage.getItem('isLogin') === '1';
  return !!token && isLogin;
};

/**
 * Verify token validity by checking its structure
 * This is a basic check and doesn't validate with the server
 * 
 * @returns {boolean} True if token appears valid
 */
export const hasValidTokenStructure = () => {
  const token = getToken();
  
  if (!token) return false;
  
  // Basic check: JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Get user ID from localStorage
 * 
 * @returns {string|null} User ID if exists, null otherwise
 */
export const getUserId = () => {
  return localStorage.getItem('userId');
};

/**
 * Get token data by decoding the JWT token
 * 
 * @returns {object|null} Decoded token data if valid, null otherwise
 */
export const getTokenData = () => {
  try {
    const userId = localStorage.getItem('userId');
    const userData = localStorage.getItem('userData');
    
    // First try to get user data from localStorage
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        return {
          ...parsedUserData,
          id: parsedUserData._id || parsedUserData.id || userId
        };
      } catch (parseError) {
        // Silent error handling for security
      }
    }
    
    // Fallback to token decoding
    const token = getToken();
    
    if (!token) {
      return null;
    }
    
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }
    
    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    // Create user object from token payload and localStorage data
    const tokenUserData = {
      ...payload,
      id: payload.id || payload.userId || userId,
      _id: payload.id || payload.userId || userId,
      firstName: payload.firstName || 'User',
      lastName: payload.lastName || '',
      email: payload.email || ''
    };
    
    return tokenUserData;
  } catch (error) {
    return null;
  }
};

/**
 * Comprehensive authentication check
 * Verifies token existence, login status, and token structure
 * 
 * @returns {object} Authentication status details
 */
export const checkAuthenticationStatus = () => {
  const token = getToken();
  const isLogin = localStorage.getItem('isLogin') === '1';
  const userId = getUserId();
  const hasValidStructure = hasValidTokenStructure();
  
  return {
    isAuthenticated: !!token && isLogin,
    hasToken: !!token,
    isLoggedIn: isLogin,
    hasUserId: !!userId,
    hasValidStructure
  };
};

/**
 * Handle authentication errors
 * 
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getAuthErrorMessage = (error) => {
  if (!error) return 'Unknown authentication error';
  
  const message = error.message || '';
  
  if (message.includes('token')) {
    return 'Your authentication token is invalid or expired. Please log in again.';
  } else if (message.includes('401') || message.includes('Unauthorized')) {
    return 'You are not authorized to perform this action. Please log in again.';
  } else if (message.includes('session')) {
    return 'Your session has expired. Please log in again.';
  }
  
  return 'Authentication failed. Please log in again.';
};
