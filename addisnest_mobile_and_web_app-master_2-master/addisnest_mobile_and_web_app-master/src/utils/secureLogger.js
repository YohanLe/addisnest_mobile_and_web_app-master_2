/**
 * Secure Logger Utility
 * Only logs in development mode to prevent exposing sensitive information in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const secureLog = {
  /**
   * Log general information (only in development)
   */
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  },

  /**
   * Log success messages (only in development)
   */
  success: (message) => {
    if (isDevelopment) {
      console.log(`✅ ${message}`);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },

  /**
   * Log errors (always log but sanitize sensitive data)
   */
  error: (message, error) => {
    // Always log errors but remove sensitive information
    const sanitizedError = error ? {
      message: error.message,
      status: error.response?.status,
      // Don't log full response data, tokens, or user info
    } : undefined;
    
    console.error(`❌ ${message}`, sanitizedError);
  },

  /**
   * Log property loading status (safe, no sensitive data)
   */
  propertyLoad: (propertyId) => {
    if (isDevelopment) {
      console.log(`📋 Loading property: ${propertyId}`);
    }
  },

  /**
   * Log API call status without exposing data
   */
  apiCall: (endpoint, success) => {
    if (isDevelopment) {
      console.log(`${success ? '✅' : '❌'} API: ${endpoint}`);
    }
  }
};

export default secureLog;
