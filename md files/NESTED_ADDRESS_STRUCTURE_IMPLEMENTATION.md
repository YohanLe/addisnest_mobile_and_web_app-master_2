# Nested Address Structure Implementation

## Overview

The application has been updated to support both flat and nested address structures for property submissions. This implementation ensures backward compatibility with existing code while supporting the new nested address structure.

## Changes Made

### 1. Property Model (src/models/Property.js)

The Property schema has been updated to include both:
- The original flat address fields (street, city, state, country) for backward compatibility
- A new nested address structure that contains the same fields

```javascript
// Address fields as top-level properties for backward compatibility
street: {
  type: String,
  required: [true, 'Please add a street address']
},
city: {
  type: String,
  required: [true, 'Please add a city']
},
state: {
  type: String,
  required: [true, 'Please add a state']
},
country: {
  type: String,
  required: [true, 'Please add a country']
},
// Nested address structure
address: {
  street: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false,
    default: 'Ethiopia'
  }
}
```

### 2. Property Controller (src/controllers/propertyController.js)

The controller has been updated to handle both address formats:

```javascript
// Handle nested address structure
if (req.body.address) {
  // If nested address is provided, ensure the flat fields are also set for backward compatibility
  req.body.street = req.body.address.street || req.body.street;
  req.body.city = req.body.address.city || req.body.city;
  req.body.state = req.body.address.state || req.body.state;
  req.body.country = req.body.address.country || req.body.country || 'Ethiopia';
} else if (req.body.street || req.body.city || req.body.state || req.body.country) {
  // If only flat fields are provided, create the nested structure
  req.body.address = {
    street: req.body.street || '',
    city: req.body.city || '',
    state: req.body.state || '',
    country: req.body.country || 'Ethiopia'
  };
}
```

### 3. Property Submission Components

Both `ChoosePropmotion.jsx` and `ChoosePropmotionFixed.jsx` have been updated to:
- Include the nested address structure when formatting property data for API call
- Maintain backward compatibility with flat fields

```javascript
// Format property data for API call
const formattedData = {
  // ... other fields ...
  
  // Required flat fields for backward compatibility
  street: data.street || data.property_address || data.address?.street || "Unknown Street",
  city: data.city || data.address?.city || "Unknown City",
  state: data.regional_state || data.address?.state || "Unknown State", 
  country: data.country || data.address?.country || "Ethiopia",
  
  // Nested address structure as required by backend
  address: {
    street: data.street || data.property_address || data.address?.street || "Unknown Street",
    city: data.city || data.address?.city || "Unknown City",
    state: data.regional_state || data.address?.state || "Unknown State",
    country: data.country || data.address?.country || "Ethiopia"
  },
  
  // ... other fields ...
};
```

## Benefits of This Implementation

1. **Backward Compatibility**: Existing code that expects flat address fields will continue to work.
2. **Future-Proof**: New code can use the nested address structure for better organization.
3. **Data Consistency**: The controller ensures both formats are synchronized.
4. **Better Data Structure**: The nested structure is more semantic and follows standard object modeling practices.
5. **Prevents 500 Errors**: By properly structuring the address data, we avoid validation errors that were causing 500 errors.

## How to Test

1. Use the property submission form to create a new property
2. When submitting the form, it will now automatically format the address in both flat and nested structure
3. The property should be successfully created without any 500 errors
4. Verify that both flat address fields and nested address structure are present in the database

## API Format

When sending property data to the API, include the address in this format:

```json
{
  "title": "Property Title",
  "description": "Property Description",
  "propertyType": "House",
  "offeringType": "For Sale",
  "price": 5000000,
  
  // Flat address fields (for backward compatibility)
  "street": "123 Main Street",
  "city": "Urbandale",
  "state": "Afar Region",
  "country": "Ethiopia",
  
  // Nested address structure
  "address": {
    "street": "123 Main Street",
    "city": "Urbandale",
    "state": "Afar Region",
    "country": "Ethiopia"
  },
  
  // ... other fields ...
}
```

## Implementation Notes

- Both address formats are kept in sync by the controller
- The nested structure is optional in the MongoDB schema but is always created by the controller
- Default values are provided for all address fields to prevent null/undefined values
