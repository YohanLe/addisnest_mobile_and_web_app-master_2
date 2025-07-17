/**
 * MongoDB ID Property Edit Fix
 *
 * This helper module provides functions to handle MongoDB-style ObjectIDs 
 * for property editing without affecting other components.
 */

// Check if a string is a valid MongoDB ObjectID (24 hex characters)
export const isMongoDbId = (id) => {
  return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

// Get the appropriate API endpoint for fetching a property based on ID format
export const getPropertyApiEndpoint = (propertyId) => {
  // If it's a MongoDB ID format, use the mongo-id endpoint
  if (isMongoDbId(propertyId)) {
    return `properties/mongo-id/${propertyId}`;
  }
  
  // Otherwise use regular property endpoints
  return `properties/${propertyId}`;
};

// Normalize property data from different sources
export const normalizePropertyData = (data, propertyId) => {
  if (!data) return null;
  
  // Ensure we always have an ID field, preferring MongoDB format
  return {
    ...data,
    _id: data._id || propertyId,
    id: data.id || data._id || propertyId,
    propertyId: data.propertyId || data.id || data._id || propertyId,
    // Other normalization as needed
  };
};

// Export a list of endpoints to try when fetching property data
export const getPropertyEndpoints = (propertyId) => {
  return [
    `agent/property/${propertyId}`,
    `properties/${propertyId}`,
    `property/${propertyId}`,
    `property/get/${propertyId}`,
    `property-by-id/${propertyId}`,
    `properties/mongo-id/${propertyId}`
  ];
};
