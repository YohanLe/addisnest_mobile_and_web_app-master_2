/**
 * This file contains the implementation code to fix the property submission issue
 * in the ChoosePromotion component.
 * 
 * Problem: 500 error occurs when submitting properties because the backend rejects
 * invalid enum values for paymentStatus.
 * 
 * Fix: Use proper enum values according to the Property model
 */

// Instructions:
// 1. Import this utility in ChoosePropmotion.jsx:
//    import { formatPropertyForSubmission } from '../../path/to/property-submit-fix-implementation';
// 
// 2. Replace the existing property formatting code in savePropertyToDatabase with:
//    const formattedData = formatPropertyForSubmission(transformedData, selectedPlan);
//
// 3. Make sure to pass the correct plan type (basic, vip, diamond)

/**
 * Formats property data for API submission with proper enum values
 * @param {Object} data - Property data from form
 * @param {String} planType - Selected promotion plan (basic, vip, diamond)
 * @returns {Object} - Properly formatted property data
 */
function formatPropertyForSubmission(data, planType) {
  // Normalize plan name to lowercase for consistency in logic
  const plan = planType?.toLowerCase() || 'basic';
  
  // Convert amenities to features object format expected by backend
  const features = {};
  if (data.amenities && Array.isArray(data.amenities)) {
    data.amenities.forEach(amenity => {
      features[amenity] = true;
    });
  }

  // Ensure all required fields match the Property schema
  const formattedData = {
    title: data.title || "",
    description: data.description || "",
    propertyType: data.propertyType || "Apartment",
    offeringType: data.offeringType || "For Sale",
    
    // FIXED: Use valid enum values for status and paymentStatus
    // Valid values for status: 'For Sale', 'For Rent', 'Sold', 'Rented', 'Pending', 'pending_payment', 'active'
    // Valid values for paymentStatus: 'pending', 'completed', 'failed', 'none'
    // Using 'none' for basic plan and 'pending' for paid plans
    status: plan === 'basic' ? 'active' : 'pending',
    paymentStatus: plan === 'basic' ? 'none' : 'pending',
    
    // Parse numbers properly
    price: Number(data.price) || 0,
    area: Number(data.area) || 0,
    bedrooms: Number(data.bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || 0,
    
    features: features,
    
    // Format address object
    address: {
      street: data.address?.street || "",
      city: data.address?.city || "",
      state: data.address?.state || "",
      country: data.address?.country || "Ethiopia"
    },
    
    // Ensure images array is properly formatted
    images: Array.isArray(data.images) ? data.images : [],
    
    // Basic metadata
    isPremium: plan !== 'basic',
    isVerified: false,
    
    // FIXED: Use valid enum value for promotionType
    // Valid values: 'Basic', 'VIP', 'Diamond', 'None'
    promotionType: plan === 'basic' ? 'Basic' : (plan === 'vip' ? 'VIP' : 'Diamond'),
    
    views: 0,
    likes: 0,
    furnishingStatus: data.furnishingStatus || "Unfurnished"
  };

  return formattedData;
}

// To be used in ChoosePropmotion.jsx
module.exports = { formatPropertyForSubmission };

// Example modification for ChoosePropmotion.jsx:
/*
// Inside savePropertyToDatabase function:
const formattedData = formatPropertyForSubmission(transformedData, selectedPlan);
console.log('Attempting to save property with formatted data:', formattedData);

// Make API call to create the property
let response;
try {
  console.log('Calling Api.postWithtoken with "properties" and formattedData...');
  response = await Api.postWithtoken('properties', formattedData);
  console.log('Received response from Api.postWithtoken:', response);
} catch (apiError) {
  console.error('Error during Api.postWithtoken call:', apiError);
  throw new Error(`API call failed: ${apiError.message || 'Unknown API error'}`);
}
*/
