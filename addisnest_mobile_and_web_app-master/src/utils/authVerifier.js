/**
 * Authentication Verification Utility
 * 
 * This module provides functions to verify authentication status
 * and token validity before making authenticated API requests.
 */

import { getToken } from './tokenHandler';

/**
 * Verify if the user is fully authenticated
 * Checks both token existence and isLogin flag
 * 
 * @returns {boolean} True if user is fully authenticated
 */
export const verifyAuthentication = () => {
  const token = getToken();
  const isLogin = localStorage.getItem('isLogin') === '1';
  
  return !!token && isLogin;
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
    hasValidStructure,
    token: token ? `${token.substring(0, 10)}...` : null // Show truncated token for debugging
  };
};
