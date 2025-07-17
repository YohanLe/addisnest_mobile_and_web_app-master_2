/**
 * Admin Utilities
 * 
 * This file contains utility functions for admin authentication and authorization.
 */

/**
 * Check if the current user is logged in as an admin
 * @returns {boolean} True if the user is logged in as an admin, false otherwise
 */
export const isAdminUser = () => {
  // Check if user is logged in
  const isLogin = localStorage.getItem('isLogin') === '1';
  const isAdmin = localStorage.getItem('isAdmin') === '1';
  
  if (!isLogin) {
    return false;
  }
  
  // Check for admin session expiry
  const expiryTime = localStorage.getItem('adminSessionExpiry');
  if (expiryTime) {
    const currentTime = new Date().getTime();
    if (currentTime > parseInt(expiryTime)) {
      // Session expired
      localStorage.removeItem('adminSessionExpiry');
      return false;
    }
  }
  
  return isAdmin;
};

/**
 * Logout admin user and clear admin-specific session data
 */
export const logoutAdmin = () => {
  // Clear admin-specific data
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminSessionExpiry');
  
  // Clear general auth data
  localStorage.removeItem('addisnest_token');
  localStorage.removeItem('isLogin');
  localStorage.removeItem('userId');
};

/**
 * Extend admin session timeout
 * @param {number} minutes - Number of minutes to extend the session (default: 30)
 */
export const extendAdminSession = (minutes = 30) => {
  const newExpiryTime = new Date().getTime() + (minutes * 60 * 1000);
  localStorage.setItem('adminSessionExpiry', newExpiryTime.toString());
};

/**
 * Get remaining admin session time in minutes
 * @returns {number} Remaining session time in minutes, or 0 if expired/not set
 */
export const getAdminSessionTimeRemaining = () => {
  const expiryTime = localStorage.getItem('adminSessionExpiry');
  if (!expiryTime) {
    return 0;
  }
  
  const currentTime = new Date().getTime();
  const remainingTime = parseInt(expiryTime) - currentTime;
  
  if (remainingTime <= 0) {
    return 0;
  }
  
  return Math.floor(remainingTime / (60 * 1000));
};
