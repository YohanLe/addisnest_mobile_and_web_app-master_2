/**
 * Nested Address Structure Controller with Image Format Fix
 * 
 * This controller wraps the original propertyController methods and adds middleware
 * to ensure the nested address structure is properly formatted for MongoDB validation.
 * It also normalizes image formats to prevent 500 errors.
 */

const propertyController = require('./propertyController');
const Property = require('../models/Property');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Middleware that ensures request body has a nested address structure
 * Converts flat address fields (street, city, regional_state, country) to nested format
 */
const ensureNestedAddress = (req, res, next) => {
  try {
    const { street, city, regional_state, country, ...rest } = req.body;
    
    // If flat address fields are provided, create nested address structure
    if (street || city || regional_state || country) {
      // Create the nested address object
      const address = {
        street: street || '',
        city: city || '',
        state: regional_state || '', // Map regional_state to state
        country: country || 'Ethiopia'
      };
      
      // Update the request body with nested address
      req.body = {
        ...rest,
        address,
        // Keep flat fields for backward compatibility
        street,
        city,
        regional_state,
        country
      };
    }
    
    next();
  } catch (error) {
    console.error('Error in ensureNestedAddress middleware:', error);
    next(error);
  }
};

/**
 * Middleware that normalizes image formats to prevent validation errors
 * Ensures all images are in the format expected by the MongoDB schema
 */
const normalizeImageFormat = (req, res, next) => {
  try {
    console.log('Normalizing image format...');
    
    if (req.body.images) {
      // Check if images is an array
      if (Array.isArray(req.body.images)) {
        // Normalize each image to have only the url property
        req.body.images = req.body.images.map(img => {
          // If it's a string, convert to object with url property
          if (typeof img === 'string') {
            return { url: img };
          } 
          // If it's an object, extract just the url
          else if (img && typeof img === 'object') {
            return { url: img.url || img.path || '' };
          }
          // Default empty object if null or undefined
          return { url: '' };
        });
        
        // Filter out any images with empty URLs
        req.body.images = req.body.images.filter(img => img.url && img.url.trim() !== '');
        
        console.log(`Normalized images array with ${req.body.images.length} items`);
      } else {
        // If it's not an array, convert to array with single item
        console.log('Images is not an array, converting to array');
        const imgUrl = typeof req.body.images === 'string' ? req.body.images : 
                     (req.body.images.url || req.body.images.path || '');
        req.body.images = imgUrl ? [{ url: imgUrl }] : [];
      }
    } else {
      // If no images provided, set to empty array
      console.log('No images found, setting to empty array');
      req.body.images = [];
    }
    
    next();
  } catch (error) {
    console.error('Error in normalizeImageFormat middleware:', error);
    next(error);
  }
};

/**
 * @desc    Create new property with nested address structure and normalized images
 * @route   POST /api/properties
 * @access  Private (Agent, Customer, Admin)
 */
const createProperty = asyncHandler(async (req, res, next) => {
  // First normalize the image format
  normalizeImageFormat(req, res, (err) => {
    if (err) return next(err);
    
    // Then apply the nested address middleware
    ensureNestedAddress(req, res, (err) => {
      if (err) return next(err);
      
      // Call the original controller method
      return propertyController.createProperty(req, res, next);
    });
  });
});

/**
 * @desc    Update property with nested address structure and normalized images
 * @route   PUT /api/properties/:id
 * @access  Private (Property Owner, Admin)
 */
const updateProperty = asyncHandler(async (req, res, next) => {
  // First normalize the image format
  normalizeImageFormat(req, res, (err) => {
    if (err) return next(err);
    
    // Then apply the nested address middleware
    ensureNestedAddress(req, res, (err) => {
      if (err) return next(err);
      
      // Call the original controller method
      return propertyController.updateProperty(req, res, next);
    });
  });
});

/**
 * Format property response to ensure it has consistent nested address
 */
const formatPropertyResponse = (property) => {
  // If the property doesn't have a nested address structure, create one from flat fields
  if (!property.address && (property.street || property.city || property.regional_state || property.country)) {
    property.address = {
      street: property.street || '',
      city: property.city || '',
      state: property.regional_state || '',
      country: property.country || 'Ethiopia'
    };
  }
  
  return property;
};

/**
 * @desc    Get single property with nested address structure
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }
  
  // Format the property to ensure it has a nested address structure
  const formattedProperty = formatPropertyResponse(property);
  
  res.status(200).json({
    success: true,
    data: formattedProperty
  });
});

/**
 * Export wrapped methods with nested address structure middleware
 */
module.exports = {
  createProperty,
  updateProperty,
  getProperty,
  // Use original methods for other operations
  getAllProperties: propertyController.getAllProperties,
  deleteProperty: propertyController.deleteProperty,
  uploadPropertyImage: propertyController.uploadPropertyImage,
  getPropertiesByAgent: propertyController.getPropertiesByAgent,
  getPropertiesByUser: propertyController.getPropertiesByUser,
  getFilteredProperties: propertyController.getFilteredProperties,
  getFeaturedProperties: propertyController.getFeaturedProperties
};
