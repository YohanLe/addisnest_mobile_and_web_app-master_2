# How to Test the Property Image Format Fix

This guide explains how to test the fix implemented for the 500 Internal Server Error during property submission caused by image format issues.

## Background

The property submission system was experiencing 500 Internal Server Errors when submitting properties with certain image formats. The issue was fixed in the `ChoosePropmotionFixed.jsx` component by normalizing image data before sending it to the API.

## Testing Options

There are three ways to test the fix:

### 1. Manual Testing Through the UI

1. Start the application with the fixed version:
   ```
   start-with-fixed-property-promotion.bat
   ```

2. Navigate to the property listing form and complete it
3. Upload images in various formats (if possible)
4. Proceed to the Choose Promotion page
5. Select a plan and continue
6. Verify the property is created successfully without any 500 errors

### 2. Automated Testing Script

We've created an automated test script that tests property submission with various image formats:

1. Ensure the server is running
2. Run the test script:
   ```
   run-image-format-fix-test.bat
   ```
3. The script will attempt to create properties with these image formats:
   - Array of string URLs
   - Array of objects with url property
   - Mixed format (strings and objects)
   - Objects with additional properties
   - Empty array (should use default images)
   - Undefined images (should use default images)

4. Check the results in the console and in the generated `image-format-test-results.json` file

### 3. Manual API Testing

For direct API testing:

1. Get an authentication token:
   ```
   curl -X POST http://localhost:7000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. Use the token to submit a property with different image formats:
   ```
   curl -X POST http://localhost:7000/api/properties \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "title": "Test Property",
       "description": "Testing image format fix",
       "propertyType": "House",
       "offeringType": "For Sale",
       "price": 5000000,
       "area": 250,
       "bedrooms": 3,
       "bathrooms": 2,
       "street": "Test Street",
       "city": "Addis Ababa",
       "regional_state": "Addis Ababa",
       "country": "Ethiopia",
       "promotionType": "Basic",
       "images": [
         {"url": "/uploads/test-property-image-1749260861596-438465535.jpg", "caption": "Test Image"}
       ]
     }'
   ```

## What to Look For

A successful fix will show:

1. No 500 Internal Server Errors during property submission
2. Properties created successfully with all image formats
3. Default images applied when no valid images are provided
4. Images correctly formatted in the database (only with url property)

## Troubleshooting

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify that the fix in `ChoosePropmotionFixed.jsx` is correctly normalizing image formats
3. Confirm that the Property model schema validation is working correctly
4. Ensure the test environment has the correct configuration and valid test user credentials

## Implementation Details

The fix works by:

1. Converting all image objects to have only the `url` property
2. Filtering out any empty URLs
3. Providing default images if none are available

```javascript
// Core part of the fix in ChoosePropmotionFixed.jsx
if (formattedData.images && Array.isArray(formattedData.images)) {
  // Convert all image objects to have only the url property
  formattedData.images = formattedData.images.map(img => {
    if (typeof img === 'string') {
      return { url: img };
    } else if (img && typeof img === 'object') {
      return { url: img.url || img.path || '' };
    }
    return { url: '' };
  });
  
  // Filter out any empty URLs
  formattedData.images = formattedData.images.filter(img => img.url && img.url.trim() !== '');
  
  // If no valid images, use default images
  if (formattedData.images.length === 0) {
    formattedData.images = DEFAULT_IMAGES.map(img => ({ url: img.url }));
  }
} else {
  // If no images at all, use default images
  formattedData.images = DEFAULT_IMAGES.map(img => ({ url: img.url }));
}
