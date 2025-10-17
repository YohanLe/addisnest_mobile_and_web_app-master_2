/**
 * Property Controller Adapter for Flat Address Structure
 * 
 * This adapter handles the transition between:
 * 1. Old nested address structure: { address: { street, city, state, country } }
 * 2. New flat address structure: { street, city, regional_state, country }
 * 
 * It ensures compatibility with existing database records while allowing
 * the new UI format to work properly.
 */

// Import the original property controller
const originalController = require('./propertyController');

/**
 * Middleware to convert flat address to nested address structure
 * Used before saving to database
 */
const convertToNestedAddress = (req, res, next) => {
  try {
    const { street, city, regional_state, country, ...rest } = req.body;
    
    // Create the nested address object
    const address = {
      street: street || '',
      city: city || '',
      state: regional_state || '', // Map regional_state to state
      regionalState: regional_state || '',
      country: country || 'Ethiopia'
    };
    
    // Keep both flat and nested versions to ensure compatibility
    req.body = {
      ...rest,
      street: street || '',
      city: city || '',
      regional_state: regional_state || '',
      country: country || 'Ethiopia',
      address
    };
    
    // Log the conversion for debugging
    console.log('Converted flat address to nested structure (keeping both):', req.body);
    
    next();
  } catch (error) {
    console.error('Error in convertToNestedAddress middleware:', error);
    next(error);
  }
};

/**
 * Middleware to convert nested address to flat address structure
 * Used after fetching from database, before sending to client
 */
const convertToFlatAddress = (req, res, next) => {
  try {
    // If response is already sent, we can't modify it
    if (res.headersSent) {
      return next();
    }
    
    // Store the original send method
    const originalSend = res.send;
    
    // Override the send method
    res.send = function(data) {
      try {
        // Only process JSON responses
        if (typeof data === 'string' && data.startsWith('{')) {
          const jsonData = JSON.parse(data);
          
          // If we have a data object with properties
          if (jsonData && jsonData.data) {
            // Handle array of properties
            if (Array.isArray(jsonData.data)) {
              jsonData.data = jsonData.data.map(property => flattenAddressInProperty(property));
            }
            // Handle single property
            else {
              jsonData.data = flattenAddressInProperty(jsonData.data);
            }
            
            // Send the modified data
            return originalSend.call(this, JSON.stringify(jsonData));
          }
        }
        
        // If not a property object or already processed, send original data
        return originalSend.call(this, data);
      } catch (error) {
        console.error('Error in response transformation:', error);
        return originalSend.call(this, data);
      }
    };
    
    next();
  } catch (error) {
    console.error('Error in convertToFlatAddress middleware:', error);
    next(error);
  }
};

/**
 * Helper function to flatten address within a property object
 */
const flattenAddressInProperty = (property) => {
  if (!property) return property;
  
  // If property has a nested address object, flatten it
  if (property.address) {
    const { address, ...rest } = property;
    
    return {
      ...rest,
      street: address.street || '',
      city: address.city || '',
      regional_state: address.state || '', // Map state to regional_state
      regionalState: address.regionalState || '',
      country: address.country || 'Ethiopia'
    };
  }
  
  // If already flat or no address, return as-is
  return property;
};

/**
 * Create a wrapped version of each controller method that applies
 * the appropriate address structure conversion
 */
const wrapControllerMethods = () => {
  const wrappedController = {};
  
  // Process each method in the original controller
  Object.entries(originalController).forEach(([key, method]) => {
    if (typeof method === 'function') {
      // Wrap the method with our middleware
      wrappedController[key] = async (req, res) => {
        try {
          // Apply conversion from flat to nested before proceeding
          convertToNestedAddress(req, res, () => {
            // Apply conversion from nested to flat after processing
            convertToFlatAddress(req, res, () => {
              // Call the original method
              return method(req, res);
            });
          });
        } catch (error) {
          console.error(`Error in wrapped controller method ${key}:`, error);
          res.status(500).json({ 
            success: false, 
            message: 'Internal server error during address structure conversion' 
          });
        }
      };
    } else {
      // Non-function properties are copied directly
      wrappedController[key] = method;
    }
  });
  
  return wrappedController;
};

// Export the wrapped controller
module.exports = {
  ...wrapControllerMethods(),
  // Also export the middleware for direct use
  convertToNestedAddress,
  convertToFlatAddress,
  flattenAddressInProperty
};
