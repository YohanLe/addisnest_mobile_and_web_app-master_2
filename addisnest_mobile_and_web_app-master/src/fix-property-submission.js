/**
 * Property Submission Fix
 * 
 * This module addresses the 500 Internal Server Error that occurs when submitting a property
 * through the ChoosePropmotionFixed component.
 * 
 * Key issues fixed:
 * 1. paymentStatus and status fields must have values from the correct enum options
 * 2. Server needs to determine these values based on the promotionType
 * 3. Images format normalization to ensure consistent structure
 */

// Helper function to ensure proper property data formatting for submission
export const formatPropertyForSubmission = (data, plan) => {
  // Process features/amenities
  const features = {};
  if (data.amenities && Array.isArray(data.amenities)) {
    data.amenities.forEach(amenity => {
      features[amenity] = true;
    });
  }

  // Format property data for API call
  const formattedData = {
    title: data.title,
    description: data.description,
    propertyType: data.propertyType,
    offeringType: data.offeringType,
    // IMPORTANT: DO NOT include status and paymentStatus fields
    // Let the server determine these values based on promotionType
    price: Number(data.price) || Number(data.total_price) || 0,
    area: Number(data.area) || Number(data.property_size) || 0,
    bedrooms: Number(data.bedrooms) || Number(data.number_of_bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || Number(data.number_of_bathrooms) || 0,
    features: features,
    
    // Handle address fields - support both flat and nested structure
    street: data.street || data.property_address || (data.address && data.address.street) || '',
    city: data.city || (data.address && data.address.city) || '',
    state: data.state || data.regional_state || data.regionalState || (data.address && data.address.state) || '',
    regionalState: data.regional_state || data.regionalState || (data.address && data.address.regionalState) || '',
    country: data.country || (data.address && data.address.country) || 'Ethiopia',
    
    // Create nested address structure as required by backend
    address: {
      street: data.street || data.property_address || (data.address && data.address.street) || '',
      city: data.city || (data.address && data.address.city) || '',
      state: data.state || data.regional_state || data.regionalState || (data.address && data.address.state) || '',
      regionalState: data.regional_state || data.regionalState || (data.address && data.address.regionalState) || '',
      country: data.country || (data.address && data.address.country) || 'Ethiopia'
    },
    
    // Set promotionType based on plan
    promotionType: plan === 'basic' ? 'Basic' : 
                  plan === 'vip' ? 'VIP' : 
                  plan === 'diamond' ? 'Diamond' : 'Basic',
                  
    // Other fields
    isPremium: plan !== 'basic',
    isVerified: false,
    views: 0,
    likes: 0,
    // Map furnishingStatus to valid enum values
    furnishingStatus: mapToValidFurnishingStatus(data.furnishingStatus || data.furnishing || "Unfurnished")
  };
  
  // Normalize images array to ensure consistent format
  if (data.images && Array.isArray(data.images)) {
    formattedData.images = data.images.map(img => {
      if (typeof img === 'string') {
        return { url: img };
      } else if (img && typeof img === 'object') {
        return { url: img.url || img.path || '' };
      }
      return { url: '' };
    }).filter(img => img.url && img.url.trim() !== '');
  } else if (data.media_paths) {
    if (Array.isArray(data.media_paths)) {
      formattedData.images = data.media_paths.map(path => {
        if (typeof path === 'string') {
          return { url: path };
        } else if (path && path.url) {
          return { url: path.url };
        }
        return { url: String(path) };
      }).filter(img => img.url && img.url.trim() !== '');
    } else {
      formattedData.images = [{ url: String(data.media_paths) }];
    }
  }
  
  return formattedData;
};

// Helper to validate property data before submission
export const validatePropertyData = (data) => {
  const requiredFields = [
    'propertyType', 
    'offeringType',
    'title'
  ];
  
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  // Ensure we have a price field (either price or total_price)
  if (!data.price && !data.total_price) {
    return {
      valid: false,
      message: 'Price is required'
    };
  }
  
  // Ensure we have an address (either direct or nested)
  if (!data.property_address && !data.street && 
      !(data.address && data.address.street)) {
    return {
      valid: false,
      message: 'Property address is required'
    };
  }
  
  return { valid: true };
};

/**
 * Maps any furnishing status value to one of the valid enum values accepted by the schema
 * Valid values: "Furnished", "Unfurnished", "Semi-Furnished"
 */
export const mapToValidFurnishingStatus = (status) => {
  // Convert to lowercase for case-insensitive matching
  const normalized = String(status || '').toLowerCase().trim();
  
  // Map to valid enum values
  if (normalized.includes('full') || normalized === 'furnished') {
    return 'Furnished';
  } else if (normalized.includes('semi') || 
             normalized.includes('part') || 
             normalized.includes('half')) {
    return 'Semi-Furnished';  // Exact match for the enum value in the schema
  } else {
    // Default value
    return 'Unfurnished';
  }
};
