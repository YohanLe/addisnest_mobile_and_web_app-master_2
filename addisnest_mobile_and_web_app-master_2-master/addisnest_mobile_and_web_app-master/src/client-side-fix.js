/**
 * THIS IS THE SOLUTION!
 * 
 * Property Submission 500 Error Fix
 * 
 * This file provides the solution for fixing the "500 Internal Server Error" 
 * when submitting properties through the ChoosePromotion component.
 */

/**
 * Root Cause:
 * The server-side controller (propertyController.js) was trying to set an invalid enum value:
 * - Setting paymentStatus to 'active' which is not in the valid enum values 
 *   ['pending', 'completed', 'failed', 'none']
 * 
 * Two possible solutions:
 * 
 * 1. SERVER-SIDE FIX (Best solution but requires server restart):
 *    - Modify propertyController.js to use 'none' instead of 'active' for paymentStatus
 * 
 * 2. CLIENT-SIDE WORKAROUND (Can be implemented immediately):
 *    - Don't send status or paymentStatus from the client
 *    - Let the server set these values
 */

// IMPLEMENTATION:

/**
 * This is the client-side fix to implement in ChoosePromotion.jsx
 * and any other components that submit property data.
 * 
 * @param {Object} propertyData - The property data from form
 * @param {String} planType - The selected plan (basic, vip, diamond)
 * @returns {Object} - Property data safe for API submission
 */
function formatPropertyForSubmission(propertyData, planType) {
  // Normalize the property data
  const formattedData = {
    title: propertyData.title || "",
    description: propertyData.description || "",
    propertyType: propertyData.propertyType || "Apartment",
    offeringType: propertyData.offeringType || "For Sale",
    
    // IMPORTANT: DO NOT include status or paymentStatus fields!
    // Let the server determine these values based on promotionType
    
    price: Number(propertyData.price) || Number(propertyData.total_price) || 0,
    area: Number(propertyData.area) || Number(propertyData.property_size) || 0,
    bedrooms: Number(propertyData.bedrooms) || Number(propertyData.number_of_bedrooms) || 0,
    bathrooms: Number(propertyData.bathrooms) || Number(propertyData.number_of_bathrooms) || 0,
    
    // Format address
    address: {
      street: propertyData.address?.street || propertyData.property_address || "",
      city: propertyData.address?.city || propertyData.city || "",
      state: propertyData.address?.state || propertyData.regional_state || "",
      country: propertyData.address?.country || propertyData.country || "Ethiopia"
    },
    
    // Process images
    images: Array.isArray(propertyData.images) ? propertyData.images :
      (propertyData.media_paths ? 
        Array.isArray(propertyData.media_paths) ?
          propertyData.media_paths.map(url => typeof url === 'string' ? {url, caption: ''} : url) :
          [{url: propertyData.media_paths, caption: ''}] :
        []),
    
    // Set premium flag based on plan type
    isPremium: planType !== 'basic',
    isVerified: false,
    
    // Ensure promotionType uses correct capitalization
    promotionType: planType === 'basic' ? 'Basic' : 
                   planType === 'vip' ? 'VIP' : 
                   planType === 'diamond' ? 'Diamond' : 'Basic',
    
    // Default values for counters
    views: 0,
    likes: 0,
    
    // Other property details
    furnishingStatus: propertyData.furnishingStatus || propertyData.furnishing || "Unfurnished"
  };
  
  // Convert amenities to features object if present
  if (propertyData.amenities && Array.isArray(propertyData.amenities)) {
    const features = {};
    propertyData.amenities.forEach(amenity => {
      features[amenity] = true;
    });
    formattedData.features = features;
  }
  
  return formattedData;
}

// Example of how to use this in ChoosePromotion.jsx:
/*
const savePropertyToDatabase = async (data, plan) => {
  try {
    // Format the data using our safe formatter
    const formattedData = formatPropertyForSubmission(data, plan);
    
    // Log for debugging
    console.log('Submitting property with formatted data:', formattedData);
    
    // Submit to API
    const response = await Api.postWithtoken('properties', formattedData);
    
    return response;
  } catch (error) {
    console.error('Error saving property:', error);
    throw error;
  }
};
*/

// Export the formatter function
module.exports = { formatPropertyForSubmission };
