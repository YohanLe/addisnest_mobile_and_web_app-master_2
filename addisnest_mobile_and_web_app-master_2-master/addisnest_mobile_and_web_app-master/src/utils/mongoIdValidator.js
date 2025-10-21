/**
 * MongoDB ID Validation Utility
 * Centralized validation functions for MongoDB ObjectIds
 */

/**
 * Validates if a string is a valid MongoDB ObjectId format (24 hex characters)
 * @param {string} id - The ID string to validate
 * @returns {boolean} - True if valid MongoDB ObjectId format, false otherwise
 */
const isValidMongoId = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // MongoDB ObjectId is 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Normalizes a MongoDB ID by removing ObjectId wrapper and quotes if present
 * @param {string} id - The ID to normalize
 * @returns {string} - Normalized ID string
 */
const normalizeMongoId = (id) => {
  if (!id || typeof id !== 'string') {
    return id;
  }
  
  let normalizedId = id;
  
  // Remove ObjectId("...") wrapper if present
  if (normalizedId.startsWith('ObjectId(') && normalizedId.endsWith(')')) {
    normalizedId = normalizedId.substring(9, normalizedId.length - 1);
  }
  
  // Remove quotes if present
  if ((normalizedId.startsWith('"') && normalizedId.endsWith('"')) ||
      (normalizedId.startsWith("'") && normalizedId.endsWith("'"))) {
    normalizedId = normalizedId.substring(1, normalizedId.length - 1);
  }
  
  return normalizedId;
};

/**
 * Validates and normalizes a MongoDB ID
 * @param {string} id - The ID to validate and normalize
 * @returns {Object} - { valid: boolean, id: string, error: string|null }
 */
const validateAndNormalizeMongoId = (id) => {
  const normalized = normalizeMongoId(id);
  const valid = isValidMongoId(normalized);
  
  return {
    valid,
    id: normalized,
    error: valid ? null : `Invalid MongoDB ID format: ${id}`
  };
};

module.exports = {
  isValidMongoId,
  normalizeMongoId,
  validateAndNormalizeMongoId
};
