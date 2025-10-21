/**
 * Utility functions for handling MongoDB IDs
 */

/**
 * Validates if a string is a valid MongoDB ObjectId (24 hex characters)
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidMongoId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Sanitizes a MongoDB ID by trimming to exactly 24 characters
 * @param {string} id - The ID to sanitize
 * @returns {string|null} - Sanitized ID or null if invalid
 */
export const sanitizeMongoId = (id) => {
  if (!id || typeof id !== 'string') return null;
  
  // Remove any whitespace
  const trimmed = id.trim();
  
  // If it's longer than 24 characters, truncate it
  if (trimmed.length > 24) {
    const truncated = trimmed.substring(0, 24);
    // Validate the truncated version
    if (isValidMongoId(truncated)) {
      console.warn(`MongoDB ID was truncated from ${trimmed.length} to 24 characters:`, id, '->', truncated);
      return truncated;
    }
  }
  
  // If it's exactly 24 characters and valid, return it
  if (isValidMongoId(trimmed)) {
    return trimmed;
  }
  
  // Otherwise return null
  console.error('Invalid MongoDB ID format:', id);
  return null;
};

/**
 * Gets a safe MongoDB ID for use in URLs
 * @param {string} id - The ID to make safe
 * @returns {string} - Safe ID or a fallback ID
 */
export const getSafeMongoId = (id) => {
  const sanitized = sanitizeMongoId(id);
  // Return sanitized ID or a fallback that will show "not found" page
  return sanitized || '000000000000000000000000';
};
