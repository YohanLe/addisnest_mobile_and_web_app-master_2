/**
 * This script provides a utility function to create a properly formatted
 * property submission payload. It corrects issues with enum validation
 * for paymentStatus and promotionType fields.
 */

/**
 * Creates a properly formatted property object for API submission
 * @param {Object} data - Raw property data from form
 * @param {String} plan - Selected promotion plan (basic, vip, diamond)
 * @returns {Object} - Formatted property data ready for API submission
 */
function formatPropertyData(data, plan) {
  // Convert amenities to features object format expected by backend
  const features = {};
  if (data.amenities && Array.isArray(data.amenities)) {
    data.amenities.forEach(amenity => {
      features[amenity] = true;
    });
  }

  // Create base property object with required fields
  const formattedData = {
    title: data.title || "",
    description: data.description || "",
    propertyType: data.propertyType || "Apartment",
    offeringType: data.offeringType || "For Sale",
    
    // FIXED: Use valid enum values for status and paymentStatus
    // Valid values for status: 'For Sale', 'For Rent', 'Sold', 'Rented', 'Pending', 'pending_payment', 'active'
    // Valid values for paymentStatus: 'pending', 'completed', 'failed', 'none'
    // Previously used 'active' which was an invalid value for paymentStatus (but valid for status)
    // The error in propertyController.js was setting paymentStatus to 'active' which isn't in the enum
    status: 'active',
    paymentStatus: 'none', // Must be one of: 'pending', 'completed', 'failed', 'none'
    
    // Parse numbers properly
    price: Number(data.price) || Number(data.total_price) || 0,
    area: Number(data.area) || Number(data.property_size) || 0,
    bedrooms: Number(data.bedrooms) || Number(data.number_of_bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || Number(data.number_of_bathrooms) || 0,
    
    features: features,
    
    // Format address object
    address: {
      street: data.address?.street || data.property_address || "",
      city: data.address?.city || data.city || "",
      state: data.address?.state || data.regional_state || "",
      country: data.address?.country || data.country || "Ethiopia"
    },
    
    // Ensure images array is properly formatted
    images: Array.isArray(data.images) ? data.images : 
      (data.media_paths ? 
        (Array.isArray(data.media_paths) ? 
          data.media_paths.map(url => typeof url === 'string' ? {url, caption: ''} : url) : 
          [{url: data.media_paths, caption: ''}]) : 
        []),
    
    // Basic metadata
    isPremium: plan !== 'basic',
    isVerified: false,
    
    // FIXED: Use valid enum value for promotionType
    // Valid values: 'Basic', 'VIP', 'Diamond', 'None'
    promotionType: plan === 'basic' ? 'Basic' : (plan === 'vip' ? 'VIP' : 'Diamond'),
    
    views: 0,
    likes: 0,
    furnishingStatus: data.furnishingStatus || data.furnishing || "Unfurnished"
  };

  return formattedData;
}

// Export the function for use in other files
module.exports = { formatPropertyData };

// Example usage for testing
if (require.main === module) {
  // Test data
  const testData = {
    title: "Test Property",
    description: "A test property description",
    property_type: "Apartment",
    offeringType: "For Sale",
    total_price: "5000",
    property_size: "200",
    number_of_bedrooms: "3",
    number_of_bathrooms: "2",
    property_address: "123 Test Street",
    city: "Addis Ababa",
    regional_state: "Addis Ababa City Administration",
    country: "Ethiopia",
    amenities: ["parking", "airConditioning"],
    media_paths: ["/uploads/test-image.jpg"]
  };
  
  console.log("Formatted property data for API submission:");
  console.log(JSON.stringify(formatPropertyData(testData, 'basic'), null, 2));
}
